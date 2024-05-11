import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Grid, Paper
} from '@mui/material';
import { trpc } from '@lib/utils/trpc';
import AdminMenu from '@components/admin-trpc/AdminMenu';
import { useAlert } from '@contexts/AlertContext';
import AddContributionRound from '../contribution/AddContributionRound';
import EditContributionRound from '../contribution/EditContributionRound';
import DeleteContributionRound from '../contribution/DeleteContributionRound';
import SelectProject from '../SelectProject';
import axios from 'axios';

const ContributionRoundPage: FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const [projectList, setProjectList] = useState<ProjectDetails[]>([])
  useEffect(() => {
    const getProjectData = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/projects/?include_drafts=true`
        )
        const projectData: ProjectDetails[] = res.data
        const sortedProjectData = projectData.sort((a, b) => a.id - b.id)
        setProjectList(sortedProjectData)
      } catch (e) {
        console.log(e)
      }
    }

    getProjectData()
  }, [])

  return (
    <AdminMenu>
      <Typography variant="h2" sx={{ mt: 10, mb: 4, fontWeight: '700' }}>
        Create Contribution Round
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select a project
        </Typography>
        <Box sx={{ maxWidth: '350px' }}>
          <SelectProject selectedProject={selectedProject} setSelectedProject={setSelectedProject} projectList={projectList} />
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <AddContributionRound selectedProject={selectedProject} projectList={projectList} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <EditContributionRound selectedProject={selectedProject} projectList={projectList} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <DeleteContributionRound selectedProject={selectedProject} />
      </Box>
    </AdminMenu>
  );
};

export default ContributionRoundPage;
