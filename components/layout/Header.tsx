import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useScrollTrigger,
  Button,
  Typography,
  Dialog,
  DialogActions,
  useTheme,
  DialogTitle,
  DialogContent
} from '@mui/material';
import Link from 'next/link';
import Navbar from '@components/navigation/Navbar';
import { cloneElement, useState, useEffect } from 'react';
import { useWallet } from '@utils/WalletContext';
// import AddWallet from '@components/AddWallet';
import Image from 'next/legacy/image';
import NotificationBell from '@components/NotificationBell';
import UserMenu from '@components/user/UserMenu';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { useSession } from 'next-auth/react';

export const navLinks = [
  { title: `Whitepaper`, path: `/whitepaper` },
  { title: `Dashboard`, path: `/dashboard` },
  { title: `Projects`, path: `/projects` },
  { title: `Token`, path: `/token` },
  { title: `Staking`, path: `/staking` },
];

function ElevationScroll(props: any) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
    color: trigger ? 'background' : 'transparent',
  });
}

const Header = () => {
  const { wallet, setSessionData, setSessionStatus } = useWallet();
  const { data: sessionRealData, status: sessionRealStatus } = useSession();
  const theme = useTheme()
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    setSessionStatus(sessionRealStatus)
    if (sessionRealData) {
      setSessionData(sessionRealData)
    }
    else setSessionData(null)
  }, [sessionRealStatus])

  useEffect(() => {
    localStorage.getItem("dontShowAgain") === "true" && setModalOpen(false)
  }, []);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: 2,
    },
    '& .MuiDialogActions-root': {
      padding: 2,
    },
    '& .MuiPaper-root': {
      backgroundImage: 'url("/ido-modal/spf-background.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: 'center',
      backgroundPositionY: 'center',
    }
  }));

  function BootstrapDialogTitle(props: any) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* <AddWallet /> */}
      <ElevationScroll>
        <AppBar
          color="transparent"
          enableColorOnDark
          sx={{
            p: 0,
            display: 'flex',
            alignItems: 'center',
            // background: theme.palette.background.default
          }}
        >
          <Toolbar
            sx={{
              maxWidth: 'lg',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              // backgroundColor: theme.palette.background.default
            }}
          >
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Box sx={{ display: 'inline-flex' }}>
                <Link
                  href="/"
                  style={{ paddingRight: '2rem' }}
                >
                  <IconButton>
                    <Image
                      priority
                      src="/favicon-32x32.png"
                      alt="Ergopad Logo"
                      width="32"
                      height="32"
                    />
                    {/* <svg width="32px" height="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <linearGradient id="b" x2="32" y1="8" y2="8" gradientUnits="userSpaceOnUse">
                        <stop stopColor={theme.palette.primary.main} offset=".2813"/>
                        <stop stopColor={theme.palette.tertiary.main} offset="1"/>
                      </linearGradient>
                      <polygon points="27.3 4.7 16 0 4.7 4.7 0 16 7.8 16 10.2 10.2 16 7.8 21.8 10.2 24.2 16 32 16" fill="url(#b)"/>
                      <linearGradient id="a" x2="32" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor={theme.palette.primary.main} offset=".2864"/>
                        <stop stopColor={theme.palette.primary.main} stopOpacity="0" offset="1"/>
                      </linearGradient>
                      <polygon points="24.2 16 21.8 21.8 16 24.2 10.2 21.8 7.8 16 0 16 4.7 27.3 16 32 27.3 27.3 32 16" fill="url(#a)"/>
                    </svg> */}
                  </IconButton>
                </Link>
              </Box>
              <Box sx={{ display: 'inline-flex' }}>
                <Navbar navLinks={navLinks} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', px: 1 }}>
              <NotificationBell />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <UserMenu />
            </Box>
            {/* {isMobile && <SideDrawer navLinks={navLinks} />} */}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <BootstrapDialog
        onClose={handleModalClose}
        aria-labelledby="ido-modal"
        open={modalOpen}
      >
        <BootstrapDialogTitle id="ido-modal" onClose={handleModalClose}>
          IDO Announcement
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              mx: 'auto',
              maxWidth: '353px',
              mt: '-80px'
            }}
          >
            <Image src="/ido-modal/spf-coin.png" width={353} height={354} alt="SPF Token" />
          </Box>
          <Box
            sx={{
              mx: 'auto',
              maxWidth: '594px',
              px: '36px',
              mt: '-60px',
            }}
          >
            <Image
              src="/ido-modal/spf-ido-title.png"
              width={594}
              height={123}
              alt="Spectrum Finance IDO: Powered by ErgoPad"

            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', justifyContent: "center" }}>
          <Button
            autoFocus
            variant="contained"
            href="https://ido.spectrum.fi"
            target="_blank"
            sx={{ my: '12px' }}
            size="large"
            color="secondary"
          >
            Learn More
          </Button>
          <Button
            size="small"
            color="secondary"
            sx={{
              ml: '0 !important',
              mb: '12px'
            }}
            onClick={() => {
              localStorage.setItem("dontShowAgain", "true");
              handleModalClose()
            }}
          >
            Don't show again
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default Header;