import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import Box from '@mui/material/Box';
import MuiNextLink from '@components/MuiNextLink';
import theme from '@styles/theme';
import React from 'react';

const Team = ({ data }) => {
  const teamMembers = data ? data : [];
  return (
    <>
      <Grid container spacing={3} direction="row" justifyContent="center">
        {teamMembers.map(({ name, description, profileImgUrl, socials }) => (
          <React.Fragment key={name}>
            <Grid item sx={{ width: '160px' }}>
              <Avatar
                alt={name}
                src={profileImgUrl}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.text.secondary,
                }}
              />
              <Typography
                color="text.secondary"
                sx={{ fontWeight: '500', textAlign: 'center', mb: '0.1rem' }}
              >
                {name}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: '300',
                  textAlign: 'center',
                  mb: '0.1rem',
                }}
              >
                {description}
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                {socials.twitter ? (
                  <MuiNextLink
                    href={`https://twitter.com/${socials.twitter}`}
                    target="_blank"
                  >
                    <TwitterIcon />
                  </MuiNextLink>
                ) : (
                  ''
                )}
                {socials.linkedin ? (
                  <MuiNextLink
                    href={`https://linkedin.com/${socials.linkedin}`}
                    target="_blank"
                  >
                    <LinkedInIcon />
                  </MuiNextLink>
                ) : (
                  ''
                )}
              </Box>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

export default Team;
