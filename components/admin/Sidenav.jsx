import {
  Grid,
  Box,
  Typography,
  List,
  ListItemText,
  ListItem,
} from '@mui/material';
import { useRouter } from 'next/router';

const Sidenav = () => {
  const listItemSx = {
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };
  const router = useRouter();
  return (
    <Grid item md={4} xs={12} sx={{ flexGrow: 1, mt: 12 }}>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Admin
        </Typography>
        <List>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin');
            }}
          >
            <ListItemText primary="Admin Home" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Users
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_user');
            }}
          >
            <ListItemText primary="Create Users" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_user');
            }}
          >
            <ListItemText primary="Edit User" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_user');
            }}
          >
            <ListItemText primary="Delete Users" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Announcements
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_announcement');
            }}
          >
            <ListItemText primary="Create Announcements" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_announcement');
            }}
          >
            <ListItemText primary="Edit Announcements" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_announcement');
            }}
          >
            <ListItemText primary="Delete Announcements" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Whitelist Events
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/whitelist_event_summary');
            }}
          >
            <ListItemText primary="Whitelist Events Summary" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_whitelist_event');
            }}
          >
            <ListItemText primary="Create Whitelist Events" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_whitelist_event');
            }}
          >
            <ListItemText primary="Edit Whitelist Events" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_whitelist_event');
            }}
          >
            <ListItemText primary="Delete Whitelist Events" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Contribution Events
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_contribution_event');
            }}
          >
            <ListItemText primary="Create Contribution Events" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_contribution_event');
            }}
          >
            <ListItemText primary="Edit Contribution Events" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_contribution_event');
            }}
          >
            <ListItemText primary="Delete Contribution Events" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Projects
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_project');
            }}
          >
            <ListItemText primary="Create Projects" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_project');
            }}
          >
            <ListItemText primary="Edit Projects" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_project');
            }}
          >
            <ListItemText primary="Delete Projects" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          Job Listings
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_job');
            }}
          >
            <ListItemText primary="Create Job Listings" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_job');
            }}
          >
            <ListItemText primary="Edit Job Listings" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_job');
            }}
          >
            <ListItemText primary="Delete Job Listings" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ mr: { md: 12, xs: 0 }, mt: { md: 0, xs: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: '700', lineHeight: '1.2' }}>
          FAQ Section
        </Typography>
        <List>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/create_faq');
            }}
          >
            <ListItemText primary="Add FAQs" />
          </ListItem>
          <ListItem
            button
            sx={{ ...listItemSx }}
            onClick={() => {
              router.push('/admin/edit_faq');
            }}
          >
            <ListItemText primary="Edit FAQs" />
          </ListItem>
          <ListItem
            button
            sx={{ mb: 2, ...listItemSx }}
            onClick={() => {
              router.push('/admin/delete_faq');
            }}
          >
            <ListItemText primary="Delete FAQs" />
          </ListItem>
        </List>
      </Box>
    </Grid>
  );
};

export default Sidenav;
