import React, { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Button,
  IconButton,
  Alert,
  Switch,
  Box,
  Typography,
  Collapse,
  Slide,
  Grow,
  ButtonGroup,
  Paper,
  Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAlert } from '@contexts/AlertContext';
import { useWallet } from '@contexts/WalletContext';
import { trpc } from '@utils/trpc';
import { flexColumn, flexRow } from '@lib/utils/flex';
import ProcessPayment from '@components/payments/ProcessPayment';
import { LoadingButton } from '@mui/lab';
import ChangeDefaultAddress from '@components/user/ChangeDefaultAddress';
import { allowedTokens } from '@lib/configs/paymentTokens';

interface IPayContributionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recipientAddress: string;
  paymentAmount: string
  paymentCurrency?: string
  receiveAmount: string
  receiveCurrency: string
  contributionRoundId: string;
  contributionRoundName: string;
  projectName: string;
}

const PayContributionDialog: FC<IPayContributionDialogProps> = ({
  open,
  setOpen,
  contributionRoundId,
  contributionRoundName,
  projectName,
  recipientAddress,
  paymentAmount,
  paymentCurrency = 'ERG',
  receiveAmount,
  receiveCurrency,
}) => {
  const theme = useTheme();
  const { addAlert } = useAlert()
  const { sessionStatus } = useWallet()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [prepaidToggle, setprepaidToggle] = useState(false)
  const [showComponent, setShowComponent] = useState(true);
  const walletList = trpc.user.getWallets.useQuery()
  const [walletsList, setWalletsList] = useState<WalletListItem[]>([])
  const [buttonChoice, setButtonChoice] = useState('erg')
  const [priceInCurrency, setPriceInCurrency] = useState<string>('')

  // Toggle between prepaid buttons and pay with mobile/nautilus buttons
  // Two step process, allowing time for the animation to end so the buttons don't exist when the new one mounts
  const handleToggle = () => {
    // Start by hiding the current component, 
    setShowComponent(false);
  };
  const handleExited = () => {
    // Once the current component has fully exited, switch the toggle and show the next component
    setprepaidToggle(!prepaidToggle);
    setShowComponent(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [tokenDetails, setTokenDetails] = useState<AllowedToken>()

  const initPayment = trpc.contributions.createTransaction.useMutation()
  const handleSubmitTx = async (txId: string, senderAddress: string) => {
    // Convert the amount back to a human-readable format
    const readableAmount = order[0].amount / Math.pow(10, tokenDetails!.decimals);

    const init = await initPayment.mutateAsync({
      description: `Contribution to ${projectName} ${contributionRoundName}`,
      amount: readableAmount.toString(),  // Use the readable amount here
      currency: order[0].tokenId,
      address: senderAddress,
      txId,
      contributionId: contributionRoundId,
    });

    if (init) {
      addAlert("success", "Payment complete");
    }
  };

  const getTokenDetailsFromName = (name: string | null) => {
    return allowedTokens.filter(
      (token) => token.name.toLowerCase() === name)[0];
  };
  const [order, setOrder] = useState<TransferAmount[]>([])
  const [paymentWalletType, setPaymentWalletType] = useState<'nautilus' | 'mobile' | undefined>(undefined)

  const generateOrder = (walletType: 'nautilus' | 'mobile') => {
    if (tokenDetails) {
      setPaymentWalletType(walletType)
      const numberTokens = Math.floor(Number(paymentAmount) * Math.pow(10, tokenDetails.decimals))
      setOrder([{
        tokenId: tokenDetails.id,
        amount: numberTokens
      }])
    }
  }

  const [priceLoading, setPriceLoading] = useState(false)
  useEffect(() => {
    setPriceLoading(true)
    const newTokenDetails = getTokenDetailsFromName(buttonChoice)
    setTokenDetails(newTokenDetails)
  }, [buttonChoice])

  // useEffect(() => {
  //   if (buttonChoice === 'prepaid') {
  //     setPriceInCurrency('Free')
  //     setPriceLoading(false)
  //   }
  //   else if (prices.discountedPrice && tokenInfo.data && tokenInfo.data.priceInUsd) {
  //     const amount = (prices.discountedPrice / tokenInfo.data.priceInUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })
  //     setPriceInCurrency(`${amount} ${buttonChoices.find(item => item.slug === buttonChoice)?.name}`)
  //     setPriceLoading(false)
  //   }
  // }, [JSON.stringify(tokenInfo.data), buttonChoice])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      PaperProps={{
        variant: 'outlined',
        elevation: 0
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "32px",
        }}
      >
        Complete Contribution
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Collapse in={!paymentWalletType}>
        <DialogContent sx={{ minWidth: '350px', maxWidth: !fullScreen ? '460px' : null }}>
          <Typography sx={{ mb: 2 }}>
            You are contributing funds to the {projectName} {contributionRoundName}. If the sale is oversold, you will receive a refund in {paymentCurrency} for a portion of your contribution.
          </Typography>
          {/* <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography sx={{ mb: 2 }}>
              Pay with connected wallet:
            </Typography>
            <ChangeDefaultAddress title="Address to pay from" />
          </Paper> */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ ...flexColumn, alignItems: 'center', gap: 1 }}>
              <Typography>
                Total payment: {`${paymentAmount} ${paymentCurrency}`}
              </Typography>
              <Typography>
                Total tokens expected: {`${receiveAmount} ${receiveCurrency}`}
              </Typography>
              {/* {priceLoading
                ? <Skeleton variant="text" sx={{ fontSize: '16px', width: '100px', textAlign: 'center' }} />
                : <Typography>
                  {priceInCurrency}
                </Typography>
              } */}
            </Box>
          </Paper>
          <Typography sx={{ mb: 2 }}>
            The tokens and any refund will be distributed via airdrop when the sale concludes, moments after the LP goes live.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'flex-end', p: 1 }}>
          <Box sx={{ width: '100%' }}>
            <Grow in={!prepaidToggle && showComponent} timeout={{ exit: 50, enter: 200 }} onExited={handleExited} mountOnEnter unmountOnExit>
              <Box sx={{ ...flexRow, justifyContent: 'center' }}>
                <LoadingButton variant="contained" onClick={() => generateOrder('mobile')}
                // loading={!tokenInfo.data?.priceInUsd}
                >
                  Pay with mobile
                </LoadingButton>
                <LoadingButton variant="contained" onClick={() => generateOrder('nautilus')}
                // loading={!tokenInfo.data?.priceInUsd}
                >
                  Pay with Nautilus
                </LoadingButton>
              </Box>
            </Grow>
          </Box>
        </DialogActions>
      </Collapse>
      <Collapse in={!!paymentWalletType} mountOnEnter unmountOnExit>
        <DialogContent sx={{ minWidth: '350px', maxWidth: !fullScreen ? '460px' : null }}>
          <ProcessPayment
            payment={order}
            paymentWalletType={paymentWalletType!}
            onTransactionSuccess={handleSubmitTx}
            recipientAddress={recipientAddress}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'flex-end', p: 1 }}>
          <Button onClick={() => setPaymentWalletType(undefined)}>
            Go back
          </Button>
          <Button onClick={() => {
            setPaymentWalletType(undefined)
            setOpen(false)
          }}>
            Close
          </Button>
        </DialogActions>
      </Collapse>
    </Dialog>
  );
};

export default PayContributionDialog;