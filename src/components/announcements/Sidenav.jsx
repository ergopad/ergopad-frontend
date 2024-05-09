import {
  Box,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Sidenav = () => {
  const listItemSx = {
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([
    { id: 0, title: 'Loading...' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.API_URL}/announcements/`);
        res.data.reverse();
        setAnnouncements(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
        Announcements
      </Typography>
      <List>
        {announcements.map((announcement) => (
          <ListItem
            key={announcement.id}
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              if (!loading)
                router.push(
                  '/announcements/' +
                    announcement.title
                      .toLowerCase()
                      .replaceAll(' ', '_')
                      .replaceAll(/[^a-zA-Z0-9_]/g, '')
                );
            }}
          >
            <ListItemIcon>
              <CampaignIcon />
            </ListItemIcon>
            <ListItemText primary={announcement.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidenav;
