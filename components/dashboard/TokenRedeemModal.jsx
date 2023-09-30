import {
  Box,
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Modal,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useEffect, useState, forwardRef } from 'react';
import { useWallet } from 'utils/WalletContext';
import TransactionSubmitted from '@components/TransactionSubmitted';
import ErgopayModalBody from '@components/ErgopayModalBody';
import { trpc } from '@utils/trpc';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// const NERG_FEES = 20 * 1000 * 1000;

const initFormData = Object.freeze({
  address: '',
});

const initFormErrors = Object.freeze({
  address: false,
});

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const TokenRedeemModal = ({ box, onClose }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  // wallet
  const { wallet } = useWallet();
  // form
  const [formErrors, setFormErrors] = useState(initFormErrors);
  const [formData, setFormData] = useState(initFormData);
  // loading
  const [loading, setLoading] = useState(false);
  const [ergopayLoading, setErgopayLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and Try Again'
  );
  // transaction submitted
  const [transactionSubmitted, setTransactionSubmitted] = useState(null);
  const [ergopayUrl, setErgopayUrl] = useState(null);
  // const walletsQuery = trpc.user.getWallets.useQuery(
  //   undefined,
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // )

  const redeemWithNautilus = async (walletAddress) => {
    const connected = await ergoConnector.nautilus.connect();
    if (connected) {
      const address = await ergo.get_change_address();
      const usedAddresses = await ergo.get_used_addresses();
      const unusedAddresses = await ergo.get_unused_addresses();
      if (
        address === walletAddress ||
        usedAddresses.includes(walletAddress) ||
        unusedAddresses.includes(walletAddress)
      ) {
        handleSubmit(walletAddress, [...usedAddresses, ...unusedAddresses])
      }
      else {
        ergoConnector.nautilus.disconnect()
        setErrorMessage('Please connect the correct Nautilus wallet');
        setOpenError(true);
        redeemWithNautilus(walletAddress)
      }
    }
  };

  useEffect(() => {
    setFormData({ address: box?.address });
    if (box?.address !== '') {
      setFormErrors({ address: false });
    } else {
      setFormErrors({ address: true });
    }
  }, [box?.address]);

  useEffect(() => {
    setButtonDisabled(loading || ergopayLoading || formErrors.address);
  }, [loading, formErrors.address, ergopayLoading]);

  // snackbar for error reporting
  const handleCloseError = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  const handleSubmit = async (address, addresses) => {
    setLoading(true);
    const emptyCheck = Object.values(formData).every(
      (v) => v !== '' && v !== 0
    );
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    if (emptyCheck && errorCheck) {
      try {
        // const walletAddresses = [wallet, ...dAppWallet.addresses].filter(
        //   (x, i, a) => a.indexOf(x) == i && x
        // );
        const res = await axios.post(
          `${process.env.API_URL}/vesting/redeemWithNFT`,
          {
            boxId: box.boxId,
            address: address,
            utxos: [],
            txFormat: 'eip-12',
            addresses: addresses,
          },
          defaultOptions
        );
        const unsignedtx = res.data;
        const signedtx = await ergo.sign_tx(unsignedtx); // eslint-disable-line
        const ok = await ergo.submit_tx(signedtx); // eslint-disable-line
        setTransactionSubmitted(ok);
      } catch (e) {
        // snackbar for error message
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          console.log(e);
          setErrorMessage('Failed to sign transaction');
        }
        setOpenError(true);
      }
    } else {
      setFormErrors({ address: true });
      // // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setLoading(false);
  };

  const handleSubmitErgopay = async () => {
    setErgopayLoading(true);
    const emptyCheck = Object.values(formData).every(
      (v) => v !== '' && v !== 0
    );
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    if (emptyCheck && errorCheck) {
      try {
        const res = await axios.post(
          `${process.env.API_URL}/vesting/redeemWithNFT`,
          {
            boxId: box.boxId,
            address: box.address,
            utxos: [],
            txFormat: 'ergo_pay',
          },
          defaultOptions
        );
        setErgopayUrl(res.data.url);
      } catch (e) {
        // snackbar for error message
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          console.log(e);
          setErrorMessage('Failed to build transaction');
        }
        setOpenError(true);
      }
    } else {
      setFormErrors({ address: true });
      // // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setErgopayLoading(false);
  };

  return (
    <>
      <Modal
        open={box !== null}
        onClose={() => {
          setTransactionSubmitted(null);
          setErgopayUrl(null);
          onClose();
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Redeem
          </Typography>
          {box !== null ? (
            <>
              {transactionSubmitted || ergopayUrl ? (
                transactionSubmitted ? (
                  <TransactionSubmitted transactionId={transactionSubmitted} />
                ) : (
                  <ErgopayModalBody ergopayUrl={ergopayUrl} />
                )
              ) : (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl
                        variant="filled"
                        fullWidth
                        required
                        name="address"
                        error={formErrors.address}
                      >
                        <InputLabel
                          htmlFor="ergoAddress"
                          sx={{ '&.Mui-focused': { color: 'text.secondary' } }}
                        >
                          Ergo Wallet Address
                        </InputLabel>
                        <FilledInput
                          id="address"
                          value={formData.address}
                          disabled
                          disableUnderline={true}
                          name="address"
                          type="ergoAddress"
                          sx={{
                            width: '100%',
                            border: '1px solid rgba(82,82,90,1)',
                            borderRadius: '4px',
                          }}
                        />
                        <FormHelperText>
                          {formErrors.address &&
                            'Please use the dapp connector to add a wallet address.'}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', mb: 0 }}>
                        You can now redeem <b>{box ? box['Redeemable'] : 0} </b>
                        tokens.
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    disabled={buttonDisabled || box.type === 'mobile'}
                    variant="contained"
                    sx={{ mt: 3, color: '#fff', textTransform: 'none', mr: 1 }}
                    onClick={() => redeemWithNautilus(box.address)}
                  >
                    Claim with browser wallet
                    {loading && (
                      <CircularProgress
                        sx={{ ml: 2, color: 'white' }}
                        size={'1.2rem'}
                      />
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={buttonDisabled || box.type === 'nautilus'}
                    variant="contained"
                    sx={{ mt: 3, color: '#fff', textTransform: 'none' }}
                    onClick={handleSubmitErgopay}
                  >
                    Claim with mobile wallet
                    {ergopayLoading && (
                      <CircularProgress
                        sx={{ ml: 2, color: 'white' }}
                        size={'1.2rem'}
                      />
                    )}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={openError}
        autoHideDuration={4500}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TokenRedeemModal;
