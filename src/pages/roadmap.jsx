import Container from '@mui/material/Container';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import CenterTitle from '@components/CenterTitle';
import RelatedLinks from '@components/RelatedLinks/RelatedLinks';
import theme from '@styles/theme';

const relatedLinkList = [
  {
    id: 0,
    title: 'Staking',
    caption: 'How to earn with ErgoPad tokens',
    icon: 'auto_graph',
    href: '/staking',
    background: theme.palette.primary.main,
  },
  {
    id: 1,
    title: 'Projects',
    caption: 'See the projects we are building',
    icon: 'app_shortcut',
    href: '/projects',
    background: theme.palette.secondary.main,
  },
  {
    id: 2,
    title: 'Documentation',
    caption: 'Read more about how ErgoPad Works',
    icon: 'auto_stories',
    href: 'https://github.com/ergo-pad/ergopad/blob/main/docs/README.md',
    background: theme.palette.tertiary.main,
  },
];

const projectTimelines = [
  {
    projectId: 0,
    projectName: 'Paideia',
    timelineItems: [
      {
        itemId: 0,
        itemDescription: 'IDO on Ergodex',
        itemDate: 220410, // YYMMDD
        itemTime: '3:00pm UTC',
      },
    ],
  },
  {
    projectId: 1,
    projectName: 'ErgoGames.io',
    timelineItems: [
      {
        itemId: 0,
        itemDescription: 'Staker Snapshot',
        itemDate: 220411, // YYMMDD
        itemTime: '4:00pm UTC',
      },
      {
        itemId: 1,
        itemDescription: 'Seed Round Whitelist',
        itemDate: 220413, // YYMMDD
        itemTime: '2:00pm UTC',
      },
    ],
  },
  {
    projectId: 2,
    projectName: 'Darkpool',
    timelineItems: [
      {
        itemId: 0,
        itemDescription: 'Staker Snapshot',
        itemDate: 220410, // YYMMDD
        itemTime: '4:00pm UTC',
      },
      {
        itemId: 1,
        itemDescription: 'Seed Round Whitelist',
        itemDate: 220415, // YYMMDD
        itemTime: '2:00pm UTC',
      },
    ],
  },
];

const Roadmap = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ mb: '3rem' }}>
        <CenterTitle
          title="Roadmap"
          subtitle="The upcoming IDO schedules, all in one place"
          main={true}
        />

        <Timeline position="alternate">
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              9:30 am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Eat
              </Typography>
              <Typography>Because you need strength</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              variant="body2"
              color="text.secondary"
            >
              10:00 am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="primary">
                <LaptopMacIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Code
              </Typography>
              <Typography>Because it&apos;s awesome!</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="primary" variant="outlined">
                <HotelIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Sleep
              </Typography>
              <Typography>Because you need rest</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
              <TimelineDot color="secondary">
                <RepeatIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Repeat
              </Typography>
              <Typography>Because this is the life you love!</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Container>

      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  );
};

export default Roadmap;
