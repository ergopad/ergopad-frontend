import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import Box from '@mui/material/Box';
import MuiNextLink from '@components/MuiNextLink';
import theme from '@styles/theme';
import React from 'react';

const teamMembers = [
  {
    name: 'Name Person',
    imgUrl: '/url/',
    social: {
      linkedin: 'linkedin',
      twitter: 'twitter',
    },
  },
  {
    name: 'Person Name',
    imgUrl: '/url/',
    social: {
      linkedin: '',
      twitter: '',
    },
  },
  {
    name: 'Fun Guy',
    imgUrl: '/url/',
    social: {
      linkedin: '',
      twitter: 'twitter',
    },
  },
  {
    name: 'Hello Here',
    imgUrl: '/url/',
    social: {
      linkedin: 'linkedin',
      twitter: 'twitter',
    },
  },
  {
    name: 'Not Person',
    imgUrl: '/url/',
    social: {
      linkedin: 'linkedin',
      twitter: 'twitter',
    },
  },
];

const Team = () => {
  return (
    <>
      <Grid container spacing={3} direction="row" justifyContent="center">
        {teamMembers.map(({ name, imgUrl, social }) => (
          <React.Fragment key={name}>
            <Grid item sx={{ width: '160px' }}>
              <Avatar
                alt={name}
                src={imgUrl}
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
              <Box sx={{ textAlign: 'center' }}>
                {social.twitter ? (
                  <MuiNextLink
                    href={`https://twitter.com/${social.twitter}`}
                    target="_blank"
                  >
                    <TwitterIcon />
                  </MuiNextLink>
                ) : (
                  ''
                )}
                {social.linkedin ? (
                  <MuiNextLink
                    href={`https://linkedin.com/${social.linkedin}`}
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
