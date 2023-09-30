import React, { FC, useState, useEffect } from 'react'
import {
  Button,
  Icon,
  Box,
  Typography,
  CircularProgress,
  TextField,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import Section from '@components/layout/Section';
import { NextPage } from 'next';
import { trpc } from '@utils/trpc';
import Grid from '@mui/material/Unstable_Grid2'
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getShorterAddress } from '@utils/general';
import AddIcon from '@mui/icons-material/Add';
import AddWalletModal from '@components/user/AddWalletModal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useWallet } from '@utils/WalletContext';
import { Wallet } from 'next-auth';

const ConnectedWallets: NextPage = () => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const [defaultAddress, setDefaultAddress] = useState('');
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const removeWalletMutation = trpc.user.removeWallet.useMutation()
  const changeDefaultAddressMutation = trpc.user.changeDefaultAddress.useMutation()
  const changeLoginAddressMutation = trpc.user.changeLoginAddress.useMutation()
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [defaultAddressLoading, setDefaultAddressLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState<number | undefined>(undefined)
  const { sessionData, sessionStatus, fetchSessionData, providerLoading, setProviderLoading } = useWallet()
  const walletsQuery = trpc.user.getWallets.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  )

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

  useEffect(() => {
    console.log('fetch ' + sessionStatus)
    if (sessionStatus === 'authenticated') updateWallets()
  }, [sessionData, sessionStatus, fetchSessionData]);

  const handleChange = (event: SelectChangeEvent) => {
    setDefaultAddress(event.target.value);
  };

  const handleAddWalletModalClose = async () => {
    setLoading(true)
    const fetching = async () => {
      const fetch = await walletsQuery.refetch()
      if (!fetch.isLoading) {
        updateWallets()
        setLoading(false)
      }
    }
    fetching()
  }

  // should run if the user adds another address, but also on page load when 
  // nextauth verifies an authenticated session
  useEffect(() => {
    if (!addWalletModalOpen && sessionStatus === 'authenticated') {
      handleAddWalletModalClose()
    }
  }, [addWalletModalOpen, sessionStatus])

  const removeItem = async (id: number, i: number) => {
    try {
      setRemoveLoading(i);

      const removeWallet = await removeWalletMutation.mutateAsync({
        walletId: id
      });

      if (removeWallet.success) {
        const fetch = await walletsQuery.refetch();
        if (!fetch.isLoading) {
          setRemoveLoading(undefined);
        }
      } else {
        throw new Error("Failed to remove the wallet");
      }
    } catch (error) {
      console.error("Error removing wallet:", error);
      setRemoveLoading(undefined);
    }
  };

  const [loadingAddress, setLoadingAddress] = useState<string | null>(null);
  const handleDefaultAddressChange = async (walletId: number, address: string) => {
    setLoadingAddress(address);
    await changeDefaultAddress(walletId, address);
    await fetchSessionData()
    setLoadingAddress(null);
  }
  const changeDefaultAddress = async (id: number, address: string) => {
    const changeAddress = await changeDefaultAddressMutation.mutateAsync({
      walletId: id,
      newDefault: address
    })
    if (changeAddress.success) {
      const fetch = await walletsQuery.refetch()
      return fetch
    }
  }

  const [sortedWallets, setSortedWallets] = useState<Wallet[]>([])
  useEffect(() => {
    if (walletsQuery.data?.wallets && walletsQuery.data.wallets.length > 0) {
      const newSorted = walletsQuery.data?.wallets.sort((a, b) => {
        return a.id - b.id;
      });
      updateWallets()
      setSortedWallets(newSorted)
    }
  }, [walletsQuery.data?.wallets])

  return (
    <>
      <Section
        title="Connected Wallets"
        subtitle="Add or remove connected wallets and change your default address here."
        main={true}
        toggleOutside={true}
        extra={
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                Default account address:
              </Typography>
            </Box>
            <Box>
              <FormControl
                variant="filled"
                sx={{ m: 1, minWidth: 120, width: { xs: '100%', md: '600px' } }}
              >
                <Select
                  labelId="default-address-label"
                  id="default-address"
                  value={defaultAddress}
                  onChange={handleChange}
                  sx={{
                    '& .MuiSelect-select': {
                      py: '7px'
                    },
                    '& input': {
                      paddingTop: '7px',
                      paddingBottom: '7px',
                    },
                    '&::before': {
                      display: 'none',
                    },
                    '&::after': {
                      display: 'none',
                    },
                  }}
                >
                  {addressOptions.map((item, i) => {
                    return (
                      <MenuItem value={item} key={`address-option-${i}`}>{item}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => updateLoginAddress(defaultAddress)}
                disabled={defaultAddressLoading}
              >
                {defaultAddressLoading ? <CircularProgress size={24} /> : "Update"}
              </Button>
            </Box>
          </Box>

        }
      >
        {loading
          ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          )
          : sessionStatus !== 'authenticated'
            ? <Box sx={{ textAlign: 'center' }}>
              <Typography>
                Sign in to view connected wallets
              </Typography>
            </Box>
            : sortedWallets && (
              <Grid container alignItems="stretch" spacing={3}>
                {sortedWallets.map((wallet, i) => {
                  const addresses = [...wallet.usedAddresses, ...wallet.unusedAddresses]
                  return (
                    <Grid xs={12} sm={6} md={4} key={`wallet-${i}`}>
                      <Paper sx={{ p: 2, height: '100%', minHeight: '250px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h5" sx={{ mb: 0 }}>
                              {wallet.changeAddress === sessionData?.user?.address && 'Default '}
                              Wallet {i + 1}
                            </Typography>
                            <Typography variant="subtitle1">
                              {wallet.type && (wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1))}
                            </Typography>
                          </Box>
                          <Box sx={{ mr: -1 }}>
                            {removeLoading === i
                              ? <CircularProgress />
                              : wallet.changeAddress !== sessionData?.user?.address && (
                                <IconButton onClick={() => removeItem(wallet.id, i)}>
                                  <DeleteOutlineIcon />
                                </IconButton>
                              )}
                          </Box>
                        </Box>

                        <TextField
                          label="Default Wallet Address"
                          sx={{ width: "100%", mt: ".75rem" }}
                          value={wallet.changeAddress}
                          disabled
                          InputProps={{
                            startAdornment: wallet.changeAddress === sessionData?.user?.address && (
                              <InputAdornment position="start">
                                <CheckCircleIcon color="success" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: theme.palette.divider,
                            borderRadius: ".3rem",
                            mt: "1rem",
                            maxHeight: "12rem",
                            overflowY: "auto",
                          }}
                        >
                          {addresses.map((address: any, i: number) => {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  fontSize: "14px",
                                  pl: ".5rem",
                                  mt: ".5rem",
                                  pb: ".5rem",
                                  borderBottom:
                                    i === addresses.length - 1 ? 0 : "1px solid",
                                  borderColor: theme.palette.divider,
                                }}
                                key={`address-selector-${i}`}
                              >
                                {getShorterAddress(address, 9)}
                                <Button
                                  sx={{ ml: "auto", mr: ".5rem" }}
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  disabled={wallet.changeAddress === address || loadingAddress === address}
                                  onClick={() => handleDefaultAddressChange(wallet.id, address)}
                                >
                                  {wallet.changeAddress === address
                                    ? "Active"
                                    : loadingAddress === address ? <CircularProgress size={24} /> : "Select"}
                                </Button>
                              </Box>
                            )
                          })}
                        </Box>
                      </Paper>
                    </Grid>
                  )
                })}
                <Grid xs={12} sm={6} md={4}>
                  <Button variant="outlined" fullWidth sx={{ height: '100%', minHeight: '250px' }} onClick={() => setAddWalletModalOpen(true)}>
                    <AddIcon sx={{ fontSize: '72px' }} />
                  </Button>
                </Grid>
              </Grid>
            )
        }

      </Section >
      <AddWalletModal
        open={addWalletModalOpen}
        setModalOpen={setAddWalletModalOpen}
        setLoading={setLoading}
      />
    </>
  );
};

export default ConnectedWallets;