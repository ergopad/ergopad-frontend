import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Features from '@components/landing/Features';
import Hero from '@components/landing/Hero';
import { Container, Divider } from '@mui/material';
import Dashboard from '@components/landing/Dashboard';
import Projects from '@components/landing/Projects';
import Announcements from '@components/landing/Announcements';
// import Social from '@components/landing/Social';
import ActiveRound from '@components/landing/ActiveRound';

const Homepage = () => {
  const router = useRouter();
  let id = router.asPath.match(/#([a-z0-9]+)/gi);

  useEffect(() => {
    if (id) {
      let element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    } else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [id]);

  return (
    <>
      <Container maxWidth="lg">
        <Hero
          title="Welcome to ErgoPad"
          subtitle="We are a token launch platform for Ergo giving you an opportunity to get in on the ground floor with Ergo token IDOs. We help projects navigate Ergoscript to build safe apps for all."
        />
        <Divider sx={{ mb: 10 }} />
        <ActiveRound />
        <Features />
        {/* 
        <Divider sx={{ mb: 10 }} />
        <Announcements />
        <Divider sx={{ mb: 10 }} />
        <Social /> 
        */}
        <Divider sx={{ mb: 10 }} />
        <Projects />
        <Divider sx={{ mb: 10 }} />
        <Dashboard />
      </Container>
    </>
  );
};

export default Homepage;
