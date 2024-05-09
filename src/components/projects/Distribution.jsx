import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Typography,
} from '@mui/material';
import theme from '@styles/theme';
import { Fragment } from 'react';

const tokenomicsHeading = {
  name: 'Name',
  amount: 'Amount',
  value: 'Value',
  tge: 'TGE',
  freq: 'Frequency',
  length: 'Length',
  lockup: 'Cliff',
};

const tokenomicsKeys = Object.keys(tokenomicsHeading);
const tokenomicsHeadingValues = Object.values(tokenomicsHeading);

const Distribution = ({ data, total, name, ticker }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const totalTokens = total ? total : 0;
  const tokenName = name ? name : '';
  const tokenTicker = ticker ? ticker : '';
  const tokenomics = data ? data : [];

  const largeHeading = tokenomicsHeadingValues.map((value, i) => {
    return (
      <TableCell key={i} sx={{ fontWeight: '800' }}>
        {value}
      </TableCell>
    );
  });

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Token Name:
        <Typography
          component="span"
          color="text.primary"
          sx={{ fontWeight: '700' }}
        >
          {' '}
          {tokenName}
        </Typography>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Token Ticker:
        <Typography
          component="span"
          color="text.primary"
          sx={{ fontWeight: '700' }}
        >
          {' '}
          {tokenTicker}
        </Typography>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Total Distribution:
        <Typography
          component="span"
          color="text.primary"
          sx={{ fontWeight: '700' }}
        >
          {' '}
          {totalTokens.toLocaleString(navigator.language, {
            maximumFractionDigits: 0,
          })}
        </Typography>
      </Typography>
      {checkSmall ? (
        <Table>
          <TableHead>
            <TableRow>{largeHeading}</TableRow>
          </TableHead>
          <TableBody>
            {tokenomics.map((round) => {
              const keysLoop = tokenomicsKeys.map((key) => {
                return (
                  <TableCell key={key}>
                    {round?.[key].toLocaleString(navigator.language, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                );
              });
              return <TableRow key={round.name}>{keysLoop}</TableRow>;
            })}
          </TableBody>
        </Table>
      ) : (
        <Table sx={{ p: 0 }}>
          {tokenomics.map((round) => {
            const keysLoop = tokenomicsKeys.map((key, i) => {
              if (round?.[key]) {
                if (i == 0) {
                  return (
                    <TableRow key={i} sx={{ borderTop: `1px solid #444` }}>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                        }}
                      >
                        {tokenomicsHeading[key]}:
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                        {round?.[key]}
                      </TableCell>
                    </TableRow>
                  );
                } else if (i < tokenomicsKeys.length - 1) {
                  return (
                    <TableRow key={i}>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                        }}
                      >
                        {tokenomicsHeading[key]}:
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1 }}>
                        {round?.[key].toLocaleString(navigator.language, {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                        }}
                      >
                        {tokenomicsHeading[key]}:
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1, pb: 2 }}>
                        {round?.[key]}
                      </TableCell>
                    </TableRow>
                  );
                }
              }
            });
            return <Fragment key={round.name}>{keysLoop}</Fragment>;
          })}
        </Table>
      )}
    </Paper>
  );
};

export default Distribution;
