import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../styles/createEmotionCache';
import '/styles/globals.css';
import theme from '../styles/theme';
import Layout from '@components/layout/Layout';
import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../utils/WalletContext';
import { AddWalletProvider } from '../utils/AddWalletContext';
import { SearchProvider } from '../utils/SearchContext';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Script from 'next/script'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth';
import { trpc } from '@utils/trpc';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
	pageProps: {
		session?: Session; // Make this optional or required based on your app's needs
		[key: string]: any; // For any additional props you might pass to a page
	};
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {

	const emotionCache = clientSideEmotionCache;
	const router = useRouter();

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>ErgoPad</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes" />
			</Head>
			{/* MUI Theme Provider */}
			<SessionProvider session={session}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} maxSnack={3} dense>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						<AddWalletProvider>
							<WalletProvider>
								<SearchProvider>
									<Layout>
										<Component {...pageProps} />
									</Layout>
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
						</AddWalletProvider>
					</SnackbarProvider>
				</ThemeProvider>
			</SessionProvider>
		</CacheProvider>
	);
}

export default trpc.withTRPC(MyApp);