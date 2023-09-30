import { useState, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/router';
import {
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Container,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FilledInput,
  FormHelperText,
  CircularProgress,
  Alert,
  useTheme,
  MenuItem,
  Select,
  SelectChangeEvent,
  Link
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TelegramIcon from '@mui/icons-material/Telegram';
import DiscordIcon from '@components/svgs/DiscordIcon';
import MarkdownRender from '@components/MarkdownRender';
import axios from 'axios';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useWallet } from '@utils/WalletContext';
import { trpc } from '@utils/trpc';
import { Wallet } from 'next-auth';
import ChangeDefaultAddress from '@components/user/ChangeDefaultAddress';

type FormData = {
  name: string;
  email: string;
  ergoAddress: string;
  usdValue: string;
}

type FormErrors = {
  name: boolean;
  email: boolean;
  ergoAddress: boolean;
  usdValue: boolean;
}

const initialFormData = {
  name: '',
  email: '',
  ergoAddress: '',
  usdValue: '',
}

const initialFormErrors = {
  name: false,
  email: false,
  ergoAddress: false,
  usdValue: false,
}

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

interface AdditionalDetails {
  min_stake: number;
  add_to_footer: boolean;
  staker_snapshot_whitelist: boolean;
  early_bird: null | any;
}

interface CheckBoxes {
  checkBoxText: string[];
}

interface Event {
  additionalDetails: AdditionalDetails;
  buffer_sigusd: number;
  checkBoxes: CheckBoxes;
  details: string;
  end_dtz: string;
  eventId: number;
  eventName: string;
  id: number;
  individualCap: number;
  projectName: string;
  roundName: string;
  start_dtz: string;
  subtitle: string;
  title: string;
  total_sigusd: number;
}

type WhitelistState = 'NOT_STARTED' | 'LIVE' | 'ROUND_END'

const emailRegex = /\S+@\S+\.\S+/;

const checkboxes = [
  {
    check: false,
    text: <>
      I have read and agree to the Ergopad <Link target="_blank" href="/terms">Terms of Service</Link> and <Link target="_blank" href="/privacy">Privacy Policy</Link>
    </>
  },
  {
    check: false,
    text: <>I verify that the funds I will send are aquired legally</>
  }
]

const Whitelist = () => {
  const eventName = 'palmyra-public-202309wl'
  // Mon Oct 02 2023 16:00:00 GMT+0000
  const startDate = new Date(1696262400000)
  // Mon Sep 25 2023 16:00:00 GMT+0000
  // const startDate = new Date(1695657600000)
  // Wed Oct 25 2023 16:00:00 GMT+0000
  const endDate = new Date(1698249600000)
  // routing
  // const router = useRouter();
  // const { projectName, roundName } = router.query;
  // whitelist data
  const [whitelistState, setWhitelistState] = useState<WhitelistState>('NOT_STARTED');
  const [sumsubStatus, setSumsubStatus] = useState<string | undefined>(undefined)
  const [sumsubId, setSumsubId] = useState<string | undefined | null>(undefined)
  const [checkboxState, setCheckboxState] = useState<any>(checkboxes);
  // form data
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);
  const [formData, updateFormData] = useState<FormData>(initialFormData);
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false);
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Saved');
  // change error message for error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again'
  );
  // total staked
  const [totalStaked, setTotalStaked] = useState(0);
  const { wallet, sessionStatus, sessionData, fetchSessionData, setProviderLoading } = useWallet()
  const walletsQuery = trpc.user.getWallets.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  )
  const changeUserDetailsMutation = trpc.user.changeUserDetails.useMutation()

  const getWallets = async (): Promise<Wallet[]> => {
    setLoading(true);
    return new Promise(async (resolve) => {
      const fetchResult = await walletsQuery.refetch();
      if (fetchResult && fetchResult.data) {
        resolve(fetchResult.data.wallets);
      } else {
        resolve([]);
      }
      setLoading(false)
    });
  };

  useEffect(() => {
    const getErgoPadStaked = async () => {
      try {
        const wallets = await getWallets();

        let uniqueAddresses = [wallet];

        if (wallets.length > 0) {
          let addressSet: Set<string> = new Set();
          for (let wallet of wallets) {
            for (let address of wallet.unusedAddresses) {
              addressSet.add(address);
            }
            for (let address of wallet.usedAddresses) {
              addressSet.add(address);
            }
            addressSet.add(wallet.changeAddress);
          }

          uniqueAddresses = [...addressSet];
        }

        const res = await axios.post(
          `${process.env.API_URL}/staking/staked/`,
          {
            addresses: uniqueAddresses
          },
          defaultOptions
        );
        setTotalStaked(Math.round(res.data.totalStaked * 100) / 100);
      } catch (error) {
        // Handle any errors that occurred during fetching
        console.error("Error fetching wallets:", error);
      }
    };
    if (wallet) {
      updateFormData({
        ...initialFormData,
        ergoAddress: wallet,
      });
      // get ergopad staked from address
      getErgoPadStaked();
      setFormErrors({
        ...initialFormErrors,
        ergoAddress: false,
      });
    } else {
      setTotalStaked(0);
      setFormErrors({
        ...initialFormErrors,
        ergoAddress: true,
      });
    }
  }, [wallet]);

  const checkboxError =
    checkboxState.filter((checkBoxes: any) => !checkBoxes.check).length !== 0;

  useEffect(() => {
    const dateNow = new Date()
    if (dateNow < startDate) setWhitelistState('NOT_STARTED')
    else if (dateNow > endDate) setWhitelistState('ROUND_END')
    else setWhitelistState('LIVE')
  }, [])

  const handleChange = (e: any) => {
    if (e.target.value == '' && e.target.name !== 'email') {
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

    if (e.target.name === 'email') {
      if (emailRegex.test(e.target.value) || e.target.value === '') {
        setFormErrors({
          ...formErrors,
          email: false,
        });
      } else {
        setFormErrors({
          ...formErrors,
          email: true,
        });
      }
    }

    if (e.target.name === 'usdValue') {
      if (e.target.value === '[max]') {
        setFormErrors({
          ...formErrors,
          usdValue: false,
        });
      }
      else {
        const sigNumber = Number(e.target.value);
        if (sigNumber >= 100 && sigNumber <= 25000) {
          setFormErrors({
            ...formErrors,
            usdValue: false,
          });
        } else {
          setFormErrors({
            ...formErrors,
            usdValue: true,
          });
        }
      }
    }

    if (e.target.name === 'ergoAddress') {
      updateFormData({
        ...formData,
        [e.target.name]: [e.target.value.trim()],
      });
    }
    else {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value.trim(),
      });
    }
  };

  const handleChecked = (e: any) => {
    setCheckboxState(
      checkboxState.map((checkbox: any, index: number) => {
        if (index == e.target.name) {
          return {
            ...checkbox,
            check: e.target.checked,
          };
        }
        return checkbox;
      })
    );
  };

  // snackbar for error reporting
  const handleCloseError = (reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  // snackbar for success message
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const changeUserDetails = async (name: string, email: string, whitelist: string) => {
    try {
      const changeDetails = await changeUserDetailsMutation.mutateAsync({
        name,
        email,
        whitelist
      })
      if (changeDetails) {
        // console.log('user updated')
      }
    } catch (error) {
      console.error("Error setting Login wallet", error);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const emptyCheck = formData.usdValue !== undefined
      && formData.usdValue !== ''
      && formData.name !== ''
      && formData.email !== ''
    const errorCheck = Object.values(formErrors).every((v) => v === false);

    const form = {
      name: formData.name,
      email: formData.email,
      usdValue: formData.usdValue === '[max]' ? 1 : formData.usdValue,
      ergoAddress: sessionData?.user.id,
      event: eventName,
      kycApproval: sumsubStatus === 'GREEN' ? true : false,
      tpe: 'ergo'
    };

    if (errorCheck && emptyCheck && sumsubStatus === 'GREEN') {
      // console.log(form)
      try {

        const res = await axios.post(
          `${process.env.API_URL}/whitelist/signup`,
          { ...form }
        );
        if (res.data.status === 'success') {
          setSuccessMessage('Successfully signed up for whitelist');
          setOpenSuccess(true);
          changeUserDetails(formData.name, formData.email, eventName)
        }
      } catch (err: any) {
        // snackbar for error message
        setErrorMessage(
          'Error: ' + err.response.status + ' - ' + err.response.data
        );
        setOpenError(true);
      }
    } else {
      type ErrorObject = {
        [key: string]: boolean;
      };
      let updateErrors: ErrorObject = {};
      Object.entries(formData).forEach((entry: [string, any]) => {
        const [key, value] = entry;

        switch (key) {
          case 'email':
            if (!emailRegex.test(value) || value === '') {
              updateErrors[key] = true;
            }
            break;

          case 'usdValue':
            if (value === 0 || value === undefined || value === '') {
              updateErrors[key] = true;
            }
            break;

          default:
            if (value === '') {
              updateErrors[key] = true;
            }
            break;
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

  const theme = useTheme()


  // SUMSUB STUFF
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState('')

  const checkVerificationResult = trpc.user.getSumsubResult.useQuery(undefined, { enabled: false, retry: false })

  useEffect(() => {
    if (sessionStatus === 'authenticated' && sessionData?.user.id) {
      const id = sessionData.user.id
      setUserId(id)
      // console.log(id)
      // Fetch the access token from your API when the component mounts
      fetch(`/api/sumsub/getAccessToken?userId=${id}`)
        .then(response => response.json())
        .then(data => setAccessToken(data.token))
        .catch(error => console.error('Error fetching access token:', error));
    }
  }, [sessionStatus]);

  const expirationHandler = async () => {
    // Fetch a new access token from your API when the current token has expired
    const response = await fetch(`/api/sumsub/getAccessToken?userId=${userId}`);
    const data = await response.json();
    setAccessToken(data.token);
    return data.token;
  }

  const config = {
    // Configuration settings for the SDK
  };

  const options = {
    // Options for the SDK
  };

  const messageHandler = (message: any) => {
    if (message.includes('applicantReviewComplete')) {
      checkVerificationResult.refetch()
        .then((response) => {
          setSumsubStatus(response.data?.sumsubResult?.reviewAnswer)
          setSumsubId(response.data?.sumsubId)
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
    // console.log("Received message from SDK:", message);
  }

  const errorHandler = (error: any) => {
    // Handle errors from the SDK
    console.error("Received error from SDK:", error);
  }

  // WALLET UPDATE STUFF
  const [defaultAddressLoading, setDefaultAddressLoading] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState('');
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const changeLoginAddressMutation = trpc.user.changeLoginAddress.useMutation()
  const updateLoginAddress = async (address: string) => {
    try {
      setDefaultAddressLoading(true)
      setProviderLoading(true)
      const changeLogin = await changeLoginAddressMutation.mutateAsync({
        changeAddress: address
      })
      if (changeLogin) {
        await fetchSessionData()
        setDefaultAddressLoading(false)
        setProviderLoading(false)
      }
    } catch (error) {
      console.error("Error setting Login wallet", error);
      setDefaultAddressLoading(false)
      setProviderLoading(false)
    }
  }
  useEffect(() => {
    // console.log('fetch ' + sessionStatus)
    if (sessionStatus === 'authenticated') {
      getWallets()
      updateWallets()
    }
  }, [sessionData, sessionStatus, fetchSessionData]);
  const updateWallets = async () => {
    if (walletsQuery.data) {
      let changeAddresses = walletsQuery.data.wallets.map(wallet => wallet.changeAddress);

      // If address exists, remove it from its current position and prepend it
      if (sessionData?.user.address) {
        const address = sessionData?.user.address
        changeAddresses = changeAddresses.filter(addr => addr !== address);
        changeAddresses.unshift(address);
        setDefaultAddress(address);
      }

      setAddressOptions(changeAddresses);
    }
  }
  const handleChangeAddress = (event: SelectChangeEvent) => {
    setDefaultAddress(event.target.value);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 12 }}>
        <>
          <Typography variant="h2" component="h1" sx={{ fontWeight: '600', mb: 1 }}>
            Palmyra Platform IDO Whitelist
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '20px', mb: 4 }}>
            Sign up to participate in the Palmyra Platform IDO
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography sx={{ fontSize: '18px', mb: 0 }}>
              {sessionStatus === 'authenticated'
                ? (
                  `You have ${totalStaked.toLocaleString()} Ergopad tokens staked from this account.`
                )
                : (
                  `Please login to verify number of Ergopad tokens staked.`
                )}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '16px', mb: 4 }}>
              It is not necessary to stake Ergopad to participate in this IDO, however the higher tier you have, the greater chance of reserving a spot. Access is not guaranteed if higher tiers sell out the IDO.
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 0 }}>
                KYC Approval
              </Typography>
              <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Please fill out the KYC form before proceeding
              </Typography>
              {accessToken ? (
                <Box sx={{
                  p: 4, pb: 0, background: '#ffffff', borderRadius: '16px',
                  minHeight: { xs: '457px', md: '570px' },
                }}>
                  <SumsubWebSdk
                    accessToken={accessToken}
                    expirationHandler={expirationHandler}
                    config={config}
                    options={options}
                    onMessage={messageHandler}
                    onError={errorHandler}
                  />
                </Box>
              ) : (
                <Box sx={{
                  p: 4,
                  background: '#ffffff',
                  borderRadius: '16px',
                  height: { xs: '457px', md: '570px' },
                  position: 'relative'
                }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.background.default,
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%,-50%)'
                    }}
                  >
                    No KYC access token, please sign in first.
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 0 }}>
                Contact Info
              </Typography>
              <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Please provide contact info so we can send out IDO updates
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    InputProps={{ disableUnderline: true }}
                    fullWidth
                    name="name"
                    label="Your Full Name"
                    error={formErrors.name}
                    id="name"
                    variant="filled"
                    helperText={
                      formErrors.name &&
                      'Please enter your full name'
                    }
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    InputProps={{ disableUnderline: true }}
                    fullWidth
                    name="email"
                    label="Your Email"
                    error={formErrors.email}
                    id="email"
                    variant="filled"
                    helperText={
                      formErrors.email &&
                      'Please enter a valid email address'
                    }
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 0 }}>
                IDO Details
              </Typography>
              <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Provide some contribution details to help us plan the distribution
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>

                <Grid item xs={12} md={6}>
                  <ChangeDefaultAddress title="Address to receive whitelist tokens" />
                  <Typography sx={{ color: theme.palette.text.secondary, textAlign: 'right' }}>
                    You may change this any time in the user menu
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <TextField
                      value={formData.usdValue}
                      sx={{ m: 0 }}
                      InputProps={{ disableUnderline: true }}
                      required
                      fullWidth
                      id="usdValue"
                      label="Amount requested (USD value)"
                      name="usdValue"
                      variant="filled"
                      helperText={
                        formErrors.usdValue && `Please enter between 100 and 25,000 USD`
                      }
                      onChange={handleChange}
                      error={formErrors.usdValue}
                    />
                    <Button
                      variant="contained"
                      sx={{ height: '56px' }}
                      onClick={() => {
                        handleChange({
                          target: {
                            name: 'usdValue',
                            value: '[max]',
                          }
                        });
                      }}
                    >
                      Max
                    </Button>
                  </Box>
                  <Typography sx={{ color: theme.palette.text.secondary, textAlign: 'right' }}>
                    The amount requested is not guaranteed
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <FormControl required error={checkboxError}>
              <FormGroup sx={{ mb: 2 }}>
                {checkboxState.map((checkbox: any, index: number) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checkbox.check}
                        onChange={handleChecked}
                        name={index.toString()}
                      />
                    }
                    label={checkbox.text}
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 1,
                    }}
                  />
                ))}
                <FormHelperText>
                  {checkboxError &&
                    'Please accept the terms before submitting'}
                </FormHelperText>
              </FormGroup>
            </FormControl>
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                disabled={isLoading || checkboxError || whitelistState !== 'LIVE' || sumsubStatus !== 'GREEN' || !sessionData?.user.id}
                variant="contained"
                sx={{ mb: 2 }}
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
                    marginTop: '-20px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
            {sumsubStatus !== 'GREEN' && (
              <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }} >
                Please complete the KYC form above.
              </Typography>
            )}
            {whitelistState === 'ROUND_END' && (
              <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }} >
                We apologize for the inconvenience, the signup form has closed.
              </Typography>
            )}
            {whitelistState === 'NOT_STARTED' && (
              <Typography sx={{ color: theme.palette.text.secondary }}>
                {
                  `This form is not yet active. The round will start at 
                    ${startDate
                    .toLocaleString(typeof navigator !== 'undefined'
                      ? navigator.language
                      : 'en-us',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short',
                      })
                  }`
                }
              </Typography>
            )}
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
                {successMessage}
              </Alert>
            </Snackbar>
          </Box>
        </>
      </Container>
    </>
  );
};

export default Whitelist;
