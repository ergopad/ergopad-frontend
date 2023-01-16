import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Collapse,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Modal,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import NumberIncrement from '../NumberIncrement';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// {
//   "roundName": "string",         -- ido_rounds.round_name
//   "tokenId": "string",           -- ido_assets.token_id
//   "roundAllocation": 0,          -- ido_assets.allocation
//   "vestingPeriods": 0,           -- vesting_periods 
//   "vestingPeriodDuration_ms": 0, -- vesting_duration (86400000 if 1, 2628000000 if 2)
//   "cliff_ms": 0,                 -- ido_rounds.cliff * 2628000000 (i.e. cliff in months)
//   "tokenSigUSDPrice": 0,         -- ido_rounds.sigusd
//   "whitelistTokenMultiplier": 0, -- ido_rounds.whitelist_token_multiplier
//   "sellerAddress": "string",     -- ido_assets.seller_wallet
//   "tgeTime_ms": 0,               -- ido_rounds.tge_time
//   "tgePct": 0,                   -- ido_rounds.tge_pct
//   "roundEnd_ms": 0               -- ido_rounds.ido_datetime in unixtime_ms
// }

const initialFormData = Object({
  idoName: '',
  tokenId: '',
  sellerAddress: '',
  tgeTime_ms: dayjs().valueOf(),
  tgePct: 0,
  roundEnd_ms: dayjs().valueOf(),
  rounds: [
    {
      id: uuidv4(),
      roundName: '',
      roundAllocation: 0,
      vestingPeriodDuration_ms: 86400000,
      vestingPeriods: 0,
      cliff_ms: 0,
      tokenSigUSDPrice: 0,
      whitelistTokenMultiplier: 1,
    }
  ]
});

const initialFormErrors = Object({
  idoName: false,
  tokenId: false,
  sellerAddress: false,
  tgeTime_ms: false,
  tokenDecimals: false,
  rounds: [
    {
      roundName: false,
      roundAllocation: false,
      vestingPeriodDuration_ms: false,
      vestingPeriods: false,
      // cliff_ms: false,
      tokenSigUSDPrice: false,
      whitelistTokenMultiplier: false,
    }
  ]
});

const Bootstrap = () => {
  // form data is all strings
  const [formData, updateFormData] = useState(initialFormData);
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false);
  // change error message for error snackbar
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again'
  );
  const [tgeDate, setTgeDate] = useState(dayjs.utc());

  const [jsonFormData, setJsonFormData] = useState([])

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

  // sets date/time in unix time when date picker is changed
  useEffect(() => {
    const event = {
      target: {
        name: 'tgeTime_ms',
        value: tgeDate.valueOf()
      }
    }
    handleChange(event)
  }, [tgeDate])

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
      roundEnd_ms: e.target.name == 'tgeTime_ms' ? e.target.value : formData.roundEnd_ms
    });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpenError(false);
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
    formData.rounds.map((item, i) => {
      Object.entries(item).forEach((entry) => {
        updateErrors = {};
        const [key, value] = entry;
        if (value == '' && Object.hasOwnProperty.call(formErrors.rounds[i], key)) {
          let newEntry = { [key]: true };
          updateErrors = { ...updateErrors, ...newEntry };
        }
      });
      setFormErrors(prevState => ({
        ...prevState,
        rounds: [
          ...prevState.rounds.slice(0, i),
          {
            ...prevState.rounds[i],
            ...updateErrors,
          },
          ...prevState.rounds.slice(i + 1),
        ]
      }));
    })
    if (Object.values(updateErrors).length === 0) {
      const errorCheck = Object.values(formErrors).every((v) => {
        if (typeof v == 'boolean' && v === false) {
          return true
        }
        if (typeof v != 'boolean') {
          return true
        }
      });
      const roundsErrorCheck = formErrors.rounds.map((item) => {
        return (
          Object.values(item).every((v) => v === false)
        )
      })
      if (errorCheck && roundsErrorCheck.every(v => v === true)) {
        setJsonFormData(formData.rounds.map((item) => {
          return (
            {
              roundName: formData.idoName + ' ' + item.roundName,
              tokenId: formData.tokenId,
              roundAllocation: Number(item.roundAllocation),
              vestingPeriods: item.vestingPeriods,
              vestingPeriodDuration_ms: item.vestingPeriodDuration_ms,
              cliff_ms: item.cliff_ms,
              tokenSigUSDPrice: Number(item.tokenSigUSDPrice),
              whitelistTokenMultiplier: item.whitelistTokenMultiplier,
              sellerAddress: formData.sellerAddress,
              tgeTime_ms: formData.tgeTime_ms,
              tgePct: 0,
              roundEnd_ms: formData.roundEnd_ms
            }
          )
        }))
        setOpen(true);
      } else {
        setErrorMessage('Please eliminate form errors and try again');
        setOpenError(true);
      }
    } else {
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
  }
  const handleClose = () => setOpen(false);

  const addButton = () => {
    updateFormData(
      prevState => ({
        ...prevState,
        rounds:
          [
            ...prevState.rounds,
            {
              id: uuidv4(),
              roundName: '',
              roundAllocation: 0,
              vestingPeriodDuration_ms: 86400000,
              vestingPeriods: 0,
              cliff_ms: 0,
              tokenSigUSDPrice: 0,
              whitelistTokenMultiplier: 1,
            }
          ]
      })
    )
    setFormErrors(
      prevState => ({
        ...prevState,
        rounds:
          [
            ...prevState.rounds,
            {
              roundName: false,
              roundAllocation: false,
              vestingPeriodDuration_ms: false,
              vestingPeriods: false,
              // cliff_ms: false,
              tokenSigUSDPrice: false,
              whitelistTokenMultiplier: false,
            }
          ]
      })
    )
  }

  return (
    <Container maxWidth="md">
      <Box
      // component="form"
      // onSubmit={handleSubmit}
      >
        <Typography variant="h2" sx={{ mt: 10, mb: 4, fontWeight: '700' }}>
          Bootstrap IDO
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="idoName"
              label="Ido Name"
              name="idoName"
              variant="filled"
              value={formData.idoName}
              onChange={handleChange}
              error={formErrors.idoName}
              helperText={formErrors.idoName && 'Enter the IDO name'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={
                  (props) =>
                    <TextField
                      required
                      fullWidth
                      id="tgeTime_ms"
                      name="tgeTime_ms"
                      variant="filled"
                      error={formErrors.tgeTime_ms}
                      helperText={formErrors.tgeTime_ms && 'Enter the TGE Day/Time in unix ms'}
                      {...props}
                      InputProps={{ ...props.InputProps, disableUnderline: true }}
                    />
                }
                ampm={false}
                label="TGE Day/Time (UTC)"
                value={tgeDate}
                onChange={(newValue) => {
                  setTgeDate(newValue);
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="tokenId"
              label="Token ID"
              name="tokenId"
              variant="filled"
              value={formData.tokenId}
              onChange={handleChange}
              error={formErrors.tokenId}
              helperText={formErrors.tokenId && 'Enter the Token ID for the project'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              fullWidth
              id="sellerAddress"
              label="Seller Address"
              name="sellerAddress"
              variant="filled"
              value={formData.sellerAddress}
              onChange={handleChange}
              error={formErrors.sellerAddress}
              helperText={formErrors.idoName && 'Enter the seller address'}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mt: '24px', mb: '0px', }}>
              IDO Rounds
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TransitionGroup>
              {formData.rounds.map((item, i) => (
                <Collapse key={item.id}>
                  <RoundForm
                    data={formData}
                    setData={updateFormData}
                    index={i}
                    id={item.id}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Button
                onClick={() => addButton()}
                sx={{ mr: '12px' }}
                variant="contained"
                color="primary"
              >
                Add another
              </Button>
              <Button
                // type="submit"
                // disabled={buttonDisabled}
                variant="contained"
                color="secondary"
                // sx={{ mt: 3, mb: 1 }}
                onClick={handleOpen}
              >
                Submit
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // maxHeight: '90vh',
        }}>
          <SummaryModal formData={formData} jsonFormData={jsonFormData} />
        </Box>
      </Modal>
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
    </Container>
  );
};

const RoundForm = ({ index, id, data, setData, formErrors, setFormErrors }) => {
  // const [formErrors, setFormErrors] = useState(initialRoundErrors);
  const [vestingMultiple, setVestingMultiple] = useState(2629800000);
  const [vestingDuration, setVestingDuration] = useState('')
  const [cliffMultiple, setCliffMultiple] = useState(2629800000);
  const [cliffDuration, setCliffDuration] = useState('')
  const [whitelistTokenMultiplier, setWhitelistTokenMultiplier] = useState(1)

  useEffect(() => {
    const event = {
      target: {
        name: 'whitelistTokenMultiplier',
        value: whitelistTokenMultiplier
      }
    }
    handleChange(event)
  }, [whitelistTokenMultiplier])

  const handleChange = (e) => {
    if (
      e.target.value == '' &&
      Object.hasOwnProperty.call(formErrors.rounds[index], e.target.name)
    ) {
      setFormErrors(prevState => ({
        ...prevState,
        rounds: [
          ...prevState.rounds.slice(0, index),
          {
            ...prevState.rounds[index],
            [e.target.name]: true,
          },
          ...prevState.rounds.slice(index + 1),
        ]
      }));
    } else if (Object.hasOwnProperty.call(formErrors.rounds[index], e.target.name)) {
      setFormErrors(prevState => ({
        ...prevState,
        rounds: [
          ...prevState.rounds.slice(0, index),
          {
            ...prevState.rounds[index],
            [e.target.name]: false,
          },
          ...prevState.rounds.slice(index + 1),
        ]
      }));
    }

    // console.log(formErrors)

    let newValue = undefined
    if (e.target.name === 'vestingPeriodDuration_ms') {
      let newVestingPeriods = Number((vestingDuration * vestingMultiple / e.target.value).toFixed(0))
      setData(
        prevState => ({
          ...prevState,
          rounds: [
            ...prevState.rounds.slice(0, index),
            {
              ...prevState.rounds[index],
              vestingPeriods: newVestingPeriods,
            },
            ...prevState.rounds.slice(index + 1),
          ]
        })
      );
    }
    if (e.target.name === 'vestingPeriods') {
      setVestingDuration(e.target.value)
      newValue = Number((e.target.value * vestingMultiple / data.rounds[index].vestingPeriodDuration_ms).toFixed(0))
    }
    if (e.target.name === 'vestingDurationMultiple') {
      setVestingMultiple(e.target.value)
      newValue = vestingDuration * e.target.value
      e.target.name = 'vestingPeriods'
    }
    if (e.target.name === 'cliff_ms') {
      setCliffDuration(e.target.value)
      newValue = e.target.value * cliffMultiple
    }
    if (e.target.name === 'cliffDurationMultiple') {
      setCliffMultiple(e.target.value)
      e.target.name = 'cliff_ms'
      if (cliffDuration != '') {
        newValue = cliffDuration * e.target.value
      }
      else {
        newValue = 0
      }
    }

    setData(
      prevState => ({
        ...prevState,
        rounds: [
          ...prevState.rounds.slice(0, index),
          {
            ...prevState.rounds[index],
            [e.target.name]: newValue || newValue === 0 ? newValue : e.target.value,
          },
          ...prevState.rounds.slice(index + 1),
        ]
      })
    );
  }; // end handleChange function

  const removeItem = (i) => {
    setData(
      prevState => ({
        ...prevState,
        rounds: prevState.rounds.filter((_item, idx) => idx !== i)
      })
    )
    setFormErrors(
      prevState => ({
        ...prevState,
        rounds: prevState.rounds.filter((_item, idx) => idx !== i)
      })
    )
  }

  return (
    <Paper sx={{ p: '24px', mb: '24px' }}>
      <Grid container spacing={2} sx={{ mb: '24px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="roundName"
            label="Round Name"
            name="roundName"
            variant="outlined"
            value={data.rounds[index].roundName}
            onChange={handleChange}
            error={formErrors.rounds[index].roundName}
            helperText={formErrors.rounds[index].roundName && 'Enter the Round name'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="roundAllocation"
            label="Round Allocation Amount"
            name="roundAllocation"
            variant="outlined"
            value={data.rounds[index].roundAllocation}
            onChange={handleChange}
            error={formErrors.rounds[index].roundAllocation}
            helperText={formErrors.rounds[index].roundAllocation && 'Enter the number of tokens for this round'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="vesting-periods-label">Vesting Release Frequency</InputLabel>
            <Select
              id="vestingPeriodDuration_ms"
              name="vestingPeriodDuration_ms"
              label="Vesting Release Frequency"
              value={data.rounds[index].vestingPeriodDuration_ms}
              onChange={handleChange}
            >
              <MenuItem value={86400000}>Daily</MenuItem>
              <MenuItem value={604800000}>Weekly</MenuItem>
              <MenuItem value={2629800000}>Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="tokenSigUSDPrice"
            label="SigUSD price"
            name="tokenSigUSDPrice"
            variant="outlined"
            value={data.rounds[index].tokenSigUSDPrice}
            onChange={handleChange}
            error={formErrors.rounds[index].tokenSigUSDPrice}
            helperText={formErrors.rounds[index].tokenSigUSDPrice && 'Enter the SigUSD price'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NumberIncrement
            label="Whitelist Multiplier"
            name="whitelistTokenMultiplier"
            value={whitelistTokenMultiplier}
            setValue={setWhitelistTokenMultiplier}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="vestingPeriods"
                label="Vesting Length"
                name="vestingPeriods"
                variant="outlined"
                value={vestingDuration}
                onChange={handleChange}
                error={formErrors.rounds[index].vestingPeriods}
                helperText={formErrors.rounds[index].vestingPeriods && 'Enter the vesting length'}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '3px 0 0 3px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  id="vestingDurationMultiple"
                  name="vestingDurationMultiple"
                  value={vestingMultiple}
                  onChange={event => { setVestingMultiple(event.target.value); handleChange(event) }}
                  sx={{ borderRadius: '0 3px 3px 0', }}
                >
                  <MenuItem value={86400000}>Days</MenuItem>
                  <MenuItem value={604800000}>Weeks</MenuItem>
                  <MenuItem value={2629800000}>Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="cliff_ms"
                label="Cliff"
                name="cliff_ms"
                variant="outlined"
                value={cliffDuration}
                onChange={handleChange}
                // error={formErrors.rounds[index].cliff_ms}
                // helperText={formErrors.rounds[index].cliff_ms && 'Enter the cliff'}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '3px 0 0 3px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  id="cliffDurationMultiple"
                  name="cliffDurationMultiple"
                  value={cliffMultiple}
                  onChange={event => { setCliffMultiple(event.target.value); handleChange(event) }}
                  sx={{ borderRadius: '0 3px 3px 0', }}
                >
                  <MenuItem value={86400000}>Days</MenuItem>
                  <MenuItem value={604800000}>Weeks</MenuItem>
                  <MenuItem value={2629800000}>Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button color="quaternary" onClick={() => removeItem(index)}>
          Remove Round
        </Button>
      </Box>
    </Paper>
  )
}

const SummaryModal = ({ formData, jsonFormData }) => {
  const bootstrapSummary = [
    {
      name: 'Vesting Start: ',
      value: dayjs.utc(formData.tgeTime_ms).format('YYYY/MM/DD HH:mm UTC')
    },
    {
      name: 'Token ID: ',
      value: formData.tokenId
    },
    {
      name: 'Seller Address: ',
      value: formData.sellerAddress
    },
  ]

  const dataSummary = formData.rounds.map((item) => {
    const durationPeriod = (period) => {
      if (period == 86400000) {
        return 'Daily'
      }
      if (period == 604800000) {
        return 'Weekly'
      }
      if (period == 2629800000) {
        return 'Monthly'
      }
    }
    const duration = (duration) => {
      if (duration % 2629800000 == 0) {
        return Number(duration) / 2629800000 + ' Months'
      }
      if (duration % 604800000 == 0) {
        return Number(duration) / 604800000 + ' Weeks'
      }
      else {
        return Number(duration) / 86400000 + ' Days'
      }
    }
    const dayWeekMonth = (duration) => {
      if (duration % 2629800000 == 0) {
        return ' Months'
      }
      if (duration % 604800000 == 0) {
        return ' Weeks'
      }
      else {
        return ' Days'
      }
    }
    return (
      [
        {
          name: "Round Name: ",
          value: formData.idoName + ' ' + item.roundName
        },
        {
          name: 'Round Allocation (number of tokens): ',
          value: Number(item.roundAllocation).toLocaleString()
        },
        {
          name: 'Price: ',
          value: item.tokenSigUSDPrice + ' SigUSD'
        },
        {
          name: 'Cliff: ',
          value: item.cliff_ms === 0 ? 'None' : duration(item.cliff_ms)
        },
        {
          name: 'Vesting Release Schedule: ',
          value: durationPeriod(item.vestingPeriodDuration_ms) + ' for ' + item.vestingPeriods + ' ' + dayWeekMonth(item.vestingPeriodDuration_ms)
        },
        {
          name: 'Whitelist Multiplier: ',
          value: item.whitelistTokenMultiplier
        }
      ]
    )
  })

  return (
    <Paper component="div" sx={{
      overflowY: 'auto',
      p: 4,
      maxHeight: '90vh',
      minWidth: '60vw'
    }}>
      <Typography id="modal-modal-title" variant="h4">
        Summary
      </Typography>
      <List dense>
        {bootstrapSummary.map((item, i) => {
          return (
            <ListItem key={i}>
              <ListItemText>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Typography>
                  {item.value}
                </Typography>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
      {formData.rounds.map((_item, i) => {
        return (
          <SummaryItem i={i} key={i} dataSummary={dataSummary} jsonFormData={jsonFormData} />
        )
      })}
    </Paper >
  )
}

const SummaryItem = ({ i, dataSummary, jsonFormData }) => {
  // loading spinner for submit button and disable button
  const [isLoading, setLoading] = useState(false);
  const [responseObject, setResponseObject] = useState({})

  const [submitResponse, setSubmitResponse] = useState({
    message: 'Not yet submitted',
    status: undefined,
    severity: 'warning'
  })

  const handleSubmit = async (index) => {
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          'jwt_token_login_422'
        )}`,
      },
    };
    setLoading(true);
    await axios.post(
      `${process.env.API_URL}/vesting/bootstrapRound`,
      jsonFormData[index],
      defaultOptions,
    ).then((res) => {
      console.log(res.data)
      setSubmitResponse({
        message: 'Success. Please see JSON output for token values. ',
        status: res.status,
        severity: 'success'
      })
      setResponseObject(res.data)
      setLoading(false);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setSubmitResponse({
          message: error.response.data?.details ? error.response.data?.details : error.response.data,
          status: error.response.status,
          severity: 'error'
        })
        setLoading(false);
      } else if (error.request) {
        setSubmitResponse({
          message: 'Service Unavailable',
          status: 503,
          severity: 'error'
        })
        console.log(error.request);
        setLoading(false);
      } else {
        console.log('Error', error.message);
        setSubmitResponse({
          message: error.message,
          status: undefined,
          severity: 'error'
        })
        setLoading(false);
      }
    })
  }
  return (
    <Paper sx={{ p: '12px', mb: '12px', background: 'rgba(255,255,255,0.03)' }}>
      <List dense>
        {dataSummary[i].map((item, i) => {
          return (
            <ListItem key={i}>
              <ListItemText>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Typography>
                  {item.value}
                </Typography>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Button
          // type="submit"
          disabled={isLoading}
          onClick={() => handleSubmit(i)}
          variant="contained"
          sx={{ mt: '-100px', mb: 1 }}
        >
          Submit
          {
            isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )
          }
        </Button>
      </Box>
      {submitResponse && (
        <Alert severity={submitResponse.severity}>
          {submitResponse.status && submitResponse.status + ': '}
          {' ' + submitResponse.message}
        </Alert>
      )}


      {Object.entries(responseObject).length > 0 && (
        <Accordion sx={{ mb: 0 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Response Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ maxWidth: '80vw' }}>
              <code>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                  {JSON.stringify(responseObject, null, 2)}
                </pre>
              </code>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion sx={{ mb: 0 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Show JSON</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ maxWidth: '80vw' }}>
            <code>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {JSON.stringify(jsonFormData[i], null, 2)}
              </pre>
            </code>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper >
  )
}

export default Bootstrap;