import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Dialog,
  TextField,
  Collapse,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PaginatedTable from "@components/PaginatedTable";
import { useWallet } from "@contexts/WalletContext";
import { useAddWallet } from "@contexts/AddWalletContext";
import { Address } from "@utils/Address";
import theme from "@styles/theme";

const WALLET_ADDRESS = "wallet_address_7621";
const WALLET_ADDRESS_LIST = "wallet_address_list_1283";
const DAPP_CONNECTED = "dapp_connected_6329";
const DAPP_NAME = "dapp_name_8930";

/**
 * Note on es-lint disable lines:
 *
 * Ergo dApp injector uses global variables injected from the browser,
 * es-lint will complain if we reference un defined varaibles.
 *
 * Injected variables:
 * - ergo
 * - window.ergo_check_read_access
 * - window.ergo_request_read_access
 * - window.ergoConnector
 */
export const AddWallet = () => {
  const router = useRouter();
  const [walletInput, setWalletInput] = useState("");
  const { addWalletOpen, setAddWalletOpen } = useAddWallet();
  const { wallet, setWallet, dAppWallet, setDAppWallet } = useWallet();
  const [init, setInit] = useState(false);
  const [mobileAdd, setMobileAdd] = useState(false);

  /**
   * dapp state
   *
   * loading: yoroi is slow so need to show a loader for yoroi
   * dAppConnected: true if permission granted (persisted in local storage)
   * dAppError: show error message
   * dAppAddressTableData: list available addresses from wallet
   */
  const [loading, setLoading] = useState(false);
  const [dAppError, setDAppError] = useState(false);
  const [dAppAddressTableData, setdAppAddressTableData] = useState([]); // table data

  useEffect(() => {
    // load primary address
    if (localStorage.getItem(WALLET_ADDRESS)) {
      setWallet(localStorage.getItem(WALLET_ADDRESS));
      setWalletInput(localStorage.getItem(WALLET_ADDRESS));
    }
    // load dApp state
    if (
      localStorage.getItem(DAPP_CONNECTED) &&
      localStorage.getItem(DAPP_NAME) &&
      localStorage.getItem(WALLET_ADDRESS_LIST)
    ) {
      setDAppWallet({
        connected:
          localStorage.getItem(DAPP_CONNECTED) === "true" ? true : false,
        name: localStorage.getItem(DAPP_NAME),
        addresses: JSON.parse(localStorage.getItem(WALLET_ADDRESS_LIST)),
      });
    }
    // refresh connection
    try {
      if (localStorage.getItem(DAPP_CONNECTED) === "true") {
        window.ergoConnector[localStorage.getItem(DAPP_NAME)]
          .isConnected()
          .then((res) => {
            if (!res)
              window.ergoConnector[localStorage.getItem(DAPP_NAME)]
                .connect()
                .then((res) => {
                  if (!res) clearWallet();
                });
          });
      }
    } catch (e) {
      console.log(e);
    }
    setInit(true);
  }, []); // eslint-disable-line

  /**
   * update persist storage
   */
  useEffect(() => {
    if (init) {
      localStorage.setItem(DAPP_CONNECTED, dAppWallet.connected);
      localStorage.setItem(DAPP_NAME, dAppWallet.name);
      localStorage.setItem(
        WALLET_ADDRESS_LIST,
        JSON.stringify(dAppWallet.addresses)
      );
    }
  }, [dAppWallet, init]);

  useEffect(() => {
    if (init) localStorage.setItem(WALLET_ADDRESS, wallet);
  }, [wallet, init]);

  const handleClose = () => {
    // reset unsaved changes
    setAddWalletOpen(false);
    setWalletInput(wallet);
    setDAppError(false);
  };

  const handleSubmitWallet = () => {
    // add read only wallet
    setAddWalletOpen(false);
    setWallet(walletInput);
    // clear dApp state
    setDAppError(false);
    setDAppWallet({
      connected: false,
      name: "",
      addresses: [],
    });
  };

  const clearWallet = (hardRefresh = false) => {
    // clear state and local storage
    setWalletInput("");
    setWallet("");
    // clear dApp state
    setDAppError(false);
    setDAppWallet({
      connected: false,
      name: "",
      addresses: [],
    });
    if (hardRefresh) router.reload();
  };

  const handleWalletFormChange = (e) => {
    setWalletInput(e.target.value);
  };

  /**
   * dapp connector
   */
  const dAppConnect = async (wallet) => {
    const walletMapper = {
      nautilus: window.ergoConnector?.nautilus,
      safew: window.ergoConnector?.safew,
    };
    setLoading(true);
    try {
      if (await walletMapper[wallet].isConnected()) {
        await dAppLoad(wallet);
        setLoading(false);
        return;
      } else if (await walletMapper[wallet].connect()) {
        await dAppLoad(wallet);
        setLoading(false);
        return;
      }
      setDAppError(true);
    } catch (e) {
      setDAppError(true);
      console.log(e);
    }
    setLoading(false);
  };

  const dAppLoad = async (wallet) => {
    try {
      const address_used = await ergo.get_used_addresses(); // eslint-disable-line
      const address_unused = await ergo.get_unused_addresses(); // eslint-disable-line
      const addresses = [...address_used, ...address_unused];
      // use the first used address if available or the first unused one if not as default
      const address = addresses.length ? addresses[0] : "";
      setWallet(address);
      setWalletInput(address);
      // update dApp state
      setDAppWallet({
        connected: true,
        name: wallet,
        addresses: addresses,
      });
      setDAppError(false);
    } catch (e) {
      console.log(e);
      // update dApp state
      setDAppWallet({
        connected: false,
        name: "",
        addresses: [],
      });
      setDAppError(true);
    }
  };

  const changeWalletAddress = (address) => {
    setWallet(address);
    setWalletInput(address);
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const address_used = await ergo.get_used_addresses(); // eslint-disable-line
      const address_unused = await ergo.get_unused_addresses(); // eslint-disable-line
      const addresses = [...address_used, ...address_unused];
      const addressData = addresses.map((address, index) => {
        return { id: index, name: address };
      });
      setDAppWallet({
        ...dAppWallet,
        addresses: addresses,
      });
      setdAppAddressTableData(addressData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={addWalletOpen} onClose={handleClose}>
        <DialogTitle
          sx={{
            textAlign: "center",
            mb: 0,
            pb: 0,
            fontWeight: "800",
            fontSize: "32px",
          }}
        >
          {dAppWallet.connected ? "DApp Connected" : "Connect Wallet"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", mb: "24px" }}>
            Your wallet info will never be stored on our server.
          </DialogContentText>
          {!dAppWallet.connected && (
            <Grid container spacing={2} sx={{ py: 2 }}>
              <Grid item xs={4}>
                <Button
                  // disabled={loading || wallet}
                  onClick={() => dAppConnect("nautilus")}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: "#4BD0C9",
                      boxShadow: "none",
                    },
                    "&:active": {
                      backgroundColor: "rgba(49, 151, 149, 0.25)",
                    },
                    width: "100%",
                  }}
                >
                  Nautilus
                  {loading && (
                    <CircularProgress
                      sx={{ ml: 2, color: "white" }}
                      size={"1.2rem"}
                    />
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  // disabled={loading || wallet}
                  onClick={() => dAppConnect("safew")}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: "#B886F9",
                      boxShadow: "none",
                    },
                    "&:active": {
                      backgroundColor: "rgba(128, 90, 213, 0.25)",
                    },
                    width: "100%",
                  }}
                >
                  SafeW
                  {loading && (
                    <CircularProgress
                      sx={{ ml: 2, color: "white" }}
                      size={"1.2rem"}
                    />
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={() => setMobileAdd(!mobileAdd)}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    backgroundColor: theme.palette.tertiary.main,
                    "&:hover": {
                      backgroundColor: "#8096F7",
                      boxShadow: "none",
                    },
                    "&:active": {
                      backgroundColor: "rgba(90, 103, 216, 0.25)",
                    },
                    width: "100%",
                  }}
                >
                  Mobile
                </Button>
              </Grid>
            </Grid>
          )}
          <FormHelperText error={true}>
            {dAppError
              ? "Failed to connect to wallet. Please retry after refreshing page."
              : ""}
          </FormHelperText>
          {dAppWallet.connected && (
            <Accordion sx={{ mt: 1 }}>
              <AccordionSummary onClick={loadAddresses}>
                <strong>Change Address</strong>
              </AccordionSummary>
              <AccordionDetails>
                <PaginatedTable
                  rows={dAppAddressTableData}
                  onClick={(index) =>
                    changeWalletAddress(dAppAddressTableData[index].name)
                  }
                />
              </AccordionDetails>
            </Accordion>
          )}
          <Collapse in={mobileAdd || dAppWallet.connected}>
            <TextField
              disabled={dAppWallet.connected}
              autoFocus
              margin="dense"
              id="name"
              label="Wallet address"
              type="wallet"
              fullWidth
              variant="outlined"
              value={walletInput}
              onChange={handleWalletFormChange}
              error={!isAddressValid(walletInput)}
              sx={{
                "& .MuiOutlinedInput-input:-webkit-autofill": {
                  boxShadow: "0 0 0 100px rgba(35, 35, 39, 1) inset",
                },
              }}
            />
            <FormHelperText error={true}>
              {!isAddressValid(walletInput) ? "Invalid ergo address." : ""}
            </FormHelperText>
          </Collapse>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-around", pb: 2 }}>
          <Button sx={{ width: "150px" }} onClick={handleClose}>
            Close Window
          </Button>
          <Button
            sx={{ width: "150px" }}
            disabled={!wallet}
            onClick={() => clearWallet(true)}
          >
            Remove Wallet
          </Button>
          <Button
            sx={{ width: "150px" }}
            onClick={handleSubmitWallet}
            disabled={!isAddressValid(walletInput) || dAppWallet.connected}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function isAddressValid(address) {
  try {
    return new Address(address).isValid();
  } catch (_) {
    return false;
  }
}

export default AddWallet;
