import React, { useEffect, useState, FC } from 'react'
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
  useTheme
} from '@mui/material';
import Link from '@components/Link';
import { signIn } from 'next-auth/react';
import { NonceResponse, Signature } from '@lib/types';
import { isErgoMainnetAddress } from '@utils/general';
import { useWallet } from '@utils/WalletContext';

interface IMobileLogin {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileLogin: FC<IMobileLogin> = ({ setModalOpen }) => {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = useState(false)
  const [address, setAddress] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [nonce, setNonce] = useState<NonceResponse | undefined>(undefined);
  const [signature, setSignature] = useState<Signature | undefined>(undefined)
  const [isSignatureProcessed, setIsSignatureProcessed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const { fetchSessionData, providerLoading, setProviderLoading } = useWallet()

  const loginMutation = trpc.auth.initiateLogin.useMutation();
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
      setProviderLoading(true)
      setLocalLoading(true)
      const response = await loginMutation.mutateAsync({ address });
      setVerificationId(response.verificationId);
      setNonce(response.nonce);
      setIsSignatureProcessed(false); // Reset the processed state
    } catch (error: any) {
      setLocalLoading(false)
      setIsSignatureProcessed(false);
      setErrorMessage(error.message)
      setAddress('')
      console.error("Error initiating login flow:", error);
    }
  };

  const authSignIn = async () => {
    // console.log(signature)
    const response = await signIn("credentials", {
      nonce: nonce?.nonce,
      userId: nonce?.userId,
      signature: JSON.stringify(signature),
      wallet: JSON.stringify({
        type: 'mobile',
        defaultAddress: address,
        usedAddresses: [],
        unusedAddresses: []
      }),
      redirect: false
    });
    if (!response?.status || response.status !== 200) {
      console.log('error logging in');
    }
    // console.log(response);
    await fetchSessionData()
    setProviderLoading(false)
    setModalOpen(false)
    setLocalLoading(false)
  }

  useEffect(() => {
    if (!isSignatureProcessed && signature && nonce) {
      // console.log('proof received');
      authSignIn();
      setIsSignatureProcessed(true); // Mark the signature as processed
    }
  }, [signature]);

  const authUrl = new URL(process.env.AUTH_DOMAIN || 'https://ergopad.io');
  const ergoAuthDomain = `ergoauth://${authUrl.host}`;

  return (
    <Box>
      <Collapse in={!isSignatureProcessed}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 1, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                setErrorMessage(undefined)
              }}
              placeholder="Enter your wallet address"
              variant="filled"
              fullWidth
              sx={{
                '& input': {
                  paddingTop: '7px',
                  paddingBottom: '7px',
                },
                '& .MuiInputBase-root': {
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  },
                  '&:before': {
                    display: 'none',
                  },
                  '&:after': {
                    display: 'none',
                  },
                }
              }}
            />
          </Box>

          <Box>
            <Button
              variant="contained"
              onClick={initiateLoginFlow}
              disabled={localLoading || !isErgoMainnetAddress(address)}
            >
              {!localLoading
                ? 'Submit'
                : <CircularProgress size={18} />
              }
            </Button>
          </Box>

        </Box>
        {errorMessage && (
          <Typography color="error">
            {errorMessage}
          </Typography>
        )}
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
            Scan the QR code or click <Link href={`${ergoAuthDomain}/api/mobile-auth/ergo-auth-request?verificationId=${verificationId}&address=${address}`}>this link</Link> to sign in.
          </Typography>
          <Box sx={{ display: 'inline-block', p: 4, background: '#fff', borderRadius: '12px' }}>
            <QRCode value={`${ergoAuthDomain}/api/mobile-auth/ergo-auth-request?verificationId=${verificationId}&address=${address}`} />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default MobileLogin;