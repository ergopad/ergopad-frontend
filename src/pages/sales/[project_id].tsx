import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Box,
  Button,
} from '@mui/material'
import CenterTitle from '@components/CenterTitle'
import Roadmap from '@components/projects/Roadmap'
import Team from '@components/projects/Team'
import Tokenomics from '@components/projects/Tokenomics'
import axios from 'axios'
import { projectSlugify } from '@utils/general'
import ContributeTab from '@components/projects/contribute/ContributeTab'
import { IProject } from '@pages/projects/[project_id]'

const Sale = () => {
  const router = useRouter()
  const { project_id } = router.query
  const [isLoading, setLoading] = useState(true)
  const [project, setProject] = useState<IProject | undefined>(undefined)

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/projects/${project_id}`
        )
        setProject(res.data)
      } catch {
        if (project_id === 'pandav') {
          setProject({
            id: 1,
            name: 'PandaV',
            shortDescription: '',
            description: '',
            fundsRaised: 0,
            bannerImgUrl: '/PandaVlogoColor1024x1024.jpg',
            isLaunched: false,
            socials: {
              telegram: '',
              discord: '',
              github: '',
              twitter: '',
              website: '',
            },
            roadmap: {
              roadmap: [],
            },
            team: {
              team: [],
            },
            tokenomics: {
              tokenName: '',
              totalTokens: 0,
              tokenTicker: '',
              tokenomics: [],
            },
            isDraft: false,
          })
        } else {
          setProject(undefined)
        }
      }
      setLoading(false)
    }

    if (project_id) getProject()
  }, [project_id])

  return (
    <>
      <Container maxWidth="lg" sx={{ mb: '3rem' }}>
        {project &&
          <>
            <Box sx={{ mt: 4 }}>
              <CenterTitle
                title={`${project.name} Contribution Rounds`}
                subtitle=""
                main={false}
              />
            </Box>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => router.push(`/projects/${project_id}`)}
              >
                Back to Project Page
              </Button>
            </Box>
            <ContributeTab
              projectName={project.name}
              projectIcon={project.bannerImgUrl}
              projectSlug={projectSlugify(project.name)}
            />
          </>
        }
      </Container>
    </>
  )
}

export default Sale
