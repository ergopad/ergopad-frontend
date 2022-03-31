import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import MuiNextLink from '@components/MuiNextLink';
import QRCode from 'react-qr-code';

const ErgopayModalBody = ({ ergopayUrl, pending }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 1,
        mt: 3,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '768px',
        }}
      >
        {pending ? (
          <>
            <CircularProgress sx={{ mt: 3, mb: 3 }} />
            <Typography variant="h4">Generating Transaction</Typography>
          </>
        ) : (
          <>
            <Card
              sx={{
                background: '#fff',
                width: '320px',
                margin: 'auto',
                py: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <QRCode value={ergopayUrl} />
              </CardContent>
            </Card>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Scan QR using your mobile wallet or{' '}
              <MuiNextLink href={ergopayUrl}>click this link</MuiNextLink> to
              open your wallet app.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ErgopayModalBody;
