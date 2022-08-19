import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Divider,
  Button
} from '@mui/material';
import axios from 'axios';
import { useWhitelistProjects } from "@hooks/useWhitelistProjects";
import { useContributionProjects } from "@hooks/useContributionProjects";
import Image from 'next/image';
import { ProjectCard } from "@components/projects/ProjectCard"

const ActiveRound: FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any>([]);
  const [included, setIncluded] = useState<any>([]);
  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive, isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/projects/`);
        contributionProjectsActive?.map((project) => (
          setIncluded(previous => [...previous, project.projectName.toLowerCase()])
        ))
        whiteListProjectsActive?.map((project) => (
          setIncluded(previous => [...previous, project.projectName.toLowerCase()])
        ))
        setProjects(res.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getProjects();

  }, []);

  const checkProject = (project) => {
    return included.includes(project.name.toLowerCase())
  }

  const filteredProjects = projects?.filter(project => checkProject(project))

  return (
    <>
      {filteredProjects.map((project) => (
        <Grid
          container
          key={project.id}
          direction="row"
        >

          <ProjectCard key={project.id} project={project} />

          <Grid item md={8}>
            <Button>
              Hello
            </Button>
          </Grid>
        </Grid>
      ))}
      <Divider sx={{ mb: 10 }} />
    </>
  );
};

export default ActiveRound;