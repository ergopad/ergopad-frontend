import CenterTitle from '@components/CenterTitle'
import { Grid, Box, Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const onLogout = async () => {
    const data = {}
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          'jwt_token_login_422'
        )}`,
      },
    }
    try {
      await axios.post(
        `${process.env.API_URL}/auth/logout`,
        data,
        defaultOptions
      )
    } catch (e) {
      console.log(e)
    }
    sessionStorage.removeItem('jwt_token_login_422')
    router.reload()
  }

  return (
    <Grid item md={9} sx={12}>
      <CenterTitle
        title="Ergopad Admin"
        subtitle="Ergopad Web Content Management Console."
        main={true}
      />
      <Grid
        container
        maxWidth="lg"
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          mx: 'auto',
          flexDirection: 'row-reverse',
          px: { xs: 2, md: 4 },
          mb: 10,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home
