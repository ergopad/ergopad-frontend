import React, { FC, useEffect, useState } from 'react'
import { Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { trpc } from '@utils/trpc'
import {
  ContainedTab,
  ContainedTabs,
} from '@components/styled-components/ContainedTabs'
import ProRataForm from './ProRataForm'

type ContributeTabProps = {
  projectName: string
  projectIcon: string
  projectSlug: string
}

const ContributeTab: FC<ContributeTabProps> = ({
  projectName,
  projectIcon,
  projectSlug,
}) => {
  const theme = useTheme()
  const { data: rounds } =
    trpc.contributions.getContributionRoundsByProjectSlug.useQuery(
      { projectSlug: projectSlug || '' },
      { enabled: !!projectSlug }
    )

  const [tabValue, setTabValue] = useState(0)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ mb: 2 }}>
      {rounds && rounds.length > 0 ? (
        <>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="styled tabs example"
          >
            {rounds.map((round, i) => (
              <Tab key={`tab-${i}`} label={round.name} />
            ))}
          </Tabs>
          <Box sx={{ my: 2 }}>
            {rounds.map(
              (round, i) =>
                tabValue === i && (
                  <ProRataForm
                    key={`form-${i}`}
                    {...round}
                    projectName={projectName}
                    projectIcon={projectIcon}
                  />
                )
            )}
          </Box>
        </>
      ) : (
        <Typography>
          No contribution rounds available at this time. Check back soon.
        </Typography>
      )}
    </Box>
  )
}

export default ContributeTab
