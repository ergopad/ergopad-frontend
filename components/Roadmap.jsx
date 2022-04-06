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
        itemId: 0,
        itemName: 'Test',
        itemDescription: 'Staker',
        itemDate: 1649275200, 
    },
    {
        itemId: 1,
        itemName: 'Hello',
        itemDescription: 'Stake 2',
        itemDate: 1649917200,
    },
]

const Roadmap = () => {

    

  return (
    <>
        <Timeline>
            {timelineItems.map(({ itemId, itemName, itemDescription, itemDate, itemTime }, i) => (
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
                        <Typography variant="h5">
                            {itemName}
                        </Typography>
                        <Typography variant="p">
                        {
                            new Date(itemDate * 1000)
                                .toISOString()
                                .slice(0, 10)
                        }
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '1rem' }}>
                            {itemDescription}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    </>
  );
};

export default Roadmap;
