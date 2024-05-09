import { Typography, Icon, Box, Grid } from '@mui/material';
// import { styled } from '@mui/system';
import MuiNextLink from '@components/MuiNextLink';

/* const LinkIcon = styled('div')(({ theme }) => ({

}))

const LinkTitle = styled('div')(({ theme }) => ({

}))

const LinkCaption = (({ theme }) => ({
    
}))

const HoverArrow = styled('div')(({ theme }) => ({

    '&:hover': {

    }
})) */

const RelatedLinkItem = ({ link }) => {
  const extraStyles = {
    bgcolor: link.background,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    py: '1rem',
    color: '#fff',
    borderRadius: 2,
    textDecoration: 'none',
    transition: '1s ease-in-out',
    '.MuiIcon-root.arrow': {
      transition: '200ms ease-in-out',
      transform: 'rotate(-45deg)',
    },
    '&:hover': {
      '.MuiIcon-root.arrow': {
        transition: '200ms ease-in-out',
        transform: 'rotate(0deg)',
      },
    },
  };

  return (
    <Grid item md={4} xs={12} sx={{ maxWidth: '320px' }}>
      <MuiNextLink
        href={link.href}
        sx={{
          '&:hover': {
            textDecoration: 'none',
          },
        }}
      >
        <Box sx={extraStyles}>
          <Icon fontSize="large">{link.icon}</Icon>

          <Typography variant="h4" sx={{ mb: '0px' }}>
            {link.title}
          </Typography>

          <Typography sx={{ mb: '8px' }}>{link.caption}</Typography>

          <Icon className="arrow">east</Icon>
        </Box>
      </MuiNextLink>
    </Grid>
  );
};

export default RelatedLinkItem;
