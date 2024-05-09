import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material'
import theme from '@styles/theme'

const StakingNavigationDropdown = ({
  tokenChoice,
  handleTokenChoiceChange,
  stakingTokenOptions,
}) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const formControlStyle = {
    '&:hover': {
      border: 'none',
    },
    '& .MuiFilledInput-root': {
      background: 'rgb(46, 46, 51)',
      border: '1px solid rgba(82,82,90,1)',
      borderRadius: '4px',
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: theme.palette.text.secondary,
      },
    },
    mb: 4,
  }

  return (
    <FormControl variant="filled" fullWidth sx={formControlStyle}>
      <InputLabel htmlFor="staking-project-select">
        Choose a token to stake
      </InputLabel>
      {checkSmall ? (
        <Select
          value={tokenChoice}
          onChange={handleTokenChoiceChange}
          disableUnderline
          id="staking-project-select"
        >
          {stakingTokenOptions.map((option) => (
            <MenuItem key={option.project} value={option.project}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Select
          native
          value={tokenChoice}
          onChange={handleTokenChoiceChange}
          disableUnderline
          id="staking-project-select"
        >
          {stakingTokenOptions.map((option) => (
            <option key={option.project} value={option.project}>
              {option.title}
            </option>
          ))}
        </Select>
      )}
    </FormControl>
  )
}

export default StakingNavigationDropdown
