import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import PaginatedTable from '@components/PaginatedTable';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  id: '',
});

const initialFormErrors = Object.freeze({
  id: false,
});

const DeleteContributionEventForm = () => {
  // table data
  const [tableData, setTableData] = useState([]);
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
    'Please eliminate form errors and try again'
  );

  useEffect(() => {
    if (isLoading) {
      setbuttonDisabled(true);
    } else {
      setbuttonDisabled(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const getTableData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.API_URL}/contribution/events`
        );
        res.data.sort((a, b) => a.id - b.id);
        setTableData(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getTableData();
  }, [openSuccess]);

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
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    if (errorCheck) {
      const id = formData.id;
      const defaultOptions = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            'jwt_token_login_422'
          )}`,
        },
      };
      try {
        await axios.delete(
          `${process.env.API_URL}/contribution/events/${id}`,
          defaultOptions
        );
        setOpenSuccess(true);
        updateFormData(initialFormData);
      } catch (e) {
        console.log(e);
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
        <Typography variant="h4" sx={{ mt: 10, mb: 2, fontWeight: '700' }}>
          Delete Contribution Event
        </Typography>
        <Grid container spacing={2} />
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter Contribution event id manually or select one from the table
            below. This is an irreversible action.{' '}
            <b>
              All details will be deleted and cannot be recovered afterwards
            </b>
            . It is <b>not recommended</b> to use this page. Forms can be
            disabled by editing the end times.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="id"
            label="Contribution Event Id"
            name="id"
            variant="filled"
            value={formData.id}
            onChange={handleChange}
            error={formErrors.id}
            helperText={formErrors.id && 'Enter the id'}
          />
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary>
              <strong>Expand to see Contribution Events</strong>
            </AccordionSummary>
            <AccordionDetails>
              <PaginatedTable
                rows={tableData.map((event) => {
                  return { ...event };
                })}
                onClick={(id) => {
                  updateFormData({ ...formData, id: id });
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            color="error"
            sx={{ mt: 1, mb: 1 }}
          >
            Delete
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

export default DeleteContributionEventForm;
