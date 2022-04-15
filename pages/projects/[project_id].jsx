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
  Avatar,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@components/MuiNextLink';
import CenterTitle from '@components/CenterTitle';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import MenuIcon from '@mui/icons-material/Menu';
import CopyToClipboard from '@components/CopyToClipboard';
import MarkdownRender from '@components/MarkdownRender';
import Roadmap from '@components/projects/Roadmap';
import Team from '@components/projects/Team';
import Tokenomics from '@components/projects/Tokenomics';
import Distribution from '@components/projects/Distribution';
import axios from 'axios';

const navBarLinks = [
  {
    name: 'Description',
    icon: 'info',
    link: '#',
  },
  {
    name: 'Roadmap',
    icon: 'signpost',
    link: '#roadmap',
  },
  {
    name: 'Team',
    icon: 'people',
    link: '#team',
  },
  {
    name: 'Tokenomics',
    icon: 'data_usage',
    link: '#tokenomics',
  },
  {
    name: 'Distribution',
    icon: 'toc',
    link: '#distribution',
  },
];

const headingStyle = {
  fontWeight: '800',
  mt: { xs: '-100px', sm: '-110px', md: '-70px' },
  pt: { xs: '100px', sm: '110px', md: '70px' },
};

const Project = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [isLoading, setLoading] = useState(true);
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

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/projects/${project_id}`
        );
        setProject(res.data);
      } catch {
        setProject(null);
      }
      setLoading(false);
    };

    if (project_id) getProject();
  }, [project_id]);

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
            router.push(`/projects/${project_id}/${link}`);
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
    <>
      {project ? (
        <>
          {isLoading && (
            <Container sx={{ mb: '3rem' }}>
              <CircularProgress
                size={24}
                sx={{
                  position: 'relative',
                  left: '50%',
                  marginLeft: '-12px',
                  marginTop: '400px',
                }}
              />
            </Container>
          )}
          {!isLoading && (
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
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={project.bannerImgUrl}
                      alt={project.name}
                      sx={{ width: 200, height: 200, display: 'flex' }}
                    />
                  </Box>
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
                  <Typography variant="h2">{project.name}</Typography>
                  <Typography variant="p">
                    {project.shortDescription}
                  </Typography>
                  <Divider sx={{ width: '2rem', mb: '1.5rem' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    {project?.socials?.website ? (
                      <Link
                        sx={{ display: 'flex', justifyContent: 'center' }}
                        href={project.socials.website}
                        aria-label="website"
                        title="Web"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <IconButton aria-label="website" size="large">
                          <PublicIcon fontSize="inherit" />
                        </IconButton>
                      </Link>
                    ) : null}
                    {project?.socials?.discord ? (
                      <Link
                        href={project.socials.discord}
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
                    ) : null}
                    {project?.socials?.github ? (
                      <Link
                        href={project.socials.github}
                        aria-label="github"
                        title="GitHub"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <IconButton aria-label="github" size="large">
                          <GitHubIcon fontSize="inherit" />
                        </IconButton>
                      </Link>
                    ) : null}
                    {project?.socials?.telegram ? (
                      <Link
                        href={project.socials.telegram}
                        aria-label="Telegram"
                        title="Telegram"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <IconButton aria-label="telegram" size="large">
                          <TelegramIcon fontSize="inherit" />
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
                        <IconButton aria-label="twitter" size="large">
                          <TwitterIcon fontSize="inherit" />
                        </IconButton>
                      </Link>
                    ) : null}
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
                  {project.description ? (
                    <Box sx={{ mb: '2rem' }}>
                      <Typography
                        variant="h4"
                        sx={{ mt: '2rem', fontWeight: '800' }}
                      >
                        Description
                      </Typography>
                      <MarkdownRender description={project.description} />
                    </Box>
                  ) : null}
                  {project?.roadmap?.roadmap &&
                  project.roadmap.roadmap.length ? (
                    <Box sx={{ mb: '2rem' }}>
                      <Typography variant="h4" sx={headingStyle} id="roadmap">
                        Roadmap
                      </Typography>
                      <Roadmap data={project?.roadmap?.roadmap} />
                    </Box>
                  ) : null}
                  {project?.team?.team && project.team.team.length ? (
                    <Box sx={{ mb: '2rem' }}>
                      <Typography variant="h4" sx={headingStyle} id="team">
                        Team
                      </Typography>
                      <Team data={project?.team?.team} />
                    </Box>
                  ) : null}
                  {project?.tokenomics?.tokenomics &&
                  project?.tokenomics?.tokenomics.length ? (
                    <Box sx={{ mb: '2rem' }}>
                      <Typography
                        variant="h4"
                        sx={headingStyle}
                        id="tokenomics"
                      >
                        Tokenomics
                      </Typography>
                      <Tokenomics data={project?.tokenomics?.tokenomics} />
                    </Box>
                  ) : null}
                  {project?.tokenomics?.tokenName && (
                    <Box>
                      <Typography
                        variant="h4"
                        sx={headingStyle}
                        id="distribution"
                      >
                        Distribution
                      </Typography>
                      <Distribution
                        data={project?.tokenomics?.tokenomics}
                        name={project?.tokenomics?.tokenName}
                        ticker={project?.tokenomics?.tokenTicker}
                        total={project?.tokenomics?.totalTokens}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Container>
          )}
        </>
      ) : (
        <CenterTitle
          title="Oops..."
          subtitle="Looks like the project you are looking for doesn't exist."
          main={true}
        />
      )}
    </>
  );
};

export default Project;
