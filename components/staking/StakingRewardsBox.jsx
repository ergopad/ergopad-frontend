import { Box, CircularProgress, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import theme from '@styles/theme';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const gridBox = {
  background: 'rgba(35, 35, 39, 0.7)',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  p: 4,
  color: '#fff',
  borderRadius: 2,
  border: 1,
  borderColor: 'rgba(46,46,51,1)',
  width: '100%',
  minWidth: '240px',
  maxWidth: '380px',
};

const StakingRewardsBox = ({
  loading,
  totalStaked,
  aggregateWallet,
  handleSwitchChange,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: '700' }}>
          Your Holdings
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={gridBox}>
          <Typography>Tokens Staked</Typography>
          <Typography variant="h3" sx={{ mb: 0 }}>
            {loading ? (
              <CircularProgress sx={{ mt: 2, color: '#fff' }} />
            ) : totalStaked ? (
              totalStaked?.toLocaleString(navigator.language, {
                maximumFractionDigits: 2,
              })
            ) : (
              '-'
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ color: theme.palette.text.secondary }}
        >
          <Typography sx={{ textAlign: 'right' }}>
            Sum all addresses in wallet
          </Typography>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{ disablePortal: true }}
              onClose={handleTooltipClose}
              open={tooltipOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="You can choose a main address when you connect a wallet. Toggle  to show the number of staked tokens in only the selected address, or to take the sum of all addresses in your connected wallet"
            >
              <IconButton aria-label="more info" onClick={handleTooltipOpen}>
                <InfoIcon
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
          <Switch
            disabled={loading}
            checked={aggregateWallet}
            onChange={(e) => handleSwitchChange(e.target.checked)}
          />
        </Stack>
      </Box>
    </>
  );
};

export default StakingRewardsBox;
