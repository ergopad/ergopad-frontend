import { CircularProgress, Grid, useMediaQuery } from '@mui/material';
import CenterTitle from '@components/CenterTitle';
import Sidenav from '@components/announcements/Sidenav';
import AnnouncementBody from '@components/announcements/AnnouncementBody';
import RelatedLinks from '@components/RelatedLinks/RelatedLinks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import theme from '@styles/theme';

const relatedLinkList = [
  {
    id: 0,
    title: 'Documentation',
    caption: 'Read about how Ergopad Works',
    icon: 'auto_stories',
    href: 'https://github.com/ergo-pad/ergopad/blob/main/docs/README.md',
    background: theme.palette.primary.main,
  },
  {
    id: 1,
    title: 'About',
    caption: 'Learn more about who we are',
    icon: 'emoji_people',
    href: '/about',
    background: theme.palette.secondary.main,
  },
  {
    id: 2,
    title: 'Apply for IDO',
    caption: 'Submit your own project proposal',
    icon: 'chat',
    href: '/apply',
    background: theme.palette.tertiary.main,
  },
];

const Announcement = () => {
  const smallCheck = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const router = useRouter();
  const { announcement_id } = router.query;
  const [announcement, setAnnouncement] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.API_URL}/announcements/${announcement_id}`,
        );
        setAnnouncement(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    if (announcement_id && announcement_id !== '') {
      getData();
    }
  }, [announcement_id]);

  return (
    <>
      <Grid
        container
        maxWidth="lg"
        sx={{
          mx: 'auto',
          flexDirection: 'row',
          px: { xs: 2, md: 3 },
        }}
      >
        <Grid item md={8} xs={12}>
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                position: 'relative',
                left: '50%',
                marginLeft: '-12px',
                marginTop: '120px',
              }}
            />
          ) : Object.keys(announcement).length ? (
            <AnnouncementBody announcement={announcement} />
          ) : (
            <CenterTitle
              title=""
              subtitle="Announcement not found"
              main={true}
            />
          )}
        </Grid>
        {smallCheck && (
          <Grid
            item
            md={4}
            xs={12}
            sx={{ flexGrow: 1, mt: smallCheck ? 12 : 0 }}
          >
            <Sidenav />
          </Grid>
        )}
      </Grid>
      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  );
};

export default Announcement;
