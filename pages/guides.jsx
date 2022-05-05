import { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/system';
import PageTitle from '@components/PageTitle';
import Search from '@components/Search';
import CopyToClipboard from '@components/CopyToClipboard';
import { useSearch } from '../utils/SearchContext';
import theme from '@styles/theme';
import axios from 'axios';

const SortButton = styled(Button)({
  borderRadius: `20px`,
  background: theme.palette.greyButton.background,
  color: theme.palette.text.tertiary,
  fontSize: '1rem',
  textTransform: 'none',
  '&:hover': {
    background: theme.palette.greyButton.hover,
  },
});

const generateYoutubeBannerUrl = (link) => {
  const params = new URLSearchParams(link.split('?')[1]);
  const v = params.get('v') ? params.get('v') : 'default';
  return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
};

const Guides = () => {
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const { search } = useSearch();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const tutorials = (await axios.get(`${process.env.API_URL}/tutorials/`))
          .data;
        const categories = (
          await axios.get(`${process.env.API_URL}/tutorials/categories`)
        ).data;
        setTutorials(tutorials);
        setCategories(categories);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'all' || tutorial.category === category)
  );

  const tutorialCard = (tutorial) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
        <Card
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <CardActionArea
            onClick={() => {
              window.open(tutorial.link, '_blank');
            }}
          >
            <CardMedia
              component="img"
              alt=""
              height="180"
              image={
                tutorial.linkType === 'youtube' &&
                tutorial.config.use_youtube_banner
                  ? generateYoutubeBannerUrl(tutorial.link)
                  : tutorial.bannerImgUrl
              }
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {tutorial.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tutorial.shortDescription}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ justifyContent: 'right' }}>
            <CopyToClipboard>
              {({ copy }) => (
                <IconButton
                  aria-label="share"
                  onClick={() => copy(tutorial.link)}
                >
                  <ShareIcon />
                </IconButton>
              )}
            </CopyToClipboard>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <Container sx={{ mx: 'auto' }}>
        <PageTitle
          title="Learn how to use our dApps"
          subtitle="You can watch the videos or follow the guides and learn how our various dApps can be used"
        />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Search placeholder="Search Tutorials" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: '2rem',
          }}
        >
          <SortButton
            variant="contained"
            disableElevation
            onClick={() => setCategory('all')}
          >
            View All
          </SortButton>
          {categories.map((category) => (
            <SortButton
              key={category}
              variant="contained"
              disableElevation
              onClick={() => setCategory(category)}
            >
              {category.slice(0, 1).toUpperCase() + category.slice(1)}
            </SortButton>
          ))}
        </Box>
        <Box sx={{ my: 1 }}>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {filteredTutorials?.map((tutorial) => tutorialCard(tutorial))}
        </Grid>
      </Container>
    </>
  );
};

export default Guides;
