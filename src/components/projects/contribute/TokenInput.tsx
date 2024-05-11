import { Box, InputBase, Paper, Typography, useTheme } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { trpc } from '@utils/trpc'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface ITokenInputProps {
  inputTokenTicker?: string
  outputTokenTicker: string
  remainingTokens: number
  exchangeRate: number // 1 input token = (exchangeRate * input) output tokens
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  outputValue: string
  setOutputValue: React.Dispatch<React.SetStateAction<string>>
}

const TokenInput: FC<ITokenInputProps> = ({
  inputTokenTicker,
  outputTokenTicker,
  remainingTokens,
  exchangeRate,
  inputValue,
  setInputValue,
  outputValue,
  setOutputValue,
}) => {
  const theme = useTheme()
  const [price, setPrice] = useState(null);
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.cruxfinance.io/coingecko/erg_price');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPrice(data.price);
      } catch (error) {
        console.error('Failed to fetch price:', error);
      }
    };

    fetchPrice();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/,/g, '.')

    // Function to count the number of periods in the string
    const countPeriods = (str: string) => (str.match(/\./g) || []).length

    // Only update the input value if it doesn't result in multiple periods
    if (countPeriods(rawValue) <= 1) {
      setInputValue(rawValue)

      // Convert to a number for output value, handling potential NaN
      const numericValue = Number(rawValue)
      if (!isNaN(numericValue)) {
        setOutputValue((numericValue * exchangeRate).toFixed(0))
      } else {
        setOutputValue('')
      }
    }
  }

  const calculateUSDValue = () => {
    const numericalValue = Number(inputValue.replace(/,/g, ''))
    return (numericalValue * (price || 0)).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          width: '100%',
          py: 1,
          px: 2,
          mb: 1,
          maxWidth: '400px',
          borderRadius: '8px',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(235,245,255,0.03)'
              : 'rgba(255,255,255,0.55)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <InputBase
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '32px',
                fontWeight: 700,
              },
            }}
            placeholder={'0.00'}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Typography
            sx={{
              fontSize: '26px!important',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            ERG Σ
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '1rem!important' }}>
            ${calculateUSDValue()}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          width: '100%',
          py: 1,
          px: 2,
          maxWidth: '400px',
          borderRadius: '8px',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(235,245,255,0.03)'
              : 'rgba(255,255,255,0.55)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <InputBase
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '32px',
                fontWeight: 700,
              },
            }}
            placeholder={'0'}
            value={outputValue}
          />
          <Typography
            sx={{
              fontSize: '26px!important',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {outputTokenTicker}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '1rem!important' }}>
          {remainingTokens.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}{' '}
          {outputTokenTicker} remaining
        </Typography>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          background: 'rgb(43, 45, 49)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ExpandMoreIcon />
      </Paper>
    </Box>
  )
}

export default TokenInput
