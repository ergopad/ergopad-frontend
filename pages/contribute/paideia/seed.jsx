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
import { useWallet } from 'utils/WalletContext';
import { useAddWallet } from 'utils/AddWalletContext';
import MuiNextLink from '@components/MuiNextLink';
import PageTitle from '@components/PageTitle';
import TransactionSubmitted from '@components/TransactionSubmitted';
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
const EVENT_NAME = 'seed-paideia-202203';
const ROUND_PROXY_NFT =
  '658a05b7d5cfc43fe08286d345bf29c1dfb8206e25ec587437418d9bfb0d0d23';
const WHITELIST_TOKEN_ID =
  '9e7b601a7ff6f8d0c19d3ece84827d320a014dce38cd3e2c813195e14cbda369';
// const SIGUSD_TOKEN_ID =
//   '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';
// const PAIDEIA_TOKEN_ID = 'paideia_token_id';
const PAIDEIA_CONVERSION_RATE = 0.005;
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

const initialRoundDetails = Object.freeze({
  remaining: 0,
});

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const ContributeSeedRound = () => {
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
  const [roundDetails, setRoundDetails] = useState(initialRoundDetails);
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

  const getRemainingTokens = async () => {
    try {
      const res = await axios.get(
        `${process.env.API_URL}/vesting/activeRounds`,
        defaultOptions
      );
      const round = res.data.activeRounds.filter(
        (round) => round.proxyNFT === ROUND_PROXY_NFT
      )[0];
      setRoundDetails(round ? round : initialRoundDetails);
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
    getRemainingTokens();
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
          title="Paideia Seed Round"
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
              The vesting period for this round will be 9 months and emission
              will happen daily following the IDO.
            </Typography>
          </Box>
        </Grid>
        <Grid item md={8}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ fontWeight: '700' }}>
              Token Contribution Form
            </Typography>
            <Typography variant="p" sx={{ mb: 0 }}>
              Tokens remaining to be distributed for this round:{' '}
              {Math.round(roundDetails.remaining * 10000) / 10000}.
            </Typography>
            <Typography variant="p" sx={{ mb: 3 }}>
              <b>Note:</b> If you are whitelisted for seed or strategic rounds,
              be aware of the waitlist open dates, where others may be able to
              claim your reserved tokens.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: '1rem' }}>
                  <Typography variant="span" sx={{ fontWeight: 'bold' }}>
                    YOROI IS NOT SUPPORTED.{' '}
                  </Typography>
                  You{' '}
                  <Typography variant="span" sx={{ fontWeight: 'bold' }}>
                    MUST
                  </Typography>{' '}
                  use Nautilus v0.2.2 or SAFEW. Please see{' '}
                  <MuiNextLink
                    href="https://ergopad.medium.com/paideia-contribution-instructions-8e897d64cfed"
                    target="_blank"
                  >
                    this post
                  </MuiNextLink>{' '}
                  for more information.
                </Typography>
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
                <Typography variant="p" sx={{ fontSize: '1rem', mb: '1rem' }}>
                  You are receiving {formData.vestingAmount} Paideia tokens at $
                  {PAIDEIA_CONVERSION_RATE} per token. Your total contribution
                  value is $
                  {Math.round(
                    PAIDEIA_CONVERSION_RATE * formData.vestingAmount * 100
                  ) / 100}
                  .
                </Typography>
                <Typography variant="p" sx={{ fontSize: '1rem', mb: 0 }}>
                  You may contribute the entire sum in ergo or sigUSD. If you
                  wish to contribute ergo, it will be taken at an exchange of ~$
                  {conversionRate} sigUSD per ergo.
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
                <FormHelperText sx={{ mt: 0, mb: 3 }}>
                  {checkboxError && 'Please accept the terms before submitting'}
                </FormHelperText>
              </FormGroup>
            </FormControl>
            <Typography variant="p" sx={{ fontSize: '1rem', mb: '1rem' }}>
              It can take time to retrieve the oracle value and generate the
              transaction. Please be patient, and try again if you get an oracle
              error. Once you sign the transcation, check the explorer link and
              give it a few minutes to confirm on the blockchain.
            </Typography>
            <Typography variant="p" sx={{ fontWeight: 'bold', mb: 0 }}>
              YOROI IS NOT SUPPORTED.
            </Typography>
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
              'This contribution round is yet to start.'}
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
          <TransactionSubmitted
            transactionId={transactionId}
            pending={openModal === transactionModalState.USER_PENDING}
          />
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

export default ContributeSeedRound;
