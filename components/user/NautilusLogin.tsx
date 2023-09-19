import React, { useEffect, useState, FC } from 'react'
import {
  Box,
  LinearProgress,
  Typography,
  useTheme
} from '@mui/material';
import SignIn, { Expanded } from '@components/user/SignIn';
import { trpc } from "@utils/trpc";
import { signIn, signOut } from "next-auth/react"
import nautilusIcon from "@public/icons/nautilus.png";
import { useWallet } from '@utils/WalletContext';

interface INautilusLogin {
  expanded: Expanded
  setExpanded: React.Dispatch<React.SetStateAction<Expanded>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  localLoading: boolean;
  setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dappConnected: boolean;
  setDappConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NautilusLogin: FC<INautilusLogin> = ({ setExpanded, setLoading, localLoading, setLocalLoading, setModalOpen, dappConnected, setDappConnected }) => {
  const theme = useTheme()
  const [defaultAddress, setDefaultAddress] = useState<string | undefined>(undefined);
  const [usedAddresses, setUsedAddresses] = useState<string[]>([])
  const [unusedAddresses, setUnusedAddresses] = useState<string[]>([])
  const getNonce = trpc.user.getNonce.useQuery({ userAddress: defaultAddress }, { enabled: false, retry: false });
  const [newNonce, setNewNonce] = useState<string | undefined>(undefined)
  const { wallet, setWallet, setDAppWallet, sessionData, sessionStatus } = useWallet()

  useEffect(() => {
    if (defaultAddress && dappConnected && sessionStatus === 'unauthenticated') {
      refetchData()
    }
    else if (dappConnected && !defaultAddress) getAddress()
  }, [defaultAddress, dappConnected, sessionStatus]);

  const getAddress = async () => {
    try {
      // @ts-ignore
      const changeAddress = await ergo.get_change_address();
      if (changeAddress) {
        setDefaultAddress(changeAddress);
      }
      // @ts-ignore
      const fetchUsedAddresses = await ergo.get_used_addresses();
      // @ts-ignore
      const fetchUnusedAddresses = await ergo.get_unused_addresses();
      setUsedAddresses(fetchUsedAddresses)
      setUnusedAddresses(fetchUnusedAddresses)
      setDAppWallet({
        connected: true,
        name: 'nautilus',
        addresses: [changeAddress, ...fetchUsedAddresses, ...fetchUnusedAddresses]
      })
    } catch {
      setLocalLoading(false)
      console.error('Error fetching wallet address')
    }
  }

  // get the new nonce
  const refetchData = () => {
    getNonce.refetch()
      .then((response: any) => {
        console.log('set new nonce')
      })
      .catch((error: any) => {
        console.error(error);
        setLocalLoading(false)
      });
  }

  useEffect(() => {
    if (getNonce?.data?.nonce !== null && getNonce?.data?.nonce !== undefined && sessionStatus === 'unauthenticated') {
      setNewNonce(getNonce.data.nonce)
    }
  }, [getNonce.data, sessionStatus])

  useEffect(() => {
    if (newNonce && defaultAddress) {
      // console.log('verifying ownership with nonce: ' + newNonce)
      if (sessionStatus === 'unauthenticated') {
        verifyOwnership(newNonce, defaultAddress)
      }
    }
  }, [newNonce, sessionStatus])

  const verifyOwnership = async (nonce: string, address: string) => {
    try {
      setLoading(true);
      // console.log('nonce: ' + nonce);
      // console.log('address: ' + address);
      // @ts-ignore
      const signature = await ergo.auth(address, nonce);
      // console.log(signature);
      if (signature) {
        const response = await signIn("credentials", {
          nonce,
          defaultAddress: defaultAddress,
          signature: JSON.stringify(signature),
          wallet: JSON.stringify({
            type: 'nautilus',
            defaultAddress: defaultAddress,
            usedAddresses,
            unusedAddresses
          }),
          redirect: false
        });
        if (!response?.status || response.status !== 200) {
          setDefaultAddress(undefined);
          setDappConnected(false)
          window.ergoConnector.nautilus.disconnect();
        }
        console.log(response);
      }
    } catch (error) {
      console.log('disconnect');
      setDefaultAddress(undefined);
      setDappConnected(false)
      window.ergoConnector.nautilus.disconnect();
      console.error(error);
    } finally {
      setLoading(false);
      setLocalLoading(false)
      setExpanded(undefined)
      setModalOpen(false)
    }
  };

  return (
    <>
      {/* {props.dAppWallet.connected && isAddressValid(props.wallet) ? (
        <>
          <Typography sx={{ mb: "1rem", fontSize: ".9rem" }}>
            Select which address you want to use as as the default.
          </Typography>
          <TextField
            label="Default Wallet Address"
            fullWidth
            value={props.wallet}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.wallet !== "" && <CheckCircleIcon color="success" />}
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              // width: "100%",
              border: "1px solid",
              borderColor: theme.palette.background.default,
              borderRadius: ".3rem",
              mt: "1rem",
              maxHeight: "12rem",
              overflowY: "auto",
            }}
          >
            {props.dAppWallet.name !== undefined && props.dAppWallet.addresses.map((address: string, i: number) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: 'space-between',
                    alignItems: "center",
                    // width: "100%",
                    fontSize: ".7rem",
                    pl: ".5rem",
                    mt: ".5rem",
                    pb: ".5rem",
                    borderBottom: i === props.dAppWallet.addresses.length - 1 ? 0 : "1px solid",
                    borderBottomColor: theme.palette.background.default,
                  }}
                  key={i}
                >
                  <Box sx={{
                    maxWidth: '60vw',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {address}
                  </Box>
                  <Box>
                    <Button
                      sx={{ ml: "auto", mr: ".5rem" }}
                      variant="contained"
                      color={props.wallet === address ? "success" : "primary"}
                      size="small"
                      onClick={() => props.changeWallet(address)}
                    >
                      {props.wallet === address ? "Active" : "Choose"}
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </>
      ) : ( */}
      {/* <Button onClick={() => dappConnection()}>Start</Button> */}
      {localLoading &&
        <Box>
          <Typography sx={{ mb: 1, textAlign: 'center' }}>
            Please follow the prompts on Nautilus
          </Typography>
          <LinearProgress />
        </Box>
      }
      {/* )} */}
    </>
  );
}

export default NautilusLogin;