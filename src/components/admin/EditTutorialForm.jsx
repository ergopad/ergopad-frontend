import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { useEffect, useState, forwardRef } from 'react'
import FileUploadS3 from '@components/FileUploadS3'
import AutoCompleteSelect from '@components/AutoCompleteSelect'
import PaginatedTable from '@components/PaginatedTable'
import axios from 'axios'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const linkTypes = ['YouTube', 'Medium', 'Others']

const initialFormData = Object.freeze({
  id: '',
  title: '',
  shortDescription: '',
  description: '',
  link: '',
  linkType: 'youtube',
  bannerImgUrl: '',
  category: 'default',
  config: {
    use_youtube_banner: false,
  },
})

const initialFormErrors = Object.freeze({
  title: false,
})

const EditTutorialForm = () => {
  // tutorial data
  const [tutorialData, setTutorialData] = useState([])
  // form data is all strings
  const [formData, updateFormData] = useState(initialFormData)
  // form error object, all booleans
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  // loading spinner for submit button
  const [isLoading, setLoading] = useState(false)
  // set true to disable submit button
  const [buttonDisabled, setbuttonDisabled] = useState(false)
  // open error snackbar
  const [openError, setOpenError] = useState(false)
  // open success modal
  const [openSuccess, setOpenSuccess] = useState(false)
  // change error message for error snackbar
  const [errorMessage, setErrorMessage] = useState(
    'Please eliminate form errors and try again'
  )
  // categories
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getTableData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.API_URL}/tutorials/`)
        res.data.sort((a, b) => a.id - b.id)
        setTutorialData(res.data)
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }

    const getCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/tutorials/categories`
        )
        setCategories(res.data)
      } catch (e) {
        console.log(e)
      }
    }

    getCategories()
    getTableData()
  }, [openSuccess])

  useEffect(() => {
    if (isLoading) {
      setbuttonDisabled(true)
    } else {
      setbuttonDisabled(false)
    }
  }, [isLoading])

  // snackbar for error reporting
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenError(false)
  }

  // modal for success message
  const handleCloseSuccess = (reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccess(false)
  }

  const fetchDetails = async (e) => {
    e.preventDefault()
    setLoading(true)
    setOpenError(false)
    const id = formData.id
    const res = tutorialData.filter((tutorial) => tutorial.id === id)
    if (id && res.length) {
      const data = res[0]
      updateFormData({ ...data })
      setFormErrors(initialFormErrors)
    } else {
      setErrorMessage('Tutorial not found')
      setOpenError(true)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    if (
      e.target.value == '' &&
      Object.hasOwnProperty.call(formErrors, e.target.name)
    ) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: true,
      })
    } else if (Object.hasOwnProperty.call(formErrors, e.target.name)) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      })
    }

    if (['use_youtube_banner'].includes(e.target.name)) {
      updateFormData({
        ...formData,
        config: {
          ...formData.config,
          [e.target.name]: e.target.checked,
        },
      })
    } else {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleImageUpload = (res) => {
    if (res.status === 'success') {
      updateFormData({ ...formData, bannerImgUrl: res.image_url })
    } else {
      setErrorMessage('Image upload failed')
      setOpenError(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setOpenError(false)
    setLoading(true)
    const errorCheck = Object.values(formErrors).every((v) => v === false)
    if (errorCheck) {
      const defaultOptions = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            'jwt_token_login_422'
          )}`,
        },
      }
      const data = {
        ...formData,
        category: formData.category ? formData.category : 'default',
      }
      try {
        await axios.put(
          `${process.env.API_URL}/tutorials/${formData.id}`,
          data,
          defaultOptions
        )
        setOpenSuccess(true)
        updateFormData(initialFormData)
      } catch {
        setErrorMessage('Invalid credentials or form data')
        setOpenError(true)
      }
    } else {
      let updateErrors = {}
      Object.entries(formData).forEach((entry) => {
        const [key, value] = entry
        if (value === '' && Object.hasOwnProperty.call(formErrors, key)) {
          let newEntry = { [key]: true }
          updateErrors = { ...updateErrors, ...newEntry }
        }
      })
      setFormErrors({
        ...formErrors,
        ...updateErrors,
      })
      setErrorMessage('Please eliminate form errors and try again')
      setOpenError(true)
    }
    setLoading(false)
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ mt: 10, mb: 4, fontWeight: '700' }}>
          Edit Tutorial
        </Typography>
        <Grid container spacing={2} />
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Enter Tutorial id manually or select one from the table below.
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="id"
            label="Tutorial Id"
            name="id"
            variant="filled"
            value={formData.id}
            onChange={handleChange}
          />
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary>
              <strong>Expand to see Tutorials</strong>
            </AccordionSummary>
            <AccordionDetails>
              <PaginatedTable
                rows={tutorialData}
                onClick={(id) => {
                  updateFormData({ ...formData, id: id })
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Button
            onClick={fetchDetails}
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Fetch Tutorial Details
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
        <Grid item xs={12}>
          <TextField
            InputProps={{ disableUnderline: true }}
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            variant="filled"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            helperText={formErrors.title && 'Title is mandatory'}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Add a short description
          </Typography>
          <TextField
            InputProps={{ disableUnderline: true }}
            fullWidth
            multiline
            id="shortDescription"
            label="Description"
            name="shortDescription"
            variant="filled"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={2}
          />
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={8} sx={{ mt: 2 }}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Link to the tutorial (YouTube or Medium article)
            </Typography>
            <TextField
              InputProps={{ disableUnderline: true }}
              fullWidth
              id="link"
              label="Tutorial Link"
              name="link"
              variant="filled"
              value={formData.link}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2, mb: 1 }}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Link Type (Platform)
            </Typography>
            <FormControl variant="filled" sx={{ minWidth: '100%' }}>
              <InputLabel id="link-type-select">Platform</InputLabel>
              <Select
                labelId="link-type-select"
                id="linkType"
                name="linkType"
                value={formData.linkType}
                onChange={handleChange}
              >
                {linkTypes.map((type) => {
                  return (
                    <MenuItem
                      sx={{
                        borderRadius: '5px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                      key={type.toLowerCase()}
                      value={type.toLowerCase()}
                    >
                      {type}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>
              Configure Banner
            </Typography>
            <TextField
              InputProps={{ disableUnderline: true }}
              disabled
              fullWidth
              id="bannerImgUrl"
              label="Banner Image Url"
              name="bannerImgUrl"
              variant="filled"
              value={formData.bannerImgUrl}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sx={{ position: 'relative', my: 2 }}>
            <FileUploadS3 onUpload={handleImageUpload} />
          </Grid>
          <Grid item xs={6} sx={{ position: 'relative', my: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={formData.linkType !== 'youtube'}
                  name="use_youtube_banner"
                  checked={formData.config.use_youtube_banner ?? 0}
                  onChange={handleChange}
                />
              }
              label="Pull Banner From YouTube?"
            />
          </Grid>
        </Grid>
        <Grid item xs={6} sx={{ mt: 1, mb: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Select a category
          </Typography>
          <AutoCompleteSelect
            options={categories.map((category) => {
              return {
                title: category,
              }
            })}
            label="Category"
            value={{ title: formData.category }}
            setValue={(value) =>
              handleChange({
                target: {
                  name: 'category',
                  value: value ? value.title : '',
                },
              })
            }
          />
        </Grid>
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            disabled={buttonDisabled}
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Update Tutorial
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
  )
}

export default EditTutorialForm
