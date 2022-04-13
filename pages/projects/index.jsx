import { useRouter } from 'next/router';
import { Typography, Box, Container, Grid, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@components/MuiNextLink';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CenterTitle from '@components/CenterTitle';
import RelatedLinks from '@components/RelatedLinks/RelatedLinks';
import theme from '@styles/theme';
import Search from '@components/Search';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import DiscordIcon from '@components/DiscordIcon';
import { useSearch } from '../../utils/SearchContext';
import { useEffect, useState } from 'react';
import CopyToClipboard from '@components/CopyToClipboard';
import axios from 'axios';

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

const Projects = () => {
  const router = useRouter();
  const { search } = useSearch();
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/projects/`);
        setProjects(res.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getProjects();
  }, []);

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );
  const launchedProjects = filteredProjects?.filter(
    (project) => project.isLaunched
  );
  const upcomingProjects = filteredProjects?.filter(
    (project) => !project.isLaunched
  );

  const projectCard = (project) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={project.id}>
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
              setLoading(true);
              router.push(
                '/projects/' +
                  project.name
                    .toLowerCase()
                    .replaceAll(' ', '')
                    .replaceAll(/[^a-zA-Z0-9]/g, '')
              );
            }}
          >
            <CardMedia
              component="img"
              alt=""
              height="180"
              image={project.bannerImgUrl}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.shortDescription}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ justifyContent: 'right' }}>
            {/* socials go here */}
            {project?.socials?.discord ? (
              <Link
                sx={{ display: 'flex', justifyContent: 'center' }}
                href={project.socials.discord}
                aria-label="discord"
                title="Discord"
                rel="noreferrer"
                target="_blank"
              >
                <IconButton aria-label="discord">
                  <DiscordIcon />
                </IconButton>
              </Link>
            ) : null}
            {project?.socials?.github ? (
              <Link
                sx={{ display: 'flex', justifyContent: 'center' }}
                href={project.socials.github}
                aria-label="github"
                title="GitHub"
                rel="noreferrer"
                target="_blank"
              >
                <IconButton aria-label="github">
                  <GitHubIcon />
                </IconButton>
              </Link>
            ) : null}
            {project?.socials?.telegram ? (
              <Link
                sx={{ display: 'flex', justifyContent: 'center' }}
                href={project.socials.telegram}
                aria-label="Telegram"
                title="Telegram"
                rel="noreferrer"
                target="_blank"
              >
                <IconButton aria-label="telegram">
                  <TelegramIcon />
                </IconButton>
              </Link>
            ) : null}
            {project?.socials?.twitter ? (
              <Link
                sx={{ display: 'flex', justifyContent: 'center' }}
                href={project.socials.twitter}
                aria-label="twitter"
                title="Twitter"
                rel="noreferrer"
                target="_blank"
              >
                <IconButton aria-label="twitter">
                  <TwitterIcon />
                </IconButton>
              </Link>
            ) : null}
            {project?.socials?.website ? (
              <Link
                sx={{ display: 'flex', justifyContent: 'center' }}
                href={project.socials.website}
                aria-label="website"
                title="Web"
                rel="noreferrer"
                target="_blank"
              >
                <IconButton aria-label="website">
                  <PublicIcon />
                </IconButton>
              </Link>
            ) : null}
            <CopyToClipboard>
              {({ copy }) => (
                <IconButton
                  aria-label="share"
                  onClick={() =>
                    copy(
                      window.location +
                        '/' +
                        project.name
                          .toLowerCase()
                          .replaceAll(' ', '')
                          .replaceAll(/[^a-zA-Z0-9]/g, '')
                    )
                  }
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
      <Container sx={{ mb: '3rem' }}>
        <CenterTitle
          title="ErgoPad Projects"
          subtitle="Building the future of the Ergo ecosystem"
          main={true}
        />
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Search placeholder="Search projects" sx={{}} />
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-12px',
                marginTop: '72px',
              }}
            />
          )}
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: '800', mb: 4 }}>
          Upcoming IDOs
        </Typography>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {upcomingProjects?.map((project) => projectCard(project))}
        </Grid>
        <Typography variant="h4" sx={{ fontWeight: '800', mb: 4 }}>
          Completed
        </Typography>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {launchedProjects?.map((project) => projectCard(project))}
        </Grid>
      </Container>
      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  );
};

export default Projects;
