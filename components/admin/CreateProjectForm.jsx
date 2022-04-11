import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FileUploadS3 from '@components/FileUploadS3';
import {
  RoadmapInput,
  TokenomicsInput,
  TeamInput,
} from '@components/ListTextInput';
import theme from '@styles/theme';
import axios from 'axios';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const socials = ['telegram', 'discord', 'github', 'twitter', 'website'];

const initialFormData = Object.freeze({
  name: '',
  shortDescription: '',
  description: '',
  fundsRaised: 0,
  bannerImgUrl: '',
  isLaunched: false,
  socials: {
    telegram: '',
    discord: '',
    github: '',
    twitter: '',
    website: '',
    linkedin: '',
  },
  roadmap: {
    roadmap: [],
  },
  team: {
    team: [],
  },
  tokenomics: {
    tokenName: '',
    totalTokens: 0,
    tokenTicker: '',
    tokenomics: [],
  },
});

const initialFormErrors = Object.freeze({
  name: false,
  shortDescription: false,
  fundsRaised: false,
  bannerImgUrl: false,
});

const CreateProjectForm = () => {
  // form data is all strings
  const [formData, updateFormData] = useState(initialFormData);
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false);
  // set true to disable submit button
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  // open error snackbar
  const [openError, setOpenError] = useState(false);
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false);
  // change error message for error snackbar
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again'
  );

  useEffect(() => {
    if (isLoading) {
      setbuttonDisabled(true);
    } else {
      setbuttonDisabled(false);
    }
  }, [isLoading]);

  // snackbar for error reporting
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  // modal for success message
  const handleCloseSuccess = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleChange = (e) => {
    if (
      e.target.value == '' &&
      Object.hasOwnProperty.call(formErrors, e.target.name)
    ) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: true,
      });
    } else if (Object.hasOwnProperty.call(formErrors, e.target.name)) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      });
    }

    if (e.target.name == 'fundsRaised') {
      if (isNaN(parseFloat(e.target.value))) {
        setFormErrors({
          ...formErrors,
          fundsRaised: true,
        });
      } else {
        setFormErrors({
          ...formErrors,
          fundsRaised: false,
        });
      }
    }

    if (socials.includes(e.target.name)) {
      updateFormData({
        ...formData,
        socials: {
          ...formData.socials,
          [e.target.name]: e.target.value,
        },
      });
    } else if (
      ['tokenName', 'totalTokens', 'tokenTicker'].includes(e.target.name)
    ) {
      updateFormData({
        ...formData,
        tokenomics: {
          ...formData.tokenomics,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      updateFormData({
        ...formData,
        [e.target.name]:
          e.target.name === 'isLaunched' ? e.target.checked : e.target.value,
      });
    }
  };

  const handleImageUpload = (res) => {
    if (res.status === 'success') {
      updateFormData({ ...formData, bannerImgUrl: res.image_url });
      setFormErrors({ ...formErrors, bannerImgUrl: false });
    } else {
      setErrorMessage('Image upload failed');
      setOpenError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenError(false);
    setLoading(true);
    const errorCheck = Object.values(formErrors).every((v) => v === false);
    const emptyCheck = formData.bannerImgUrl !== '';
    if (errorCheck && emptyCheck) {
      const defaultOptions = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            'jwt_token_login_422'
          )}`,
        },
      };
      const data = { ...formData };
      try {
        await axios.post(
          `${process.env.API_URL}/projects/`,
          data,
          defaultOptions
        );
        setOpenSuccess(true);
        updateFormData(initialFormData);
      } catch {
        setErrorMessage('Invalid credentials or form data');
        setOpenError(true);
      }
    } else {
      let updateErrors = {};
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry;
        if (value === '' && Object.hasOwnProperty.call(formErrors, key)) {
          let newEntry = { [key]: true };
          updateErrors = { ...updateErrors, ...newEntry };
        }
      });
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      });
      setErrorMessage('Please eliminate form errors and try again');
      setOpenError(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ mt: 10, mb: 2, fontWeight: '700' }}>
          Create Project
        </Typography>
        <Grid container spacing={2} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Project Name and Description
        </Typography>
        <Grid item xs={12}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="name"
            label="Project Name"
            name="name"
            variant="filled"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
            helperText={formErrors.name && 'Enter the project name'}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            A short summary for the project.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="shortDescription"
            label="Project Short Description"
            name="shortDescription"
            variant="filled"
            value={formData.shortDescription}
            onChange={handleChange}
            error={formErrors.shortDescription}
            helperText={
              formErrors.shortDescription && 'Enter the project summary'
            }
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            disabled
            fullWidth
            id="bannerImgUrl"
            label="Banner Image Url"
            name="bannerImgUrl"
            variant="filled"
            value={formData.bannerImgUrl}
            onChange={handleChange}
            error={formErrors.bannerImgUrl}
            helperText={formErrors.bannerImgUrl && 'Banner image is required'}
          />
        </Grid>
        <Box sx={{ position: 'relative', my: 2 }}>
          <FileUploadS3 onUpload={handleImageUpload} />
        </Box>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Detailed description and project deliverables.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            multiline
            id="description"
            label="Project Description"
            name="description"
            variant="filled"
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="fundsRaised"
            label="Funds Raised in USD"
            name="fundsRaised"
            variant="filled"
            value={formData.fundsRaised}
            onChange={handleChange}
            error={formErrors.fundsRaised}
            helperText={
              formErrors.fundsRaised && 'Funds should be a valid number'
            }
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Socials
        </Typography>
        <Grid container item xs={12} sx={{ mb: 1 }}>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="telegram"
              label="Team Telegram Handle"
              name="telegram"
              variant="filled"
              value={formData.socials.telegram}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="discord"
              label="Discord"
              name="discord"
              variant="filled"
              value={formData.socials.discord}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="github"
              label="Github"
              name="github"
              variant="filled"
              value={formData.socials.github}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="twitter"
              label="Project Twitter Page"
              name="twitter"
              variant="filled"
              value={formData.socials.twitter}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="website"
              label="Website Url"
              name="website"
              variant="filled"
              value={formData.socials.website}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Roadmap
        </Typography>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Roadmap Items
          </Typography>
          <RoadmapInput
            data={formData.roadmap.roadmap}
            setData={(updatedData) => {
              updateFormData({
                ...formData,
                roadmap: {
                  ...formData.roadmap,
                  roadmap: [...updatedData],
                },
              });
            }}
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Team
        </Typography>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Add Team Member
          </Typography>
          <TeamInput
            data={formData.team.team}
            setData={(updatedData) => {
              updateFormData({
                ...formData,
                team: {
                  ...formData.team,
                  team: [...updatedData],
                },
              });
            }}
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Tokenomics
        </Typography>
        <Grid container item xs={12} sx={{ mb: 1 }}>
          <Grid item xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="tokenName"
              label="Token Name"
              name="tokenName"
              variant="filled"
              value={formData.tokenomics.tokenName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="totalTokens"
              label="Total Tokens"
              name="totalTokens"
              variant="filled"
              value={formData.tokenomics.totalTokens}
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ p: 0.5 }}>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="tokenTicker"
              label="Ticker"
              name="tokenTicker"
              variant="filled"
              value={formData.tokenomics.tokenTicker}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Tokenomics Table Row
          </Typography>
          <TokenomicsInput
            data={formData.tokenomics.tokenomics}
            setData={(updatedData) => {
              updateFormData({
                ...formData,
                tokenomics: {
                  ...formData.tokenomics,
                  tokenomics: [...updatedData],
                },
              });
            }}
          />
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '700' }}>
          Additional Configuration
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              name="isLaunched"
              value={formData.isLaunched}
              onChange={handleChange}
            />
          }
          label="Launched?"
          sx={{ color: theme.palette.text.secondary, mb: 3 }}
        />
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 1 }}
          >
            Submit
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-9px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          Changes were saved.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateProjectForm;
