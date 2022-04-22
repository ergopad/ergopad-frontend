import { useRouter } from 'next/router';
import { useMediaQuery, Container, Box } from '@mui/material';
import { useTheme } from '@mui/system';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import BottomNav from '@components/navigation/BottomNav';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          alignContent: 'space-between',
          flexDirection: 'column',
          pt: theme.spacing(8),
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowX: router.pathname === '/' ? 'hidden' : 'visible',
          }}
        >
          {children}
        </Box>
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            pb: { xs: theme.spacing(12), md: theme.spacing(1) },
          }}
        >
          <Footer />
        </Container>
      </Box>
      {isMobile && <BottomNav />}
    </>
  );
};

export default Layout;
