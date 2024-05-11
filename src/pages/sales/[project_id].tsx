import { useEffect, useState, Fragment, useMemo } from 'react'
import { useRouter } from 'next/router'
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
  ListItemButton,
  useTheme,
  Link,
  Fade,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import CenterTitle from '@components/CenterTitle'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import PublicIcon from '@mui/icons-material/Public'
import ShareIcon from '@mui/icons-material/Share'
import MenuIcon from '@mui/icons-material/Menu'
import CopyToClipboard from '@components/CopyToClipboard'
import MarkdownRender from '@components/MarkdownRender'
import Roadmap from '@components/projects/Roadmap'
import Team from '@components/projects/Team'
import Tokenomics from '@components/projects/Tokenomics'
import Distribution from '@components/projects/Distribution'
import axios from 'axios'
import { useWhitelistProjects } from '../../lib/hooks/useWhitelistProjects'
import { useContributionProjects } from '../../lib/hooks/useContributionProjects'
import { scroller } from 'react-scroll'
import { trpc } from '@utils/trpc'
import { projectSlugify } from '@utils/general'
import {
  ContainedTab,
  ContainedTabs,
} from '@components/styled-components/ContainedTabs'
import ContributeTab from '@components/projects/contribute/ContributeTab'

export interface Project {
  name: string
  shortDescription: string
  description: string
  fundsRaised: number
  bannerImgUrl: string
  isLaunched: boolean
  socials: Socials
  roadmap: Roadmap
  team: Team
  tokenomics: Tokenomics
  isDraft: boolean
  id: number
}

interface Socials {
  telegram: string
  twitter: string
  discord: string
  github: string
  website: string
}

interface Roadmap {
  roadmap: RoadmapItem[]
}

interface RoadmapItem {
  name: string
  description: string
  date: string
}

interface Team {
  team: TeamMember[]
}

interface TeamMember {
  name: string
  description: string
  profileImgUrl: string
  socials: TeamMemberSocials
}

interface TeamMemberSocials {
  twitter: string
  linkedin: string
}

interface Tokenomics {
  tokenName: string
  totalTokens: number
  tokenTicker: string
  tokenomics: TokenomicsItem[]
}

interface TokenomicsItem {
  name: string
  amount: number
  value: string
  tge: string
  freq: string
  length: string
  lockup: string
}

const navBarLinks = [
  {
    name: 'Description',
    icon: 'info',
    link: 'top',
  },
  {
    name: 'Roadmap',
    icon: 'signpost',
    link: 'roadmap',
  },
  {
    name: 'Team',
    icon: 'people',
    link: 'team',
  },
  {
    name: 'Tokenomics',
    icon: 'data_usage',
    link: 'tokenomics',
  },
  {
    name: 'Distribution',
    icon: 'toc',
    link: 'distribution',
  },
]

const headingStyle = {
  fontWeight: '800',
  mt: { xs: '-100px', sm: '-110px', md: '-70px' },
  pt: { xs: '100px', sm: '110px', md: '70px' },
}

const Project = () => {
  const router = useRouter()
  const { project_id } = router.query
  const [isLoading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | undefined>(undefined)

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/projects/${project_id}`
        )
        setProject(res.data)
      } catch {
        setProject(undefined)
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

export default Project
