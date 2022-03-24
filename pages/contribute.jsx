import { Typography, Grid, Box, TextField, Button, Container, LinearProgress } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import PageTitle from '@components/PageTitle';
import theme from '../styles/theme';
import axios from 'axios';
import { useWallet } from 'utils/WalletContext'
import { useAddWallet } from 'utils/AddWalletContext'
import { useState, useEffect, forwardRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from "react-qr-code";
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
    amount: 0.0,
    currency: 'sigusd'
  });

const initialFormErrors = Object.freeze({
    wallet: false,
    amount: false
});

const initialCheckboxState = Object.freeze({
    legal: false,
    risks: false,
    dao: false
})

const initialSuccessMessageData = Object.freeze({
    ergs: 0.0,
    address: '',
    currency: '',
    token: 0.0
})

function friendlyAddress(addr, tot = 13) {
    if (addr === undefined || addr.slice === undefined) return ''
    if (addr.length < 30) return addr
    return addr.slice(0, tot) + '...' + addr.slice(-tot);
}

const defaultOptions = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// wait time in mins
// config in assembler
const WAIT_TIME = 5;

const PRESALE_USD = 0.03;

const Contribute = () => {
    const mediumWidthUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
    // boolean object for each checkbox
    const [checkboxState, setCheckboxState] = useState(initialCheckboxState)
    // set true to disable submit button
    const [buttonDisabled, setbuttonDisabled] = useState(true)
    // loading spinner for submit button
    const [isLoading, setLoading] = useState(false);
    // form error object, all booleans
    const [formErrors, setFormErrors] = useState(initialFormErrors)
    const [formData, updateFormData] = useState(initialFormData);
    // open error snackbar 
	const [openError, setOpenError] = useState(false);
    // change error message for error snackbar
	const [errorMessage, setErrorMessage] = useState('Please eliminate form errors and try again')
    // open success snackbar
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
    // change message for success snackbar
	const [successMessageSnackbar, setSuccessMessageSnackbar] = useState('Copied to Clipboard')
    // open success modal
	const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessageData, setSuccessMessageData] = useState(initialSuccessMessageData)
    const [sigusdAllowed, setSigusdAllowed] = useState(0.0)
    const [alignment, setAlignment] = useState('sigusd');
    const [sigusdApprovalMessage, setSigusdApprovalMessage] = useState('Please enter an Ergo address to see how much sigUSD is approved.')
    // helper text for sigvalue
    const [sigHelper, setSigHelper] = useState('')
    // erg conversion rate loading from backend
    const [conversionRate, setConversionRate] = useState(1);
    // modal is closed
    // used to reopen modal if user closes the modal after form
    // is submitted
    const [modalClosed, setModalClosed] = useState(false);
    // used to control the Timer component
    // timer
    const [timer, setTimer] = useState('');
    const [progress, setProgress] = useState(0.0);
    // interval
    const [interval, setStateInterval] = useState(0);
    // to early
    const [toEarly, setToEarly] = useState(true);

    const apiCheck = () => {
      axios
        .get(`${process.env.API_URL}/blockchain/info`, { ...defaultOptions })
        .then((res) => {
          console.log(res.data);
          // Thu Jan 20 2022 17:00:00 GMT+0000
          if (res.data.currentTime_ms > 1642698000000) {
            setToEarly(false);
            if (!checkboxError)
              setbuttonDisabled(false);
          } else {
            // should be true
            setToEarly(true);
            setbuttonDisabled(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // set erg/usd conversion rate
    const updateConversionRate = async () => {
        try {
            const res = await axios.get(`${process.env.API_URL}/asset/price/ergo`);
            setConversionRate(res.data.price);
        } catch (e) {
            console.log(e);
        }
    }

    // calculate and update the timer string
    const updateWaitCounter = (lastSubmit) => {
        const now = new Date().valueOf();
        const diff = lastSubmit - now + WAIT_TIME * 60 * 1000;
        const mm = Math.max(0, Math.floor(diff / (60 * 1000))).toString(10);
        const ss = Math.max(0, (Math.floor(diff / (1000)) % 60)).toString(10);
        const pmm = mm.length === 2 ? mm : ('0'+mm);
        const pss = ss.length === 2 ? ss : ('0'+ss);
        setTimer(`${pmm}:${pss}`);
        // calculate progress
        const n = Math.max(0, diff);
        const d = WAIT_TIME * 60 * 1000;
        setProgress((n / d) * 100);
        // if zero check for wallet approval
        if (Math.floor(diff / 1000) == 0) {
            checkWalletApproval();
        }
    }

    // when component is loaded initializing the conversion rate and counter
    useEffect(() => {
        updateConversionRate();
        apiCheck();
        // update counter every 1 second or 1000ms
        // const now = new Date().valueOf();
        // clearInterval(interval);
        // setStateInterval(setInterval(() => updateWaitCounter(now), 1000));
    }, [])

    // when loading button is disabled
    useEffect(() => {
        setbuttonDisabled(isLoading);
    }, [isLoading])

    const { legal, risks, dao } = checkboxState;
    const checkboxError = [legal, risks, dao].filter((v) => v).length !== 3

    // if there are no checkbox errors confirm time from api
    // if there are checkbox errors button is disabled regardless
    useEffect(() => {
        if (checkboxError) {
            setbuttonDisabled(true);
        } else {
            apiCheck()
        }
    }, [checkboxError])

    const handleCurrencyChange = (e, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            updateFormData({
                ...formData,
                amount: 0,
                currency: e.target.value
            });
            setFormErrors({
                ...formErrors,
                amount: true,
            })
        }

        // get latest data on change
        updateConversionRate();
    };

    const { wallet } = useWallet()
    const { setAddWalletOpen } = useAddWallet()
    
    const openWalletAdd = () => {
        setAddWalletOpen(true)
    }

    useEffect(() => {
      if (sigusdAllowed >= 0.0) {
        // show the conversion rate if currency is erg
        const additionalMsg =
          formData.currency === 'erg'
            ? ' For erg current conversion rate is ~' + conversionRate + '$.'
            : '';
        const allowed =
          formData.currency === 'erg'
            ? `~${Math.floor(sigusdAllowed / conversionRate)} erg`
            : `${sigusdAllowed} sigUsd`;
        setSigusdApprovalMessage(
          'This address is approved for ' + allowed + ' max.' + additionalMsg
        );
      } else if (sigusdAllowed < 0.0 && wallet) {
        setSigusdApprovalMessage(
          'There is a pending transaction, either send the funds or wait(may take upto 10 mins) for it to time-out and refresh the page to try again. '
        );
      } else if (!wallet) {
        setSigusdApprovalMessage(
          'Please enter an Ergo address to see how much sigUSD is approved.'
        );
      }
    }, [sigusdAllowed, formData.currency, wallet, conversionRate]);

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
    // todo: refactor
    // the checkWalletApproval and useEffect for wallet has a good degree of code repeatation
    // a good idea might be to refactor the two
    const checkWalletApproval = async () => {
      if (wallet != '') {
        const pending = await isTransactionPending();
        if (pending) {
          setSigusdAllowed(-1);
          setSigHelper(
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
            `${process.env.API_URL}/purchase/allowance/${wallet}`
          );
          console.log(res.data);
          setSigusdAllowed(res.data.sigusd);
          setModalClosed(false);
          updateFormData({ ...formData, amount: 0 });
          setFormErrors({ ...formErrors, amount: false });
        } catch (e) {
          console.log(e);
        }
      }
    };

    useEffect(() => {
      const updateData = async () => {
        if (wallet != '') {
          const pending = await isTransactionPending();
          if (pending) {
            setSigusdAllowed(-1);
            setSigHelper(
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
              `${process.env.API_URL}/purchase/allowance/${wallet}`
            );
            setSigusdAllowed(res.data.sigusd);
            setFormErrors({
              ...formErrors,
              wallet: false,
            });
            updateFormData({
              ...formData,
              wallet: wallet,
            });
          } catch (e) {
            if (
              e.response ===
              'invalid wallet or allowance; wallet may not exist or remaining value is non-numeric'
            ) {
              setSigusdAllowed(0.0);
              setFormErrors({
                ...formErrors,
                wallet: true,
              });
              updateFormData({
                ...formData,
                wallet: wallet,
              });
            } else {
              console.log(e);
            }
          }
        } else {
          setFormErrors({
            ...formErrors,
            wallet: true,
          });
          setSigusdAllowed(0.0);
        }
        // hide reopen modal button on wallet change
        setModalClosed(false);
      };

      updateData();
    }, [wallet]);

    const handleChecked = (e) => {
        setCheckboxState({
            ...checkboxState,
            [e.target.name]: e.target.checked
        })
    }

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
        setSuccessMessageSnackbar('Copied ' + text + ' to clipboard')
        setOpenSuccessSnackbar(true)
    }

    const handleChange = (e) => {
        if (e.target.value == '' || e.target.value == 0.0) {
            setSigHelper('Please enter the amount you\'d like to invest in sigUSD or erg.')
			setFormErrors({
				...formErrors,
				[e.target.name]: true
			});
		}
		else {
			setFormErrors({
				...formErrors,
				[e.target.name]: false
			});
		}

        if (e.target.name == 'amount') {
          const amount = Number(e.target.value);
          // if currency is in erg calculate sigUSD value to check if value is
          // within the approved amount
          const sigNumber =
            formData.currency === 'sigusd' ? amount : amount * conversionRate;
          if (
            sigNumber <= 20000.0 &&
            sigNumber > 0.0 &&
            sigNumber <= sigusdAllowed
          ) {
            setFormErrors({
              ...formErrors,
              amount: false,
            });
            updateFormData({
              ...formData,
              amount: e.target.value,
            });
          } else {
            setSigHelper('Must be a value within your approved amount');
            setFormErrors({
              ...formErrors,
              amount: true,
            });
            updateFormData({
                ...formData,
                amount: e.target.value,
              });
          }
        }
      };

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);

      const emptyCheck = Object.values(formData).every(
        (v) => v != '' || v != 0
      );
      const errorCheck = Object.values(formErrors).every((v) => v === false);

      if (errorCheck && emptyCheck) {
        console.log(formData);
        // new request format
        const data = {
          wallet: formData.wallet,
          vestingAmount:
            formData.currency === 'sigusd'
              ? Math.floor(formData.amount / PRESALE_USD)
              : Math.floor((formData.amount * conversionRate) / PRESALE_USD),
          vestingScenario:
            formData.currency === 'sigusd' ? 'presale_sigusd' : 'presale_ergo',
        };
        console.log(data);
        setModalClosed(false);
        axios
          .post(`${process.env.API_URL}/vesting/vest/`, { ...data })
          .then((res) => {
            console.log(res.data);
            setLoading(false);
            // modal for success message
            setOpenSuccess(true);
            setSuccessMessageData({
              ...successMessageData,
              ergs: res.data.total,
              address: res.data.smartContract,
              currency: res.data.currency,
              token: res.data.currencyAmount,
            });

            const now = new Date().valueOf();
            clearInterval(interval);
            setStateInterval(setInterval(() => updateWaitCounter(now), 1000));

            checkWalletApproval();
          })
          .catch((err) => {
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
          });
        // setLoading(false)
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

        // turn off loading spinner for submit button
        setLoading(false);
      }
    };

  return (
    <>
        <Container maxWidth="lg" sx={{ px: {xs: 2, md: 3 } }}>
		<PageTitle 
			title="Paideia Token Staker Round"
			subtitle="Contribute Ergo or Sigusd to the Paideia DAO to reserve your Paideia governance tokens."
		/>
        </Container>

        <Grid container maxWidth='lg' sx={{ mx: 'auto', flexDirection: 'row-reverse', px: {xs: 2, md: 3 } }}>

            <Grid item md={4} sx={{ pl: { md: 4, xs: 0 } }}>
				<Box sx={{ mt: { md: 0, xs: 4 } }}>
                    <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
                        Details
                    </Typography>
                
                    <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
                        You must be pre-approved on whitelist to be able to receive tokens. Add your wallet address to check if you have an allocation available. 
                    </Typography>

                    <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
                      When you contribute to the Paideia DAO using this form, your tokens will be locked in a vesting contract. You will receive an NFT that represents these vested tokens, and that will allow you to claim them as they unlock. You may claim as often as you'd like or wait to claim as infrequently as you like, and they will not be distributed to your wallet until you send claim transactions to the smart contract. 
                    </Typography>

                    <Typography variant="p" sx={{ fontSize: '1rem', mb: 3 }}>
                      The vesting period for this round will be [VESTING_TIME_FRAME] and emission will happen [DAILY]. You may wait for them to accumulate and claim at any time, or claim each time tokens are unlocked. 
                    </Typography>
				</Box>
			</Grid>

			<Grid item md={8}>
				<Box component="form" noValidate onSubmit={handleSubmit}>
					<Typography variant="h4" sx={{ mb: 3, fontWeight: '700' }}>
						Token Contribution Form
					</Typography>

          <FormControl
              variant="filled" 
              fullWidth
              required
              name="wallet"
              error={formErrors.wallet}
              sx={{ mb: 1 }}
          >
              <InputLabel htmlFor="ergoAddress" sx={{'&.Mui-focused': { color: 'text.secondary'}}}>
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
                  {formErrors.wallet && 'Your address must be approved on the whitelist' }
              </FormHelperText>
          </FormControl>

          <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
              Note: This address contains [NUMBER_OF_WHITELIST_TOKENS] whitelist tokens. 
          </Typography>

          <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="amount"
              label={`Number of Paideia tokens you'd like to receive`}
              name="amount"
              variant="filled"
              sx={{ mb: 3 }}
              onChange={handleChange}
              value={formData.amount}
              error={formErrors.amount}
              helperText={formErrors.amount && sigHelper}
          />

          
          <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>Select which currency you would like to send: </Typography>
          <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleCurrencyChange}
              sx={{ mb: 3, mt: 0 }}
              >
              <ToggleButton value="sigusd">SigUSD</ToggleButton>
              <ToggleButton value="erg">Erg</ToggleButton>
          </ToggleButtonGroup>

          <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="amount"
              label={`Number of ${formData.currency === 'sigusd' ? 'sigUSD' : 'erg' } this transaction will require`}
              name="amount"
              variant="filled"
              sx={{ mb: 3 }}
              onChange={handleChange}
              value={formData.amount}
              error={formErrors.amount}
              helperText={formErrors.amount && sigHelper}
          />


                    

                    <FormControl required error={checkboxError}>
                    <FormGroup sx={{mt: 6 }}>
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={legal} 
                                    onChange={handleChecked} 
                                    name="legal" 
                                />
                            }
                            label="I have confirmed that I am legally entitled to invest in a cryptocurrency project of this nature in the jurisdiction in which I reside" 
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
                            label="I am aware of the risks involved when investing in a project of this nature. There is always a chance an investment with this level of risk can lose all it's value, and I accept full responsiblity for my decision to invest in this project" 
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
                        <FormHelperText>{checkboxError && 'Please accept the terms before submitting'}</FormHelperText>
                    </FormGroup>
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
                        <Button onClick={() => setOpenSuccess(true)} variant="outlined" sx={{mt: 1, mb: 1}}>
                            Re-Open Payment Modal
                        </Button>
                    )}
				</Box>

                <Snackbar open={openError} autoHideDuration={4500} onClose={handleCloseError}>
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
                <Snackbar open={openSuccessSnackbar} autoHideDuration={4500} onClose={handleCloseSuccessSnackbar}>
                    <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
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
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                        <DialogContentText id="alert-dialog-description">
                            Please send exactly {' '}
                            <Typography onClick={() => {
                                    navigator.clipboard.writeText(successMessageData.ergs)
                                    copyToClipboard(successMessageData.ergs)
                                }
                            } variant="span" sx={{ color: 'text.primary', cursor: 'pointer' }}>
                                {successMessageData.ergs} Erg
                            </Typography>
                            {(successMessageData.token > 0.0 && successMessageData.currency !== 'ergo') && 
                            <>{' '}and{' '}<Typography onClick={() => {
                                navigator.clipboard.writeText(successMessageData.token)
                                copyToClipboard(successMessageData.token)
                            }
                            } variant="span" sx={{ color: 'text.primary', cursor: 'pointer' }}>
                                 {successMessageData.token} {successMessageData.currency}
                            </Typography></>}
                            {' '}to{' '}
                            <Typography onClick={() => {
                                    navigator.clipboard.writeText(successMessageData.address)
                                    copyToClipboard(successMessageData.address)
                                }
                            } variant="span" sx={{ color: 'text.primary', cursor: 'pointer' }}>
                                {friendlyAddress(successMessageData.address)}
                            </Typography>
                            {(successMessageData.token > 0.0 && successMessageData.currency !== 'ergo') && 
                                <>
                                    <Typography variant="p" sx={{ fontSize: mediumWidthUp ? '0.8rem' : '0.7rem', mt: 1, mb: 1 }}>
                                        Note: Yoroi users will not need to add 0.01 erg, it is already done by Yoroi. Other wallet users do need to include that amount with the sigUSD tokens they send.
                                    </Typography>
                                </>
                            }
                        </DialogContentText>
                        <Card sx={{ background: '#fff', width: {xs: '180px', md: '360px'}, margin: 'auto', py: 1, display: 'flex', justifyContent: 'center'}}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                                <QRCode
                                    size={mediumWidthUp ? 300 : 140}
                                    value={"https://explorer.ergoplatform.com/payment-request?address=" + successMessageData.address +
                                    "&amount=" + successMessageData.ergs}
                                />
                            </CardContent>
                        </Card>
                        {(successMessageData.token > 0.0 && successMessageData.currency !== 'ergo') && 
                                <>
                                    <Typography variant="p" sx={{ fontSize: mediumWidthUp ? '0.8rem' : '0.7rem', mt: 1, mb: 1 }}>
                                        The QR code will not enter {successMessageData.currency} values for you, you must enter them manually. 
                                    </Typography>
                                </>
                            }
                        <>
                            <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
                                Time remaining: {timer}
                            </Typography>
                            <Box sx={{px: 5, mb: 2}}>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                            <Typography variant="p" sx={{ fontSize: mediumWidthUp ? '0.8rem' : '0.7rem', mb: 1 }}>
                                Please make sure you complete the transaction before the timer runs out.
                                If you are close to the timeout refresh the page and restart the transaction.
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

export default Contribute;
