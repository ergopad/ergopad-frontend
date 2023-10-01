import {
  Box,
  Button,
  Table,
  TableCell,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  TableBody,
} from '@mui/material';
import theme from '@styles/theme';
import { FC, Fragment } from 'react';
import { StakedData, Staked } from '@pages/staking/[project_id]';

const stakedHeading = {
  boxId: 'Box Id',
  stakeAmount: 'Number of Tokens',
  penaltyPct: 'Penalty %',
  penaltyEndTime: 'Penalty End',
  unstake: '',
};

export type Unstake = {
  boxId: string;
  stakeKeyId: string;
  stakeAmount: number;
  penaltyPct: number;
  address: string;
}

type StakeFunction = (
  boxId: string,
  stakeKeyId: string,
  stakeAmount: number,
  penaltyPct: number,
  address: string
) => void;

const friendlyAddress = (addr: string, tot = 8) => {
  if (addr === undefined || addr.slice === undefined) return '';
  if (addr.length < 30) return addr;
  return addr.slice(0, tot) + '...' + addr.slice(-tot);
};

type UnstakingTableProps = {
  data: StakedData;
  unstake: StakeFunction;
  addstake: StakeFunction | null;
  disableUnstaking?: boolean;
  disableAddStake?: boolean;
};

const UnstakingTable: FC<UnstakingTableProps> = ({
  data,
  unstake,
  addstake,
  disableUnstaking,
  disableAddStake
}) => {
  const theme = useTheme()
  const checkSmall = useMediaQuery(theme.breakpoints.up('md'));
  const stakeObject = { ...data };

  if (stakeObject.totalStaked === 0) {
    return (
      <>
        <Box>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Looks like you do not have any staked tokens associated with your
            this address. This page only shows tokens for the selected address.
            For overall wallet summary visit the dashboard. The values in the
            table may take some time to reflect new changes.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box>
        <Typography variant="h6" color="text.primary" sx={{ mb: 1, pl: 1 }}>
          Total Staked Tokens:{' '}
          {stakeObject.totalStaked?.toLocaleString(navigator.language, {
            maximumFractionDigits: 2,
          })}
        </Typography>
        {/* <Typography
          variant="body2"
          sx={{ fontWeight: '400', fontSize: '1rem', mb: 1, pl: 1 }}
        >
          Note: You may have staked tokens associated with other addresses in
          your wallet. This page only shows tokens for the selected addresses.
          For overall wallet summary visit the dashboard. The values in the
          table may take some time to reflect new changes.
        </Typography> */}
      </Box>
      {Object.keys(stakeObject.addresses).map((address) => (
        <Box sx={{ mt: 4 }} key={address}>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Address:{' '}
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                textTransform: 'capitalize',
                fontWeight: '400',
                overflowWrap: 'anywhere',
              }}
            >
              {checkSmall ? address : friendlyAddress(address)}
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: '600', fontSize: '1rem', mb: 1, pl: 1 }}
          >
            Total Staked:{' '}
            <Typography
              component="span"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontWeight: '400' }}
            >
              {stakeObject.addresses[address].totalStaked?.toLocaleString(
                navigator.language,
                { maximumFractionDigits: 2 }
              )}
            </Typography>
          </Typography>
          <Table sx={{ p: 0 }}>
            <TableBody>
              {stakeObject.addresses[address].stakeBoxes.map((stake, index) => {
                return (
                  <Fragment key={stake.boxId}>
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
                        {stake.stakeAmount?.toLocaleString(navigator.language, {
                          maximumFractionDigits: 2,
                        })}
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
                        {stake.penaltyPct ?? 0}
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
                        {stake.penaltyEndTime
                          ? new Date(stake.penaltyEndTime)
                            .toISOString()
                            .slice(0, 10)
                          : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          border: 'none',
                          p: 0,
                          pt: 1,
                          pb:
                            index ===
                              stakeObject.addresses[address].stakeBoxes.length - 1
                              ? 0
                              : 3,
                        }}
                        colSpan={2}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {typeof addstake !== 'undefined' && addstake && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                mr: 3,
                                color: '#fff',
                                textTransform: 'none',
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: '#4BD0C9',
                                  boxShadow: 'none',
                                },
                                '&:active': {
                                  backgroundColor: 'rgba(49, 151, 149, 0.25)',
                                },
                              }}
                              onClick={() =>
                                addstake(
                                  stake.boxId,
                                  stake.stakeKeyId,
                                  stake.stakeAmount,
                                  stake.penaltyPct ?? 0,
                                  address
                                )
                              }
                              disabled={disableAddStake}
                            >
                              Add Stake
                            </Button>
                          )}
                          <Button
                            disabled={disableUnstaking}
                            variant="contained"
                            size="small"
                            sx={{
                              color: '#fff',
                              textTransform: 'none',
                              backgroundColor: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: '#4BD0C9',
                                boxShadow: 'none',
                              },
                              '&:active': {
                                backgroundColor: 'rgba(49, 151, 149, 0.25)',
                              },
                            }}
                            onClick={() =>
                              unstake(
                                stake.boxId,
                                stake.stakeKeyId,
                                stake.stakeAmount,
                                stake.penaltyPct ?? 0,
                                address
                              )
                            }
                          >
                            Unstake
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      ))}
      {disableUnstaking && (
        <Typography variant="body2" sx={{ mt: 1, fontSize: '1rem' }}>
          NOTE: Unstaking is currently disabled.
        </Typography>
      )}
    </>
  );
};

export default UnstakingTable;
