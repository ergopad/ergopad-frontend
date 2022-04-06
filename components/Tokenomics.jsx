import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const tokenSections = [
    {
        name: 'Seed Round',
        percent: 50
    },
    {
        name: 'Staker Round',
        percent: 30
    },
    {
        name: 'Liquidity',
        percent: 20
    },
]

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

const Distribution = () => {

  return (
        <Box width="90%" sx={{ mx: 'auto' }}>
            {tokenSections.map(({ name, percent }, i) => (
                <>
                <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography color="text.secondary" sx={{ fontWeight: '500' }}>
                        {name}
                    </Typography>
                    <LinearProgressWithLabel value={percent} />
                </Box>
                </>
            ))}
        </Box>
  );
};

export default Distribution;
