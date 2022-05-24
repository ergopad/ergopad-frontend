import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  IconButton,
  Divider,
  Box,
  Grid,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Icon,
  Button,
  SwipeableDrawer,
  useMediaQuery,
} from '@mui/material';
import Link from '@components/MuiNextLink';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import ShareIcon from '@mui/icons-material/Share';
import MenuIcon from '@mui/icons-material/Menu';
import CopyToClipboard from '@components/CopyToClipboard';
import DataTable from '@components/DataTable'

const navBarLinks = [
  {
    name: 'Introduction',
    icon: 'info',
    link: '#',
  },
  {
    name: 'Disclaimer',
    icon: 'gavel',
    link: '#disclaimer',
  },
  {
    name: 'Our Philosophy',
    icon: 'account_balance',
    link: '#our-philosophy',
  },
  // {
  //   name: 'Roadmap',
  //   icon: 'signpost',
  //   link: '#roadmap',
  // },
  {
    name: 'Tokenomics',
    icon: 'data_usage',
    link: '#tokenomics',
  },
  {
    name: 'Staking',
    icon: 'stacked_line_chart',
    link: '#staking',
  },
];

const tokenomicsData = {
  header: ['Description', 'Value'],
  data: [
    [
      'Token Name', 'ErgoPad'
    ],
    [
      'Token ID', 'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413'
    ],
    [
      'Blockchain', 'Ergo'
    ],
    [
      'Initial supply', 20000000
    ],
    [
      'Market cap at IDO', '800k sigUSD'
    ],
    [
      'Total supply	', 400000000
    ]
  ]
}

const vestingData = {
  header: [
    'Distribution',
    'Amount',
    'Percent of Initial Supply',
    'Vesting Period',
  ],
  data: [
    [
      'Seed Round',
      10000000,
      '12.7%',
      '1/9th Monthly for 9 Months',
    ],
    [
      'Strategic Round',
      20000000,
      '25.3%',
      '1/6th Monthly for 6 Months',
    ],
    [
      'Pre-IDO Round',
      20000000,
      '25.3%',
      '1/3 Monthly for 3 Months',
    ],
    [
      'Liquidity',
      5000000,
      '6.3%',
      '-',
    ],
    [
      'DAO',
      24000000,
      '30.3%',
      'Quarterly for 6 Quarters',
    ],
    [
      'Staking',
      321000000,
      '-',
      'Daily for 36 months',
    ],
  ],
}

const stakingTiers = {
  header: [
    'Tier',
    'Amount',
    'Allocation Weight',
  ],
  data: [
    [
      '(M) Mini',
      12500,
      4,
    ],
    [
      '(A) Alpha',
      25000,
      10,
    ],
    [
      '(Β) Beta',
      50000,
      24,
    ],
    [
      '(Γ) Gamma',
      100000,
      58,
    ],
    [
      '(Ω) Omega',
      250000,
      175,
    ],
    [
      '(Φ) Phi',
      500000,
      420,
    ],
    [
      '(Σ) Sigma',
      1500000,
      1500,
    ],
  ],
}

const earlyUnstakingTable = {
  header: ['Fee', 'Time staked'],
  data: [
    [
      '25%', 'Less than 2 weeks'
    ],
    [
      '20%', 'Between 2 and 4 weeks'
    ],
    [
      '12.5%', 'Between 4 and 6 weeks'
    ],
    [
      '5%', 'Between 6 and 8 weeks'
    ],
    [
      '0%', 'More than 8 weeks'
    ],
  ]
}

const headingStyle = {
  fontWeight: '800',
  mt: { xs: '-100px', sm: '-110px', md: '-70px' },
  pt: { xs: '100px', sm: '110px', md: '70px' },
};

const Whitepaper = () => {
  const router = useRouter();

  const [project, setProject] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);

  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setMobileMenu({ ...mobileMenu, [anchor]: open });
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
        <ListItem
          key={i}
          button
          sx={{ ...listItemSx }}
          onClick={() => {
            router.push(`whitepaper/${link}`);
          }}
        >
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  );

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {navBarList}
    </Box>
  );

  return (
    <Container maxWidth="lg">
      {!checkSmall
        ? ['top'].map((anchor) => (
          <Box
            key={anchor}
            sx={{
              position: 'sticky',
              top: 65,
              bottom: 20,
              // paddingTop: '40px',
              // paddingBottom: '40px',
              zIndex: 1,
            }}
          >
            <Fragment key={anchor}>
              <Button
                sx={{
                  width: '100vw',
                  ml: { xs: '-16px', sm: '-24px' },
                  mt: { xs: '-9px', sm: '-1px' },
                  borderRadius: '0',
                }}
                fullWidth
                variant="contained"
                onClick={toggleDrawer(anchor, true)}
              >
                <MenuIcon />
              </Button>
              <SwipeableDrawer
                anchor={anchor}
                open={mobileMenu[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </Fragment>
          </Box>
        ))
        : null}
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
          <Typography variant="p">
            Read the Ergopad Whitepaper to get up to speed on how the project works
          </Typography>
          <Divider sx={{ width: '2rem', mb: '1.5rem' }} />
          <Box sx={{ display: 'flex', justifyContent: 'left' }}>
            <Link
              href=""
              aria-label="discord"
              title="Discord"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="discord" size="large">
                <svg
                  fill="#ffffff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28px"
                  height="28px"
                >
                  <path d="M19.229,6.012c-1.731-1.399-4.187-1.657-4.187-1.657L15,6c-1.979,0-4.021,0-6,0L8.989,4.458c0,0-2.486,0.155-4.241,1.573 C3.831,6.882,2,11.861,2,16.165c0,0.076,0.019,0.15,0.057,0.216c1.265,2.233,4.714,2.817,5.499,2.842 c0.005,0.001,0.009,0.001,0.014,0.001c0.139,0,0.286-0.056,0.351-0.18l0.783-1.485c-0.646-0.164-1.313-0.359-2.04-0.617 c-0.521-0.185-0.792-0.757-0.607-1.277s0.758-0.791,1.277-0.607c3.526,1.254,5.624,1.253,9.345-0.005 c0.525-0.175,1.092,0.104,1.268,0.627c0.177,0.523-0.104,1.091-0.627,1.268c-0.728,0.246-1.392,0.434-2.035,0.594l0.793,1.503 c0.065,0.124,0.213,0.18,0.351,0.18c0.005,0,0.009,0,0.014-0.001c0.786-0.025,4.235-0.61,5.499-2.843 C21.981,16.315,22,16.241,22,16.164C22,11.861,20.169,6.882,19.229,6.012z M9.04,13.988c-0.829,0-1.5-0.893-1.5-1.996 c0-1.102,0.671-1.996,1.5-1.996c0.832-0.11,1.482,0.893,1.5,1.996C10.54,13.095,9.869,13.988,9.04,13.988z M14.996,14.012 c-0.829,0-1.5-0.895-1.5-2s0.671-2,1.5-2s1.5,0.895,1.5,2S15.825,14.012,14.996,14.012z" />
                </svg>
              </IconButton>
            </Link>
            <Link
              href=""
              aria-label="github"
              title="GitHub"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="github" size="large">
                <GitHubIcon fontSize="inherit" />
              </IconButton>
            </Link>
            <Link
              href=""
              aria-label="Telegram"
              title="Telegram"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="telegram" size="large">
                <TelegramIcon fontSize="inherit" />
              </IconButton>
            </Link>
            <Link
              sx={{ display: 'flex', justifyContent: 'center' }}
              href=""
              aria-label="twitter"
              title="Twitter"
              rel="noreferrer"
              target="_blank"
            >
              <IconButton aria-label="twitter" size="large">
                <TwitterIcon fontSize="inherit" />
              </IconButton>
            </Link>
            <CopyToClipboard>
              {({ copy }) => (
                <IconButton
                  aria-label="share"
                  onClick={() => copy(window.location)}
                  size="large"
                >
                  <ShareIcon fontSize="inherit" />
                </IconButton>
              )}
            </CopyToClipboard>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography
              variant="h4"
              sx={{ mt: '2rem', fontWeight: '800' }}
            >
              Introduction
            </Typography>
            <Typography variant="p">
              ErgoPad is a project incubator offering token IDOs which provide funding for new projects within the Ergo ecosystem. Ergopad released its own native token through an IDO (Initial Dex Offering), and users are be able to stake Ergopad tokens through smart contracts on-chain.
            </Typography>
            <Typography variant="p">
              If you stake ErgoPad tokens and reach one of the tiers outlined in the staking section, you'll be given an opportunity to contribute to the DAOs of projects launched through the Ergopad platform, before they go live on any dex. These seed rounds will often be lower than the price the tokens list at during the IDO, allowing you to partcipate in the DAOs of various projects. 
            </Typography>
            <Typography variant="p">
              SigUSD and Erg raised by DAOs in the early contribution rounds will be used, as voted by DAO members, to build projects on the Ergo platform.
            </Typography>
            <Typography variant="p">
              Ergopad is not an investing platform, we are here to bring people together and create DAOs which organize people&apos;s goals to build blockchain solutions on Ergo and in other related ecosystems. 
            </Typography>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="disclaimer">
              Disclaimer
            </Typography>
            <Typography variant="p">
              All information is subject to change.
            </Typography>
            <Typography variant="p">
              Using the ergopad.io website is not the same as using the Ergo blockchain. When you use the ErgoPad website to generate transactrions for you, you&apos;ll still need to use a native Ergo wallet to send the transactions and interact with the blockchain.
            </Typography>
            <Typography variant="p">
              Connecting your wallet on the ergopad.io website doesn&apos;t give the website any control over your funds. It stores the public address of your Ergo wallet in localStorage on your device, and will use that data to compile ergoscript contracts for you to interact with on chain. The data will never be stored on the ergopad.io servers.
            </Typography>
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="our-philosophy">
              Our Philosophy
            </Typography>
            <Typography variant="p">
              We believe that all people should have full access to and full control over their finances. No government should have the right to control what someone can and can't invest in, or how they can spend their money. We also believe control of the money supply should be taken from governments, since governments have proven they don't take the responsibility seriously enough, and contiunue to choose profits for the ultra-wealthy over fairness for common people.
            </Typography>
            <Typography variant="p">
              As the government attempts to print us out of problems of their making, the resulting inflation erodes people's buying power. Corporations continue to charge more for goods and services, while refusing to give fair wages to workers.
            </Typography>
            <Typography variant="p">
              Beginning with Bitcoin, cryptocurrency became a financial revolution that can help free people from this cycle. While Bitcoin gave us a fantastic store of value, Ethereum proved that on-chain dApps could replace much of the financial services we traditionally have relied on investment banks and large hedge funds to provide. Anyone who has used Ethereum knows there are flaws in the design; you find out quick when a transaction costs over $80 USD in gas fees. However, it was a great proof of concept, and Ergo is here to carry that torch to the next stage of development. With a robust PoW backing, novel concepts like extended-UTXO, NIPOPOWs, and Sigma protocols, Ergo is set to be the next iteration in blockchain ecosystem solutions.
            </Typography>
            <Typography variant="p">
              Because the eUTXO system is still in its infancy, the user experience is severly lacking in comparison to other projects like Ethereum that have had a several year head start. However, that leaves a lot of room for growth, and we would like to be part of that growth.
            </Typography>
            <Typography variant="p">
              ErgoPad was created to generate financial backing for the developers who need it, so we can help the Ergo platform grow into a safe, accessible financial ecosystem where everyone has fair access. All dApps should provide an experience where a user's data is only shared when they want it to, and where they can leverage or spend their money any way they wish with minimal fees for doing so. Some devs don't have strong marketing skills, and other teams have a great idea and community but no devs to build it. That's where we come in. We can put teams together, raise funds, grow the communities, and create the future of free market access for all. We'd love to have you join us on this journey!
            </Typography>
          </Box>
          {/*           <Box sx={{ mb: '2rem' }}>
            <Typography variant="h4" sx={headingStyle} id="roadmap">
              Roadmap
            </Typography>
          </Box> */}
          <Box sx={{ mb: '2rem' }}>
            <Typography
              variant="h4"
              sx={headingStyle}
              id="tokenomics"
            >
              Tokenomics
            </Typography>
            <DataTable data={tokenomicsData} />
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              DAO Tokens
            </Typography>
            <Typography variant="p">
              The ErgoPad DAO will receive 6% of the total supply of tokens. This will be released quarterly to the DAO over 6 quarters (one and a half years). The DAO will vote to determine how those tokens will be spent. Typically these tokens will be used for marketing purposes.
            </Typography>
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              Vesting Schedule
            </Typography>
            <DataTable data={vestingData} />
          </Box>
          <Box sx={{ mb: '2rem' }}>
            <Typography
              variant="h4"
              sx={headingStyle}
              id="staking"
            >
              Staking
            </Typography>
            <Typography variant="p">
              Staking provides a few utilites. Staking your ErgoPad tokens will generate new tokens based on the number you have staked and the emission schdule. If you reach one of the staking tiers, you'll get pool allocation which gives you an opportunity to contribute to new projects launched on ErgoPad at staker and seed round rates not available to everyone.
            </Typography>
            <Typography variant="p">
              Staking went live  on January 26th.
            </Typography>
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              Tiers
            </Typography>
            <DataTable data={stakingTiers} />
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              Pool Allocation
            </Typography>
            <Typography variant="p">
              Pool allocation will be determined on a case-by-case basis for each project. Projects will have some tokens reserved for ErgoPad stakers. A staking snapshot date will be announced ahead of time, and a sign-up form will be provided. Anyone staking in a tier during that time who signed up will be eligible for their share of staker round tokens based on their pool weight.
            </Typography>
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              Token Emission
            </Typography>
            <Typography variant="p">
              There will be 400M total ErgoPad tokens, and 321M of them will be sent to stakers over a 3 year period. The APY will vary day-to-day based on the number of staked tokens and the total tokens left.
            </Typography>
            <Typography
              variant="h5"
              sx={headingStyle}
            >
              Early Unstaking Fees
            </Typography>
            <Typography variant="p">
              There are fees for unstaking early, in order to prevent people from staking the day before a snapshot, then unstaking the day after. Staking Ergopad tokens should be an indication that you are interested in contributing to project development over a long-term time-frame. The intention behind this project is to group together and help build the Ergo blockchain. 
            </Typography>
            <DataTable data={earlyUnstakingTable} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Whitepaper;
