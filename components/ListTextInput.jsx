import {
  Button,
  Grid,
  TextField,
} from '@mui/material';

const ListTextInput = ({ label, data, setData }) => {
  return (
    <>
      {data.map((text, index) => (
        <Grid container key={index} sx={{ mb: 1 }}>
          <Grid item md={11} xs={10} sx={{ pr: 1 }}>
            <TextField
              label={label}
              InputProps={{ disableUnderline: true }}
              fullWidth
              variant="filled"
              value={text}
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
