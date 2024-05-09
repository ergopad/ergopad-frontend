import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Link,
} from '@mui/material';
import QRCode from 'react-qr-code';

type ErgopayModalBodyProps = {
  ergopayUrl: string;
  address: string;
  pending?: boolean;
};

const ErgopayModalBody: FC<ErgopayModalBodyProps> = ({
  ergopayUrl,
  address,
  pending,
}) => {
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
              <Link href={ergopayUrl}>click this link</Link> to open your wallet
              app.
            </Typography>
            <Link
              href={'https://explorer.ergoplatform.com/en/addresses/' + address}
              rel="noreferrer"
              target="_blank"
            >
              View your wallet on explorer to check if it went through
            </Link>{' '}
            (You may need to refresh a few times)
          </>
        )}
      </Box>
    </Box>
  );
};

export default ErgopayModalBody;
