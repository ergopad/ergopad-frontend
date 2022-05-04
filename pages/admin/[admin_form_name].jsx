import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import Sidenav from '@components/admin/Sidenav';
import CenterTitle from '@components/CenterTitle';
import CreateProjectForm from '@components/admin/CreateProjectForm';
import EditProjectForm from '@components/admin/EditProjectForm';
import DeleteProjectForm from '@components/admin/DeleteProjectForm';
import EditUserForm from '@components/admin/EditUserForm';
import CreateJobForm from '@components/admin/CreateJobForm';
import EditJobForm from '@components/admin/EditJobForm';
import DeleteJobForm from '@components/admin/DeleteJobForm';
import CreateAnnouncementForm from '@components/admin/CreateAnnouncementForm';
import EditAnnouncementForm from '@components/admin/EditAnnouncementForm';
import DeleteAnnouncementForm from '@components/admin/DeleteAnnouncementForm';
import CreateFaqForm from '@components/admin/CreateFaqForm';
import EditFaqForm from '@components/admin/EditFaqForm';
import DeleteFaqForm from '@components/admin/DeleteFaqForm';
import CreateWhitelistEventForm from '@components/admin/CreateWhitelistEventForm';
import EditWhitelistEventForm from '@components/admin/EditWhitelistEventForm';
import DeleteWhitelistEventForm from '@components/admin/DeleteWhitelistEventForm';
import GenerateWhitelistEventReportForm from '@components/admin/GenerateWhitelistEventReportForm';
import CreateContributionEventForm from '@components/admin/CreateContributionEventForm';
import EditContributionEventForm from '@components/admin/EditContributionEventForm';
import DeleteContributionEventForm from '@components/admin/DeleteContributionEventForm';
import CreateTutorialForm from '@components/admin/CreateTutorialForm';
import EditTutorialForm from '@components/admin/EditTutorialForm';
import DeleteTutorialForm from '@components/admin/DeleteTutorialForm';

const AdminForm = () => {
  const JWT_TOKEN =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('jwt_token_login_422')
      : null;
  const router = useRouter();
  const { admin_form_name } = router.query;
  const [load, setLoad] = useState(false);

  const formMapper = {
    create_project: <CreateProjectForm />,
    edit_project: <EditProjectForm />,
    delete_project: <DeleteProjectForm />,
    edit_user: <EditUserForm />,
    create_job: <CreateJobForm />,
    edit_job: <EditJobForm />,
    delete_job: <DeleteJobForm />,
    create_announcement: <CreateAnnouncementForm />,
    edit_announcement: <EditAnnouncementForm />,
    delete_announcement: <DeleteAnnouncementForm />,
    create_faq: <CreateFaqForm />,
    edit_faq: <EditFaqForm />,
    delete_faq: <DeleteFaqForm />,
    create_whitelist_event: <CreateWhitelistEventForm />,
    edit_whitelist_event: <EditWhitelistEventForm />,
    delete_whitelist_event: <DeleteWhitelistEventForm />,
    whitelist_event_summary: <GenerateWhitelistEventReportForm />,
    create_contribution_event: <CreateContributionEventForm />,
    edit_contribution_event: <EditContributionEventForm />,
    delete_contribution_event: <DeleteContributionEventForm />,
    create_tutorial: <CreateTutorialForm />,
    edit_tutorial: <EditTutorialForm />,
    delete_tutorial: <DeleteTutorialForm />,
  };

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <>
      {JWT_TOKEN && load ? (
        <Grid
          container
          maxWidth="lg"
          sx={{
            mx: 'auto',
            flexDirection: 'row-reverse',
            px: { xs: 2, md: 3 },
          }}
        >
          {formMapper[admin_form_name] ? (
            <Grid item md={8} xs={12}>
              {formMapper[admin_form_name]}
            </Grid>
          ) : (
            <Grid item md={8} xs={12}>
              <CenterTitle
                title="Not Found"
                subtitle="Looks like the form you are looking for is under construction..."
                main={true}
              />
            </Grid>
          )}
          <Sidenav />
        </Grid>
      ) : (
        <CenterTitle
          title="Oops..."
          subtitle="Looks like you do not have admin access"
          main={true}
        />
      )}
    </>
  );
};

export default AdminForm;
