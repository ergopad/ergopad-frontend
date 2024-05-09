import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import theme from '@styles/theme';

const unstakeFees = [
  {
    fee: '25%',
    time: 'Less than 2 weeks',
  },
  {
    fee: '20%',
    time: 'Between 2 and 4 weeks',
  },
  {
    fee: '12.5%',
    time: 'Between 4 and 6 weeks',
  },
  {
    fee: '5%',
    time: 'Between 6 and 8 weeks',
  },
  {
    fee: '0%',
    time: 'More than 8 weeks',
  },
];

const UnstakingFeesTable = () => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: '700', mt: 6 }}>
          Early Unstaking Fees
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '800' }}>Fee</TableCell>
              <TableCell sx={{ fontWeight: '800' }}>Time staked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unstakeFees.map((fee) => {
              return (
                <TableRow key={fee.fee}>
                  <TableCell
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: '800',
                    }}
                  >
                    {fee.fee}
                  </TableCell>
                  <TableCell>{fee.time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default UnstakingFeesTable;
