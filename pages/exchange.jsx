import {
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Container,
  LinearProgress,
} from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MuiNextLink from '@components/MuiNextLink';
import PageTitle from '@components/PageTitle';
import axios from 'axios';
import { useWallet } from 'utils/WalletContext';
import { useAddWallet } from 'utils/AddWalletContext';
import { useState, useEffect, forwardRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from 'react-qr-code';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useMediaQuery from '@mui/material/useMediaQuery';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  wallet: '',
  vestingAmount: 0.0,
  vestingScenario: 'seedsale',
});

const initialFormErrors = Object.freeze({
  wallet: false,
  vestingAmount: false,
});

const initialSuccessMessageData = Object.freeze({
  ergs: 0.0,
  address: '',
  currency: '',
  token: 0.0,
});

const initialValueAllowed = Object.freeze({
  seedsale: 0,
  strategic_sale: 0,
});

function friendlyAddress(addr, tot = 13) {
  if (addr === undefined || addr.slice === undefined) return '';
  if (addr.length < 30) return addr;
  return addr.slice(0, tot) + '...' + addr.slice(-tot);
}

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Token Ids
const ERGOPAD_SEEDSALE =
  '02203763da5f27c01ba479c910e479c4f479e5803c48b2bf4fd4952efa5c62d9';
const ERGOPAD_STRATEGIC =
  '60def1ed45ffc6493c8c6a576c7a23818b6b2dfc4ff4967e9867e3795886c437';

// wait time in mins
// config in assembler
const WAIT_TIME = 5;

const Exchange = () => {
  // responsive design
  const mediumWidthUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  // standard form stuff
  // submit button
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false);
  // form error and data
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [formData, updateFormData] = useState(initialFormData);
  // error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again'
  );
  // success snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessageSnackbar, setSuccessMessageSnackbar] = useState(
    'Copied to Clipboard'
  );
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessageData, setSuccessMessageData] = useState(
    initialSuccessMessageData
  );
  // helper texts and messages
  const [approvalMessage, setApprovalMessage] = useState(
    'Please enter an ergo address to see how much of seedsale/strategic_sale token you hold.'
  );
  const [valueAllowed, setValueAllowed] = useState(initialValueAllowed);
  const [valueHelper, setValueHelper] = useState('');
  // modal is closed
  // used to reopen modal if user closes the modal after form
  // is submitted
  const [modalClosed, setModalClosed] = useState(false);
  // used to control the Timer component
  // timer and interval
  const [timer, setTimer] = useState('');
  const [progress, setProgress] = useState(0.0);
  const [interval, setStateInterval] = useState(0);

  const apiCheck = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/blockchain/info`, {
        ...defaultOptions,
      });
      if (res.data.currentTime_ms > 1642698000000) {
        // Thu Jan 20 2022 17:00:00 GMT+0000
        setbuttonDisabled(false);
      } else {
        // this should be true
        setbuttonDisabled(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // test for pending transactions
  const isTransactionPending = async () => {
    try {
      const res = await axios.get(
        `${process.env.API_URL}/assembler/status/${wallet}`
      );
      return (
        Object.values(res.data).filter((status) => status === 'pending')
          .length > 0
      );
    } catch {
      return false;
    }
  };

  const checkWalletApproval = async () => {
    if (wallet != '') {
      const pending = await isTransactionPending();
      if (pending) {
        setValueAllowed({
          seedsale: -1,
          strategic_sale: -1,
        });
        setValueHelper(
          'Please wait(may take upto 10 mins) for pending transaction to time-out'
        );
        setFormErrors({
          ...formErrors,
          wallet: false,
          amount: true,
        });
        updateFormData({
          ...formData,
          wallet: wallet,
        });
        return;
      }

      // if not pending
      try {
        const res = await axios.get(
          `${process.env.API_URL}/asset/balance/${wallet}`
        );
        const tokens = res.data.balance.ERG.tokens;
        const seedsale = tokens
          .filter((token) => token.tokenId === ERGOPAD_SEEDSALE)
          .map((token) => token.amount / Math.pow(10, token.decimals))
          .reduce((a, c) => a + c, 0);
        const strategic_sale = tokens
          .filter((token) => token.tokenId === ERGOPAD_STRATEGIC)
          .map((token) => token.amount / Math.pow(10, token.decimals))
          .reduce((a, c) => a + c, 0);
        setModalClosed(false);
        setValueAllowed({
          ...initialValueAllowed,
          seedsale,
          strategic_sale,
        });
        updateFormData({ ...formData, wallet: wallet, vestingAmount: 0 });
        setFormErrors({ ...formErrors, wallet: false, vestingAmount: false });
      } catch (e) {
        console.log(e);
        // invalid wallet
        setModalClosed(false);
        setValueAllowed(initialValueAllowed);
        setFormErrors({
          ...formErrors,
          wallet: true,
        });
        updateFormData({
          ...formData,
          wallet: wallet,
        });
      }
    } else {
      setModalClosed(false);
      setFormErrors({
        ...formErrors,
        wallet: true,
      });
      setValueAllowed(initialValueAllowed);
    }
  };

  // calculate and update the timer string
  const updateWaitCounter = (lastSubmit) => {
    const now = new Date().valueOf();
    const diff = lastSubmit - now + WAIT_TIME * 60 * 1000;
    const mm = Math.max(0, Math.floor(diff / (60 * 1000))).toString(10);
    const ss = Math.max(0, Math.floor(diff / 1000) % 60).toString(10);
    const pmm = mm.length === 2 ? mm : '0' + mm;
    const pss = ss.length === 2 ? ss : '0' + ss;
    setTimer(`${pmm}:${pss}`);
    // calculate progress
    const n = Math.max(0, diff);
    const d = WAIT_TIME * 60 * 1000;
    setProgress((n / d) * 100);
    // if zero check for wallet approval
    if (Math.floor(diff / 1000) == 0) {
      checkWalletApproval();
    }
  };

  // when component is loaded initializing the conversion rate and counter
  useEffect(() => {
    apiCheck();
    // update counter every 1 second or 1000ms
    // const now = new Date().valueOf();
    // clearInterval(interval);
    // setStateInterval(setInterval(() => updateWaitCounter(now), 1000));
  }, []);

  // when loading button is disabled
  useEffect(() => {
    setbuttonDisabled(isLoading);
  }, [isLoading]);

  const { wallet } = useWallet();
  const { setAddWalletOpen } = useAddWallet();
  const openWalletAdd = () => {
    setAddWalletOpen(true);
  };

  useEffect(() => {
    if (valueAllowed[formData.vestingScenario] >= 0.0) {
      const allowed = `${valueAllowed[formData.vestingScenario]} ${
        formData.vestingScenario
      }`;
      setApprovalMessage('This address has ' + allowed + '.');
    } else if (valueAllowed[formData.vestingScenario] < 0.0 && wallet) {
      setApprovalMessage(
        'There is a pending transaction, either send the funds or wait(may take upto 10 mins) for it to time-out and refresh the page to try again.'
      );
    } else if (!wallet) {
      setApprovalMessage('Please enter your Ergo address.');
    }
  }, [wallet, valueAllowed, formData.vestingScenario]);

  useEffect(() => {
    checkWalletApproval();
    setModalClosed(false);
  }, [wallet]);

  // snackbar for error reporting
  const handleCloseError = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  const handleCloseSuccessSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  // modal for success message
  const handleCloseSuccess = () => {
    // show additional button to reopen modal
    setModalClosed(true);
    setOpenSuccess(false);
  };

  const copyToClipboard = (text) => {
    setSuccessMessageSnackbar('Copied ' + text + ' to clipboard');
    setOpenSuccessSnackbar(true);
  };

  const handleCurrencyChange = (e, newAlignment) => {
    if (newAlignment !== null) {
      updateFormData({
        ...formData,
        vestingAmount: 0,
        vestingScenario: e.target.value,
      });
      setFormErrors({
        ...formErrors,
        vestingAmount: true,
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.value == '' || e.target.value == 0.0) {
      setValueHelper("Please enter the amount you'd like to vest.");
      setFormErrors({
        ...formErrors,
        [e.target.name]: true,
      });
    } else {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      });
    }

    if (e.target.name == 'vestingAmount') {
      const amount = Number(e.target.value);
      if (amount > 0.0 && amount <= valueAllowed[formData.vestingScenario]) {
        setFormErrors({
          ...formErrors,
          vestingAmount: false,
        });
        updateFormData({
          ...formData,
          vestingAmount: e.target.value,
        });
      } else {
        setValueHelper('Must be a valid amount');
        setFormErrors({
          ...formErrors,
          vestingAmount: true,
        });
        updateFormData({
          ...formData,
          vestingAmount: e.target.value,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emptyCheck = Object.values(formData).every((v) => v != '' || v != 0);
    const errorCheck = Object.values(formErrors).every((v) => v === false);

    if (errorCheck && emptyCheck) {
      try {
        const data = {
          ...formData,
        };
        setModalClosed(false);
        const res = await axios.post(`${process.env.API_URL}/vesting/vest/`, {
          ...data,
        });
        // console.log(res.data);
        setLoading(false);
        // modal for success message
        setOpenSuccess(true);
        setSuccessMessageData({
          ...successMessageData,
          ergs: res.data.total,
          address: res.data.smartContract,
          token: res.data.currencyAmount,
          currency: res.data.currency,
        });

        const now = new Date().valueOf();
        clearInterval(interval);
        setStateInterval(setInterval(() => updateWaitCounter(now), 1000));

        checkWalletApproval();
      } catch (err) {
        if (err.response?.status) {
          setErrorMessage(
            'Error: ' + err.response?.status + ' ' + err.response?.data
          );
        } else {
          setErrorMessage('Error: Network error');
        }

        setOpenError(true);
        console.log(err);
        setLoading(false);
      }
    } else {
      let updateErrors = {};
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry;
        if (value == '') {
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
          title="Exchange Ergopad Tokens"
          subtitle="If you bought Ergopad seedsale or strategic sale tokens you can vest them here."
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
            <Typography variant="body2" sx={{ fontSize: '1rem', mb: 3 }}>
              This form will generate a transaction to lock your
              strategic_sale or seedsale tokens into their
              appropriate vesting contracts. Once sent, your ergopad tokens will
              be automatically deposited into your wallet once per month,
              starting January 26th.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem', mb: 3 }}>
              If you have both tokens, please send them in two separate
              transactions. Once your tokens are vested, you can see them on the{' '}
              <MuiNextLink href="/dashboard">dashboard</MuiNextLink> page in the
              vesting table. Please follow the instructions closely when you
              submit this form.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem', mb: 3 }}>
              The instructions differ if you&apos;re using Yoroi wallet or one
              of the mobile wallets.
            </Typography>
          </Box>
        </Grid>

        <Grid item md={8}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: '700' }}>
              Token Exchange Form
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem', mb: 1 }}>
              Note: {approvalMessage}
            </Typography>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="vestingAmount"
              label={`Enter the ${formData.vestingScenario} value you are sending`}
              name="vestingAmount"
              variant="filled"
              sx={{ mb: 3 }}
              onChange={handleChange}
              value={formData.vestingAmount}
              error={formErrors.vestingAmount}
              helperText={formErrors.vestingAmount && valueHelper}
            />
            <Typography variant="body2" sx={{ fontSize: '1rem', mb: 1 }}>
              Select which token you would like to exchange from:{' '}
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={formData.vestingScenario}
              exclusive
              onChange={handleCurrencyChange}
              sx={{ mb: 3, mt: 0 }}
            >
              <ToggleButton value="seedsale">Seedsale</ToggleButton>
              <ToggleButton value="strategic_sale">Strategic</ToggleButton>
            </ToggleButtonGroup>
            <FormControl
              variant="filled"
              fullWidth
              required
              name="wallet"
              error={formErrors.wallet}
            >
              <InputLabel
                htmlFor="ergoAddress"
                sx={{ '&.Mui-focused': { color: 'text.secondary' } }}
              >
                Ergo Wallet Address
              </InputLabel>
              <FilledInput
                id="ergoAddress"
                value={wallet}
                onClick={openWalletAdd}
                readOnly
                disableUnderline={true}
                name="wallet"
                type="ergoAddress"
                sx={{
                  width: '100%',
                  border: '1px solid rgba(82,82,90,1)',
                  borderRadius: '4px',
                }}
              />
              <FormHelperText>
                {formErrors.wallet && 'Enter a valid ergo wallet address'}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={buttonDisabled}
              // disabled={true}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'relative',
                  top: '-40px',
                  left: '50%',
                  marginTop: '-9px',
                  marginLeft: '-12px',
                }}
              />
            )}
            {modalClosed && (
              <Button
                onClick={() => setOpenSuccess(true)}
                variant="outlined"
                sx={{ mt: 1, mb: 1 }}
              >
                Re-Open Payment Modal
              </Button>
            )}
          </Box>

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
          <Dialog
            open={openSuccess}
            onClose={handleCloseSuccess}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ textAlign: 'center' }}
          >
            <DialogTitle id="alert-dialog-title" sx={{ pt: 3 }}>
              Click on the amount and the address to copy them!
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
              }}
            >
              <DialogContentText id="alert-dialog-description">
                Please send exactly{' '}
                <Typography
                  onClick={() => {
                    navigator.clipboard.writeText(successMessageData.ergs);
                    copyToClipboard(successMessageData.ergs);
                  }}
                  variant="span"
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                >
                  {successMessageData.ergs} Erg
                </Typography>
                {successMessageData.token > 0.0 && (
                  <>
                    {' '}
                    and{' '}
                    <Typography
                      onClick={() => {
                        navigator.clipboard.writeText(successMessageData.token);
                        copyToClipboard(successMessageData.token);
                      }}
                      variant="span"
                      sx={{ color: 'text.primary', cursor: 'pointer' }}
                    >
                      {successMessageData.token} {successMessageData.currency}
                    </Typography>
                  </>
                )}{' '}
                to{' '}
                <Typography
                  onClick={() => {
                    navigator.clipboard.writeText(successMessageData.address);
                    copyToClipboard(successMessageData.address);
                  }}
                  variant="span"
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                >
                  {friendlyAddress(successMessageData.address)}
                </Typography>
                {successMessageData.token > 0.0 && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: mediumWidthUp ? '0.8rem' : '0.7rem',
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      Note: Yoroi users will not need to add 0.01 erg, it is
                      already done by Yoroi. Other wallet users do need to
                      include that amount with the tokens they send.
                    </Typography>
                  </>
                )}
              </DialogContentText>
              <Card
                sx={{
                  background: '#fff',
                  width: { xs: '180px', md: '360px' },
                  margin: 'auto',
                  py: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  <QRCode
                    size={mediumWidthUp ? 300 : 140}
                    value={
                      'https://explorer.ergoplatform.com/payment-request?address=' +
                      successMessageData.address +
                      '&amount=' +
                      successMessageData.ergs
                    }
                  />
                </CardContent>
              </Card>
              {successMessageData.token > 0.0 && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: mediumWidthUp ? '0.8rem' : '0.7rem',
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    The QR code will not enter {successMessageData.currency}{' '}
                    values for you, you must enter them manually.
                  </Typography>
                </>
              )}
              <>
                <Typography variant="body2" sx={{ fontSize: '1rem', mb: 1 }}>
                  Time remaining: {timer}
                </Typography>
                <Box sx={{ px: 5, mb: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: mediumWidthUp ? '0.8rem' : '0.7rem', mb: 1 }}
                >
                  Please make sure you complete the transaction before the timer
                  runs out. If you are close to the timeout refresh the page and
                  restart the transaction.
                </Typography>
              </>
            </DialogContent>
            <DialogActions sx={{ mt: -5 }}>
              <Button onClick={handleCloseSuccess} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
};

export default Exchange;
