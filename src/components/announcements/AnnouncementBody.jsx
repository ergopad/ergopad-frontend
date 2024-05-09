import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'
import ShareIcon from '@mui/icons-material/Share'
import CopyToClipboard from '@components/CopyToClipboard'
import DiscordIcon from '@components/DiscordIcon'
import MarkdownRender from '@components/MarkdownRender'

const AnnouncementBody = ({ announcement }) => {
  return (
    <Container maxWidth="760px" sx={{ maxWidth: '760px', mx: 'auto', mt: 0 }}>
      <Box sx={{ mt: '3rem', mb: '3rem' }}>
        <img
          src={
            announcement.bannerImgUrl === ''
              ? '/announcement-default.png'
              : announcement.bannerImgUrl
          }
          alt={announcement.title}
          width="100%"
        />
      </Box>
      <Typography variant="h2" sx={{ mt: 5 }}>
        {announcement.title}
      </Typography>
      <Typography variant="body2">{announcement.shortDescription}</Typography>
      <Divider sx={{ width: '2rem', mb: '1.5rem' }} />
      {announcement.description && (
        <>
          <Typography variant="h4" sx={{ mt: '2rem' }}>
            Details
          </Typography>
          <MarkdownRender description={announcement.description} />
        </>
      )}
      <Grid container>
        <Link
          sx={{ display: 'flex', justifyContent: 'center' }}
          href="https://discord.gg/GDfU8XHx"
          aria-label="discord"
          title="Discord"
          rel="noreferrer"
          target="_blank"
        >
          <IconButton aria-label="discord">
            <DiscordIcon />
          </IconButton>
        </Link>
        <Link
          sx={{ display: 'flex', justifyContent: 'center' }}
          href="https://t.me/ergopad"
          aria-label="Telegram"
          title="Telegram"
          rel="noreferrer"
          target="_blank"
        >
          <IconButton aria-label="telegram">
            <TelegramIcon />
          </IconButton>
        </Link>
        <CopyToClipboard>
          {({ copy }) => (
            <IconButton
              aria-label="share"
              onClick={() => copy(window.location)}
            >
              <ShareIcon />
            </IconButton>
          )}
        </CopyToClipboard>
      </Grid>
    </Container>
  )
}

export default AnnouncementBody
