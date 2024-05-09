import { useState, forwardRef, useEffect } from 'react';
import CenterTitle from '@components/CenterTitle';
import { Typography, Grid, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Home from '@components/admin/Home';
import Sidenav from '@components/admin/Sidenav';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  email: '',
  password: '',
});

const initialFormErrors = Object.freeze({
  email: false,
  password: false,
});

const Admin = () => {
  const JWT_TOKEN =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('jwt_token_login_422')
      : null;

  const [isLoggedIn, setIsLoggedIn] = useState(JWT_TOKEN);
  // form data is all strings
  const [formData, updateFormData] = useState(initialFormData);
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false);
  // set true to disable submit button
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  // change error message for error snackbar
  const [errorMessage] = useState('Invalid crendentials. Please try again');
  // show home page page when logged in
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    setbuttonDisabled(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setbuttonDisabled(
      formData.email === '' ||
        formData.password === '' ||
        formErrors.email ||
        formErrors.password
    );
  }, [formData, formErrors]);

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

  // snackbar for error reporting
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const form = {
      username: formData.email,
      password: formData.password,
    };

    const data = Object.keys(form)
      .map((key) => `${key}=${encodeURIComponent(form[key])}`)
      .join('&');

    if (errorCheck) {
      axios
        .post(`${process.env.API_URL}/auth/token`, data, defaultOptions)
        .then((res) => {
          if (res.data.permissions !== 'admin') throw 401;
          sessionStorage.setItem('jwt_token_login_422', res.data.access_token);
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch(() => {
          // snackbar for error message
          setOpenError(true);
          setLoading(false);
        });
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
      setOpenError(true);
      // turn off loading spinner for submit button
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowHome(true);
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <>
          <CenterTitle
            title="Ergopad Admin"
            subtitle="Login to Continue"
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
                  Login
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      InputProps={{ disableUnderline: true }}
                      name="email"
                      required
                      fullWidth
                      id="email"
                      label="Username"
                      autoFocus
                      variant="filled"
                      value={formData.email}
                      onChange={handleChange}
                      error={formErrors.email}
                      helperText={formErrors.email && 'Enter username'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      InputProps={{ disableUnderline: true }}
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      variant="filled"
                      value={formData.password}
                      onChange={handleChange}
                      error={formErrors.password}
                      helperText={formErrors.password && 'Enter password'}
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
          </Grid>
        </>
      ) : (
        <>
          {showHome ? (
            <Grid
              container
              maxWidth="lg"
              sx={{
                mx: 'auto',
                flexDirection: 'row-reverse',
                px: { xs: 2, md: 3 },
              }}
            >
              <Home />
              <Sidenav />
            </Grid>
          ) : null}
        </>
      )}
    </>
  );
};

export default Admin;
