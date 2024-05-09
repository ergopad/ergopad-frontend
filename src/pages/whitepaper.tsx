import { useState } from 'react';
import {
  Container,
  Typography,
  Divider,
  Box,
  Grid,
  List,
  ListItemText,
  ListItemIcon,
  Icon,
  Button,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DataTable from '@components/DataTable';
import { scroller } from 'react-scroll';

const navBarLinks = [
  {
    name: 'Introduction',
    icon: 'info',
    link: 'top',
  },
  {
    name: 'Disclaimer',
    icon: 'gavel',
    link: 'disclaimer',
  },
  {
    name: 'Our Philosophy',
    icon: 'account_balance',
    link: 'our-philosophy',
  },
  // {
  //   name: 'Roadmap',
  //   icon: 'signpost',
  //   link: '#roadmap',
  // },
  {
    name: 'Tokenomics',
    icon: 'data_usage',
    link: 'tokenomics',
  },
  {
    name: 'Staking',
    icon: 'stacked_line_chart',
    link: 'staking',
  },
];

const tokenomicsData = {
  header: ['Description', 'Value'],
  data: [
    ['Token Name', 'ErgoPad'],
    [
      'Token ID',
      'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413',
    ],
    ['Blockchain', 'Ergo'],
    ['Initial supply', 20000000],
    ['Market cap at IDO', '800k sigUSD'],
    ['Total supply	', 400000000],
  ],
};

const vestingData = {
  header: [
    'Distribution',
    'Amount',
    'Percent of Initial Supply',
    'Vesting Period',
  ],
  data: [
    ['Seed Round', 10000000, '12.7%', '1/9th Monthly for 9 Months'],
    ['Strategic Round', 20000000, '25.3%', '1/6th Monthly for 6 Months'],
    ['Pre-IDO Round', 20000000, '25.3%', '1/3 Monthly for 3 Months'],
    ['Liquidity', 5000000, '6.3%', '-'],
    ['DAO', 24000000, '30.3%', 'Quarterly for 6 Quarters'],
    ['Staking', 321000000, '-', 'Daily for 36 months'],
  ],
};

const stakingTiers = {
  header: ['Tier', 'Amount', 'Allocation Weight'],
  data: [
    ['(M) Mini', 12500, 4],
    ['(A) Alpha', 25000, 10],
    ['(Β) Beta', 50000, 24],
    ['(Γ) Gamma', 100000, 58],
    ['(Ω) Omega', 250000, 175],
    ['(Φ) Phi', 500000, 420],
    ['(Σ) Sigma', 1500000, 1500],
  ],
};

const earlyUnstakingTable = {
  header: ['Fee', 'Time staked'],
  data: [
    ['25%', 'Less than 2 weeks'],
    ['20%', 'Between 2 and 4 weeks'],
    ['12.5%', 'Between 4 and 6 weeks'],
    ['5%', 'Between 6 and 8 weeks'],
    ['0%', 'More than 8 weeks'],
  ],
};

const headingStyle = {
  fontWeight: '800',
  mt: { xs: '-100px', sm: '-110px', md: '-70px' },
  pt: { xs: '100px', sm: '110px', md: '70px' },
};

const Whitepaper = () => {
  const theme = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);

  const checkSmall = useMediaQuery(() => theme.breakpoints.up('md'));

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setMobileMenu(open);
  };

  const listItemSx = {
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const navBarList = (
    <List>
      {navBarLinks.map(({ icon, name, link }, i) => (
        <ListItemButton
          key={`scroller${i}`}
          sx={{ ...listItemSx }}
          onClick={() => {
            scroller.scrollTo(link, { duration: 500, smooth: true });
          }}
        >
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Container maxWidth="lg" id="top">
      {!checkSmall ? (
        <Box
          sx={{
            position: 'sticky',
            top: 65,
            bottom: 20,
            // paddingTop: '40px',
            // paddingBottom: '40px',
            zIndex: 1,
          }}
        >
          <Button
            sx={{
              width: '100vw',
              ml: { xs: '-16px', sm: '-24px' },
              mt: { xs: '-9px', sm: '-1px' },
              borderRadius: '0',
            }}
            fullWidth
            variant="contained"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </Button>
          <SwipeableDrawer
            anchor="top"
            open={mobileMenu}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{ width: 'auto' }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {navBarList}
            </Box>
          </SwipeableDrawer>
        </Box>
      ) : null}
      <Grid
        container
        spacing={6}
        sx={{
          mt: 1,
          justifyContent: 'space-between',
          // flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: 'sticky',
              top: 80,
              // bottom: 20,
              // paddingTop: '40px',
              // paddingBottom: '40px',
              zIndex: 0,
            }}
          >
            {!checkSmall ? null : navBarList}
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h2">Ergopad Whitepaper</Typography>
          <Typography variant="body2">
            Read the Ergopad Whitepaper to get up to speed on how the project
            works
          </Typography>
          <Divider sx={{ width: '2rem', mb: '1.5rem' }} />

          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }}>
              Introduction
            </Typography>
            <Typography variant="body2">
              ErgoPad is a project incubator offering token IDOs which provide
              funding for new projects within the Ergo ecosystem. Ergopad
              released its own native token through an IDO (Initial Dex
              Offering), and users are now able to stake Ergopad tokens through
              smart contracts on-chain.
            </Typography>
            <Typography variant="body2">
              If you stake ErgoPad tokens and reach one of the staking tiers,
              you&apos;ll be given an opportunity to contribute to the DAOs of
              projects launched through the Ergopad platform, before they go
              live on any dex. Seed round contributors will receive governance
              tokens at a lower value than what they&apos;ll launch at on the
              dex and allow participation in the governance of the DAOs of
              various projects.
            </Typography>
            <Typography variant="body2">
              SigUSD and Erg raised by DAOs in the early contribution rounds
              will be used, as voted by DAO members, to build projects on the
              Ergo platform.
            </Typography>
            <Typography variant="body2">
              Ergopad is not an investing platform, we are here to bring people
              together and create DAOs which organize people&apos;s goals to
              build blockchain solutions on Ergo and in other related
              ecosystems.
            </Typography>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="disclaimer">
              Disclaimer
            </Typography>
            <Typography variant="body2">
              All information is subject to change.
            </Typography>
            <Typography variant="body2">
              Using the ergopad.io website is not the same as using the Ergo
              blockchain. When you use the ErgoPad website to generate
              transactrions for you, you&apos;ll still need to use a native Ergo
              wallet to send the transactions and interact with the blockchain.
            </Typography>
            <Typography variant="body2">
              Connecting your wallet on the ergopad.io website doesn&apos;t give
              the website any control over your funds. It stores the public
              address of your Ergo wallet in localStorage on your device, and
              will use that data to compile ergoscript contracts for you to
              interact with on chain. The data will never be stored on the
              ergopad.io servers.
            </Typography>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="our-philosophy">
              Our Philosophy
            </Typography>
            <Typography variant="body2">
              We believe that all people should have full access to and full
              control over their finances. No government should have the right
              to control what someone can and can&apos;t invest in, or how they
              can spend their money. We also believe control of the money supply
              should be taken from governments, since governments have proven
              they don&apos;t take the responsibility seriously enough, and
              contiunue to choose profits for the ultra-wealthy over fairness
              for common people.
            </Typography>
            <Typography variant="body2">
              As the government attempts to print us out of problems of their
              making, the resulting inflation erodes people&apos;s buying power.
              Corporations continue to charge more for goods and services, while
              refusing to give fair wages to workers.
            </Typography>
            <Typography variant="body2">
              Beginning with Bitcoin, cryptocurrency became a financial
              revolution that can help free people from this cycle. While
              Bitcoin gave us a fantastic store of value, Ethereum proved that
              on-chain dApps could replace much of the financial services we
              traditionally have relied on investment banks and large hedge
              funds to provide. Anyone who has used Ethereum knows there are
              flaws in the design; you find out quick when a transaction costs
              over $80 USD in gas fees. However, it was a great proof of
              concept, and Ergo is here to carry that torch to the next stage of
              development. With a robust PoW backing, novel concepts like
              extended-UTXO, NIPOPOWs, and Sigma protocols, Ergo is set to be
              the next iteration in blockchain ecosystem solutions.
            </Typography>
            <Typography variant="body2">
              Because the eUTXO system is still in its infancy, the user
              experience is severly lacking in comparison to other projects like
              Ethereum that have had a several year head start. However, that
              leaves a lot of room for growth, and we would like to be part of
              that growth.
            </Typography>
            <Typography variant="body2">
              ErgoPad was created to generate financial backing for the
              developers who need it, so we can help the Ergo platform grow into
              a safe, accessible financial ecosystem where everyone has fair
              access. All dApps should provide an experience where a user&apos;s
              data is only shared when they want it to, and where they can
              leverage or spend their money any way they wish with minimal fees
              for doing so. Some devs don&apos;t have strong marketing skills,
              and other teams have a great idea and community but no devs to
              build it. That&apos;s where we come in. We can put teams together,
              raise funds, grow the communities, and create the future of free
              market access for all. We&apos;d love to have you join us on this
              journey!
            </Typography>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="tokenomics">
              Tokenomics
            </Typography>
            <DataTable data={tokenomicsData} />
            <Typography variant="h5" sx={headingStyle}>
              DAO Tokens
            </Typography>
            <Typography variant="body2">
              The ErgoPad DAO will receive 6% of the total supply of tokens.
              This will be released quarterly to the DAO over 6 quarters (one
              and a half years). The DAO will vote to determine how those tokens
              will be spent. Typically these tokens will be used for marketing
              purposes.
            </Typography>
            <Typography variant="h5" sx={headingStyle}>
              Vesting Schedule
            </Typography>
            <DataTable data={vestingData} />
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="staking">
              Staking
            </Typography>
            <Typography variant="body2">
              Staking provides a few utilities. Staking your ErgoPad tokens will
              generate new tokens based on the number you have staked and the
              emission schedule. If you reach one of the staking tiers,
              you&apos;ll get pool allocation which gives you an opportunity to
              contribute to new projects launched on ErgoPad at staker and seed
              round rates not available to everyone.
            </Typography>
            <Typography variant="body2">
              Staking went live on January 26th.
            </Typography>
            <Typography variant="h5" sx={headingStyle}>
              Tiers
            </Typography>
            <DataTable data={stakingTiers} />
            <Typography variant="h5" sx={headingStyle}>
              Pool Allocation
            </Typography>
            <Typography variant="body2">
              Pool allocation will be determined on a case-by-case basis for
              each project. Projects will have some tokens reserved for ErgoPad
              stakers. A staking snapshot date will be announced ahead of time,
              and a sign-up form will be provided. Anyone staking in a tier
              during that time who signed up will be eligible for their share of
              staker round tokens based on their pool weight.
            </Typography>
            <Typography variant="h5" sx={headingStyle}>
              Token Emission
            </Typography>
            <Typography variant="body2">
              There will be 400M total ErgoPad tokens, and 321M of them will be
              sent to stakers over a 3 year period. The APY will vary day-to-day
              based on the number of staked tokens and the total tokens left.
            </Typography>
            <Typography variant="h5" sx={headingStyle}>
              Early Unstaking Fees
            </Typography>
            <Typography variant="body2">
              There are fees for unstaking early, in order to prevent people
              from staking the day before a snapshot, then unstaking the day
              after. Staking Ergopad tokens should be an indication that you are
              interested in contributing to project development over a long-term
              time-frame. The intention behind this project is to group together
              and help build the Ergo blockchain.
            </Typography>
            <DataTable data={earlyUnstakingTable} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Whitepaper;
