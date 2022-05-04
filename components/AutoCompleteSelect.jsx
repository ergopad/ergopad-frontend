import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { ListItem } from '@mui/material';

const filter = createFilterOptions();

const AutoCompleteSelect = ({ label, options, value, setValue }) => {

  return (
    <Autocomplete
      value={value}
      onChange={(e, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => {
        // css patch
        props.onMouseOver = null;
        props.onTouchStart = null;
        return (
          <ListItem
            {...props}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {option.title}
          </ListItem>
        );
      }}
      freeSolo
      renderInput={(params) => {
        params = {
          ...params,
          InputProps: {
            ...params.InputProps,
            disableUnderline: true,
          },
        };
        return (
          <TextField {...params} fullWidth label={label} variant="filled" />
        );
      }}
    />
  );
};

export default AutoCompleteSelect;
