import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon'

const timelineItems = [
    {
        itemName: 'Staker Whitelist',
        itemDescription: 'Sign up for the staker whitelist to make sure your wallet is scanned when we do the snapshot. ',
        itemDate: 1649275200, 
    },
    {
        itemName: 'Staker Snapshot',
        itemDescription: 'All Ergopad stakers will be scanned on this date, and we will generate the staker whitelist. Once complete, tokens will be airdropped to everyone and you\'ll be able to contribute once the form is live. ',
        itemDate: 1649917200,
    },
]

const Roadmap = () => {

  return (
    <Timeline>
        {timelineItems.map((item) => {
            const itemTime = new Date(item?.itemDate * 1000).toISOString()
            return (
                <TimelineItem sx={{ 
                    '&::before': {
                        p: 0,
                        flex: 'none'
                    }
                }}>
                    <TimelineSeparator>
                        <TimelineDot>
                            <Icon sx={{ color: 'rgb( 29, 29, 32 )' }}>
                                check_circle
                            </Icon>
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h5" sx={{ mt: '-3px' }}>
                            {item?.itemName}
                        </Typography>
                        <Typography variant="p" sx={{ mb: 1 }}>
                            {itemTime.slice(0, 10) + ', ' + itemTime.slice(11, 16) + ' UTC'}
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '1rem', mb: 1 }}>
                            {item?.itemDescription}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            )
        })}
    </Timeline>
  );
};

export default Roadmap;
