import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Typography, Divider } from '@mui/material'
import { CircularProgress } from '@mui/material'
import MuiNextLink from '@components/MuiNextLink'
import CenterTitle from '@components/CenterTitle'
import axios from 'axios'
import MarkdownRender from '@components/MarkdownRender'

const Job = () => {
  const router = useRouter()
  const { job_id } = router.query
  const [isLoading, setLoading] = useState(true)
  const [job, setJob] = useState({})

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/jobs/${job_id}`)
        setJob(res.data)
      } catch {
        setJob(null)
      }
      setLoading(false)
    }

    if (job_id) getJobDetails()
  }, [job_id])

  return (
    <>
      {job && !job.archived ? (
        <>
          <Container maxWidth="960px" sx={{ maxWidth: '960px', mx: 'auto' }}>
            <Typography variant="h4" sx={{ mt: 5 }}>
              Careers
            </Typography>
          </Container>
          {isLoading && (
            <Container sx={{ mb: '3rem' }}>
              <CircularProgress
                size={24}
                sx={{
                  position: 'relative',
                  left: '50%',
                  marginLeft: '-12px',
                  marginTop: '120px',
                }}
              />
            </Container>
          )}
          {!isLoading && (
            <Container maxWidth="760px" sx={{ maxWidth: '760px', mx: 'auto' }}>
              <Typography variant="h2" sx={{ mt: 5 }}>
                {job.title}
              </Typography>
              <Typography variant="body2">{job.shortDescription}</Typography>
              <Divider sx={{ width: '2rem', mb: '1.5rem' }} />
              {job.description && (
                <>
                  <Typography variant="h4" sx={{ mt: '2rem' }}>
                    Description
                  </Typography>
                  <MarkdownRender description={job.description} />
                </>
              )}
              <Typography variant="h4" sx={{ mt: '2rem' }}>
                Apply
              </Typography>
              <Typography variant="body2">
                Join the{' '}
                <MuiNextLink
                  href="https://discord.gg/Ph9Wsw6v"
                  rel="noreferrer"
                  target="_blank"
                >
                  #development
                </MuiNextLink>{' '}
                channel today.
              </Typography>
            </Container>
          )}
        </>
      ) : (
        <CenterTitle
          title="Oops..."
          subtitle="Looks like the job id you are looking for doesn't exist or has already been archived."
          main={true}
        />
      )}
    </>
  )
}

export default Job
