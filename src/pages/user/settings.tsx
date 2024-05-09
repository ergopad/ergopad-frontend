import React, { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  Box,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
  Grid,
} from '@mui/material'
import Section from '@components/layout/Section'
import { NextPage } from 'next'
import { trpc } from '@utils/trpc'
import { useWallet } from '@contexts/WalletContext'
import Link from 'next/link'

const Settings: NextPage = () => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const [loading, setLoading] = useState(true)
  const userDetails = trpc.user.getUserDetails.useQuery({
    name: true,
    email: true,
    whitelists: true,
    image: true,
    sumsubStatus: true,
  })
  const { sessionStatus, providerLoading } = useWallet()
  const [formErrors, setFormErrors] = useState<{
    name: boolean
    email: boolean
  }>({ name: false, email: false })
  const [formInput, setFormInput] = useState<{ name: string; email: string }>({
    name: '',
    email: '',
  })

  useEffect(() => {
    if (
      sessionStatus === 'authenticated' ||
      sessionStatus === 'unauthenticated'
    ) {
      setLoading(false)
    }
  }, [sessionStatus])

  useEffect(() => {
    if (sessionStatus === 'authenticated' && userDetails.status === 'success') {
      console.log('edit')
      setFormInput((prev) => {
        return {
          ...prev,
          name: userDetails.data.user.name ?? '',
          email: userDetails.data.user.email ?? '',
        }
      })
    }
  }, [sessionStatus, userDetails.status])

  const handleChange = (e: any) => {
    if (e.target.value == '' && e.target.name !== 'email') {
      setFormErrors({
        ...formErrors,
        [e.target.name]: true,
      })
    } else {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      })
    }

    const emailRegex = /\S+@\S+\.\S+/

    if (e.target.name === 'email') {
      if (emailRegex.test(e.target.value) || e.target.value === '') {
        setFormErrors({
          ...formErrors,
          email: false,
        })
      } else {
        setFormErrors({
          ...formErrors,
          email: true,
        })
      }
    }

    setFormInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  return (
    <>
      {providerLoading || loading ? (
        <>Loading...</>
      ) : sessionStatus !== 'authenticated' ? (
        <Box sx={{ my: '30vh', textAlign: 'center' }}>
          <Typography variant="h1">Not Authenticated</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography>
              Return{' '}
              <Link href="/" passHref>
                <MuiLink>Home</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Section
            title="Account Settings"
            subtitle="View and change your account details."
            main={true}
            toggleOutside={true}
            extra={
              <>
                <Typography variant="h3">This section coming soon. </Typography>
              </>
            }
          >
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  name="name"
                  label="Your Full Name"
                  disabled
                  value={formInput.name}
                  error={formErrors.name}
                  id="name"
                  variant="filled"
                  helperText={formErrors.name && 'Please enter your full name'}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  name="email"
                  label="Your Email"
                  disabled
                  value={formInput.email}
                  error={formErrors.email}
                  id="email"
                  variant="filled"
                  helperText={
                    formErrors.email && 'Please enter a valid email address'
                  }
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button variant="contained">Delete account</Button>
          </Section>
        </>
      )}
    </>
  )
}

export default Settings
