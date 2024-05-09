import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PaginatedTable from '@components/PaginatedTable';
import axios from 'axios';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  id: '',
  project: '',
  title: '',
  tokenId: '',
  tokenDecimals: 0,
  stakingInfo: '',
  terms: '', // not used yet
  additionalDetails: {
    stakingV1: false,
    disableStaking: false,
    disableUnstaking: false,
  },
});

const initialFormErrors = Object.freeze({
  id: false,
  project: false,
  title: false,
  tokenId: false,
  tokenDecimals: false,
});

const EditStakingConfigForm = () => {
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
        const res = await axios.get(`${process.env.API_URL}/staking/config`);
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
      e.target.value === '' &&
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

    if (e.target.name === 'tokenDecimals' && isNaN(e.target.value)) {
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

    if (
      ['stakingV1', 'disableStaking', 'disableUnstaking'].includes(
        e.target.name,
      )
    ) {
      updateFormData({
        ...formData,
        additionalDetails: {
          ...formData.additionalDetails,
          [e.target.name]: e.target.checked,
        },
      });
    } else {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const fetchDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenError(false);
    try {
      const project = tableData.filter(
        (project) => project.id === formData.id,
      )[0].project;
      if (project) {
        const res = await axios.get(
          `${process.env.API_URL}/staking/config/${project}`,
        );
        updateFormData({ ...res.data });
        setFormErrors(initialFormErrors);
      }
    } catch (e) {
      setErrorMessage('Staking config not found');
      setOpenError(true);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    const emptyCheck =
      formData.project !== '' &&
      formData.title !== '' &&
      formData.tokenId !== '' &&
      !isNaN(formData.tokenDecimals);
    if (errorCheck && emptyCheck) {
      const id = formData.id;
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
          `${process.env.API_URL}/staking/config/${id}`,
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
        if (value === '' && Object.hasOwnProperty.call(formErrors, key)) {
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
          Edit Staking Configuration
        </Typography>
        <Grid container spacing={2} />
        <Typography
          variant="h6"
          sx={{ mt: 2, mb: 1, fontWeight: '700' }}
        ></Typography>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter project staking config id manually or select a project from
            the table below.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="id"
            label="Staking Config Id"
            name="id"
            variant="filled"
            value={formData.id}
            onChange={handleChange}
          />
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary>
              <strong>Expand to see projects</strong>
            </AccordionSummary>
            <AccordionDetails>
              <PaginatedTable
                rows={tableData}
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
            Fetch Project Staking Config
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
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter the project unique identifier. Project identifier should be
            same as one used in the backend api configuration. The url for the
            generated staking page will be https://ergopad.io/staking/
            {formData.project}.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="project"
            label="Project Unique Identifier"
            name="project"
            variant="filled"
            value={formData.project}
            onChange={handleChange}
            error={formErrors.project}
            helperText={
              formErrors.project && 'Enter the project unique identifier'
            }
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="title"
            label="Project Title"
            name="title"
            variant="filled"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            helperText={formErrors.title && 'Enter project title'}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Token details
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="tokenId"
            label="Stake Token Id"
            name="tokenId"
            variant="filled"
            value={formData.tokenId}
            onChange={handleChange}
            error={formErrors.tokenId}
            helperText={formErrors.tokenId && 'Stake token id is required'}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="tokenDecimals"
            label="Stake Token Decimals"
            name="tokenDecimals"
            variant="filled"
            value={formData.tokenDecimals}
            onChange={handleChange}
            error={formErrors.tokenDecimals}
            helperText={
              formErrors.tokenDecimals &&
              'Stake token decimals should be a number'
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Detailed description and staking info.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            multiline
            id="stakingInfo"
            label="Staking Info Section Text"
            name="stakingInfo"
            variant="filled"
            value={formData.stakingInfo}
            onChange={handleChange}
            rows={6}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Staking v1 config allows for staking penalties and is similar to how
            ErgoPad staking works. Staking v2 is similar to Paideia staking with
            no penalties.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                name="stakingV1"
                checked={formData.additionalDetails.stakingV1}
                onChange={handleChange}
              />
            }
            label="Staking Version 1"
          />
        </Grid>
        <Grid container item xs={12} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography color="text.secondary">
              Disable/Enable Form Buttons
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="disableStaking"
                  checked={formData.additionalDetails.disableStaking}
                  onChange={handleChange}
                />
              }
              label="Disable Staking"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="disableUnstaking"
                  checked={formData.additionalDetails.disableUnstaking}
                  onChange={handleChange}
                />
              }
              label="Disable Unstaking"
            />
          </Grid>
        </Grid>
        <Box sx={{ position: 'relative', mt: 3 }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 1 }}
          >
            Update Staking Config
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

export default EditStakingConfigForm;
