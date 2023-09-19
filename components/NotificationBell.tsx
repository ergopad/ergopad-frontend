import { ReactNode, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import ReplayIcon from '@mui/icons-material/Replay';
import PublicIcon from '@mui/icons-material/Public';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import { useWallet } from '@utils/WalletContext';
import axios from 'axios';

/**
 * When do we show the notifcation dot?
 *
 * Have a snapshot of notifications in localStorage.
 * Only call the api if a certain amount of time has elapsed. Ideally 5 mins for frontend.
 * Compare with api call data and check for new notifications.
 *
 */

// const notifications = [
//   {
//     id: '1',
//     txId: 'ac629767bb5230638ad84e27037b4307b082eb19ea3a55f0efc3cb9d505385b1',
//     status: 'confirmed',
//     text: 'Your transaction with id ac6297...b1 is confirmed on chain', // autogen
//     href: 'https://explorer.ergoplatform.com/en/transactions/ac629767bb5230638ad84e27037b4307b082eb19ea3a55f0efc3cb9d505385b1', // autogen
//   },
//   {
//     id: '2',
//     txId: 'd22c410d048178c2f7acee45b75fc56b3c22aeda2813c1bd0ff61cc75cae1e3e',
//     status: 'refund',
//     text: 'Your transaction with id d22c41...3e has failed and is refunded', // autogen
//     href: 'https://explorer.ergoplatform.com/en/transactions/d22c410d048178c2f7acee45b75fc56b3c22aeda2813c1bd0ff61cc75cae1e3e', // autogen
//   },
// ];

interface Notification {
  href: string | undefined;
  icon: 'confirmed' | 'submitted' | 'refund' | 'failed' | 'default';
  text: ReactNode;
  id: any;
  transactionStatus: any;
  additionalText: string | string[];
  transactionId: any;
}

const NOTIFICATION_STORAGE_KEY = 'notification_storage_758321';
const NOTIFICATION_BADGE_DOT = 'notification_badge_dot_217936';
const NOTIFICATION_TTL = 10 * 1000; // 10 sec

const iconMap = {
  confirmed: <DoneAllIcon />,
  submitted: <DoneIcon />,
  refund: <ReplayIcon />,
  failed: <PriorityHigh />,
  default: <PublicIcon />,
};

const NotificationBell = () => {
  // wallet addresses
  const { wallet, dAppWallet } = useWallet();
  const [lastState, setLastState] = useState<string[]>([]);
  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // notifications
  const [dot, setDot] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setDot(false);
    localStorage.setItem(NOTIFICATION_BADGE_DOT, 'false');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setDot(localStorage.getItem(NOTIFICATION_BADGE_DOT) === 'true');
  }, []);

  // useEffect(() => {
  //   const walletAddresses: string[] = [wallet, ...dAppWallet.addresses].filter(
  //     (x, i, a) => a.indexOf(x) == i && x
  //   );
  //   const updateNotifications = async () => {
  //     try {
  //       // bug fix: prevent extra api calls
  //       if (JSON.stringify(lastState) === JSON.stringify(walletAddresses)) {
  //         return;
  //       }
  //       setLastState(walletAddresses);
  //       // normal flow
  //       const res = await axios.post(
  //         `${process.env.API_URL}/notifications/getNotifications`,
  //         [...walletAddresses]
  //       );
  //       const nt = res.data.slice(0, 6).map((notification: Notification) => {
  //         return {
  //           id: notification.id,
  //           icon: notification.transactionStatus
  //             ? notification.additionalText.includes('Unfortunately') // handle refund
  //               ? 'refund'
  //               : notification.transactionStatus
  //             : 'default',
  //           href: notification.transactionId
  //             ? `https://explorer.ergoplatform.com/en/transactions/${notification.transactionId}`
  //             : null,
  //           text: notification.additionalText,
  //         };
  //       });
  //       setNotifications(nt);
  //       // previous state
  //       if (localStorage.getItem(NOTIFICATION_STORAGE_KEY)) {
  //         const notificationKey = localStorage.getItem(NOTIFICATION_STORAGE_KEY)!!
  //         const pnt = JSON.parse(notificationKey).notifications;
  //         const newNotification = !nt.every((notification: Notification) =>
  //           pnt.map((notification: Notification) => notification.id).includes(notification.id)
  //         );
  //         const oldDot =
  //           localStorage.getItem(NOTIFICATION_BADGE_DOT) === 'true';
  //         setDot(newNotification || oldDot);
  //         localStorage.setItem(
  //           NOTIFICATION_BADGE_DOT,
  //           newNotification || oldDot ? 'true' : 'false'
  //         );
  //       } else {
  //         if (nt.length) {
  //           setDot(true);
  //           localStorage.setItem(NOTIFICATION_BADGE_DOT, 'true');
  //         }
  //       }
  //       // set localStorage
  //       localStorage.setItem(
  //         NOTIFICATION_STORAGE_KEY,
  //         JSON.stringify({
  //           notifications: nt,
  //           expiry: Date.now() + NOTIFICATION_TTL,
  //           addresses: walletAddresses,
  //         })
  //       );
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   // if (wallet && walletAddresses && walletAddresses.length) {
  //   //   if (localStorage.getItem(NOTIFICATION_STORAGE_KEY)) {
  //   //     const nt = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY));
  //   //     if (
  //   //       nt.expiry < Date.now() ||
  //   //       JSON.stringify(nt.addresses) !== JSON.stringify(walletAddresses)
  //   //     ) {
  //   //       updateNotifications();
  //   //     } else {
  //   //       setNotifications(nt.notifications);
  //   //     }
  //   //   } else {
  //   //     updateNotifications();
  //   //   }
  //   // } else {
  //   //   setDot(false);
  //   //   localStorage.setItem(NOTIFICATION_BADGE_DOT, 'false');
  //   //   setNotifications([]);
  //   // }
  // }, [wallet, dAppWallet.addresses]); // eslint-disable-line

  return (
    <>
      <IconButton
        id="icon-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge color="primary" variant={dot ? 'dot' : undefined}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {notifications.length ? (
          notifications.map((notification: Notification) => (
            <MenuItem
              component={Link}
              key={notification.id}
              onClick={handleClose}
              sx={{
                borderRadius: '5px',
                m: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                width: '320px',
                whiteSpace: 'normal',
              }}
              href={notification.href}
              rel="noreferrer"
              target="_blank"
            >
              <ListItemIcon>{iconMap[notification.icon]}</ListItemIcon>
              <ListItemText>{notification.text}</ListItemText>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ m: 1, px: 2 }}>
            <Typography variant="body2" sx={{ m: 0, fontSize: '1rem' }}>
              No new notifications
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
