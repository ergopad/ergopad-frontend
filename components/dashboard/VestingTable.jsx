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
import { Button } from '@mui/material';
import { useState } from 'react';
import TokenRedeemModal from '@components/dashboard/TokenRedeemModal';

const vestedHeading = {
  amount: 'Number of Tokens',
  date: 'Date Releasing',
};

const vestedWithNFTHeading = {
  remaining: 'Tokens Remaining',
  redeemable: 'Tokens Redeemable Now',
  nextUnlock: 'Next Unlock',
};

const VestingTable = ({ vestedObject, vestedTokensWithNFT }) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [redeemModal, setRedeemModal] = useState(null);

  if (
    vestedObject.length === 0 &&
    Object.keys(vestedTokensWithNFT).length === 0
  ) {
    return (
      <>
        <Box>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Looks like you do not have any locked tokens associated with your
            wallet.
          </Typography>
        </Box>
      </>
    );
  }

  const redeem = (boxId) => {
    setRedeemModal(boxId);
  };

  return (
    <>
      {vestedObject.map((vestedToken) => (
        <Box sx={{ mt: 4 }} key={vestedToken.tokenId}>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Name:{' '}
            <Typography
              variant="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {vestedToken.name}
            </Typography>
          </Typography>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Total Locked:{' '}
            <Typography
              variant="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {vestedToken.totalVested}
            </Typography>
          </Typography>
          {checkSmall ? (
            <Table sx={{ mb: 3 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {vestedHeading.date}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {vestedHeading.amount}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vestedToken.outstanding.map((vested, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {vested.date}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {vested.amount}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table sx={{ p: 0 }}>
              {vestedToken.outstanding.map((vested) => {
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
                        {vestedHeading.amount}
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                        {vested.amount}
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
                        {vestedHeading.date}
                      </TableCell>
                      <TableCell sx={{ border: 'none', p: 1 }}>
                        {vested.date}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </Table>
          )}
        </Box>
      ))}
      {Object.keys(vestedTokensWithNFT).map((vestedToken) => (
        <Box sx={{ mt: 4 }} key={vestedTokensWithNFT[vestedToken].boxId}>
          <Typography
            variant="p"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Name:{' '}
            <Typography
              variant="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {vestedToken}
            </Typography>
          </Typography>
          {checkSmall ? (
            <Table sx={{ mb: 3 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {vestedWithNFTHeading.remaining}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {vestedWithNFTHeading.redeemable}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {vestedWithNFTHeading.nextUnlock}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vestedTokensWithNFT[vestedToken].map((box) => (
                  <TableRow key={box.boxId}>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {box['Remaining']}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {box['Redeemable']}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {box['Next unlock']}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      <Button onClick={() => redeem(box.boxId)}>Redeem</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table sx={{ p: 0 }}>
              {vestedTokensWithNFT[vestedToken].map((box) => (
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
                      {vestedWithNFTHeading.remaining}
                    </TableCell>
                    <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                      {box['Remaining']}
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
                      {vestedWithNFTHeading.redeemable}
                    </TableCell>
                    <TableCell sx={{ border: 'none', p: 1 }}>
                      {box['Redeemable']}
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
                      {vestedWithNFTHeading.nextUnlock}
                    </TableCell>
                    <TableCell sx={{ border: 'none', p: 1 }}>
                      {box['Next unlock']}
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
                      <Button onClick={() => redeem(box.boxId)}>Redeem</Button>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </Table>
          )}
        </Box>
      ))}
      <TokenRedeemModal
        boxId={redeemModal}
        onClose={() => setRedeemModal(null)}
      />
    </>
  );
};

export default VestingTable;
