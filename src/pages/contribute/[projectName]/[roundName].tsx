import { useState, useEffect, forwardRef, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
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
  Alert,
  CircularProgress,
  Modal,
  useMediaQuery,
  Link,
  useTheme,
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { useWallet } from '@contexts/WalletContext'
import { useAddWallet } from '@contexts/AddWalletContext'
import PageTitle from '@components/PageTitle'
import CenterTitle from '@components/CenterTitle'
import TransactionSubmitted from '@components/TransactionSubmitted'
import ErgopayModalBody from '@components/ErgopayModalBody'
import MarkdownRender from '@components/MarkdownRender'
import theme from '@styles/theme'
import axios from 'axios'
import MuiNextLink from '@components/MuiNextLink'
import ChangeDefaultAddress from '@components/user/ChangeDefaultAddress'
import { trpc } from '@utils/trpc'
import { NextPage } from 'next'

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
}

// todo: update constants
// const EVENT_NAME = 'strategic-paideia-202202';
// const ROUND_PROXY_NFT =
//   '610efa09f2c581e2e309b31175930876fe3cc814650f7b82febfeb7874198377';
// const WHITELIST_TOKEN_ID =
//   '23b1ff0bfae87de54c4d8513c660109b3a0061db429917a3d59c7af1ef5b6c6e';
// const SIGUSD_TOKEN_ID =
//   '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';
// const PAIDEIA_TOKEN_ID = 'paideia_token_id';
// const TOKEN_PRICE = 0.008;
// const TOKEN_DECIMALS = 10000;
// const NERG_FEES = 20 * 1000 * 1000;

const initialFormData = {
  vestingAmount: 0,
  address: '',
  currency: 'erg',
}

const initialFormErrors = {
  vestingAmount: false,
  address: false,
}

const initialWalletBalance = {
  whitelist: 0,
  sigusd: 0,
  ergs: 0,
}

const formOpenState = {
  EARLY: 'EARLY',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
}

const transactionModalState = {
  SUBMITTED: 'SUBMITTED',
  USER_PENDING: 'USER_PENDING',
  CLOSED: 'CLOSED',
}

const initialRoundDetails = {
  remaining: 0,
}

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const checkboxes = [
  {
    check: false,
    text: (
      <>
        I have read and agree to the Ergopad{' '}
        <Link target="_blank" href="/terms">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link target="_blank" href="/privacy">
          Privacy Policy
        </Link>
      </>
    ),
  },
  {
    check: false,
    text: <>I verify that the funds I am sending are aquired legally</>,
  },
]

const Contribute: NextPage = () => {
  const theme = useTheme()
  const checkSmall = useMediaQuery(theme.breakpoints.up('md'))
  // routing
  const router = useRouter()
  const { projectName, roundName } = router.query
  // wallet
  const { wallet, dAppWallet, providerLoading, sessionStatus } = useWallet()
  const { setAddWalletOpen } = useAddWallet()
  // contribute data
  const [contributeData, setContributeData] = useState<any | null>(null)
  const [contributeLoading, setContributeLoading] = useState(true)
  const [checkboxState, setCheckboxState] = useState(checkboxes)
  // submit button
  const [buttonDisabled, setbuttonDisabled] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [formState, setFormState] = useState(formOpenState.EARLY)
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [formData, updateFormData] = useState(initialFormData)
  const [walletBalance, setWalletBalance] = useState(initialWalletBalance)
  const [roundDetails, setRoundDetails] = useState(initialRoundDetails)
  // open error snackbar
  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and Try Again'
  )
  // success snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
  const [successMessageSnackbar, setSuccessMessageSnackbar] =
    useState('Form Submitted')
  // success modal
  const [openModal, setOpenModal] = useState(transactionModalState.CLOSED)
  const [transactionId, setTransactionId] = useState('')
  const [ergopayUrl, setErgopayUrl] = useState('')
  // erg conversion rate loading from backend
  const [conversionRate, setConversionRate] = useState(1.0)
  const [currentWallet, setCurrentWallet] = useState<{
    id: number
    type: string | null
    changeAddress: string
    unusedAddresses: string[]
    usedAddresses: string[]
    userId: string
  }
    | undefined>(undefined)

  const shouldFetch = sessionStatus === 'authenticated'
  const walletsQuery = trpc.user.getWallets.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: shouldFetch,
  })

  useEffect(() => {
    const getMatchingWallet = async () => {
      setLoading(true)

      try {
        const fetchResult = await walletsQuery.refetch()
        const wallets = fetchResult?.data?.wallets || []

        let matchedWallet = null

        for (let thisWallet of wallets) {
          const { unusedAddresses, usedAddresses, changeAddress } = thisWallet

          if (
            [...unusedAddresses, ...usedAddresses, changeAddress].includes(
              wallet!
            )
          ) {
            matchedWallet = thisWallet
            break
          }
        }

        if (matchedWallet) {
          setCurrentWallet(matchedWallet)
          // console.log(matchedWallet)
        }
      } catch (e) {
        console.log('ERROR FETCHING: ', e)
      }

      setLoading(false)
    }

    if (
      wallet !== undefined &&
      wallet !== '' &&
      sessionStatus === 'authenticated'
    ) {
      getMatchingWallet()
    }
  }, [wallet])

  useEffect(() => {
    const getContributeData = async () => {
      setContributeLoading(true)
      try {
        const res = await axios.get(
          `${process.env.API_URL}/contribution/events/${projectName}/${roundName}`
        )
        setContributeData(res.data)
        // setCheckboxState(
        //   res.data.checkBoxes.checkBoxes.map((text) => {
        //     return { text: text, check: false };
        //   })
        // );
        setCheckboxState(checkboxes)
      } catch (e) {
        console.log(e)
      }
      setContributeLoading(false)
    }

    if (projectName && roundName) getContributeData()
  }, [projectName, roundName])

  const readWallet = async () => {
    // todo: fix infinite promise
    try {
      if (dAppWallet.connected) {
        // @ts-ignore
        const whitelistBalance = await ergo.get_balance(
          contributeData?.whitelistTokenId
        )
        // const sigUSDBalance = await ergo.get_balance(SIGUSD_TOKEN_ID);
        // @ts-ignore
        const ergBalance = await ergo.get_balance() // eslint-disable-line
        setWalletBalance({
          whitelist:
            whitelistBalance / Math.pow(10, contributeData.tokenDecimals),
          sigusd: 0, // sigusd validation is disabled
          ergs: ergBalance / (1000 * 1000 * 1000),
        })
      } else if (wallet !== '' && wallet !== undefined) {
        const res = await axios.post(
          `${process.env.API_URL}/asset/balances/`,
          { addresses: [wallet] },
          { ...defaultOptions }
        )
        const ergs = res.data.addresses[wallet].balance
        const token = res.data.addresses[wallet].tokens.filter(
          (token: any) => token.tokenId === contributeData.whitelistTokenId
        )[0]
        if (token) {
          setWalletBalance({
            whitelist:
              token.amount / Math.pow(10, contributeData.tokenDecimals),
            sigusd: 0,
            ergs: ergs,
          })
        }
      } else {
        setWalletBalance(initialWalletBalance)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // set erg/usd conversion rate
  const updateConversionRate = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/asset/price/ergo`)
      setConversionRate(Math.round(res.data.price * 100) / 100)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const apiCheck = async () => {
      try {
        const now = Date.now()
        const startTime = Date.parse(contributeData.start_dtz)
        const endTime = Date.parse(contributeData.end_dtz)
        if (now < startTime) {
          setFormState(formOpenState.EARLY)
        } else if (now > endTime) {
          setFormState(formOpenState.CLOSED)
        } else {
          setFormState(formOpenState.OPEN)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const getRemainingTokens = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/vesting/activeRounds`,
          defaultOptions
        )
        const round = res.data.activeRounds.filter(
          (round: any) => round.proxyNFT === contributeData.proxyNFTId
        )[0]
        setRoundDetails(round ? round : initialRoundDetails)
      } catch (e) {
        console.log(e)
      }
    }

    if (contributeData) {
      updateConversionRate()
      apiCheck()
      getRemainingTokens()
    }
  }, [contributeData])

  useEffect(() => {
    if (wallet) {
      updateFormData({
        ...formData,
        address: wallet,
      })
      setWalletBalance(initialWalletBalance)
    }
    if (contributeData) {
      if (wallet !== '') {
        // wait till js injection?
        setTimeout(readWallet, 500)
        setFormErrors({
          ...formErrors,
          address: false,
        })
      } else {
        setFormErrors({
          ...formErrors,
          address: true,
        })
      }
    }
  }, [wallet, dAppWallet.connected, contributeData]) // eslint-disable-line

  // when loading button is disabled
  useEffect(() => {
    setbuttonDisabled(isLoading)
  }, [isLoading])

  const checkboxError =
    checkboxState.filter((checkBoxes) => !checkBoxes.check).length !== 0

  useEffect(() => {
    if (checkboxError || formState !== formOpenState.OPEN) {
      setbuttonDisabled(true)
    } else {
      setbuttonDisabled(false)
    }
  }, [checkboxError, formState])

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxState(
      checkboxState.map((checkbox, index) => {
        if (index.toString() === e.target.name) {
          return {
            ...checkbox,
            check: e.target.checked,
          }
        }
        return checkbox
      })
    )
  }

  // snackbar for error reporting
  const handleCloseError = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenError(false)
  }

  // snackbar for success
  const handleCloseSuccessSnackbar = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccessSnackbar(false)
  }

  const handleCurrencyChange = (event: React.MouseEvent, value: string) => {
    if (value !== null) {
      updateFormData({
        ...formData,
        currency: value,
      })
    }
  }

  const handleChange = (e: any) => {
    if (e.target.name === 'vestingAmount') {
      const amount = Number(e.target.value)
      if (amount > 0 && amount <= walletBalance.whitelist) {
        setFormErrors({
          ...formErrors,
          vestingAmount: false,
        })
      } else {
        setFormErrors({
          ...formErrors,
          vestingAmount: true,
        })
      }
      updateFormData({
        ...formData,
        vestingAmount: amount,
      })
    }
  }

  const submitWithNautilus = async (walletAddress: string) => {
    // @ts-ignore
    const connected = await ergoConnector.nautilus.connect()
    if (connected) {
      // @ts-ignore
      const address = await ergo.get_change_address()
      // @ts-ignore
      const usedAddresses = await ergo.get_used_addresses()
      // @ts-ignore
      const unusedAddresses = await ergo.get_unused_addresses()
      if (
        address === currentWallet?.changeAddress ||
        usedAddresses.includes(currentWallet?.changeAddress) ||
        unusedAddresses.includes(currentWallet?.changeAddress)
      ) {
        handleSubmit(address, [...usedAddresses, ...unusedAddresses])
      } else {
        // @ts-ignore
        ergoConnector.nautilus.disconnect()
        setErrorMessage('Please connect the correct Nautilus wallet')
        setOpenError(true)
      }
    }
  }

  const handleSubmit = async (address: string, otherAddresses: string[]) => {
    setLoading(true)
    const emptyCheck = Object.values(formData).every((v) => v !== '' && v !== 0)
    const errorCheck = Object.values(formErrors).every((v) => v === false)
    if (errorCheck && emptyCheck) {
      try {
        const sigUSDAmount =
          formData.currency === 'erg'
            ? 0
            : Math.round(
              formData.vestingAmount * contributeData.tokenPrice * 100
            ) / 100
        // const walletAddresses = [wallet, ...dAppWallet.addresses].filter(
        //   (x, i, a) => a.indexOf(x) == i && x
        // );
        const body = {
          proxyNFT: contributeData.proxyNFTId,
          vestingAmount: formData.vestingAmount,
          sigUSDAmount: sigUSDAmount,
          address: address,
          utxos: [],
          addresses: otherAddresses,
          txFormat: 'eip-12',
        }
        // console.log(body)
        const res = await axios.post(
          `${process.env.API_URL}/vesting/contribute`,
          body,
          defaultOptions
        )
        const unsignedtx = res.data
        // form submitted
        setSuccessMessageSnackbar('Form Submitted: Awaiting user confirmation')
        setOpenSuccessSnackbar(true)
        setOpenModal(transactionModalState.USER_PENDING)
        // @ts-ignore
        const signedtx = await ergo.sign_tx(unsignedtx)
        // @ts-ignore
        const ok = await ergo.submit_tx(signedtx)
        // await on dapp connector to sub
        setTransactionId(ok)
        setSuccessMessageSnackbar('Transaction Submitted: ' + ok)
        setOpenSuccessSnackbar(true)
        setOpenModal(transactionModalState.SUBMITTED)
      } catch (e: any) {
        // snackbar for error message
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          )
        } else {
          console.log(e)
          setOpenSuccessSnackbar(false)
          setErrorMessage('Failed to sign transaction')
        }
        setOpenError(true)
        setOpenModal(transactionModalState.CLOSED)
      }
    } else {
      let updateErrors = {}
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry
        if (value === '' || value === 0) {
          if (Object.hasOwn(formErrors, key)) {
            let newEntry = { [key]: true }
            updateErrors = { ...updateErrors, ...newEntry }
          }
        }
      })
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      })

      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again')
      setOpenError(true)
    }
    // turn off loading spinner for submit button
    setLoading(false)
  }

  const handleSubmitErgopay = async () => {
    setLoading(true)
    const emptyCheck = Object.values(formData).every((v) => v !== '' && v !== 0)
    const errorCheck = Object.values(formErrors).every((v) => v === false)
    if (errorCheck && emptyCheck) {
      try {
        const sigUSDAmount =
          formData.currency === 'erg'
            ? 0
            : Math.round(
              formData.vestingAmount * contributeData.tokenPrice * 100
            ) / 100
        const res = await axios.post(
          `${process.env.API_URL}/vesting/contribute`,
          {
            proxyNFT: contributeData.proxyNFTId,
            vestingAmount: formData.vestingAmount,
            sigUSDAmount: sigUSDAmount,
            address: formData.address,
            utxos: [],
            txFormat: 'ergo_pay',
          },
          defaultOptions
        )
        setErgopayUrl(res.data.url)
        setSuccessMessageSnackbar('Form Submitted')
        setOpenSuccessSnackbar(true)
        setOpenModal(transactionModalState.USER_PENDING)
      } catch (e: any) {
        // snackbar for error message
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          )
        } else {
          console.log(e)
          setOpenSuccessSnackbar(false)
          setErrorMessage('Failed to build transaction')
        }
        setOpenError(true)
        setOpenModal(transactionModalState.CLOSED)
      }
    } else {
      let updateErrors = {}
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry
        if (value === '' || value === 0) {
          if (Object.hasOwn(formErrors, key)) {
            let newEntry = { [key]: true }
            updateErrors = { ...updateErrors, ...newEntry }
          }
        }
      })
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      })

      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again')
      setOpenError(true)
    }
    // turn off loading spinner for submit button
    setLoading(false)
  }

  return (
    <>
      {contributeLoading ? (
        <>
          <Container sx={{ mb: '3rem' }}>
            <CircularProgress
              size={24}
              sx={{
                position: 'relative',
                left: '50%',
                marginLeft: '-12px',
                marginTop: '120px',
              }}
            />
          </Container>
        </>
      ) : (
        <>
          {contributeData ? (
            <>
              <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
                <PageTitle
                  title={contributeData.title}
                  subtitle={contributeData.subtitle}
                />
              </Container>
              <Grid
                container
                maxWidth="lg"
                sx={{
                  mx: 'auto',
                  flexDirection: 'row-reverse',
                  px: { xs: 2, md: 3 },
                }}
              >
                <Grid item md={4} xs={12} sx={{ pl: { md: 4, xs: 0 } }}>
                  <Box sx={{ mt: { md: 0, xs: 4 } }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: '700', lineHeight: '1.2' }}
                    >
                      Details
                    </Typography>
                    <MarkdownRender description={contributeData.details} />
                  </Box>
                </Grid>
                <Grid item md={8} xs={12}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: '700' }}>
                      Token Contribution Form
                    </Typography>
                    {/* <Typography variant="body2" sx={{ mb: 1 }}>
                      Tokens remaining to be distributed for this round:{' '}
                      {(roundDetails.remaining > 0) ? (roundDetails.remaining).toLocaleString(
                        navigator.language,
                        {
                          maximumFractionDigits: contributeData.tokenDecimals,
                        }
                      )
                      : (
                        'loading'
                      )
                    }
                      .
                    </Typography> */}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '1rem', mb: 1 }}
                        >
                          This address currently has{' '}
                          {walletBalance.whitelist.toLocaleString(
                            navigator.language,
                            {
                              maximumFractionDigits:
                                contributeData.tokenDecimals,
                            }
                          )}{' '}
                          whitelist tokens.
                        </Typography>
                        {/* <FormControl
                          variant="filled"
                          fullWidth
                          required
                          name="address"
                          error={formErrors.address}
                        >
                          <InputLabel
                            htmlFor="ergoAddress"
                            sx={{
                              '&.Mui-focused': { color: 'text.secondary' },
                            }}
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
                              'Please add a wallet address.'}
                          </FormHelperText>
                        </FormControl> */}
                        <ChangeDefaultAddress title="Address to send from" />
                      </Grid>
                      <Grid container item xs={12}>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '1rem', mb: 1 }}
                          >
                            Enter the number of {contributeData.tokenName}{' '}
                            tokens you would like. Rate for this round is $
                            {contributeData.tokenPrice} per token.
                          </Typography>
                        </Grid>
                        <Grid item xs={10} md={11} sx={{ pr: 1 }}>
                          <TextField
                            InputProps={{ disableUnderline: true }}
                            required
                            fullWidth
                            id="vestingAmount"
                            label="Token Amount"
                            name="vestingAmount"
                            variant="filled"
                            onChange={handleChange}
                            value={formData.vestingAmount}
                            error={formErrors.vestingAmount}
                            helperText={
                              formErrors.vestingAmount &&
                              'Invalid amount entered. Make sure you have enough whitelist tokens in your wallet.'
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
                                  value: walletBalance.whitelist.toString(),
                                },
                              })
                            }
                          >
                            MAX
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '1rem', mb: '1rem' }}
                        >
                          You are receiving{' '}
                          {formData.vestingAmount.toLocaleString(
                            navigator.language,
                            {
                              maximumFractionDigits:
                                contributeData.tokenDecimals,
                            }
                          )}{' '}
                          {contributeData.tokenName} tokens at $
                          {contributeData.tokenPrice} per token. Your total
                          contribution value is $
                          {(
                            contributeData.tokenPrice * formData.vestingAmount
                          ).toLocaleString(navigator.language, {
                            maximumFractionDigits: 2,
                          })}
                          .
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '1rem', mb: 0 }}
                        >
                          Ergo exchange ~$
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
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '1rem', mb: 1 }}
                        >
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
                                  (contributeData.tokenPrice *
                                    formData.vestingAmount *
                                    Math.pow(
                                      10,
                                      contributeData.tokenDecimals
                                    )) /
                                  conversionRate
                                ) / Math.pow(10, contributeData.tokenDecimals)
                              )
                              : Math.round(
                                contributeData.tokenPrice *
                                formData.vestingAmount *
                                100
                              ) / 100
                          }
                        />
                      </Grid>
                    </Grid>
                    <FormControl required error={checkboxError}>
                      <FormGroup sx={{ mt: 3 }}>
                        {checkboxState.map((checkbox, index) => (
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
                              mb: 0,
                            }}
                          />
                        ))}
                        <FormHelperText sx={{ mt: 0, mb: 3 }}>
                          {checkboxError &&
                            'Please accept the terms before submitting'}
                        </FormHelperText>
                      </FormGroup>
                    </FormControl>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '1rem', mb: '1rem' }}
                    >
                      Once you receive your vesting key, view the{' '}
                      <Link href="/dashboard">dashboard</Link> to redeem them
                      after the unlock date.
                    </Typography>
                    {/* <Typography
                      variant="body2"
                      sx={{ fontSize: '1rem', mb: '1rem' }}
                    >
                      If there's any issue, the transaction will be
                      automatically refunded. If that happens, please try
                      submitting again.
                    </Typography> */}
                    <Grid container>
                      <Grid item xs={6} sx={{ pr: 0.5 }}>
                        <Button
                          type="submit"
                          fullWidth
                          disabled={
                            buttonDisabled ||
                            formErrors.address ||
                            currentWallet?.type !== 'nautilus' ||
                            providerLoading
                          }
                          variant="contained"
                          sx={{ mt: 3, mb: 3, textTransform: 'none', px: 0 }}
                          onClick={() =>
                            submitWithNautilus(currentWallet?.changeAddress!)
                          }
                        >
                          Send with Desktop Wallet
                        </Button>
                      </Grid>
                      <Grid item xs={6} sx={{ pl: 0.5 }}>
                        <Button
                          type="submit"
                          fullWidth
                          disabled={
                            buttonDisabled ||
                            formErrors.address ||
                            currentWallet?.type !== 'mobile' ||
                            providerLoading
                          }
                          variant="contained"
                          sx={{ mt: 3, mb: 3, textTransform: 'none', px: 0 }}
                          onClick={handleSubmitErgopay}
                        >
                          Send with Mobile Wallet
                        </Button>
                      </Grid>
                    </Grid>
                    {(isLoading || providerLoading) && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'relative',
                          top: '0px',
                          left: '50%',
                          marginTop: '-18px',
                          marginLeft: '-12px',
                        }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    {formState === formOpenState.EARLY &&
                      'This form is not yet active. The round will start at ' +
                      new Date(
                        Date.parse(contributeData.start_dtz)
                      ).toTimeString()}
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    {formState === formOpenState.CLOSED &&
                      'The round is closed.'}
                  </Typography>
                </Grid>
              </Grid>
              <Modal
                open={openModal !== transactionModalState.CLOSED}
                onClose={() => {
                  setOpenModal(transactionModalState.CLOSED)
                  setTransactionId('')
                  setErgopayUrl('')
                }}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box
                  sx={
                    checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }
                  }
                >
                  <Typography id="modal-title" variant="h6" component="h2">
                    Contribution
                  </Typography>
                  {ergopayUrl && currentWallet?.changeAddress ? (
                    <ErgopayModalBody
                      ergopayUrl={ergopayUrl}
                      address={currentWallet.changeAddress}
                    />
                  ) : (
                    <TransactionSubmitted
                      transactionId={transactionId}
                      pending={openModal === transactionModalState.USER_PENDING}
                    />
                  )}
                </Box>
              </Modal>
              <Snackbar
                open={openError}
                autoHideDuration={4500}
                onClose={handleCloseError}
              >
                <Alert severity="error" sx={{ width: '100%' }}>
                  {errorMessage}
                </Alert>
              </Snackbar>
              <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={4500}
                onClose={handleCloseSuccessSnackbar}
              >
                <Alert severity="success" sx={{ width: '100%' }}>
                  {successMessageSnackbar}
                </Alert>
              </Snackbar>
            </>
          ) : (
            <CenterTitle
              title="Oops..."
              subtitle="Looks like the contribution event you are looking for doesn't exist."
              main={true}
            />
          )}
        </>
      )}
    </>
  )
}

export default Contribute
