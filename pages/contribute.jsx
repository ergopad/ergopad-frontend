import { useState, useEffect, forwardRef } from 'react';
import {
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FilledInput,
  InputLabel,
  CircularProgress,
  Modal,
  useMediaQuery,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useWallet } from 'utils/WalletContext';
import { useAddWallet } from 'utils/AddWalletContext';
import MuiNextLink from '@components/MuiNextLink';
import PageTitle from '@components/PageTitle';
import theme from '@styles/theme';
import axios from 'axios';

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

// todo: update constants
const EVENT_NAME = 'staker-paideia-202203';
const ROUND_PROXY_NFT =
  'e172d5737145a0a7fdf551d122dec848207b2fd5e02df52d475e5dd45ec2aa80';
const WHITELIST_TOKEN_ID =
  '87fb172d186d260f1855eb627fc7a70beb9bafdcadfd5c1ff392f094442cf35e';
// const SIGUSD_TOKEN_ID =
//   '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';
// const PAIDEIA_TOKEN_ID = 'paideia_token_id';
const PAIDEIA_CONVERSION_RATE = 0.001;
const NERG_FEES = 20 * 1000 * 1000;

const initialFormData = Object.freeze({
  vestingAmount: 0,
  address: '',
  currency: 'erg',
});

const initialFormErrors = Object.freeze({
  vestingAmount: false,
  address: false,
});

const initialCheckboxState = Object.freeze({
  legal: false,
  risks: false,
  dao: false,
});

const initialWalletBalance = Object.freeze({
  whitelist: 0,
  sigusd: 0,
  ergs: 0,
});

const formOpenState = Object.freeze({
  EARLY: 'EARLY',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
});

const transactionModalState = Object.freeze({
  SUBMITTED: 'SUBMITTED',
  USER_PENDING: 'USER_PENDING',
  CLOSED: 'CLOSED',
});

const friendlyTransactionId = (addr, tot = 15) => {
  if (addr === undefined || addr.slice === undefined) return '';
  if (addr.length < 30) return addr;
  return addr.slice(0, tot) + '...' + addr.slice(-tot);
};

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const Contribute = () => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  // wallet
  const { wallet, dAppWallet } = useWallet();
  const { setAddWalletOpen } = useAddWallet();
  // boolean object for each checkbox
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState);
  // submit button
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formState, setFormState] = useState(formOpenState.EARLY);
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [formData, updateFormData] = useState(initialFormData);
  const [walletBalance, setWalletBalance] = useState(initialWalletBalance);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and Try Again'
  );
  // success snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessageSnackbar, setSuccessMessageSnackbar] =
    useState('Form Submitted');
  // success modal
  const [openModal, setOpenModal] = useState(transactionModalState.CLOSED);
  const [transactionId, setTransactionId] = useState('');
  // erg conversion rate loading from backend
  const [conversionRate, setConversionRate] = useState(1.0);

  const readWallet = async () => {
    // todo: fix infinite promise
    try {
      const whitelistBalance = await ergo.get_balance(WHITELIST_TOKEN_ID); // eslint-disable-line
      // const sigUSDBalance = await ergo.get_balance(SIGUSD_TOKEN_ID); // eslint-disable-line
      const ergBalance = await ergo.get_balance(); // eslint-disable-line
      setWalletBalance({
        whitelist: whitelistBalance / 10000,
        sigusd: 0, // sigusd validation is disabled
        ergs: ergBalance / (1000 * 1000 * 1000),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const apiCheck = async () => {
    try {
      const res = await axios.get(
        `${process.env.API_URL}/whitelist/info/${EVENT_NAME}`,
        defaultOptions
      );
      if (res.data.isBeforeSignup) {
        setFormState(formOpenState.EARLY);
      } else if (res.data.isAfterSignup) {
        setFormState(formOpenState.CLOSED); // change to CLOSED
      } else {
        setFormState(formOpenState.OPEN);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // set erg/usd conversion rate
  const updateConversionRate = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/asset/price/ergo`);
      setConversionRate(Math.round(res.data.price * 100) / 100);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    updateConversionRate();
    apiCheck();
  }, []);

  useEffect(() => {
    updateFormData({
      ...formData,
      address: wallet,
    });

    if (dAppWallet.connected) {
      // wait till js injection?
      setTimeout(readWallet, 500);
      setFormErrors({
        ...formErrors,
        address: false,
      });
    } else {
      setWalletBalance(initialWalletBalance);
      setFormErrors({
        ...formErrors,
        address: true,
      });
    }
  }, [wallet, dAppWallet.connected]); // eslint-disable-line

  // when loading button is disabled
  useEffect(() => {
    setbuttonDisabled(isLoading);
  }, [isLoading]);

  const { legal, risks, dao } = checkboxState;
  const checkboxError = [legal, risks, dao].filter((v) => v).length !== 3;

  useEffect(() => {
    if (checkboxError || formState !== formOpenState.OPEN) {
      setbuttonDisabled(true);
    } else {
      setbuttonDisabled(false);
    }
  }, [checkboxError, formState]);

  const handleChecked = (e) => {
    setCheckboxState({
      ...checkboxState,
      [e.target.name]: e.target.checked,
    });
  };

  // snackbar for error reporting
  const handleCloseError = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  // snackbar for success
  const handleCloseSuccessSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const handleCurrencyChange = (e, newAlignment) => {
    if (newAlignment !== null) {
      updateFormData({
        ...formData,
        currency: e.target.value,
      });
    }
  };

  const handleChange = (e) => {
    // if (e.target.value === '') {
    //   setFormErrors({
    //     ...formErrors,
    //     [e.target.name]: true,
    //   });
    // } else {
    //   setFormErrors({
    //     ...formErrors,
    //     [e.target.name]: false,
    //   });
    // }

    if (e.target.name === 'vestingAmount') {
      const amount = Number(e.target.value);
      if (amount > 0 && amount <= walletBalance.whitelist) {
        setFormErrors({
          ...formErrors,
          vestingAmount: false,
        });
      } else {
        setFormErrors({
          ...formErrors,
          vestingAmount: true,
        });
      }
      updateFormData({
        ...formData,
        vestingAmount: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emptyCheck = Object.values(formData).every(
      (v) => v !== '' && v !== 0
    );
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    if (errorCheck && emptyCheck) {
      try {
        const sigUSDAmount =
          formData.currency === 'erg'
            ? 0
            : Math.round(
                formData.vestingAmount * PAIDEIA_CONVERSION_RATE * 100
              ) / 100;
        // todo: get tokens and amounts from /vesting/requiredNergTokens and call ergo.get_utxos
        const tokens = await axios.post(
          `${process.env.API_URL}/vesting/requiredNergTokens`,
          {
            proxyNFT: ROUND_PROXY_NFT,
            vestingAmount: formData.vestingAmount,
            sigUSDAmount: sigUSDAmount,
          },
          defaultOptions
        );
        const nergs = tokens.data.nErgRequired + NERG_FEES;
        // prettier-ignore
        const utxos = await ergo.get_utxos(nergs.toString()); // eslint-disable-line
        tokens.data.tokens.forEach(async (token) => {
          // prettier-ignore
          const _utxos = await ergo.get_utxos(token.amount.toString(), token.tokenId); // eslint-disable-line
          utxos.concat(_utxos);
        });
        const filteredUtxos = Array.from(
          new Set([...utxos].map((x) => x.boxId))
        );

        // todo: get unsigned transaction from /vesting/vestFromProxy
        const res = await axios.post(
          `${process.env.API_URL}/vesting/vestFromProxy`,
          {
            proxyNFT: ROUND_PROXY_NFT,
            vestingAmount: formData.vestingAmount,
            sigUSDAmount: sigUSDAmount,
            address: formData.address,
            utxos: [...filteredUtxos], // replace with filteredUtxos
          },
          defaultOptions
        );
        const unsignedtx = res.data;
        // patch
        // const unsignedtx_t = {
        //   ...unsignedtx,
        //   dataInputs: unsignedtx.dataInputs.map((input) => {
        //     return {
        //       ...input,
        //       assets: input.assets.map((asset) => {
        //         return { ...asset, amount: asset.amount.toString() };
        //       }),
        //       extension: {},
        //       value: input.value.toString(),
        //     };
        //   }),
        //   inputs: unsignedtx.inputs.map((input) => {
        //     return {
        //       ...input,
        //       assets: input.assets.map((asset) => {
        //         return { ...asset, amount: asset.amount.toString() };
        //       }),
        //       extension: {},
        //       value: input.value.toString(),
        //     };
        //   }),
        // };
        // form submitted
        setSuccessMessageSnackbar('Form Submitted: Awaiting user confirmation');
        setOpenSuccessSnackbar(true);
        setOpenModal(transactionModalState.USER_PENDING);
        const signedtx = await ergo.sign_tx(unsignedtx); // eslint-disable-line
        const ok = await ergo.submit_tx(signedtx); // eslint-disable-line
        // await on dapp connector to sub
        setTransactionId(ok);
        setSuccessMessageSnackbar('Transaction Submitted: ' + ok);
        setOpenSuccessSnackbar(true);
        setOpenModal(transactionModalState.SUBMITTED);
      } catch (e) {
        // snackbar for error message
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          console.log(e);
          setOpenSuccessSnackbar(false);
          setErrorMessage('Failed to sign transaction');
        }
        setOpenError(true);
        setOpenModal(transactionModalState.CLOSED);
      }
    } else {
      let updateErrors = {};
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry;
        if (value === '' || value === 0) {
          if (Object.hasOwn(formErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      });

      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    // turn off loading spinner for submit button
    setLoading(false);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <PageTitle
          title="Paideia Staker Round"
          subtitle="Contribute Ergo or SigUsd to the Paideia DAO to reserve your Paideia governance tokens."
        />
      </Container>
      <Grid
        container
        maxWidth="lg"
        sx={{ mx: 'auto', flexDirection: 'row-reverse', px: { xs: 2, md: 3 } }}
      >
        <Grid item md={4} sx={{ pl: { md: 4, xs: 0 } }}>
          <Box sx={{ mt: { md: 0, xs: 4 } }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: '700', lineHeight: '1.2' }}
            >
              Details
            </Typography>
            <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
              You must be pre-approved on whitelist to be able to receive
              tokens. Add your wallet address to check if you have an allocation
              available.
            </Typography>
            <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
              When you contribute to the Paideia DAO using this form, your
              tokens will be locked in a vesting contract. You will receive an
              NFT that represents these vested tokens, and that will allow you
              to claim them as they unlock. You may claim as often as you&apos;d
              like or wait to claim as infrequently as you like, and they will
              not be distributed to your wallet until you send claim
              transactions to the smart contract.
            </Typography>
            <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
              The vesting period for this round will be 12 months and emission
              will happen daily following the IDO.
            </Typography>
          </Box>
        </Grid>
        <Grid item md={8}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: '700' }}>
              Token Contribution Form
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
                  Your wallet currently has {walletBalance.whitelist} whitelist
                  tokens. Reconnect your wallet with the dapp connector to hard
                  refresh this value.
                </Typography>
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
                    onClick={() => setAddWalletOpen(true)}
                    readOnly
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
                    {/* {formErrors.address &&
                      'Your address must be approved on the whitelist. '} */}
                    {formErrors.address &&
                      'Please use the dapp connector to add a wallet address.'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
                    Enter the number of Paideia tokens you would like. Rate for
                    this round is ${PAIDEIA_CONVERSION_RATE} per token.
                  </Typography>
                </Grid>
                <Grid item xs={10} md={11} sx={{ pr: 1 }}>
                  <TextField
                    InputProps={{ disableUnderline: true }}
                    required
                    fullWidth
                    id="vestingAmount"
                    label="Paideia Token Amount"
                    name="vestingAmount"
                    variant="filled"
                    onChange={handleChange}
                    value={formData.vestingAmount}
                    error={formErrors.vestingAmount}
                    helperText={
                      formErrors.vestingAmount &&
                      'Invalid amount entered. Make sure you have enough Paideia Whitelist tokens in your wallet.'
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={1}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    onClick={() =>
                      handleChange({
                        target: {
                          name: 'vestingAmount',
                          value: walletBalance.whitelist,
                        },
                      })
                    }
                  >
                    MAX
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: 0 }}>
                  You are receiving {formData.vestingAmount} Paideia tokens at $
                  {PAIDEIA_CONVERSION_RATE} per token. Your total contribution
                  value is $
                  {Math.round(
                    PAIDEIA_CONVERSION_RATE * formData.vestingAmount * 100
                  ) / 100}
                  .
                </Typography>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: 0 }}>
                  You can decide to contribute the entire sum in ergo or with
                  sigUSD. If you wish to contribute ergo, it will be taken at an
                  exchange of ~${conversionRate} sigUSD per ergo.
                </Typography>
              </Grid>
              <Grid item md={12}>
                <ToggleButtonGroup
                  color="primary"
                  value={formData.currency}
                  exclusive
                  onChange={handleCurrencyChange}
                  sx={{ mb: 0, mt: 0 }}
                >
                  <ToggleButton value="erg">erg</ToggleButton>
                  <ToggleButton value="sigusd">sigUSD</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
                  Contribution amount in{' '}
                  {formData.currency === 'erg'
                    ? 'ergo (exact erg amount may vary slightly).'
                    : 'sigUSD.'}
                </Typography>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  required
                  fullWidth
                  id="amount"
                  label="Amount"
                  name="amount"
                  variant="filled"
                  disabled
                  value={
                    formData.currency === 'erg'
                      ? Math.max(
                          0,
                          Math.round(
                            (PAIDEIA_CONVERSION_RATE *
                              formData.vestingAmount *
                              10000) /
                              conversionRate
                          ) / 10000
                        )
                      : Math.round(
                          PAIDEIA_CONVERSION_RATE * formData.vestingAmount * 100
                        ) / 100
                  }
                />
              </Grid>
            </Grid>
            <FormControl required error={checkboxError}>
              <FormGroup sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={legal}
                      onChange={handleChecked}
                      name="legal"
                    />
                  }
                  label="I have confirmed that I am legally entitled to invest in a cryptocurrency project of this nature in the jurisdiction in which I reside."
                  sx={{ color: theme.palette.text.secondary, mb: 3 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={risks}
                      onChange={handleChecked}
                      name="risks"
                    />
                  }
                  label="I am aware of the risks involved when investing in a project of this nature. There is always a chance an investment with this level of risk can lose all it's value, and I accept full responsiblity for my decision to invest in this project."
                  sx={{ color: theme.palette.text.secondary, mb: 3 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dao}
                      onChange={handleChecked}
                      name="dao"
                    />
                  }
                  label="I understand that the funds raised by this project will be controlled by the Paideia DAO, which has members throughout the world, and my tokens will represent my membership in this DAO. I am aware that this DAO does not fall within the jurisdiction of any one country, and accept the implications therein."
                  sx={{ color: theme.palette.text.secondary, mb: 3 }}
                />
                <FormHelperText>
                  {checkboxError && 'Please accept the terms before submitting'}
                </FormHelperText>
              </FormGroup>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={buttonDisabled}
              variant="contained"
              sx={{ mt: 3, mb: 3 }}
            >
              Submit
            </Button>
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'relative',
                  top: '0px',
                  left: '50%',
                  marginTop: '-9px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {formState === formOpenState.EARLY &&
              'The Paideia stakers contribution is yet to start.'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {formState === formOpenState.CLOSED && 'The round is closed.'}
          </Typography>
        </Grid>
      </Grid>
      <Modal
        open={openModal !== transactionModalState.CLOSED}
        onClose={() => {
          setOpenModal(transactionModalState.CLOSED);
          setTransactionId('');
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Contribution
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
              mt: 3,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                maxWidth: '768px',
              }}
            >
              {openModal === transactionModalState.USER_PENDING ? (
                <>
                  <CircularProgress sx={{ mt: 3, mb: 3 }} />
                  <Typography variant="h4">
                    Awaiting User Confirmation
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircleOutlineIcon sx={{ fontSize: '8rem' }} />
                  <Typography variant="h4">Transaction Submitted</Typography>
                  <Typography variant="subtitle1">
                    Transaction ID:{' '}
                    <MuiNextLink
                      href={
                        'https://explorer.ergoplatform.com/en/transactions/' +
                        transactionId
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      {friendlyTransactionId(transactionId)}
                    </MuiNextLink>
                  </Typography>
                </>
              )}
            </Box>
          </Box>
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
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={4500}
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessageSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Contribute;
