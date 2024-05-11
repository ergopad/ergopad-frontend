import React from 'react';
import { NextPage } from 'next';
import { useWallet } from '@contexts/WalletContext';
import { useRouter } from 'next/router';
import ErrorPage from '@components/ErrorPage';
import { Container } from '@mui/material';
import WhitelistPage from '@components/admin-trpc/Pages/WhitelistPage';
import ContributionPage from '@components/admin-trpc/Pages/ContributionPage';
import TransactionReportPage from '@components/admin-trpc/Pages/TransactionReportPage';

const AdminPage: NextPage = () => {
  const { sessionData, sessionStatus } = useWallet()
  const router = useRouter()
  const { admin_page } = router.query
  const route = admin_page?.toString()

  const pageMapper: { [key: string]: React.ReactElement } = {
    "whitelist": <WhitelistPage />,
    "contribution-rounds": <ContributionPage />,
    "transaction-report": <TransactionReportPage />
  }

  return (
    <>
      {sessionStatus === 'loading' ? (
        <Container sx={{ textAlign: 'center', py: '20vh' }}>
          Loading...
        </Container>
      ) : sessionStatus === 'authenticated' ? (
        sessionData?.user.isAdmin ? (
          route && pageMapper[route] ? (
            <>{pageMapper[route]}</>
          ) : (
            <ErrorPage />
          )
        ) : (
          <ErrorPage
            title="403"
            subtitle="You do not have permission to access this resource. "
            message="You are not authorized to access this page. Please go back where you came from before someone sees you. "
          />
        )
      ) : (
        <ErrorPage
          title="401"
          subtitle="You are not authenticated and need to be to access this resource. "
          message="If you are not signed in, please sign in to an account that has access. Otherwise, return to the home page. "
        />
      )}
    </>
  )
};

export default AdminPage;
