import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import theme from '@styles/theme';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  id: 0,
  email: '',
  is_active: true,
  is_superuser: false,
  password: '',
});

const initialFormErrors = Object.freeze({
  password: false,
});

const EditUserForm = () => {
  // form data is all strings
  const [formData, updateFormData] = useState(initialFormData);
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false);
  // set true to disable submit button
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false);
  // change error message for error snackbar
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again',
  );

  // get initial data
  useEffect(() => {
    setLoading(true);
    setOpenError(false);
    const setUserData = async () => {
      try {
        const defaultOptions = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              'jwt_token_login_422',
            )}`,
          },
        };
        const res = await axios.get(
          `${process.env.API_URL}/users/me`,
          defaultOptions,
        );
        updateFormData({ ...formData, ...res.data });
      } catch (e) {
        setErrorMessage('Authentication Error: Please logout and re-login');
        setOpenError(true);
      }
      setLoading(false);
    };

    setUserData();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isLoading) {
      setbuttonDisabled(true);
    } else {
      setbuttonDisabled(false);
    }
  }, [isLoading]);

  // snackbar for error reporting
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  // modal for success message
  const handleCloseSuccess = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    if (errorCheck) {
      const defaultOptions = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            'jwt_token_login_422',
          )}`,
        },
      };
      const data = { ...formData };
      try {
        await axios.put(
          `${process.env.API_URL}/users/${formData.id}/password`,
          data,
          defaultOptions,
        );
        setOpenSuccess(true);
        updateFormData({ ...formData, password: '' });
      } catch {
        setErrorMessage('Invalid credentials or form data');
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
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ mt: 10, mb: 4, fontWeight: '700' }}>
          Change Password
        </Typography>
        <Grid container spacing={2} />
        <Grid item xs={12} sx={{ mb: 1 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            disabled
            id="email"
            label="Username"
            name="email"
            variant="filled"
            value={formData.email}
          />
        </Grid>
        <Grid item xs={12} sx={{ mb: 1 }}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Change password.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="password"
            type="password"
            label="Password"
            name="password"
            variant="filled"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            helperText={formErrors.password && 'Password cannot be empty'}
          />
        </Grid>
        <FormControlLabel
          control={
            <Checkbox name="is_active" checked={formData.is_active} disabled />
          }
          label="Active?"
          sx={{ color: theme.palette.text.secondary, mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="is_superuser"
              checked={formData.is_superuser}
              disabled
            />
          }
          label="Superuser?"
          sx={{ color: theme.palette.text.secondary, mb: 2 }}
        />
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
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
      <Snackbar
        open={openError}
        autoHideDuration={6000}
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
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          Changes were saved.
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserForm;
