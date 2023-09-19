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

const ConnectedWallets: NextPage = () => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const [defaultAddress, setDefaultAddress] = useState('');
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const walletsQuery = trpc.user.getWallets.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  )
  const removeWalletMutation = trpc.user.removeWallet.useMutation()
  const changeDefaultAddressMutation = trpc.user.changeDefaultAddress.useMutation()
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState<number | undefined>(undefined)
  const { sessionData, sessionStatus } = useWallet()

  useEffect(() => {
    const address = sessionData?.user?.address;

    if (sessionStatus === 'authenticated') walletsQuery.refetch()

    if (address) {
      setAddressOptions((prev) => {
        if (!prev.includes(address)) {
          setDefaultAddress(address);
          return [address, ...prev];
        }
        return prev;
      });
    }
  }, [sessionData]);

  const handleChange = (event: SelectChangeEvent) => {
    setDefaultAddress(event.target.value);
  };

  const handleAddWalletModalClose = async () => {
    setLoading(true)
    const fetching = async () => {
      const fetch = await walletsQuery.refetch()
      if (!fetch.isLoading) {
        setLoading(false)
      }
    }
    fetching()
  }

  useEffect(() => {
    if (!addWalletModalOpen) {
      handleAddWalletModalClose()
    }
  }, [addWalletModalOpen])

  const removeItem = async (id: number, i: number) => {
    setRemoveLoading(i)
    const removeWallet = await removeWalletMutation.mutateAsync({
      walletId: id
    })
    if (removeWallet.success) {
      const fetch = await walletsQuery.refetch()
      if (!fetch.isLoading) {
        setRemoveLoading(undefined)
      }
    }
    else setRemoveLoading(undefined)
  }


  const [loadingAddress, setLoadingAddress] = useState<string | null>(null);
  const handleDefaultAddressChange = async (walletId: number, address: string) => {
    setLoadingAddress(address);
    await changeDefaultAddress(walletId, address);
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

  return (
    <>
      <Section
        title="Connected Wallets"
        subtitle="Add or remove connected wallets and change your login address here."
        main={true}
        toggleOutside={true}
        extra={
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                Login address:
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
              <Button variant="contained">
                Update
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
          : walletsQuery.data?.wallets && (
            <Grid container alignItems="stretch" spacing={3}>
              {walletsQuery.data?.wallets.map((wallet, i) => {
                const addresses = [...wallet.usedAddresses, ...wallet.unusedAddresses]
                return (
                  <Grid xs={12} sm={6} md={4}>
                    <Paper key={`wallet-${i}`} sx={{ p: 2, height: '100%', minHeight: '250px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h5" sx={{ mb: 0 }}>
                            {wallet.changeAddress === sessionData?.user?.address && 'Login '}
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
                          startAdornment: (
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