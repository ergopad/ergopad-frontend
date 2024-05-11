import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@styles/globals.css'
import theme from '@styles/theme'
import Layout from '@components/layout/Layout'
import { SnackbarProvider } from 'notistack'
import { WalletProvider } from '@lib/contexts/WalletContext'
import { AddWalletProvider } from '@contexts/AddWalletContext'
import { SearchProvider } from '@contexts/SearchContext'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'
import { trpc } from '@utils/trpc'
import AlertComponent from '@components/Alert'
import { AlertProvider } from '@lib/contexts/AlertContext'
import { DialogProvider } from '@contexts/DialogContext'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
      <Head>
        <title>ErgoPad</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes"
        />
      </Head>
      {/* MUI Theme Provider */}
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            maxSnack={3}
            dense
          >
            <CssBaseline />
            <AddWalletProvider>
              <AlertProvider>
                <DialogProvider>
                  <WalletProvider>
                    <SearchProvider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                      <AlertComponent />
                      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
                      <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-XBTFK9GRMF"
                        strategy="afterInteractive"
                      />
                      <Script id="google-analytics" strategy="afterInteractive">
                        {`
												window.dataLayer = window.dataLayer || [];
												function gtag(){window.dataLayer.push(arguments);}
												gtag('js', new Date());

												gtag('config', 'G-XBTFK9GRMF');
											`}
                      </Script>
                    </SearchProvider>
                  </WalletProvider>
                </DialogProvider>
              </AlertProvider>
            </AddWalletProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
