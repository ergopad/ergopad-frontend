import { useState } from 'react';
import {
  Badge,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * When do we show the notifcation dot?
 * 
 * Have a snapshot of notifications in localStorage.
 * Only call the api if a certain amount of time has elapsed. Ideally 5 mins for frontend.
 * Compare with api call data and check for new notifications.
 *  
*/

const notifications = [
  {
    id: '1',
    txId: 'ac629767bb5230638ad84e27037b4307b082eb19ea3a55f0efc3cb9d505385b1',
    status: 'confirmed',
    text: 'Your transaction with id ac6297...b1 is confirmed on chain', // autogen
    href: 'https://explorer.ergoplatform.com/en/transactions/ac629767bb5230638ad84e27037b4307b082eb19ea3a55f0efc3cb9d505385b1', // autogen
  },
  {
    id: '1',
    txId: 'd22c410d048178c2f7acee45b75fc56b3c22aeda2813c1bd0ff61cc75cae1e3e',
    status: 'refund',
    text: 'Your transaction with id d22c41...3e has failed and is refunded', // autogen
    href: 'https://explorer.ergoplatform.com/en/transactions/d22c410d048178c2f7acee45b75fc56b3c22aeda2813c1bd0ff61cc75cae1e3e', // autogen
  },
];

const iconMap = {
  confirmed: <DoneAllIcon />,
  refund: <ReplayIcon />,
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="icon-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge color="primary" variant="dot">
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
        {notifications.map((notification) => (
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
            <ListItemIcon>{iconMap[notification.status]}</ListItemIcon>
            <ListItemText>{notification.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
