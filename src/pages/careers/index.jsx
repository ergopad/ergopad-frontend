import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Typography, Box, Container, Grid, IconButton } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import ShareIcon from '@mui/icons-material/Share'
import CopyToClipboard from '@components/CopyToClipboard'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CenterTitle from '@components/CenterTitle'
import Search from '@components/Search'
import { useSearch } from '../../utils/SearchContext'
import RelatedLinks from '@components/RelatedLinks/RelatedLinks'
import theme from '@styles/theme'
import axios from 'axios'

const relatedLinkList = [
  {
    id: 0,
    title: 'Documentation',
    caption: 'Read about how Ergopad Works',
    icon: 'auto_stories',
    href: '/whitepaper',
    background: theme.palette.primary.main,
  },
  {
    id: 1,
    title: 'About',
    caption: 'Learn more about who we are',
    icon: 'emoji_people',
    href: '/about',
    background: theme.palette.secondary.main,
  },
  {
    id: 2,
    title: 'Apply for IDO',
    caption: 'Submit your own project proposal',
    icon: 'chat',
    href: '/apply',
    background: theme.palette.tertiary.main,
  },
]

const Careers = () => {
  const router = useRouter()
  const { search } = useSearch()
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/jobs/`)
        setJobs(res.data.filter((job) => !job.archived))
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }

    getJobs()
  }, [])

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search)
  )

  const jobCard = (job) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={job.id}>
        <Card
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <CardActionArea
            onClick={() => {
              setLoading(true)
              router.push('/careers/' + job.id.toString(10))
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.shortDescription}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ justifyContent: 'right' }}>
            <CopyToClipboard>
              {({ copy }) => (
                <IconButton
                  aria-label="share"
                  onClick={() =>
                    copy(window.location + '/' + job.id.toString(10))
                  }
                >
                  <ShareIcon />
                </IconButton>
              )}
            </CopyToClipboard>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  return (
    <>
      <Container sx={{ mb: '3rem' }}>
        <CenterTitle
          title="Join us."
          subtitle="We are always looking for smart people to join our team"
          main={true}
        />
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Search placeholder="Search for a role that suits you" />
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-12px',
                marginTop: '72px',
              }}
            />
          )}
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: '800', mb: 4 }}>
          Open Positions
        </Typography>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
          {filteredJobs?.map((job) => jobCard(job))}
        </Grid>
      </Container>
      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  )
}

export default Careers
