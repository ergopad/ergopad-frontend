import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { trpc } from '@lib/utils/trpc';
import { useAlert } from '@contexts/AlertContext';
import EditAndCreateContributionForm from './EditAndCreateContributionForm';
import { projectSlugify } from '@utils/general';

type AddContributionRoundProps = {
  projectList: ProjectDetails[] | undefined;
  selectedProject: string | null;
}

const AddContributionRound: FC<AddContributionRoundProps> = ({ projectList, selectedProject }) => {
  const [project, setProject] = useState<ProjectDetails | undefined>(undefined)

  useEffect(() => {
    if (selectedProject) {
      setProject(projectList?.find(project => selectedProject === projectSlugify(project.name)))
    } else setProject(undefined)
  }, [selectedProject])

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Add Contribution Round
      </Typography>
      {project
        ? <EditAndCreateContributionForm
          mode="create"
          project={project}
        />
        : <Typography>Select a project to create a new Contribution round. </Typography>
      }
    </Box>
  );
};

export default AddContributionRound;
