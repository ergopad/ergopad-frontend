import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useWhitelistProjects } from "@hooks/useWhitelistProjects";
import { useContributionProjects } from "@hooks/useContributionProjects";

var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ActiveRound = () => {
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [included, setIncluded] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive, isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/projects/`)
        setProjects(res.data);
        // console.log('projects fired')
      } catch (e) {
        console.error(e);
      }
      setLoading(false)
    }
    getProjects();
  }, []);

  const checkProject = (project) => {
    return included.includes(project.name.toLowerCase())
  }

  useEffect(() => {
    contributionProjectsActive?.map((project) => (
      setIncluded(previous => [...previous, project.projectName.toLowerCase()])
    ))
    whiteListProjectsActive?.map((project) => (
      setIncluded(previous => [...previous, project.projectName.toLowerCase()])
    ))
    // console.log('projects changed')
  }, [projects]);

  useEffect(() => {
    setFilteredProjects(projects?.filter(project => checkProject(project)))
  }, [included]);

  return (
    <>
      {isLoading && (
        <>
          <Typography>Hello</Typography>
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              left: "50%",
              marginLeft: "-12px",
              marginTop: "72px",
            }}
          /></>
      )}
      {filteredProjects.map((project) => (
        <Grid
          container
          key={project.id}
          direction="row"
        >
          <Grid item md={6} xs={12}>


            <Typography gutterBottom variant="h4" component="div">
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.shortDescription}
            </Typography>

          </Grid>
          <Grid item md={6} xs={12}>


            {project.roadmap.roadmap.map((item, i) => (
              <Grid container key={i} sx={{ mb: '24px' }}>
                <Grid item xs={1} md={2}>
                  <Typography sx={{ fontSize: '.875rem' }}>
                    {months[parseInt(item.date.slice(5, 7))]}
                  </Typography>
                  <Typography sx={{ fontSize: '2.25rem', lineHeight: 0.7 }}>
                    {item.date.slice(8, 10)}
                  </Typography>
                </Grid>
                <Grid item xs={11} md={10}>
                  {item.name}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))
      }
      <Divider sx={{ mb: 10 }} />
    </>
  );
};

export default ActiveRound;