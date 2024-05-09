import {
  Typography,
  Container,
  Box,
  Grid,
  Button,
  Paper,
  Checkbox,
  Modal,
  FormGroup,
  FormControl,
  FormControlLabel,
  InputLabel,
  FilledInput,
  FormHelperText,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CenterTitle from '@components/CenterTitle';
import { StakingItem } from '@components/staking/StakingSummary';
import StakingSummary from '@components/staking/StakingSummary';
import StakingNavigationDropdown from '@components/staking/StakingNavigationDropdown';
import StakingRewardsBox from '@components/staking/StakingRewardsBox';
import StakingTiers from '@components/staking/StakingTiers';
import UnstakingFeesTable from '@components/staking/UnstakingFeesTable';
import UnstakingTable from '@components/staking/UnstakingTable';
import TransactionSubmitted from '@components/TransactionSubmitted';
import ErgopayModalBody from '@components/ErgopayModalBody';
import MuiNextLink from '@components/MuiNextLink';
import theme from '@styles/theme';
import { useWallet } from '@contexts/WalletContext';
import { SetStateAction, forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { trpc } from '@utils/trpc';
import { Wallet } from 'next-auth';
import ChangeDefaultAddress from '@components/user/ChangeDefaultAddress';

const STAKE_TOKEN_ID =
  'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413';
const STAKE_TOKEN_DECIMALS = 2;
const STAKING_TOKEN_OPTIONS = [{ title: 'ErgoPad', project: 'default' }];

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
};

type StakingConfig = {
  project: string;
  title: string;
  tokenId: string;
  tokenDecimals: number;
  stakingInfo: string;
  additionalDetails: {
    stakingV1: boolean;
    disableStaking?: boolean;
    disableUnstaking?: boolean;
  }
}

type StakingForm = {
  wallet: string;
  tokenAmount: number;
}
const initStakingForm: StakingForm = {
  wallet: '',
  tokenAmount: 0,
}

type StakingFormErrors = {
  wallet: boolean;
  tokenAmount: boolean;
}

const initStakingFormErrors: StakingFormErrors = {
  wallet: false,
  tokenAmount: false,
}

const initUnstakingForm = {
  tokenAmount: 0,
}

const initUnstakingFormErrors = {
  wallet: false,
  tokenAmount: false,
}

export type StakedData = {
  project: string;
  tokenName: string;
  totalStaked: number;
  addresses: {
    [address: string]: {
      totalStaked: number;
      stakeBoxes: {
        boxId: string;
        stakeKeyId: string;
        stakeAmount: number;
        penaltyPct?: number;
        penaltyEndTime?: number;
      }[];
    };
  };
};

const initStaked: StakedData = {
  project: '',
  tokenName: '',
  totalStaked: 0,
  addresses: {},
}

export type Staked = {
  boxId: string;
  stakeKeyId: string;
  stakeAmount: number;
  penaltyPct: number;
  address: string;
}

const initUnstaked: Staked = {
  boxId: '',
  stakeKeyId: '',
  stakeAmount: 0,
  penaltyPct: 25,
  address: ''
}

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Staking = () => {
  const theme = useTheme()
  const checkSmall = useMediaQuery(theme.breakpoints.up('md'));
  // nav
  const router = useRouter();
  const [tokenChoice, setTokenChoice] = useState('default');
  const [tokenChoiceList, setTokenChoiceList] = useState(STAKING_TOKEN_OPTIONS);
  // stake modal
  const [tokenBalance, setTokenBalance] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [stakingForm, setStakingForm] = useState(initStakingForm);
  const [stakingFormErrors, setStakingFormErrors] = useState(
    initStakingFormErrors
  );
  const [stakeLoading, setStakeLoading] = useState(false);
  const [stakeErgopayLoading, setStakeErgopayLoading] = useState(false);
  // unstake table
  const [unstakeTableLoading, setUnstakeTableLoading] = useState(false);
  const [stakedData, setStakedData] = useState(initStaked);
  // unstake modal
  const [openUnstakeModal, setOpenUnstakeModal] = useState(false);
  const [unstakeModalLoading, setUnstakeModalLoading] = useState(false);
  const [unstakeErgopayLoading, setUnstakeErgopayLoading] = useState(false);
  const [unstakeModalData, setUnstakeModalData] = useState(initUnstaked);
  const [unstakingForm, setUnstakingForm] = useState(initUnstakingForm);
  const [unstakingFormErrors, setUnstakingFormErrors] = useState(
    initStakingFormErrors
  );
  const [unstakePenalty, setUnstakePenalty] = useState(-1);
  // error snackbar
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Something went wrong');
  // success snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessageSnackbar, setSuccessMessageSnackbar] =
    useState('Form submitted');
  const [checkBox, setCheckBox] = useState(false);
  const stakeButtonEnabled = checkBox; // use other conditions to enable this
  // transaction submitted
  const [transactionSubmitted, setTransactionSubmitted] = useState(null);
  const [ergopayUrl, setErgopayUrl] = useState(null);
  // tabs
  const [tabValue, setTabValue] = useState(0);
  const { wallet, providerLoading, sessionStatus } = useWallet()
  const shouldFetch = sessionStatus === "authenticated";
  const walletsQuery = trpc.user.getWallets.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch
    }
  )
  const [currentWalletType, setCurrentWalletType] = useState<string | null>(null)
  const [currentModalWalletType, setCurrentModalWalletType] = useState<string | null>(null)
  const [dappWalletAddresses, setDappWalletAddresses] = useState<string[]>([])
  const [currentDappWalletAddresses, setCurrentDappWalletAddresses] = useState<string[]>([])

  const handleTabChange = (event: any, newValue: SetStateAction<number>) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getTokenOptions = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/staking/config`);
        setTokenChoiceList([
          ...STAKING_TOKEN_OPTIONS,
          ...res.data.map((option: any) => {
            return { project: option.project, title: option.title };
          }),
        ]);
      } catch (e) {
        console.log(e);
      }
    };

    getTokenOptions();
  }, []);


  const getWallets = async (): Promise<Wallet[]> => {
    if (sessionStatus !== 'authenticated') {
      return []
    }
    const fetchResult = await walletsQuery?.refetch();
    return fetchResult && fetchResult.data ? fetchResult.data.wallets : [];
  };

  useEffect(() => {
    // load staked tokens for primary wallet address
    const getStaked = async () => {
      setUnstakeTableLoading(true);
      try {
        const wallets = await getWallets();
        if (wallets) {
          let uniqueAddresses: string[] = [];
          if (wallet) uniqueAddresses = [wallet]

          if (wallets && wallets.length > 0) {
            let addressSet: Set<string> = new Set();
            for (let thisWallet of wallets) {
              for (let address of thisWallet.unusedAddresses) {
                addressSet.add(address);
              }
              for (let address of thisWallet.usedAddresses) {
                addressSet.add(address);
              }
              addressSet.add(thisWallet.changeAddress);
              if (thisWallet.changeAddress === wallet) {
                setCurrentWalletType(thisWallet.type)
                if (thisWallet.type === 'nautilus') setDappWalletAddresses([...thisWallet.usedAddresses, ...thisWallet.unusedAddresses])
              }
            }

            uniqueAddresses = [...addressSet];
          }
          const request = {
            addresses: uniqueAddresses,
          };
          const res = await axios.post(
            `${process.env.API_URL}/staking/staked/`,
            request,
            { ...defaultOptions }
          );
          setStakedData(res.data);
        }
      } catch (e) {
        console.log('ERROR FETCHING: ', e);
      }
      setUnstakeTableLoading(false);
    };

    if (wallet !== '' && sessionStatus === 'authenticated') {
      getStaked();
    } else {
      setStakedData(initStaked);
    }
  }, [wallet]);

  useEffect(() => {
    // reset staking Form on wallet change
    if (wallet) {
      setStakingForm({ ...initStakingForm, wallet: wallet });
    }
    else setStakingForm({ ...initStakingForm })
    setStakingFormErrors({
      ...initStakingFormErrors,
      wallet: wallet === '',
    });
    setUnstakingFormErrors({
      ...initUnstakingFormErrors,
      wallet: wallet === '',
    });
  }, [wallet]);

  const getWalletType = (address: string) => {
    const wallets = walletsQuery.data?.wallets
    if (wallets) {
      const wallet = wallets.find(w =>
        w.changeAddress === address ||
        w.unusedAddresses.includes(address) ||
        w.usedAddresses.includes(address)
      );
      if (wallet && wallet.type === 'nautilus') setCurrentDappWalletAddresses([
        ...wallet?.unusedAddresses, ...wallet.usedAddresses
      ])
      return wallet ? wallet.type : null;
    }
    else return null
  };

  useEffect(() => {
    // get ergopad balance
    const getTokenBalance = async (address: string) => {
      try {
        if (address !== '') {
          const res = await axios.post(
            `${process.env.API_URL}/asset/balances/`,
            { addresses: [wallet] },
            { ...defaultOptions }
          );
          const token = res.data.addresses[address].tokens.filter(
            (token: { tokenId: string; }) => token.tokenId === STAKE_TOKEN_ID
          )[0];
          if (token) {
            setTokenBalance(token.amount / Math.pow(10, STAKE_TOKEN_DECIMALS));
          }
        } else {
          setTokenBalance(0);
        }
      } catch (e) {
        console.log('ERROR: ', e);
      }
    };
    if (openUnstakeModal) {
      setCurrentModalWalletType(getWalletType(unstakeModalData.address))
    }
    if (openModal || openUnstakeModal) {
      getTokenBalance(openUnstakeModal ? unstakeModalData.address : wallet!);
    }
  }, [openModal, openUnstakeModal, wallet]);

  const stakeWithDappConnector = async (walletAddress: string) => {
    // @ts-ignore
    const connected = await ergoConnector.nautilus.connect();
    if (connected) {
      // @ts-ignore
      const address = await ergo.get_change_address();
      if (address === walletAddress) {
        StakeNautilus(address)
      }
      else {
        // @ts-ignore
        ergoConnector.nautilus.disconnect()
        setErrorMessage('Please connect the correct Nautilus wallet');
        setOpenError(true);
        stakeWithDappConnector(walletAddress)
      }
    }
  };

  const StakeNautilus = async (walletAddress: string) => {
    setStakeLoading(true);
    const emptyCheck = Object.values(stakingForm).every(
      (v) => v !== '' && v !== 0
    );
    const errorCheck = Object.values(stakingFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        const tokenAmount = Math.round(
          stakingForm.tokenAmount * Math.pow(10, STAKE_TOKEN_DECIMALS)
        );
        const walletAddresses = [walletAddress, ...dappWalletAddresses].filter(
          (x, i, a) => a.indexOf(x) == i && x
        );
        const request = {
          wallet: walletAddress,
          amount: tokenAmount / Math.pow(10, STAKE_TOKEN_DECIMALS),
          utxos: [],
          txFormat: 'eip-12',
          addresses: [...walletAddresses],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/stake/`,
          request,
          { ...defaultOptions }
        );
        const unsignedtx = res.data;
        // @ts-ignore
        const signedtx = await ergo.sign_tx(unsignedtx); // eslint-disable-line
        // @ts-ignore
        const ok = await ergo.submit_tx(signedtx); // eslint-disable-line
        setSuccessMessageSnackbar('Transaction Submitted: ' + ok);
        setTransactionSubmitted(ok);
        setOpenSuccessSnackbar(true);
      } catch (e: any) {
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          setErrorMessage('Error: Failed to build transaction');
        }
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(stakingForm).forEach((entry) => {
        const [key, value] = entry;
        if (value == '') {
          if (Object.hasOwn(stakingFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setStakingFormErrors({
        ...stakingFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setStakeLoading(false);
  };

  const stakeErgopay = async () => {
    setStakeErgopayLoading(true);
    const emptyCheck = Object.values(stakingForm).every(
      (v) => v !== '' && v !== 0
    );
    const errorCheck = Object.values(stakingFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        const tokenAmount = Math.round(
          stakingForm.tokenAmount * Math.pow(10, STAKE_TOKEN_DECIMALS)
        );
        const request = {
          wallet: wallet,
          amount: tokenAmount / Math.pow(10, STAKE_TOKEN_DECIMALS),
          utxos: [],
          txFormat: 'ergo_pay',
          addresses: [wallet]
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/stake/`,
          request,
          { ...defaultOptions }
        );
        setErgopayUrl(res.data.url);
        setSuccessMessageSnackbar('Form Submitted');
        setOpenSuccessSnackbar(true);
      } catch (e: any) {
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          setErrorMessage('Error: Failed to build transaction');
        }
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(stakingForm).forEach((entry) => {
        const [key, value] = entry;
        if (value == '') {
          if (Object.hasOwn(stakingFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setStakingFormErrors({
        ...stakingFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setStakeErgopayLoading(false);
  };

  const initUnstake = () => {
    setTransactionSubmitted(null);
    setErgopayUrl(null);
    setUnstakePenalty(-1);
    setUnstakingForm(initUnstakingForm);
    setUnstakingFormErrors({
      tokenAmount: false,
      wallet: wallet === '',
    });
  };

  const unstakeWithDappConnector = async (walletAddress: string) => {
    // @ts-ignore
    const connected = await ergoConnector.nautilus.connect();
    if (connected) {
      // @ts-ignore
      const address = await ergo.get_change_address();
      if (address === walletAddress) {
        unstakeNautilus(address)
      }
      else {
        // @ts-ignore
        ergoConnector.nautilus.disconnect()
        setErrorMessage('Please connect the correct Nautilus wallet');
        setOpenError(true);
        unstakeWithDappConnector(walletAddress)
      }
    }
  };

  const unstakeNautilus = async (walletAddress: string) => {
    setUnstakeModalLoading(true);
    const emptyCheck = Object.values(unstakingForm).every(
      (v) => v !== undefined && v !== 0
    );
    const errorCheck = Object.values(unstakingFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        const tokenAmount =
          unstakingForm.tokenAmount * Math.pow(10, STAKE_TOKEN_DECIMALS);
        const walletAddresses = [walletAddress, ...currentDappWalletAddresses].filter(
          (x, i, a) => a.indexOf(x) == i && x
        );
        const request = {
          stakeBox: unstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, STAKE_TOKEN_DECIMALS),
          address: walletAddress,
          utxos: [],
          txFormat: 'eip-12',
          addresses: [...walletAddresses],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/unstake/`,
          request,
          { ...defaultOptions }
        );
        const penalty = res.data.penalty;
        setUnstakePenalty(penalty);
        const unsignedtx = res.data.unsignedTX;
        // @ts-ignore
        const signedtx = await ergo.sign_tx(unsignedtx); // eslint-disable-line
        // @ts-ignore
        const ok = await ergo.submit_tx(signedtx); // eslint-disable-line
        setSuccessMessageSnackbar('Transaction Submitted: ' + ok);
        setTransactionSubmitted(ok);
        setOpenSuccessSnackbar(true);
      } catch (e: any) {
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          setErrorMessage('Error: Failed to build transaction');
        }
        initUnstake();
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(unstakingForm).forEach((entry) => {
        const [key, value] = entry;
        if (value === 0) {
          if (Object.hasOwn(unstakingFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setUnstakingFormErrors({
        ...unstakingFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setUnstakeModalLoading(false);
  };

  const unstakeErgopay = async () => {
    setUnstakeErgopayLoading(true);
    const emptyCheck = Object.values(unstakingForm).every(
      (v) => v !== undefined && v !== 0
    );
    const errorCheck = Object.values(unstakingFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        console.log(unstakeModalData.address)
        const tokenAmount =
          unstakingForm.tokenAmount * Math.pow(10, STAKE_TOKEN_DECIMALS);
        const request = {
          stakeBox: unstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, STAKE_TOKEN_DECIMALS),
          address: unstakeModalData.address,
          utxos: [],
          // addresses: [unstakeModalData.address],
          txFormat: 'ergo_pay',
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/unstake/`,
          request,
          { ...defaultOptions }
        );
        const penalty = res.data.penalty;
        setUnstakePenalty(penalty);
        setErgopayUrl(res.data.url);
        setSuccessMessageSnackbar('Form Submitted');
        setOpenSuccessSnackbar(true);
      } catch (e: any) {
        if (e.response) {
          setErrorMessage(
            'Error: ' + e.response.status + ' - ' + e.response.data
          );
        } else {
          setErrorMessage('Error: Failed to build transaction');
        }
        initUnstake();
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(unstakingForm).forEach((entry) => {
        const [key, value] = entry;
        if (value === 0) {
          if (Object.hasOwn(unstakingFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setUnstakingFormErrors({
        ...unstakingFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setUnstakeErgopayLoading(false);
  };

  // snackbar for error reporting
  const handleCloseError = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  // snackbar for success
  const handleCloseSuccessSnackbar = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const handleTokenChoiceChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTokenChoice(event.target.value);
    if (event.target.value === 'default') router.push('/staking');
    else router.push(`/staking/${event.target.value}`);
  };

  const handleStakingFormChange = (e: { target: any; }) => {
    if (e.target.name === 'stakingAmount') {
      const amount = Number(e.target.value);
      if (amount >= 10 && amount <= tokenBalance) {
        setStakingFormErrors({
          ...stakingFormErrors,
          tokenAmount: false,
        });
        setStakingForm({
          ...stakingForm,
          tokenAmount: e.target.value,
        });
      } else {
        setStakingFormErrors({
          ...stakingFormErrors,
          tokenAmount: true,
        });
        setStakingForm({
          ...stakingForm,
          tokenAmount: e.target.value,
        });
      }
    }
  };

  const handleUnstakingFormChange = (e: { target: any; }) => {
    const calcPenalty = (value: number, penaltyPct: number) => {
      return Math.round(value * penaltyPct) / 100;
    };
    if (e.target.name === 'unstakingAmount') {
      const amount = Number(e.target.value);
      if (amount > 0 && amount <= unstakeModalData.stakeAmount) {
        setUnstakingFormErrors({
          ...unstakingFormErrors,
          tokenAmount: false,
        });
        setUnstakingForm({
          ...unstakingForm,
          tokenAmount: e.target.value,
        });
        const penalty = calcPenalty(amount, unstakeModalData.penaltyPct);
        setUnstakePenalty(penalty);
      } else {
        setUnstakingFormErrors({
          ...unstakingFormErrors,
          tokenAmount: true,
        });
        setUnstakingForm({
          ...unstakingForm,
          tokenAmount: e.target.value,
        });
        setUnstakePenalty(-1);
      }
    }
  };

  return (
    <>
      <Container sx={{ mb: '3rem' }}>
        <CenterTitle
          title="Stake Your ErgoPad Tokens"
          subtitle="Connect your wallet and stake your tokens to receive staking rewards and early access to upcoming IDOs"
          main={true}
        />
      </Container>
      <Container maxWidth="lg">
        <StakingNavigationDropdown
          tokenChoice={tokenChoice}
          stakingTokenOptions={tokenChoiceList}
          handleTokenChoiceChange={handleTokenChoiceChange}
        />
        <StakingSummary project_id={undefined} />
        <Grid
          container
          spacing={3}
          sx={{
            mt: 8,
            justifyContent: 'space-between',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          <Grid item xs={12} md={8} sx={{ pr: { lg: 1, xs: 0 } }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Stake" {...a11yProps(0)} />
                  <Tab label="Unstake" {...a11yProps(1)} />
                  <Tab label="Tiers" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h4">Staking Info</Typography>
                <Typography variant="body2">
                  Staking your tokens will generate new tokens daily based on
                  the APY percentage above. If you stake in one of the{' '}
                  <a
                    onClick={() => {
                      setTabValue(2);
                    }}
                    style={{
                      cursor: 'pointer',
                      color: theme.palette.primary.main,
                    }}
                  >
                    tiers
                  </a>
                  , it also makes you eligible for early contribution rounds to
                  IDOs of projects launched on Ergopad.
                </Typography>
                <Typography variant="body2">
                  Be aware of the unstaking fees, as outlined in the table.
                  These fees are in place to prevent someone from staking right
                  before a tier snapshot, then unstaking immediately after.
                  Unstaking fees are burned and will no longer be in
                  circulation, reducing the total supply of Ergopad tokens.
                </Typography>
                <Typography variant="body2">
                  Note: Please stake a minimum of 10 ergopad tokens, fewer will
                  not work.
                </Typography>
                <Typography variant="h4">Terms &amp; Conditions</Typography>
                <Typography variant="body2">
                  By using this website to stake tokens on the Ergo blockchain,
                  you accept that you are interacting with a smart contract that
                  this website has no control over. The operators of this
                  website accept no liability whatsoever in relation to your use
                  of these smart contracts. By using this website to stake, you
                  also have read and agree to the{' '}
                  <Link href="/terms">Terms and Conditions</Link>.
                </Typography>
                <FormGroup
                  sx={{
                    marginBottom: '1rem',
                    mt: '-1rem',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={checkBox}
                        onChange={(e, checked) => setCheckBox(checked)}
                      />
                    }
                    sx={{ label: { fontSize: '1.125rem' } }}
                    label="I have read and accept the terms described above. "
                  />
                </FormGroup>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={!stakeButtonEnabled}
                    sx={{
                      color: '#fff',
                      fontSize: '1rem',
                      py: '0.6rem',
                      px: '1.2rem',
                      textTransform: 'none',
                      background: theme.palette.primary.main,
                      '&:hover': {
                        background: '#4BD0C9',
                        boxShadow: 'none',
                      },
                      '&:active': {
                        background: 'rgba(49, 151, 149, 0.25)',
                      },
                    }}
                    onClick={() => {
                      setOpenModal(true);
                      setTransactionSubmitted(null);
                    }}
                  >
                    Stake Now
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={1} id="withdraw">
                <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: '700' }}>
                    Withdraw
                  </Typography>
                  {unstakeTableLoading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    <UnstakingTable
                      data={stakedData}
                      unstake={(boxId, stakeKeyId, stakeAmount, penaltyPct, address) => {
                        initUnstake();
                        setOpenUnstakeModal(true);
                        setUnstakeModalData({
                          boxId,
                          stakeKeyId,
                          stakeAmount,
                          penaltyPct,
                          address
                        });
                      }}
                      addstake={null}
                    />
                  )}
                </Paper>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                  <StakingTiers />
                </Paper>
              </TabPanel>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <StakingRewardsBox
              tokenName={'ErgoPad'}
              loading={unstakeTableLoading}
              totalStaked={stakedData.totalStaked}
            />
            <UnstakingFeesTable />
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setTransactionSubmitted(null);
          setErgopayUrl(null);
          setStakingFormErrors(initStakingFormErrors);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Stake Tokens
          </Typography>
          {transactionSubmitted || ergopayUrl ? (
            transactionSubmitted ? (
              <TransactionSubmitted transactionId={transactionSubmitted} pending={undefined} />
            ) : (
              <ErgopayModalBody ergopayUrl={ergopayUrl!} address={wallet!} />
            )
          ) : (
            <>
              <Typography variant="body2" sx={{ fontSize: '1rem', mb: 2 }}>
                Once you click submit you will be prompted by your wallet to
                approve the transaction. Make sure you verify token amounts
                before approving it.
              </Typography>
              <Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  You have {tokenBalance} ErgoPad tokens.
                </Typography>
                <Grid
                  container
                  spacing={1}
                  alignItems="stretch"
                  justifyContent="center"
                  sx={{ flexGrow: 1 }}
                >
                  <Grid item md={10} xs={8}>
                    <TextField
                      InputProps={{ disableUnderline: true }}
                      required
                      fullWidth
                      id="stakingAmount"
                      label={`Enter the token amount you are staking`}
                      name="stakingAmount"
                      variant="filled"
                      sx={{ mb: 2 }}
                      onChange={handleStakingFormChange}
                      value={stakingForm.tokenAmount}
                      error={stakingFormErrors.tokenAmount}
                      helperText={
                        stakingFormErrors.tokenAmount &&
                        'Enter a valid token amount'
                      }
                    />
                  </Grid>
                  <Grid item md={2} xs={4}>
                    <Button
                      onClick={() => {
                        handleStakingFormChange({
                          target: {
                            name: 'stakingAmount',
                            value: tokenBalance,
                          },
                        });
                      }}
                    >
                      Max Amount
                    </Button>
                  </Grid>
                </Grid>
                <ChangeDefaultAddress title="Address to stake from" />
                <Grid container justifyContent="center">
                  {wallet && currentWalletType === 'nautilus' && (
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={
                          stakeErgopayLoading ||
                          stakeLoading ||
                          stakingFormErrors.wallet
                          || providerLoading
                          || unstakeTableLoading
                        }
                        sx={{
                          color: '#fff',
                          fontSize: '1rem',
                          mt: 2,
                          mr: 1,
                          py: '0.6rem',
                          px: '1.2rem',
                          textTransform: 'none',
                          background: '#667eea',
                          '&:hover': {
                            background: '#8096F7',
                            boxShadow: 'none',
                          },
                          '&:active': {
                            background: 'rgba(90, 103, 216, 0.25)',
                          },
                        }}
                        onClick={() => stakeWithDappConnector(wallet)}
                      >
                        Stake with Desktop Wallet
                        {(stakeErgopayLoading ||
                          stakeLoading ||
                          stakingFormErrors.wallet
                          || providerLoading
                          || unstakeTableLoading) && (
                            <CircularProgress
                              sx={{ ml: 2, color: 'white' }}
                              size={'1.2rem'}
                            />
                          )}
                      </Button>
                    </Grid>
                  )}
                  {wallet && currentWalletType === 'mobile' && (
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={
                          stakeErgopayLoading ||
                          stakeLoading ||
                          stakingFormErrors.wallet
                          || providerLoading
                          || unstakeTableLoading
                        }
                        sx={{
                          color: '#fff',
                          fontSize: '1rem',
                          mt: 2,
                          py: '0.6rem',
                          px: '1.2rem',
                          textTransform: 'none',
                          background: '#667eea',
                          '&:hover': {
                            background: '#8096F7',
                            boxShadow: 'none',
                          },
                          '&:active': {
                            background: 'rgba(90, 103, 216, 0.25)',
                          },
                        }}
                        onClick={stakeErgopay}
                      >
                        Stake with Mobile Wallet
                        {(stakeErgopayLoading ||
                          stakeLoading ||
                          stakingFormErrors.wallet
                          || providerLoading
                          || unstakeTableLoading) && (
                            <CircularProgress
                              sx={{ ml: 2, color: 'white' }}
                              size={'1.2rem'}
                            />
                          )}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={openUnstakeModal}
        onClose={() => {
          setOpenUnstakeModal(false);
          setTransactionSubmitted(null);
          setErgopayUrl(null);
          setUnstakingFormErrors(initUnstakingFormErrors);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Unstake Tokens
          </Typography>
          {transactionSubmitted || ergopayUrl ? (
            transactionSubmitted ? (
              <TransactionSubmitted transactionId={transactionSubmitted} pending={undefined} />
            ) : (
              <ErgopayModalBody ergopayUrl={ergopayUrl!} address={unstakeModalData.address} pending={undefined} />
            )
          ) : (
            <>
              <Typography variant="body2" sx={{ fontSize: '1rem', mb: 2 }}>
                Please note the unstaking penalty before approving the
                transaction in your wallet.
              </Typography>
              <Grid
                container
                spacing={checkSmall ? 3 : 1}
                alignItems="stretch"
                justifyContent="center"
                sx={{ flexGrow: 1, mb: 3 }}
              >
                {[
                  {
                    title: 'Staked in Box',
                    value: unstakeModalData.stakeAmount,
                    background: theme.palette.background.default,
                  },
                  {
                    title: 'Penalty',
                    value: unstakePenalty === -1 ? '-' : unstakePenalty,
                    background: theme.palette.background.default,
                  },
                ].map((item) => {
                  if (checkSmall) {
                    return StakingItem(item, 6);
                  } else {
                    return StakingItem(item, 6, true);
                  }
                })}
              </Grid>
              <Box>
                <Grid
                  container
                  spacing={3}
                  alignItems="stretch"
                  justifyContent="center"
                  sx={{ flexGrow: 1 }}
                >
                  <Grid item md={10} xs={9}>
                    <TextField
                      InputProps={{ disableUnderline: true }}
                      required
                      fullWidth
                      id="unstakingAmount"
                      label={`Enter the token amount you are unstaking`}
                      name="unstakingAmount"
                      variant="filled"
                      sx={{ mb: 2 }}
                      onChange={handleUnstakingFormChange}
                      value={unstakingForm.tokenAmount}
                      error={unstakingFormErrors.tokenAmount}
                      helperText={
                        unstakingFormErrors.tokenAmount &&
                        'Enter a valid token amount'
                      }
                    />
                  </Grid>
                  <Grid item md={2} xs={3}>
                    <Button
                      onClick={() => {
                        handleUnstakingFormChange({
                          target: {
                            name: 'unstakingAmount',
                            value: unstakeModalData.stakeAmount,
                          },
                        });
                      }}
                    >
                      Max Amount
                    </Button>
                  </Grid>
                </Grid>
                <FormHelperText>
                  {unstakingFormErrors.wallet
                    ? 'Please connect wallet to proceed'
                    : ''}
                </FormHelperText>
                <Grid container justifyContent="center">

                  {unstakeModalData.address && currentModalWalletType === 'nautilus' && (
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={
                          unstakeModalLoading ||
                          unstakeErgopayLoading ||
                          unstakingFormErrors.wallet
                        }
                        sx={{
                          color: '#fff',
                          fontSize: '1rem',
                          mt: 2,
                          mr: 1,
                          py: '0.6rem',
                          px: '1.2rem',
                          textTransform: 'none',
                          background: theme.palette.secondary.main,
                          '&:hover': {
                            background: '#B886F9',
                            boxShadow: 'none',
                          },
                          '&:active': {
                            background: 'rgba(128, 90, 213, 0.25)',
                          },
                        }}
                        onClick={() => unstakeWithDappConnector(unstakeModalData.address)}
                      >
                        Unstake with Desktop Wallet
                        {unstakeModalLoading && (
                          <CircularProgress
                            sx={{ ml: 2, color: 'white' }}
                            size={'1.2rem'}
                          />
                        )}
                      </Button>
                    </Grid>
                  )}
                  {unstakeModalData.address && currentModalWalletType === 'mobile' && (
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={
                          unstakeModalLoading ||
                          unstakeErgopayLoading ||
                          unstakingFormErrors.wallet
                        }
                        sx={{
                          color: '#fff',
                          fontSize: '1rem',
                          mt: 2,
                          py: '0.6rem',
                          px: '1.2rem',
                          textTransform: 'none',
                          background: theme.palette.secondary.main,
                          '&:hover': {
                            background: '#B886F9',
                            boxShadow: 'none',
                          },
                          '&:active': {
                            background: 'rgba(128, 90, 213, 0.25)',
                          },
                        }}
                        onClick={unstakeErgopay}
                      >
                        Unstake with Mobile Wallet
                        {unstakeErgopayLoading && (
                          <CircularProgress
                            sx={{ ml: 2, color: 'white' }}
                            size={'1.2rem'}
                          />
                        )}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={openError}
        autoHideDuration={4500}
        onClose={handleCloseError}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessageSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Staking;
