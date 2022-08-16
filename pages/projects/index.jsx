import { Typography, Box, Container, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CenterTitle from "@components/CenterTitle";
import RelatedLinks from "@components/RelatedLinks/RelatedLinks";
import theme from "@styles/theme";
import Search from "@components/Search";
import { useSearch } from "../../utils/SearchContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWhitelistProjects } from "../../hooks/useWhitelistProjects";
import { useContributionProjects } from "../../hooks/useContributionProjects";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { ActiveProjectCard } from "../../components/projects/ActiveProjectCard";

const relatedLinkList = [
  {
    id: 0,
    title: "Documentation",
    caption: "Read about how Ergopad Works",
    icon: "auto_stories",
    href: "/whitepaper",
    background: theme.palette.primary.main,
  },
  {
    id: 1,
    title: "About",
    caption: "Learn more about who we are",
    icon: "emoji_people",
    href: "/about",
    background: theme.palette.secondary.main,
  },
  {
    id: 2,
    title: "Apply for IDO",
    caption: "Submit your own project proposal",
    icon: "chat",
    href: "/apply",
    background: theme.palette.tertiary.main,
  },
];

const Projects = () => {
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
  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive,
    isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();
  console.log(contributionProjectsActive);
  return (
    <>
      <Container sx={{ mb: "3rem" }}>
        <CenterTitle
          title="ErgoPad Projects"
          subtitle="Building the future of the Ergo ecosystem"
          main={true}
        />
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Search placeholder="Search projects" sx={{}} />
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                left: "50%",
                marginLeft: "-12px",
                marginTop: "72px",
              }}
            />
          )}
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: "800", mb: 4 }}>
          Upcoming IDOs
        </Typography>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {upcomingProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Grid>
        {contributionProjectsActive?.length !== 0 ||
        whiteListProjectsActive?.length !== 0 ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: "800", mb: 4 }}>
              Active Rounds
            </Typography>
            <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
              {contributionProjectsActive?.map((project) => (
                <ActiveProjectCard
                  key={project.id}
                  type="contribution"
                  project={project}
                />
              ))}
              {whiteListProjectsActive?.map((project) => (
                <ActiveProjectCard
                  key={project.id}
                  type="whitelist"
                  project={project}
                />
              ))}
            </Grid>
          </>
        ) : null}
        <Typography variant="h4" sx={{ fontWeight: "800", mb: 4 }}>
          Completed
        </Typography>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {launchedProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Grid>
      </Container>
      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  );
};

export default Projects;
