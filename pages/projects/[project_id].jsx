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
  Icon
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@components/MuiNextLink';
import CenterTitle from '@components/CenterTitle';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import CopyToClipboard from '@components/CopyToClipboard';
import DiscordIcon from '@components/DiscordIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MarkdownRender from '@components/MarkdownRender';
import Image from 'next/image'
import Roadmap from '@components/Roadmap'
import Team from '@components/Team'
import Tokenomics from '@components/Tokenomics'
import Distribution from '@components/Distribution'

const navBarLinks = [
  {
    name: 'Description',
    icon: 'info',
    link: '#'
  },
  {
    name: 'Roadmap',
    icon: 'signpost',
    link: '#roadmap'
  },
  {
    name: 'Team',
    icon: 'people',
    link: '#team'
  },
  {
    name: 'Tokenomics',
    icon: 'data_usage',
    link: '#tokenomics'
  },
  {
    name: 'Distribution',
    icon: 'toc',
    link: '#distribution'
  },
  {
    name: 'Social',
    icon: 'forum',
    link: '#social'
  }
]

const Project = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [isLoading, setLoading] = useState(true);
  const [project, setProject] = useState({});

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
              {/* <Box sx={{ mt: '3rem', mb: '3rem' }}>
                    <img
                      src={project.bannerImgUrl}
                      alt={project.name}
                      width="100%"
                    />
                  </Box> */}
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
                  <Box sx={{ mb: '3rem', borderRadius: '150px', overflow: 'hidden' }}>
                    <Image
                      src="/paideia-test-square.png"
                      alt="paideia"
                      width={800}
                      height={800}
                    />
                  </Box>
                  <Box sx={{ 
                    position: '-webkit-sticky', 
                    position: 'sticky', 
                    top: 20,
                    // bottom: 20, 
                    paddingTop: '40px',
                    // paddingBottom: '40px',
                    zIndex: 0,
                  }}>
                  <List>
                  {navBarLinks.map(({ icon, name, link }, i) => (
                    <ListItem
                      button
                      sx={{ ...listItemSx }}
                      onClick={() => {
                        router.push(`/projects/${project_id}/${link}`);
                      }}
                    >
                      <ListItemIcon>
                        <Icon>
                          {icon}
                        </Icon>
                      </ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
                  </List>
                  {project?.socials?.website ? (
                    <>
                    <Typography fontWeight="600" sx={{ fontSize: '1rem', mt: 2 }}>
                      Website:
                    </Typography>
                      <Link
                        href={project.socials.website}
                        aria-label="website"
                        title="Web"
                        rel="noreferrer"
                        target="_blank"
                      >
                        {project.socials.website}
                      </Link>
                    </>
                  ) : null}
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  
                  <Typography variant="h2">{project.name}</Typography>
                  <Typography variant="p">{project.shortDescription}</Typography>

                  <Divider sx={{ width: '2rem', mb: '1.5rem' }} />

                  {project.description && (
                    <>
                      <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }}>
                        Description
                      </Typography>
                      <MarkdownRender description={project.description} />
                    </>
                  )}

                  <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }} id="roadmap">
                    Roadmap
                  </Typography>
                  <Roadmap />

                  <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }} id="team">
                    Team
                  </Typography>
                  <Team />

                  <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }} id="tokenomics">
                    Tokenomics
                  </Typography>
                  <Tokenomics />

                  <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }} id="distribution">
                    Distribution
                  </Typography>
                  <Distribution />

                  <Typography variant="h4" sx={{ mt: '2rem', fontWeight: '800' }} id="social">
                    Social
                  </Typography>
                  <Grid container>
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
                          onClick={() => copy(window.location)}
                        >
                          <ShareIcon />
                        </IconButton>
                      )}
                    </CopyToClipboard>
                  </Grid>
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
