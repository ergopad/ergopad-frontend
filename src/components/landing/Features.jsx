import { Box, CardContent, Grid, Typography } from '@mui/material';

const Features = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '768px',
          }}
        >
          <Typography variant="h2">
            The next evolution in crypto ecosystem solutions
          </Typography>
          <Typography variant="subtitle1">
            We help grassroots projects build the global financial future,
            creating products that enable ordinary people to take part in
            commerce, without limitation. We believe in private money.
          </Typography>
          <Typography variant="subtitle1">
            Here are just a few of the services we can offer:
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6, mt: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <CardContent>
              <Box
                component="img"
                alt=""
                height={300}
                width={300}
                sx={{
                  margin: 'auto',
                  display: 'block',
                }}
                src="feature-1.png"
              />
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
                sx={{ my: 3 }}
              >
                Funding
              </Typography>
            </CardContent>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <CardContent>
              <Box
                component="img"
                alt=""
                height={300}
                width={300}
                sx={{
                  margin: 'auto',
                  display: 'block',
                }}
                src="feature-2.png"
              />
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
                sx={{ my: 3 }}
              >
                Marketing
              </Typography>
            </CardContent>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <CardContent>
              <Box
                component="img"
                alt=""
                height={300}
                width={300}
                sx={{
                  margin: 'auto',
                  display: 'block',
                }}
                src="feature-3.png"
              />
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
                sx={{ my: 3 }}
              >
                Blockchain Development
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Features;
