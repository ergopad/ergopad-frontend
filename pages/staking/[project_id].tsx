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
import MarkdownRender from '@components/MarkdownRender';
import { StakingItem } from '@components/staking/StakingSummary';
import StakingNavigationDropdown from '@components/staking/StakingNavigationDropdown';
import StakingSummary from '@components/staking/StakingSummary';
import StakingRewardsBox from '@components/staking/StakingRewardsBox';
import UnstakingFeesTable from '@components/staking/UnstakingFeesTable';
import UnstakingTable from '@components/staking/UnstakingTable';
import TransactionSubmitted from '@components/TransactionSubmitted';
import ErgopayModalBody from '@components/ErgopayModalBody';
import MuiNextLink from '@components/MuiNextLink';
import { useWallet } from '@utils/WalletContext';
import { SetStateAction, forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { trpc } from '@utils/trpc';
import { Wallet } from 'next-auth';
import Link from 'next/link';
import ChangeDefaultAddress from '@components/user/ChangeDefaultAddress';

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

const defaultStakingConfig: StakingConfig = {
  project: 'ergopad',
  title: 'ErgoPad',
  tokenId: '0xtest',
  tokenDecimals: 0,
  stakingInfo: '',
  additionalDetails: {
    stakingV1: false,
  },
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

const initAddstakeForm = {
  tokenAmount: 0,
}

const initAddstakeFormErrors = {
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

const initAddstaked: Staked = {
  boxId: '',
  stakeKeyId: '',
  stakeAmount: 0,
  penaltyPct: 0,
  address: ''
}

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
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

const ProjectStaking = () => {
  const theme = useTheme()
  const checkSmall = useMediaQuery(() => theme.breakpoints.up('md'));
  const router = useRouter();
  const { project_id } = router.query;
  const [pageLoading, setPageLoading] = useState(true);
  const [tokenChoice, setTokenChoice] = useState('Loading...');
  const [tokenChoiceList, setTokenChoiceList] = useState(STAKING_TOKEN_OPTIONS);
  const [stakingConfig, setStakingConfig] = useState(defaultStakingConfig);
  // wallet
  const { wallet, sessionStatus } = useWallet()
  const shouldFetch = sessionStatus === "authenticated";
  const walletsQuery = trpc.user.getWallets.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetch
    }
  )
  // const [aggregateWallet, setAggregateWallet] = useState(true);
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
  // add stake modal
  const [openAddstakeModal, setOpenAddstakeModal] = useState(false);
  const [addstakeModalLoading, setAddstakeModalLoading] = useState(false);
  const [addstakeErgopayLoading, setAddstakeErgopayLoading] = useState(false);
  const [addstakeModalData, setAddstakeModalData] = useState(initAddstaked);
  const [addstakeForm, setAddstakeForm] = useState(initAddstakeForm);
  const [addstakeFormErrors, setAddstakeFormErrors] = useState(
    initAddstakeFormErrors
  );
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
  const [currentWalletType, setCurrentWalletType] = useState<string | null>(null)
  const [dappWalletAddresses, setDappWalletAddresses] = useState<string[]>([])
  const [getTokenBalanceLoading, setGetTokenBalanceLoading] = useState(false)
  const [currentModalWalletType, setCurrentModalWalletType] = useState<string | null>(null)
  const [currentDappWalletAddresses, setCurrentDappWalletAddresses] = useState<string[]>([])

  const handleTabChange = (event: any, newValue: SetStateAction<number>) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getPageConfig = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(`${process.env.API_URL}/staking/config`);
        setTokenChoiceList([
          ...STAKING_TOKEN_OPTIONS,
          ...res.data.map((option: { project: any; title: any; }) => {
            return { project: option.project, title: option.title };
          }),
        ]);
        const config = res.data.filter(
          (config: { project: string | string[] | undefined; }) => config.project === project_id
        )[0];
        setStakingConfig(config ?? defaultStakingConfig);
      } catch (e) {
        console.log(e);
      }
      setPageLoading(false);
    };

    if (project_id) {
      setTokenChoice(project_id.toString());
      getPageConfig();
    }
  }, [project_id]);

  const getWalletType = (address: string) => {
    const wallets = walletsQuery?.data?.wallets
    if (wallets && wallets.length > 0) {
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
            `${process.env.API_URL}/staking/${project_id}/staked/`,
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

    if (project_id && wallet !== '' && sessionStatus === 'authenticated') {
      getStaked();
    } else {
      if (!project_id) setStakingConfig(defaultStakingConfig);
      setStakedData(initStaked);
    }
  }, [wallet, project_id]);

  useEffect(() => {
    // reset staking Form on wallet change
    if (wallet) {
      setStakingForm({ ...initStakingForm, wallet: wallet });
    }
    else setStakingForm({ ...initStakingForm });
    setStakingFormErrors({
      ...initStakingFormErrors,
      wallet: wallet === '',
    });
    setUnstakingFormErrors({
      ...initUnstakingFormErrors,
      wallet: wallet === '',
    });
    setAddstakeFormErrors({
      ...initAddstakeFormErrors,
      wallet: wallet === '',
    });
  }, [wallet]);

  useEffect(() => {
    // get token balance
    const getTokenBalance = async (address: string) => {
      try {
        // if (dAppWallet.connected) {
        //   const balance = await ergo.get_balance(stakingConfig.tokenId); // eslint-disable-line
        //   setTokenBalance(balance / Math.pow(10, stakingConfig.tokenDecimals));
        // } else 

        setGetTokenBalanceLoading(true)
        if (address !== '') {
          const res = await axios.post(
            `${process.env.API_URL}/asset/balances/`,
            { addresses: [address] },
            { ...defaultOptions }
          );
          const token = res.data.addresses[address].tokens.filter(
            (token: { tokenId: string; }) => token.tokenId === stakingConfig.tokenId
          )[0];
          if (token && token.amount > 0) {
            setTokenBalance(
              token.amount / Math.pow(10, stakingConfig.tokenDecimals)
            );
          }
          else {
            setTokenBalance(0);
          }
        } else {
          setTokenBalance(0);
        }
        setGetTokenBalanceLoading(false)
      } catch (e) {
        console.log('ERROR: ', e);
        setGetTokenBalanceLoading(false)
      }
    };
    if (openAddstakeModal) {
      setCurrentModalWalletType(getWalletType(addstakeModalData.address))
    }
    if (openUnstakeModal) {
      setCurrentModalWalletType(getWalletType(unstakeModalData.address))
    }
    if (openModal || openAddstakeModal || openUnstakeModal) {
      getTokenBalance(openAddstakeModal ? addstakeModalData.address : openUnstakeModal ? unstakeModalData.address : wallet!);
    }
  }, [
    openModal,
    openUnstakeModal,
    openAddstakeModal,
    wallet,
    // dAppWallet.connected,
    stakingConfig,
  ]);

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
          stakingForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals)
        );
        const walletAddresses = [walletAddress, ...dappWalletAddresses].filter(
          (x, i, a) => a.indexOf(x) == i && x
        );
        const request = {
          wallet: walletAddress,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          utxos: [],
          txFormat: 'eip-12',
          addresses: [...walletAddresses],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/stake/`,
          request,
          { ...defaultOptions }
        );
        const unsignedtx = res.data;
        // @ts-ignore
        const signedtx = await ergo.sign_tx(unsignedtx);
        // @ts-ignore
        const ok = await ergo.submit_tx(signedtx);
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
  }

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
          stakingForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals)
        );
        const request = {
          wallet: stakingForm.wallet,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          utxos: [],
          txFormat: 'ergo_pay',
          addresses: [stakingForm.wallet],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/stake/`,
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
          unstakingForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals);
        const walletAddresses = [walletAddress, ...dappWalletAddresses].filter(
          (x, i, a) => a.indexOf(x) == i && x
        );
        const request = {
          stakeBox: unstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          address: walletAddress,
          utxos: [],
          txFormat: 'eip-12',
          addresses: [...walletAddresses],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/unstake/`,
          request,
          { ...defaultOptions }
        );
        // staked v1 has a response different format
        const penalty = res.data.penalty ?? 0;
        setUnstakePenalty(penalty);
        const unsignedtx = stakingConfig.additionalDetails.stakingV1
          ? res.data.unsignedTX
          : res.data;
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
        const tokenAmount =
          unstakingForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals);
        const request = {
          stakeBox: unstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          address: unstakeModalData.address,
          utxos: [],
          addresses: [unstakeModalData.address],
          txFormat: 'ergo_pay',
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/unstake/`,
          request,
          { ...defaultOptions }
        );
        const penalty = res.data.penalty ?? 0;
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

  const initAddstake = () => {
    setTransactionSubmitted(null);
    setErgopayUrl(null);
    setAddstakeForm(initAddstakeForm);
    setAddstakeFormErrors({
      tokenAmount: false,
      wallet: wallet === '',
    });
  };

  const addStakeWithDappConnector = async () => {
    // @ts-ignore
    const connected = await ergoConnector.nautilus.connect();
    if (connected) {
      // @ts-ignore
      const address = await ergo.get_change_address();
      if (address === addstakeModalData.address) {
        addstake()
      }
      else {
        // @ts-ignore
        ergoConnector.nautilus.disconnect()
        setErrorMessage(`Please connect the wallet with address ${addstakeModalData.address} `);
        setOpenError(true);
        addStakeWithDappConnector()
      }
    }
  };

  const addstake = async () => {
    setAddstakeModalLoading(true);
    const emptyCheck = Object.values(addstakeForm).every(
      (v) => v !== undefined && v !== 0
    );
    const errorCheck = Object.values(addstakeFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        const tokenAmount =
          addstakeForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals);
        const walletAddresses = [addstakeModalData.address, ...currentDappWalletAddresses].filter(
          (x, i, a) => a.indexOf(x) == i && x
        );
        const request = {
          stakeBox: addstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          address: addstakeModalData.address,
          utxos: [],
          txFormat: 'eip-12',
          addresses: [...walletAddresses],
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/addstake/`,
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
        initAddstake();
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(addstakeForm).forEach((entry) => {
        const [key, value] = entry;
        if (value === undefined || value === 0) {
          if (Object.hasOwn(addstakeFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setAddstakeFormErrors({
        ...addstakeFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setAddstakeModalLoading(false);
  };

  const addstakeErgopay = async () => {
    setAddstakeErgopayLoading(true);
    const emptyCheck = Object.values(addstakeForm).every(
      (v) => v !== undefined && v !== 0
    );
    const errorCheck = Object.values(addstakeFormErrors).every(
      (v) => v === false
    );
    if (emptyCheck && errorCheck) {
      try {
        const tokenAmount =
          addstakeForm.tokenAmount * Math.pow(10, stakingConfig.tokenDecimals);
        const request = {
          stakeBox: addstakeModalData.boxId,
          amount: tokenAmount / Math.pow(10, stakingConfig.tokenDecimals),
          address: addstakeModalData.address,
          utxos: [],
          addresses: [addstakeModalData.address],
          txFormat: 'ergo_pay',
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/${project_id}/addstake/`,
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
        initAddstake();
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(addstakeForm).forEach((entry) => {
        const [key, value] = entry;
        if (value === 0) {
          if (Object.hasOwn(addstakeFormErrors, key)) {
            let newEntry = { [key]: true };
            updateErrors = { ...updateErrors, ...newEntry };
          }
        }
      });
      setAddstakeFormErrors({
        ...addstakeFormErrors,
        ...updateErrors,
      });
      // snackbar for error message
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setAddstakeErgopayLoading(false);
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

  const handleAddstakeFormChange = (e: { target: any; }) => {
    if (e.target.name === 'tokenAmount') {
      const amount = Number(e.target.value);
      if (amount > 0 && amount <= tokenBalance) {
        setAddstakeFormErrors({
          ...addstakeFormErrors,
          tokenAmount: false,
        });
        setAddstakeForm({
          ...addstakeForm,
          tokenAmount: e.target.value,
        });
      } else {
        setAddstakeFormErrors({
          ...addstakeFormErrors,
          tokenAmount: true,
        });
        setAddstakeForm({
          ...addstakeForm,
          tokenAmount: e.target.value,
        });
      }
    }
  };

  const projectName =
    tokenChoiceList.filter((option) => option.project === project_id)[0]
      ?.title ?? '';

  return (
    <>
      {projectName ? (
        <>
          <Container sx={{ mb: 3 }}>
            <CenterTitle
              title={`Stake Your ${stakingConfig.title} Tokens`}
              subtitle="Connect your wallet and stake your tokens to receive staking rewards"
              main={true}
            />
          </Container>
          <Container maxWidth="lg">
            <StakingNavigationDropdown
              tokenChoice={tokenChoice}
              stakingTokenOptions={tokenChoiceList}
              handleTokenChoiceChange={handleTokenChoiceChange}
            />
            <StakingSummary project_id={project_id} />
            <Grid
              container
              spacing={3}
              sx={{
                mt: 4,
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
                      <Tab
                        label={
                          stakingConfig.additionalDetails.stakingV1
                            ? 'Unstake'
                            : 'Manage Stake'
                        }
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    <Typography variant="h4">Staking Info</Typography>
                    <MarkdownRender
                      description={stakingConfig.stakingInfo ?? ''}
                    />
                    <Typography variant="body2">
                      Note: Please stake a minimum of 10 tokens, fewer will not
                      work.
                    </Typography>
                    <Typography variant="h4">Terms &amp; Conditions</Typography>
                    <Typography variant="body2">
                      By using this website to stake tokens on the Ergo
                      blockchain, you accept that you are interacting with a
                      smart contract that this website has no control over. The
                      operators of this website accept no liability whatsoever
                      in relation to your use of these smart contracts. By using
                      this website to stake, you also have read and agree to the{' '}
                      <Link href="/terms">
                        Terms and Conditions
                      </Link>
                      .
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
                        textAlign: 'center'
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={
                          !stakeButtonEnabled ||
                          stakingConfig.additionalDetails.disableStaking ||
                          stakingConfig.title === 'Neta'
                        }
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
                      {stakingConfig.title === 'Neta' && (
                        <Typography variant="body2" sx={{ mt: 1, fontSize: '1rem' }}>
                          Neta staking currently disabled. You are still able to unstake normally.
                        </Typography>
                      )}
                    </Box>
                    {stakingConfig.additionalDetails.disableStaking && (
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '1rem' }}>
                        NOTE: Staking is currently disabled.
                      </Typography>
                    )}
                  </TabPanel>
                  <TabPanel value={tabValue} index={1} id="manage">
                    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: '700' }}>
                        {stakingConfig.additionalDetails.stakingV1
                          ? 'Withdraw'
                          : 'Manage Stake Boxes'}
                      </Typography>
                      {unstakeTableLoading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        <UnstakingTable
                          data={stakedData}
                          unstake={(
                            boxId: string,
                            stakeKeyId: string,
                            stakeAmount: number,
                            penaltyPct: number,
                            address: string
                          ) => {
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
                          addstake={
                            stakingConfig.additionalDetails.stakingV1 ||
                              stakingConfig.additionalDetails.disableStaking
                              ? null
                              : (boxId: string, stakeKeyId: string, stakeAmount: number, penaltyPct: number, address: string) => {
                                initAddstake();
                                setOpenAddstakeModal(true);
                                setAddstakeModalData({
                                  boxId,
                                  stakeKeyId,
                                  stakeAmount,
                                  penaltyPct,
                                  address
                                });
                              }
                          }
                          disableUnstaking={
                            stakingConfig.additionalDetails.disableUnstaking
                          }
                          disableAddStake={
                            stakingConfig.title === 'Neta'
                          }
                        />
                      )}
                    </Paper>
                  </TabPanel>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <StakingRewardsBox
                  tokenName={stakingConfig.title}
                  loading={unstakeTableLoading}
                  totalStaked={stakedData.totalStaked}
                // aggregateWallet={true}
                // handleSwitchChange={(state) => setAggregateWallet(state)}
                />
                {stakingConfig.additionalDetails.stakingV1 && (
                  <UnstakingFeesTable />
                )}
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
            <Box
              sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Stake Tokens
              </Typography>
              {transactionSubmitted || ergopayUrl ? (
                transactionSubmitted ? (
                  <TransactionSubmitted transactionId={transactionSubmitted} pending={undefined} />
                ) : (
                  <ErgopayModalBody ergopayUrl={ergopayUrl!} address={wallet!} pending={undefined} />
                )) : (
                <>
                  <Typography variant="body2" sx={{ fontSize: '1rem', mb: 2 }}>
                    Once you click submit you will be prompted by your wallet to
                    approve the transaction. Make sure you verify token amounts
                    before approving it.
                  </Typography>
                  <Box>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      This address has {tokenBalance} {stakingConfig.title} tokens available to stake.
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
                              stakingFormErrors.wallet ||
                              !wallet || currentWalletType !== 'nautilus'
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
                            onClick={() => stakeWithDappConnector(wallet!)}
                          >
                            Stake now with Nautilus
                            {stakeLoading && (
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
                            Stake now with Ergopay
                            {stakeErgopayLoading && (
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
            <Box
              sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Unstake Tokens
              </Typography>
              {transactionSubmitted || ergopayUrl ? (
                transactionSubmitted ? (
                  <TransactionSubmitted transactionId={transactionSubmitted} pending={undefined} />
                ) : (
                  <ErgopayModalBody ergopayUrl={ergopayUrl!} address={unstakeModalData.address} pending={undefined} />
                )) : (
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
                      {currentModalWalletType === 'nautilus' && (
                        <Grid item>
                          <Button
                            variant="contained"
                            disabled={
                              unstakeModalLoading ||
                              unstakeErgopayLoading ||
                              unstakingFormErrors.wallet
                              // || !dAppWallet.connected
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
                      {currentModalWalletType === 'mobile' && (
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
          <Modal
            open={openAddstakeModal}
            onClose={() => {
              setOpenAddstakeModal(false);
              setTransactionSubmitted(null);
              setErgopayUrl(null);
              setAddstakeFormErrors(initAddstakeFormErrors);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={checkSmall ? modalStyle : { ...modalStyle, width: '85vw' }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add tokens to stake box
              </Typography>
              {ergopayUrl ? (
                <ErgopayModalBody ergopayUrl={ergopayUrl} address={addstakeModalData.address} pending={undefined} />
              ) : (
                <>
                  <Typography variant="body2" sx={{ fontSize: '1rem', mb: 2 }}>
                    You have {getTokenBalanceLoading ? '...loading...' : tokenBalance} {stakingConfig.title} tokens at this address. You
                    can add tokens to your existing stake box here.
                  </Typography>
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
                          id="tokenAmount"
                          label={`Enter the token amount you are staking`}
                          name="tokenAmount"
                          variant="filled"
                          sx={{ mb: 2 }}
                          onChange={handleAddstakeFormChange}
                          value={addstakeForm.tokenAmount}
                          error={addstakeFormErrors.tokenAmount}
                          helperText={
                            addstakeFormErrors.tokenAmount &&
                            'Enter a valid token amount'
                          }
                        />
                      </Grid>
                      <Grid item md={2} xs={3}>
                        <Button
                          onClick={() => {
                            handleAddstakeFormChange({
                              target: {
                                name: 'tokenAmount',
                                value: tokenBalance,
                              },
                            });
                          }}
                        >
                          Max Amount
                        </Button>
                      </Grid>
                    </Grid>
                    <FormHelperText>
                      {addstakeFormErrors.wallet
                        ? 'Please connect wallet to proceed'
                        : ''}
                    </FormHelperText>
                    <Grid container justifyContent="center">
                      {currentModalWalletType === 'nautilus' && (
                        <Grid item>
                          <Button
                            variant="contained"
                            disabled={
                              addstakeModalLoading ||
                              addstakeErgopayLoading ||
                              addstakeFormErrors.wallet
                              || tokenBalance === 0
                              || getTokenBalanceLoading
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
                            onClick={addStakeWithDappConnector}
                          >
                            Add stake with Nautilus
                            {(addstakeModalLoading || getTokenBalanceLoading) && (
                              <CircularProgress
                                sx={{ ml: 2, color: 'white' }}
                                size={'1.2rem'}
                              />
                            )}
                          </Button>
                        </Grid>
                      )}
                      {currentModalWalletType === 'mobile' && (
                        <Grid item>
                          <Button
                            variant="contained"
                            disabled={
                              addstakeModalLoading ||
                              addstakeErgopayLoading ||
                              addstakeFormErrors.wallet
                              || tokenBalance === 0
                              || getTokenBalanceLoading
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
                            onClick={addstakeErgopay}
                          >
                            Add stake with Mobile Wallet
                            {(addstakeErgopayLoading || getTokenBalanceLoading) && (
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
      ) : (
        <>
          {pageLoading ? (
            <Container sx={{ mb: '3rem' }}>
              <CircularProgress
                size={24}
                sx={{
                  position: 'relative',
                  left: '50%',
                  marginLeft: '-12px',
                  marginTop: '250px',
                  marginBottom: '100px',
                }}
              />
            </Container>
          ) : (
            <CenterTitle
              title="Oops..."
              subtitle="Looks like the page you are looking for doesn't exist."
              main={true}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProjectStaking;
