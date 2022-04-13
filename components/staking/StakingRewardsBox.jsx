import { Box, Button, CircularProgress, Typography } from '@mui/material';
import MuiNextLink from '@components/MuiNextLink'
// import theme from '@styles/theme';

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

const StakingRewardsBox = (props) => {
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
          <Typography>ErgoPad Staked</Typography>
          <Typography variant="h3" sx={{ mb: 0 }}>
            {props.loading ? (
              <CircularProgress sx={{ mt: 2, color: '#fff' }} />
            ) : props.totalStaked ? (
              props.totalStaked?.toLocaleString(navigator.language, { maximumFractionDigits: 2 })
            ) : (
              '-'
            )}
          </Typography>
          
          {/* <Typography>Rewards</Typography>
          <Typography variant="h3" sx={{ mb: 3 }}>
            -
          </Typography> */}
{/*           <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              sx={{
                color: '#fff',
                fontSize: '1rem',
                py: '0.6rem',
                px: '1.2rem',
                textTransform: 'none',
                background: theme.palette.secondary.main,
                '&:hover': {
                  background: theme.palette.secondary.hover,
                  boxShadow: 'none',
                },
                '&:active': {
                  background: theme.palette.secondary.active,
                },
              }}
              onClick={() => {
                props.setTabValue(1)
                const element = document.getElementById('withdraw');
                if (element && element.scrollIntoView) {
                  element.scrollIntoView();
                }
              }}
            >
              Unstake
            </Button>
          </Box> */}
        </Box>
        
      </Box>
      <Typography variant="p" sx={{ fontSize: '0.9rem', mb: 0, p: 2, pb: 0 }}>
              Note: This only display tokens in your primary connected address. To see all staked tokens across all connected addresses in this wallet, see <MuiNextLink href="/dashboard">Dashboard</MuiNextLink>. 
      </Typography>
    </>
  );
};

export default StakingRewardsBox;
