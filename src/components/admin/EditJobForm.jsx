import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import theme from '@styles/theme';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PaginatedTable from '@components/PaginatedTable';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  id: '',
  title: '',
  shortDescription: '',
  description: '',
  category: '',
  archived: false,
});

const initialFormErrors = Object.freeze({
  id: false,
  name: false,
  shortDescription: false,
  category: false,
});

const EditJobForm = () => {
  // job data
  const [jobData, setJobData] = useState([]);
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
        const res = await axios.get(`${process.env.API_URL}/jobs/`);
        res.data.sort((a, b) => a.id - b.id);
        setJobData(res.data);
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
      [e.target.name]:
        e.target.name === 'archived' ? e.target.checked : e.target.value,
    });
  };

  const fetchDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenError(false);
    try {
      const jobId = formData.id;
      if (jobId) {
        const res = await axios.get(`${process.env.API_URL}/jobs/${jobId}`);
        updateFormData({ ...res.data });
        setFormErrors(initialFormErrors);
      }
    } catch (e) {
      setErrorMessage('Job listing not found');
      setOpenError(true);
    }
    setLoading(false);
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
          `${process.env.API_URL}/jobs/${formData.id}`,
          data,
          defaultOptions,
        );
        setOpenSuccess(true);
        updateFormData(initialFormData);
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
          Edit Job Listing
        </Typography>
        <Grid container spacing={2} />
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter job id manually or select a job listing from the table below.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="id"
            label="Job Id"
            name="id"
            variant="filled"
            value={formData.id}
            onChange={handleChange}
          />
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary>
              <strong>Expand to see job listings</strong>
            </AccordionSummary>
            <AccordionDetails>
              <PaginatedTable
                rows={jobData}
                onClick={(id) => {
                  updateFormData({ ...formData, id: id });
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Button
            onClick={fetchDetails}
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Fetch Job Details
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
        <Grid item xs={12}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="title"
            label="Job Title"
            name="title"
            variant="filled"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            helperText={formErrors.title && 'Enter the job title'}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            A short summary for the job opening.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="shortDescription"
            label="Job Short Description"
            name="shortDescription"
            variant="filled"
            value={formData.shortDescription}
            onChange={handleChange}
            error={formErrors.shortDescription}
            helperText={formErrors.shortDescription && 'Enter the job summary'}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Detailed description and Job deliverables (markdown supported).
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            multiline
            id="description"
            label="Job Description"
            name="description"
            variant="filled"
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="category"
            label="Category Tag"
            name="category"
            variant="filled"
            value={formData.category}
            onChange={handleChange}
            error={formErrors.category}
            helperText={
              formErrors.category &&
              'Enter a helpful job tag (development or marketing etc)'
            }
          />
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              name="archived"
              checked={formData.archived ?? 0}
              onChange={handleChange}
            />
          }
          label="Archived?"
          sx={{ color: theme.palette.text.secondary, mb: 3 }}
        />
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 1 }}
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

export default EditJobForm;
