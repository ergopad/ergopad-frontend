import React, { useEffect, useState, FC } from 'react'
import { z } from 'zod';
import { trpc } from "@utils/trpc";
import QRCode from 'react-qr-code';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from '@components/Link';
import { useWallet } from '@utils/WalletContext';
import { AddWalletExpanded } from './AddWalletModal';

interface IMobileLogin {
  localLoading: boolean;
  setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setExpanded: React.Dispatch<React.SetStateAction<AddWalletExpanded>>;
}

const MobileLogin: FC<IMobileLogin> = ({ localLoading, setLocalLoading, setModalOpen, setExpanded }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [address, setAddress] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [signature, setSignature] = useState({
    signedMessage: '',
    proof: ''
  })
  const [isSignatureProcessed, setIsSignatureProcessed] = useState<boolean>(false);
  const { wallet, setWallet } = useWallet()
  const mutateAddAddress = trpc.user.addAddress.useMutation()
  const loginMutation = trpc.user.initAddWallet.useMutation();
  trpc.auth.checkLoginStatus.useQuery(
    // @ts-ignore
    { verificationId },
    {
      enabled: !!verificationId,
      refetchInterval: (data: { status: 'PENDING' | 'SIGNED'; signedMessage: string, proof: string } | undefined) => {
        // If the status is 'SIGNED', stop polling
        if (data?.status === 'SIGNED') {
          return false;
        }
        // Otherwise, continue polling every 2 seconds
        return 2000;
      },
      refetchIntervalInBackground: true,
      onSuccess: (data) => {
        if (data?.status === 'SIGNED') {
          console.log(data)
          setSignature({
            signedMessage: data.signedMessage,
            proof: data.proof
          });
        }
      }
    }
  );

  const initiateLoginFlow = async () => {
    try {
      setLocalLoading(true)
      const response = await loginMutation.mutateAsync({ address });
      console.log(response)
      setVerificationId(response.verificationId);
      setNonce(response.nonce);
      setIsSignatureProcessed(false); // Reset the processed state
    } catch (error) {
      console.error("Error initiating login flow:", error);
    }
  };

  const addAddress = async () => {
    // console.log(signature)
    if (signature && nonce) {
      const response = await mutateAddAddress.mutateAsync({
        nonce,
        address,
        signature: signature,
        wallet: {
          type: 'mobile',
          defaultAddress: address,
        }
      });
      if (response.defaultAddress) {
        console.log(response.defaultAddress)
        setWallet(response.defaultAddress)
        // setMessage(`Address ${address} successfully added`)
        setModalOpen(false)
        setExpanded(undefined)
        setLocalLoading(false)
      }
      else {
        setLocalLoading(false)
        console.error('Error: address not added')
      }
    }
  }

  useEffect(() => {
    if (!isSignatureProcessed && signature.signedMessage !== '' && signature.proof !== '') {
      // console.log('proof received');
      addAddress();
      setIsSignatureProcessed(true); // Mark the signature as processed
    }
  }, [signature]);

  const authUrl = new URL(process.env.AUTH_DOMAIN || 'https://ergopad.io');
  const ergoAuthDomain = `ergoauth://${authUrl.host}`;

  return (
    <Box>
      <Collapse in={!isSignatureProcessed}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 1 }}>
          <TextField
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your wallet address"
            variant="filled"
            sx={{
              flexGrow: 1,
              borderRadius: '6px',
              borderStyle: 'solid',
              borderWidth: '1px',
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
              borderColor: 'rgba(200, 225, 255, 0.2)',
              background: 'radial-gradient(at right top, rgba(16,20,34,0.4), rgba(1, 4, 10, 0.4))',
              boxShadow: `2px 2px 5px 3px rgba(0,0,0,0.1)`,
              '&:hover': {
                borderColor: theme.palette.primary.main
              }
            }}
          />
          <Button
            variant="contained"
            onClick={initiateLoginFlow}
            disabled={localLoading}
          >
            {!localLoading
              ? 'Submit'
              : <CircularProgress size={18} />
            }
          </Button>
        </Box>
      </Collapse>
      <Collapse in={isSignatureProcessed && localLoading}>
        <Box>
          <Typography sx={{ mb: 1, textAlign: 'center' }}>
            Verifying signature
          </Typography>
          <LinearProgress />
        </Box>
      </Collapse>
      <Collapse in={verificationId !== null && !isSignatureProcessed}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Typography sx={{ mb: 2 }}>
            Scan the QR code or click <Link href={`${ergoAuthDomain}/api/mobile-auth/add-wallet-request?verificationId=${verificationId}&address=${address}`}>this link</Link> to sign in.
          </Typography>
          <Box sx={{ display: 'inline-block', p: 4, background: '#fff', borderRadius: '12px' }}>
            <QRCode value={`${ergoAuthDomain}/api/mobile-auth/add-wallet-request?verificationId=${verificationId}&address=${address}`} />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default MobileLogin