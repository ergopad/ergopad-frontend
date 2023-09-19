import React, { useEffect, useState, FC } from 'react'
import { z } from 'zod';
import { trpc } from "@utils/trpc";
import QRCode from 'react-qr-code';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Input,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import Link from '@components/Link';
import { signIn } from 'next-auth/react';
import { Expanded } from './SignIn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useWallet } from '@utils/WalletContext';
import AddMobileOpen from './AddMobileOpen';
import { AddWalletExpanded } from './AddWalletModal';

interface IMobileLogin {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  expanded: AddWalletExpanded;
  setExpanded: React.Dispatch<React.SetStateAction<AddWalletExpanded>>;
}

const MobileLogin: FC<IMobileLogin> = ({ setModalOpen, expanded, setExpanded }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [localLoading, setLocalLoading] = useState(false)

  return (
    <Collapse in={expanded !== 'nautilus'}>
      <Button
        fullWidth
        // disabled={walletAddress != ""}
        sx={{
          borderRadius: "6px",
          p: "0.5rem",
          justifyContent: "space-between",
          mb: "12px",
          display: "flex",
          minWidth: fullScreen ? "90vw" : "500px",
        }}
        onClick={
          () => {
            if (expanded === 'mobile') {
              setExpanded(undefined)
              setLocalLoading(false)
            }
            else {
              setExpanded('mobile')
            }
          }
        }
      >
        <Box
          sx={{
            fontSize: "1.2rem",
            color: "text.primary",
            fontWeight: "400",
            textAlign: "left",
            display: "flex",
          }}
        >
          <Avatar
            src=""
            // variant="circular"
            sx={{
              height: "3rem",
              width: "3rem",
              mr: "1rem",
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: "400",
              }}
            >
              Terminus/Mobile wallet
            </Typography>
            <Typography
              sx={{
                fontSize: ".9rem",
                color: "text.secondary",
                fontWeight: "400",
              }}
            >
              Enter your wallet address then sign with the mobile app
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            transform:
              expanded === 'mobile'
                ? "rotate(0deg)"
                : "rotate(-90deg)",
            transition: "transform 100ms ease-in-out",
            textAlign: "right",
            lineHeight: "0",
            mr: "-0.5rem",
          }}
        >
          <ExpandMoreIcon />
        </Box>
      </Button>
      <Collapse in={expanded === 'mobile'} unmountOnExit mountOnEnter>
        <AddMobileOpen
          localLoading={localLoading}
          setLocalLoading={setLocalLoading}
          setModalOpen={setModalOpen}
          setExpanded={setExpanded}
        />
      </Collapse>
    </Collapse>
  );
}

export default MobileLogin