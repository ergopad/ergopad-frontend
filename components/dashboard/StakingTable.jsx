import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import theme from '@styles/theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const stakedHeading = {
  boxId: 'Box Id',
  stakeAmount: 'Number of Tokens',
  penaltyPct: 'Penalty %',
  penaltyEndTime: 'Penalty End Time',
};

// const sampleData = Object.freeze({
//   totalStaked: 14140410,
//   addresses: {
//     '9eZ77otC8nncPcph58K4wDTuaebnRT5ahLMFdXFWtCQyqkvnkrC': {
//       totalStaked: 14140410,
//       stakeBoxes: [
//         {
//           boxId:
//             'fc4f69c99fb13fd43d23529bd1aeea678a16ba16061fdfd1a67be2d892939255',
//           stakeKeyId:
//             'ab14a7caa142ceb5a71026ae9b0f83157e0fba9ec584fe5c1972895704879ccb',
//           stakeAmount: 1000,
//           penaltyPct: 25,
//           penaltyEndTime: 1649856211862,
//         },
//         {
//           boxId:
//             '290a2656634835820f68938914875973a91fbb63edbc3c3e8fd35c58fbb27c55',
//           stakeKeyId:
//             '984c24667bba40d090cd133b7f7096f4095d31f5e1f70f6e8e8196246f6ff7f7',
//           stakeAmount: 14134566,
//           penaltyPct: 25,
//           penaltyEndTime: 1649763635216,
//         },
//         {
//           boxId:
//             'faa88b752725c61bcb1c8de9c95422ea9d940270ea8f5b21e6c91335404ddd55',
//           stakeKeyId:
//             '97b58c64ae6ebc1f5efd8d2e2bbce1274ec2c5530d023ca7fe32eda7dcd92677',
//           stakeAmount: 1211,
//           penaltyPct: 25,
//           penaltyEndTime: 1649795587634,
//         },
//         {
//           boxId:
//             '63886183bc439a42136267c59142c2a07dc4352b0c792e32ea2d8861edcf8d07',
//           stakeKeyId:
//             'e8c46216d87ffdb16d60676a32e893fa70059f41ead869a690ee711210e909ee',
//           stakeAmount: 1211,
//           penaltyPct: 25,
//           penaltyEndTime: 1649796900027,
//         },
//         {
//           boxId:
//             '8629d1de7c65955143773f6ac72bbf532f5a5d61b69419a9a27c77ba642adc08',
//           stakeKeyId:
//             '81dcd6114092f799d26d973c39d781b89e096f65ec6ff35058567805f6c9fd7e',
//           stakeAmount: 1211,
//           penaltyPct: 25,
//           penaltyEndTime: 1649797138402,
//         },
//         {
//           boxId:
//             '84b73fd5bf5cd83d3a075857e07995f63b8fd8ffc5a28e4418cbfbb82d3468fa',
//           stakeKeyId:
//             '8f70a6d96fc957e343506800459118f3665fd8ae226af69292107f2171f458cd',
//           stakeAmount: 1211,
//           penaltyPct: 25,
//           penaltyEndTime: 1649834685912,
//         },
//       ],
//     },
//   },
// });

const friendlyAddress = (addr, tot = 15) => {
  if (addr === undefined || addr.slice === undefined) return '';
  if (addr.length < 30) return addr;
  return addr.slice(0, tot) + '...' + addr.slice(-tot);
};

const StakingTable = ({ data }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const stakeObject = { ...data };

  if (stakeObject.totalStaked === 0) {
    return (
      <>
        <Box>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Looks like you do not have any staked tokens associated with your
            wallet.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" color="text.primary" sx={{ mb: 1, pl: 1 }}>
          Total Staked Tokens: {stakeObject.totalStaked?.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}
        </Typography>
        <Typography
          variant="p"
          sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}
        >
          Total staked aggregates all your wallet address and may not clearly
          reflect your staking tier per address. Visit the staking page for more
          details.
        </Typography>
      </Box>
      {Object.keys(stakeObject.addresses).map((address) => (
        <Box sx={{ mt: 4 }} key={address}>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Address:{' '}
            <Typography
              variant="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {checkSmall ? address : friendlyAddress(address)}
            </Typography>
          </Typography>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Total Staked:{' '}
            <Typography
              variant="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {stakeObject.addresses[address].totalStaked?.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}
            </Typography>
          </Typography>
          {checkSmall ? (
            <Table sx={{ mb: 3 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {stakedHeading.boxId}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {stakedHeading.stakeAmount}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {stakedHeading.penaltyPct}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {stakedHeading.penaltyEndTime}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stakeObject.addresses[address].stakeBoxes.map((stake) => {
                  return (
                    <TableRow key={stake.boxId}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {stake.boxId}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {stake.stakeAmount}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {stake.penaltyPct}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {new Date(stake.penaltyEndTime)
                          .toISOString()
                          .slice(0, 10)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table sx={{ p: 0 }}>
              {stakeObject.addresses[address].stakeBoxes.map((stake) => {
                return (
                  <>
                    <TableRow sx={{ borderTop: `1px solid #444` }}>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                          pt: 2,
                        }}
                      >
                        {stakedHeading.stakeAmount}
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                        {stake.stakeAmount}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                        }}
                      >
                        {stakedHeading.penaltyPct}
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1 }}>
                        {stake.penaltyPct}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          border: 'none',
                          p: 1,
                        }}
                      >
                        {stakedHeading.penaltyEndTime}
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1 }}>
                        {new Date(stake.penaltyEndTime)
                          .toISOString()
                          .slice(0, 10)}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </Table>
          )}
        </Box>
      ))}
    </>
  );
};

export default StakingTable;
