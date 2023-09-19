import { Grid, Typography, Button, Box } from '@mui/material';
import LowerGradients from '@components/stylistic/LowerGradients';
import TelegramIcon from '@mui/icons-material/Telegram';
import DiscordIcon from '@components/DiscordIcon';
import QqIcon from '@components/QqIcon';
import theme from '@styles/theme';
import Image from 'next/legacy/image';

const Hero = ({ title, subtitle }) => {
  return (
    <>
      <Box
        maxWidth="lg"
        sx={{
          position: 'relative',
          mx: 'auto',
          height: '0',
          pointerEvents: 'none',
          zIndex: '-100',
          overflow: 'visible',
        }}
        aria-hidden="true"
      >
        <LowerGradients />
      </Box>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item xs={12} md={5} sx={{ mt: { xs: 12, md: 6 } }}>
          <Typography variant="h1">{title}</Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
          <Typography variant="subtitle1">
            Join our communities:
          </Typography>

          <Box sx={{ my: '1rem' }}>
            <a href="http://t.me/ergopad_chat" target="_blank" rel="noreferrer">
              <Button
                startIcon={<TelegramIcon />}
                variant="contained"
                sx={{
                  color: '#fff',
                  fontSize: '1rem',
                  py: '0.6rem',
                  px: '1.2rem',
                  m: '0.7rem',
                  textTransform: 'none',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.hover,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: theme.palette.primary.active,
                  },
                }}
              >
                Telegram
              </Button>
            </a>
            <a
              href="https://discord.gg/E8cHp6ThuZ"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                startIcon={<DiscordIcon />}
                variant="contained"
                sx={{
                  color: '#fff',
                  fontSize: '1rem',
                  py: '0.6rem',
                  px: '1.2rem',
                  m: '0.7rem',
                  textTransform: 'none',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.hover,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: theme.palette.secondary.active,
                  },
                }}
              >
                Discord
              </Button>
            </a>
            <a
              href="https://t.me/+yN8QD_adXQ9mNTk1"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                startIcon={<TelegramIcon />}
                variant="contained"
                sx={{
                  color: '#fff',
                  fontSize: '1rem',
                  py: '0.6rem',
                  px: '1.2rem',
                  m: '0.7rem',
                  textTransform: 'none',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.hover,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: theme.palette.primary.active,
                  },
                }}
              >
                中文 Telegram
              </Button>
            </a>
          </Box>
        </Grid>
        <Grid item xs={12} md={7} sx={{ pb: { xs: 4, md: 16 } }}>
           <Image
            src="/ergo-illustration.png"
            alt="ErgoPad Illustration"
            layout="responsive"
            width="600"
            height="600"
            priority={true}
          /> 
        </Grid>
      </Grid>
    </>
  );
};

export default Hero;
