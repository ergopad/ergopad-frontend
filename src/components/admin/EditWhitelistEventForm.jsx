import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ListTextInput from '@components/ListTextInput';
import PaginatedTable from '@components/PaginatedTable';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialFormData = Object.freeze({
  id: '',
  projectName: '',
  roundName: '',
  title: '',
  subtitle: '',
  details: '',
  checkBoxes: {
    checkBoxText: [],
  },
  additionalDetails: {
    min_stake: 0,
    add_to_footer: false,
    staker_snapshot_whitelist: false,
    early_bird: null,
  },
  total_sigusd: 0,
  buffer_sigusd: 0,
  individualCap: 0,
  start_dtz: new Date().toISOString(),
  end_dtz: new Date().toISOString(),
});

const initialFormErrors = Object.freeze({
  id: false,
  projectName: false,
  roundName: false,
  title: false,
  subtitle: false,
  total_sigusd: false,
  buffer_sigusd: false,
  individualCap: false,
  start_dtz: false,
  end_dtz: false,
});

const EditWhitelistEventForm = () => {
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
        const res = await axios.get(`${process.env.API_URL}/whitelist/events`);
        res.data.sort((a, b) => a.id - b.id);
        setTableData(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getTableData();
  }, [openSuccess]);

  const fetchDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenError(false);
    try {
      const id = formData.id;
      if (id) {
        const event = tableData.filter((event) => event.id === id)[0];
        const res = await axios.get(
          `${process.env.API_URL}/whitelist/events/${event.projectName}/${event.roundName}`
        );
        updateFormData({ ...res.data });
        setFormErrors(initialFormErrors);
      } else {
        setErrorMessage('Event not found');
        setOpenError(true);
      }
    } catch {
      setErrorMessage('Event not found');
      setOpenError(true);
    }
    setLoading(false);
  };

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

    if (
      ['total_sigusd', 'individualCap', 'buffer_sigusd'].includes(e.target.name)
    ) {
      const numCheck = Number(e.target.value);
      setFormErrors({
        ...formErrors,
        [e.target.name]: isNaN(numCheck),
      });
    }

    if (['start_dtz', 'end_dtz'].includes(e.target.name)) {
      const dateCheck = Date.parse(e.target.value);
      setFormErrors({
        ...formErrors,
        [e.target.name]: isNaN(dateCheck),
      });
    }

    if (
      [
        'min_stake',
        'add_to_footer',
        'staker_snapshot_whitelist',
        'early_bird',
        'early_bird_min_stake',
        'early_bird_round_length__s',
      ].includes(e.target.name)
    ) {
      if (['min_stake'].includes(e.target.name)) {
        updateFormData({
          ...formData,
          additionalDetails: {
            ...formData.additionalDetails,
            [e.target.name]: isNaN(parseInt(e.target.value))
              ? 0
              : parseInt(e.target.value),
          },
        });
      } else if (['early_bird'].includes(e.target.name)) {
        updateFormData({
          ...formData,
          additionalDetails: {
            ...formData.additionalDetails,
            [e.target.name]: e.target.checked
              ? { min_stake: 0, round_length__s: 3600 }
              : null,
          },
        });
      } else if (
        ['early_bird_min_stake', 'early_bird_round_length__s'].includes(
          e.target.name
        )
      ) {
        updateFormData({
          ...formData,
          additionalDetails: {
            ...formData.additionalDetails,
            early_bird: {
              ...formData.additionalDetails.early_bird,
              [e.target.name.replace('early_bird_', '')]: isNaN(
                parseInt(e.target.value)
              )
                ? 0
                : parseInt(e.target.value),
            },
          },
        });
      } else {
        updateFormData({
          ...formData,
          additionalDetails: {
            ...formData.additionalDetails,
            [e.target.name]: e.target.checked,
          },
        });
      }
    } else {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
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
            'jwt_token_login_422'
          )}`,
        },
      };
      const stakerRound = formData.additionalDetails.staker_snapshot_whitelist;
      const data = {
        ...formData,
        // random buffer to allow signups
        buffer_sigusd: stakerRound ? 0xc0ffee : formData.buffer_sigusd,
        individualCap: stakerRound ? 0xc0ffee : formData.individualCap,
      };
      try {
        await axios.put(
          `${process.env.API_URL}/whitelist/events/${formData.id}`,
          data,
          defaultOptions
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
        if (!value && Object.hasOwnProperty.call(formErrors, key)) {
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
          Edit Whitelist Event
        </Typography>
        <Grid container spacing={2} />
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: '700' }}>
          Select Event to Edit
        </Typography>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter whitelist id manually or select one from the table below.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="id"
            label="Whitelist Event Id"
            name="id"
            variant="filled"
            value={formData.id}
            onChange={handleChange}
          />
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary>
              <strong>Expand to see Whitelist Events</strong>
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
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Button
            onClick={fetchDetails}
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Fetch Details
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
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: '700' }}>
          Event Name and Url
        </Typography>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Project Name and Round Name. Eg. paideia: strategic
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="projectName"
            label="Project Name"
            name="projectName"
            variant="filled"
            value={formData.projectName}
            onChange={handleChange}
            error={formErrors.projectName}
            helperText={formErrors.projectName && 'Project Name is required'}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <TextField
            required
            InputProps={{ disableUnderline: true }}
            fullWidth
            id="roundName"
            label="Round Name"
            name="roundName"
            variant="filled"
            value={formData.roundName}
            onChange={handleChange}
            error={formErrors.roundName}
            helperText={formErrors.roundName && 'Round Name is required'}
          />
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            URL for the event will be{' '}
            <b>
              https://ergopad.io/whitelist/
              {formData.projectName}/{formData.roundName}
            </b>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Title for the form generated
          </Typography>
          <TextField
            required
            InputProps={{ disableUnderline: true }}
            fullWidth
            id="title"
            label="Title"
            name="title"
            variant="filled"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            helperText={formErrors.title && 'Title is required'}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <TextField
            required
            InputProps={{ disableUnderline: true }}
            fullWidth
            id="subtitle"
            label="Subtitle"
            name="subtitle"
            variant="filled"
            value={formData.subtitle}
            onChange={handleChange}
            error={formErrors.subtitle}
            helperText={formErrors.subtitle && 'Subtitle is required'}
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: '700' }}>
          Form Details and Text
        </Typography>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Details Section: Use markdown to add links
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            multiline
            id="details"
            label="Details"
            name="details"
            variant="filled"
            value={formData.details}
            onChange={handleChange}
            rows={6}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Checkbox Text (Terms and Conditions)
          </Typography>
          <ListTextInput
            label="CheckBox Text"
            data={formData.checkBoxes.checkBoxText}
            setData={(updatedData) => {
              updateFormData({
                ...formData,
                checkBoxes: {
                  ...formData.checkBoxes,
                  checkBoxText: [...updatedData],
                },
              });
            }}
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: '700' }}>
          Financials
        </Typography>
        <Grid container item>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={formData.additionalDetails.staker_snapshot_whitelist}
              required
              fullWidth
              id="total_sigusd"
              label="Whitelist SigUSD"
              name="total_sigusd"
              variant="filled"
              value={formData.total_sigusd}
              onChange={handleChange}
              error={formErrors.total_sigusd}
              helperText={
                formErrors.total_sigusd && 'SigUSD value must be a number'
              }
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={formData.additionalDetails.staker_snapshot_whitelist}
              required
              fullWidth
              id="buffer_sigusd"
              label="Buffer SigUSD"
              name="buffer_sigusd"
              variant="filled"
              value={formData.buffer_sigusd}
              onChange={handleChange}
              error={formErrors.buffer_sigusd}
              helperText={
                formErrors.buffer_sigusd && 'SigUSD value must be a number'
              }
            />
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={formData.additionalDetails.staker_snapshot_whitelist}
              required
              fullWidth
              id="individualCap"
              label="Individual Cap"
              name="individualCap"
              variant="filled"
              value={formData.individualCap}
              onChange={handleChange}
              error={formErrors.individualCap}
              helperText={
                formErrors.individualCap && 'SigUSD value must be a number'
              }
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={formData.additionalDetails.staker_snapshot_whitelist}
              fullWidth
              id="min_stake"
              label="Minimum Stake (0 for default)"
              name="min_stake"
              variant="filled"
              value={formData.additionalDetails.min_stake}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="staker_snapshot_whitelist"
                  checked={formData.additionalDetails.staker_snapshot_whitelist}
                  onChange={handleChange}
                />
              }
              label="Staker Snapshot Whitelist"
            />
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: '700' }}>
          Event Timing
        </Typography>
        <Grid container item>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="start_dtz"
              label="Start Date and Time (UTC)"
              name="start_dtz"
              variant="filled"
              value={formData.start_dtz}
              onChange={handleChange}
              error={formErrors.start_dtz}
              helperText={formErrors.start_dtz && 'Invalid Format'}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="end_dtz"
              label="End Date and Time (UTC)"
              name="end_dtz"
              variant="filled"
              value={formData.end_dtz}
              onChange={handleChange}
              error={formErrors.end_dtz}
              helperText={formErrors.end_dtz && 'Invalid Format'}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: '700' }}>
          Early Bird Round Configuration
        </Typography>
        <Grid container item>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={
                    formData.additionalDetails.staker_snapshot_whitelist
                  }
                  name="early_bird"
                  checked={formData.additionalDetails.early_bird != null}
                  onChange={handleChange}
                />
              }
              label="Add Early Bird Round Configuration"
            />
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={
                formData.additionalDetails.early_bird == null ||
                formData.additionalDetails.staker_snapshot_whitelist
              }
              required
              fullWidth
              id="early_bird_min_stake"
              label="Early Bird Min Stake"
              name="early_bird_min_stake"
              variant="filled"
              value={formData.additionalDetails.early_bird?.min_stake ?? 0}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <TextField
              sx={{ p: 0.5 }}
              InputProps={{ disableUnderline: true }}
              disabled={
                formData.additionalDetails.early_bird == null ||
                formData.additionalDetails.staker_snapshot_whitelist
              }
              required
              fullWidth
              id="early_bird_round_length__s"
              label="Early Bird Round Length(sec)"
              name="early_bird_round_length__s"
              variant="filled"
              value={
                formData.additionalDetails.early_bird?.round_length__s ?? 3600
              }
              onChange={handleChange}
            />
          </Grid>
          {formData.additionalDetails.early_bird != null && (
            <Grid item xs={12} sx={{ mt: 1, px: 1 }}>
              <Typography color="text.secondary" fontSize={12}>
                Early Bird Round Starts:{' '}
                {new Date(Date.parse(formData.start_dtz)).toUTCString()}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                Public Round Starts:{' '}
                {new Date(
                  Date.parse(formData.start_dtz) +
                    formData.additionalDetails.early_bird?.round_length__s *
                      1000
                ).toUTCString()}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                Round Ends:{' '}
                {new Date(Date.parse(formData.end_dtz)).toUTCString()}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: '700' }}>
          Form Configuration
        </Typography>
        <Grid container item>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="add_to_footer"
                  checked={formData.additionalDetails.add_to_footer}
                  onChange={handleChange}
                />
              }
              label="Add to Footer"
            />
          </Grid>
        </Grid>
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Update Whitelist Event
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

export default EditWhitelistEventForm;
