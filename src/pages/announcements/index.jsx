import { Grid, useMediaQuery } from '@mui/material';
import CenterTitle from '@components/CenterTitle';
import Sidenav from '@components/announcements/Sidenav';
import RelatedLinks from '@components/RelatedLinks/RelatedLinks';
import theme from '@styles/theme';

const relatedLinkList = [
  {
    id: 0,
    title: 'Documentation',
    caption: 'Read about how Ergopad Works',
    icon: 'auto_stories',
    href: 'https://github.com/ergo-pad/ergopad/blob/main/docs/README.md',
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
];

const Announcements = () => {
  const smallCheck = useMediaQuery((theme) => theme.breakpoints.up('md'));
  return (
    <>
      <Grid
        container
        maxWidth="lg"
        sx={{
          mx: 'auto',
          flexDirection: 'row',
          px: { xs: 2, md: 3 },
        }}
      >
        {smallCheck && (
          <Grid item md={8} xs={12}>
            <CenterTitle
              title=""
              subtitle="Select an announcement to expand"
              main={true}
            />
          </Grid>
        )}
        <Grid item md={4} xs={12} sx={{ flexGrow: 1, mt: smallCheck ? 12 : 0 }}>
          <Sidenav />
        </Grid>
      </Grid>
      <RelatedLinks title="Learn More" subtitle="" links={relatedLinkList} />
    </>
  );
};

export default Announcements;
