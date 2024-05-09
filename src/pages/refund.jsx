import { useState, useEffect, forwardRef } from 'react';
import { Typography, Grid, Box, TextField, Button } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import { useWallet } from '@contexts/WalletContext';
import { useAddWallet } from '@contexts/AddWalletContext';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CenterTitle from '@components/CenterTitle';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  wallet: '',
  smartContract: '',
});

const initialFormErrors = Object.freeze({
  wallet: false,
  smartContract: false,
});

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const Refund = () => {
  // form data
  const [formData, updateFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const { wallet } = useWallet();
  const { setAddWalletOpen } = useAddWallet();
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false);
  // set true to disable submit button
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  // error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again',
  );
  // success snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessageSnackbar, setSuccessMessageSnackbar] =
    useState('OK processing...');

  useEffect(() => {
    setbuttonDisabled(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setbuttonDisabled(
      formData.wallet === '' ||
        formData.smartContract === '' ||
        formErrors.wallet ||
        formErrors.smartContract,
    );
  }, [formData, formErrors]);

  useEffect(() => {
    updateFormData({ ...formData, wallet: wallet });
  }, [wallet]);

  const openWalletAdd = () => {
    setAddWalletOpen(true);
  };

  const handleChange = (e) => {
    if (
      e.target.value == '' &&
      Object.hasOwnProperty.call(formErrors, e.target.name)
    ) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: true,
      });
    } else if (Object.hasOwnProperty.call(formErrors, e.target.name)) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      });
    }

    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);

    const errorCheck = Object.values(formErrors).every((v) => v === false);

    if (errorCheck) {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/assembler/return/${formData.wallet}/${formData.smartContract}`,
          defaultOptions,
        );
        setOpenSuccessSnackbar(true);
        // console.log(res);
      } catch (e) {
        if (e?.response?.data?.detail) {
          setErrorMessage('Error: ' + e.response.data.detail);
        } else {
          setErrorMessage('Error: Network Error');
        }
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry;
        if (value == '' && Object.hasOwnProperty.call(formErrors, key)) {
          let newEntry = { [key]: true };
          updateErrors = { ...updateErrors, ...newEntry };
        }
      });
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      });
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }

    setLoading(false);
  };

  return (
    <>
      <CenterTitle
        title="Refund"
        subtitle="Return funds that become 'stuck' in a proxy address"
        main={true}
      />
      <Grid
        container
        maxWidth="lg"
        alignItems="center"
        justifyContent="center"
        sx={{
          mx: 'auto',
          flexDirection: 'row-reverse',
          px: { xs: 2, md: 4 },
          mb: 10,
        }}
      >
        <Grid item md={4}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: '700' }}>
              Return funds
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                    {formErrors.wallet &&
                      'Enter the ergo wallet address you sent funds from'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  required
                  fullWidth
                  id="smartContract"
                  label="Smart Contract Address"
                  name="smartContract"
                  variant="filled"
                  value={formData.smartContract}
                  onChange={handleChange}
                  error={formErrors.smartContract}
                  helperText={
                    formErrors.smartContract &&
                    'Enter smart contract address you sent funds to'
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                disabled={buttonDisabled}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-9px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
        <Snackbar
          open={openError}
          autoHideDuration={4000}
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
          autoHideDuration={4000}
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
      </Grid>
    </>
  );
};

export default Refund;
