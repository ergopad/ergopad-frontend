import { Box, CircularProgress, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import MuiNextLink from '@components/MuiNextLink'

const friendlyTransactionId = (addr, tot = 15) => {
  if (addr === undefined || addr.slice === undefined) return ''
  if (addr.length < 30) return addr
  return addr.slice(0, tot) + '...' + addr.slice(-tot)
}

const TransactionSubmitted = ({ transactionId, pending }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 3,
        mt: 3,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '768px',
        }}
      >
        {pending ? (
          <>
            <CircularProgress sx={{ mt: 3, mb: 3 }} />
            <Typography variant="h4">Awaiting User Confirmation</Typography>
          </>
        ) : (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: '8rem' }} />
            <Typography variant="h4">Transaction Submitted</Typography>
            <Typography variant="subtitle1">
              Transaction ID:{' '}
              <MuiNextLink
                href={
                  'https://explorer.ergoplatform.com/en/transactions/' +
                  transactionId
                }
                rel="noreferrer"
                target="_blank"
              >
                {friendlyTransactionId(transactionId)}
              </MuiNextLink>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}

export default TransactionSubmitted
