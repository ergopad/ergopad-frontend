import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import theme from '@styles/theme';
import { Fragment } from 'react';

const stakingHeading = {
  tier: 'Tier',
  value: 'Amount',
  requirements: 'Staking Requirements',
  weight: 'Allocation Weight',
};

const stakingTiers = [
  {
    tier: '(M) Mini',
    value: 12500,
    requirements: 'Twitter like, retweet',
    weight: 4,
  },
  {
    tier: '(A) Alpha',
    value: 25000,
    requirements: 'Twitter like, retweet',
    weight: 10,
  },
  {
    tier: '(B) Beta',
    value: 50000,
    requirements: 'Twitter like, retweet',
    weight: 24,
  },
  {
    tier: '(Γ) Gamma',
    value: 100000,
    requirements: 'Twitter like, retweet',
    weight: 58,
  },
  {
    tier: '(Ω) Omega',
    value: 250000,
    requirements: 'Twitter like',
    weight: 175,
  },
  {
    tier: '(Φ) Phi',
    value: 500000,
    requirements: 'Twitter like',
    weight: 420,
  },
  {
    tier: '(Σ) SIgma',
    value: 1500000,
    requirements: 'none',
    weight: 1500,
  },
];

const StakingTiers = () => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: '700' }}>
        Staking Tiers
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '1rem' }}>
        If you stake enough tokens to reach one of the following staking tiers, you will have an opportunity to get into reserved early contribution rounds to any of the projects that IDO through Ergopad. We will take a snapshot at a specific time and date, as outlined in that project&apos;s roadmap. In order to be considered for the snapshot, please remember to sign your wallet address up for the appropriate whitelist. 
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '1rem' }}>
        Note that you can meet more than one tier at once. For example, if you stake 75,000 tokens at one address, you will qualify for both Alpha and Beta tiers. 
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '1rem' }}>
        Be sure to follow our socials and check the announcement channels to keep informed about upcoming IDOs and important dates. 
      </Typography>

      {checkSmall ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '800' }}>Tier</TableCell>
              <TableCell sx={{ fontWeight: '800' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: '800' }}>
                Allocation Weight
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stakingTiers.map((tier) => {
              return (
                <TableRow key={tier.tier}>
                  <TableCell
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: '800',
                    }}
                  >
                    {tier.tier}
                  </TableCell>
                  <TableCell>{tier.value?.toLocaleString(navigator.language, { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{tier.weight?.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Table sx={{ p: 0 }}>
          {stakingTiers.map((tier) => {
            return (
              <Fragment key={tier.tier}>
                <TableRow sx={{ borderTop: `1px solid #444` }}>
                  <TableCell
                    sx={{
                      color: theme.palette.text.secondary,
                      border: 'none',
                      p: 1,
                      pt: 2,
                    }}
                  >
                    {stakingHeading.tier}
                  </TableCell>
                  <TableCell sx={{ border: 'none', p: 1, pt: 2 }}>
                    {tier.tier}
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
                    {stakingHeading.value}
                  </TableCell>
                  <TableCell sx={{ border: 'none', p: 1 }}>
                    {tier.value?.toLocaleString(navigator.language, { maximumFractionDigits: 0 })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: theme.palette.text.secondary,
                      border: 'none',
                      p: 1,
                      pb: 2,
                    }}
                  >
                    {stakingHeading.weight}
                  </TableCell>
                  <TableCell sx={{ border: 'none', p: 1, pb: 2 }}>
                    {tier.weight?.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </Table>
      )}
    </>
  );
};

export default StakingTiers;
