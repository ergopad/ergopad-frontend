import { Button, Grid, TextField } from '@mui/material';
import FileUploadS3 from '@components/FileUploadS3';

export const RoadmapInput = ({ data, setData }) => {
  const handleChange = (e, index) => {
    const updatedData = data.map((roadmap, i) => {
      if (index === i) {
        return {
          ...roadmap,
          [e.target.name]: e.target.value,
        };
      } else {
        return roadmap;
      }
    });
    setData(updatedData);
  };
  return (
    <>
      {data.map((roadmap, index) => (
        <Grid container key={index} sx={{ mb: 2 }}>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="name"
              label="Event Name"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={roadmap.name}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="date"
              label="Date (yyyy-mm-ddTHH:MM:SS)"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={roadmap.date}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={11} xs={10} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="description"
              label="Description"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={roadmap.description}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={2}
            sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const updatedData = data.filter((roadmap, i) => {
                  return index !== i;
                });
                setData(updatedData);
              }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        sx={{ textTransform: 'none' }}
        onClick={() =>
          setData([
            ...data,
            { name: '', description: '', date: new Date().toISOString() },
          ])
        }
      >
        Add Row
      </Button>
    </>
  );
};

export const TeamInput = ({ data, setData }) => {
  const handleChange = (e, index) => {
    console.log(e);
    const updatedData = data.map((member, i) => {
      if (index === i) {
        if (['linkedin', 'twitter'].includes(e.target.name)) {
          return {
            ...member,
            socials: { ...member.socials, [e.target.name]: e.target.value },
          };
        }
        return {
          ...member,
          [e.target.name]: e.target.value,
        };
      } else {
        return member;
      }
    });
    setData(updatedData);
  };

  const handleImageUpload = (res, index) => {
    if (res.status === 'success') {
      handleChange(
        {
          target: {
            name: 'profileImgUrl',
            value: res.image_url,
          },
        },
        index,
      );
    } else {
      handleChange(
        {
          target: {
            name: 'profileImgUrl',
            value: 'upload_error',
          },
        },
        index,
      );
    }
  };

  return (
    <>
      {data.map((member, index) => (
        <Grid container key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="Name"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={member.name}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              name="description"
              label="Role"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={member.description}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={11} xs={10} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="profileImgUrl"
              label="Profile Image"
              disabled
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={member.profileImgUrl}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={2}
            sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() =>
                handleChange(
                  {
                    target: {
                      name: 'profileImgUrl',
                      value: '',
                    },
                  },
                  index,
                )
              }
            >
              Clear
            </Button>
          </Grid>
          <Grid item md={12} sx={{ mt: 1 }}>
            <FileUploadS3 onUpload={(res) => handleImageUpload(res, index)} />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="twitter"
              label="Twitter Handle"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={member.socials.twitter}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="linkedin"
              label="LinkedIn Profile"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={member.socials.linkedin}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={2}
            sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const updatedData = data.filter((member, i) => {
                  return index !== i;
                });
                setData(updatedData);
              }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        sx={{ textTransform: 'none' }}
        onClick={() =>
          setData([
            ...data,
            {
              name: '',
              description: '',
              profileImgUrl: '',
              socials: { linkedin: '', twitter: '' },
            },
          ])
        }
      >
        Add Row
      </Button>
    </>
  );
};

export const TokenomicsInput = ({ data, setData }) => {
  const handleChange = (e, index) => {
    const updatedData = data.map((elem, i) => {
      if (index === i) {
        return {
          ...elem,
          [e.target.name]: e.target.value,
        };
      } else {
        return elem;
      }
    });
    setData(updatedData);
  };
  return (
    <>
      {data.map((elem, index) => (
        <Grid container key={index} sx={{ mb: 2 }}>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="name"
              label="Name"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.name}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="amount"
              label="Amount"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.amount}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="value"
              label="Value"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.value}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="tge"
              label="TGE"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.tge}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="freq"
              label="Freq"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.freq}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="length"
              label="Length"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.length}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid item md={11} xs={10} sx={{ mt: 1, pr: 1 }}>
            <TextField
              name="lockup"
              label="Lock Up"
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={elem.lockup}
              onChange={(e) => handleChange(e, index)}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={2}
            sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const updatedData = data.filter((data, i) => {
                  return index !== i;
                });
                setData(updatedData);
              }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        sx={{ textTransform: 'none' }}
        onClick={() =>
          setData([
            ...data,
            {
              name: '',
              amount: 0,
              value: '',
              tge: '',
              freq: '',
              length: '',
              lockup: '',
            },
          ])
        }
      >
        Add Row
      </Button>
    </>
  );
};

const ListTextInput = ({ label, data, setData }) => {
  return (
    <>
      {data.map((text, index) => (
        <Grid container key={index} sx={{ mb: 1 }}>
          <Grid item md={11} xs={10} sx={{ pr: 1 }}>
            <TextField
              label={label}
              multiline
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={text}
              rows={2}
              onChange={(e) => {
                const updatedData = data.map((text, i) => {
                  if (index === i) {
                    return e.target.value;
                  } else {
                    return text;
                  }
                });
                setData(updatedData);
              }}
            />
          </Grid>
          <Grid
            item
            md={1}
            xs={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const updatedData = data.filter((text, i) => {
                  return index !== i;
                });
                setData(updatedData);
              }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        sx={{ textTransform: 'none' }}
        onClick={() => setData([...data, ''])}
      >
        Add Row
      </Button>
    </>
  );
};

export default ListTextInput;
