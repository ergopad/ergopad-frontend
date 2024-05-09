import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Announcements = () => {
  const router = useRouter();
  const mtheme = useTheme();
  const matches = useMediaQuery(mtheme.breakpoints.up('md'));
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.API_URL}/announcements/`);
        res.data.reverse();
        setAnnouncements(res.data.slice(0, 2));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  const annoucementCard = (announcement) => {
    return (
      <Grid item xs={12} sm={6} md={6} key={announcement.id}>
        <Card
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <CardActionArea
            onClick={() =>
              router.push(
                '/announcements/' +
                  announcement.title
                    .toLowerCase()
                    .replaceAll(' ', '_')
                    .replaceAll(/[^a-zA-Z0-9_]/g, ''),
              )
            }
          >
            <CardMedia
              component="img"
              alt=""
              height={matches ? '300' : '200'}
              image={
                announcement.bannerImgUrl === ''
                  ? '/announcement-default.png'
                  : announcement.bannerImgUrl
              }
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ my: 3 }}
              >
                {announcement.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {announcement.shortDescription}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  const SkeletonCard = () => {
    return (
      <Grid item xs={12} sm={6} md={6}>
        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ borderRadius: '10px' }}
        />
      </Grid>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '768px',
          }}
        >
          <Typography variant="h2">Announcements</Typography>
        </Box>
      </Box>
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6, mt: 1 }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {announcements?.map((annoucement) => annoucementCard(annoucement))}
          </>
        )}
      </Grid>
    </>
  );
};

export default Announcements;
