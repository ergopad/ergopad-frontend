import { Button, Icon, Box, Typography, CircularProgress } from '@mui/material';
import Section from '@components/layout/Section';
import AccordionComponent from '@components/AccordionComponent';
import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import theme from '@styles/theme';
import Search from '@components/Search';
import { useSearch } from '../utils/SearchContext';
import axios from 'axios';

const faqItems = [];

const SortButton = styled(Button)({
  borderRadius: `20px`,
  background: 'rgb(46, 46, 51)',
  color: 'rgb(228, 228, 231)',
  fontSize: '1rem',
  textTransform: 'none',
  '&:hover': {
    background: 'rgba(63,62,68,255)',
  },
});

const Faq = () => {
  const [tag, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(faqItems);
  const [data, setData] = useState(apiData);
  const { search } = useSearch();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.API_URL}/faq/`);
        setApiData(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    if (tag === '') {
      setData(apiData);
    } else {
      const newFaqItems = apiData.filter((item) => item.tag.includes(tag));
      setData(newFaqItems);
    }
  }, [tag, apiData]);

  useEffect(() => {
    if (search != '') {
      let lowerCase = search.toLowerCase();
      const filtered = apiData.filter((item) => {
        return (
          item.question.toLowerCase().includes(lowerCase) ||
          item.solution.toLowerCase().includes(lowerCase)
        );
      });
      setData(filtered);
    } else {
      setData(apiData);
    }
  }, [search, apiData]);

  return (
    <>
      <Section
        title="Frequently Asked Questions"
        subtitle="You've got questions, we've got answers"
        main={true}
        toggleOutside={true}
        extra={<Search placeholder="Filter questions" />}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: '2rem',
          }}
        >
          <SortButton
            variant="contained"
            disableElevation
            onClick={() => setCategory('')}
            startIcon={<Icon>list</Icon>}
          >
            View All
          </SortButton>
          <SortButton
            variant="contained"
            disableElevation
            onClick={() => setCategory('token')}
            sx={
              tag === 'token'
                ? {
                    background: 'rgba(49, 151, 149, 0.25)',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: 'rgba(49, 151, 149, 0.25)',
                    },
                  }
                : {}
            }
            startIcon={<Icon color="primary">toll</Icon>}
          >
            Token
          </SortButton>
          <SortButton
            variant="contained"
            disableElevation
            onClick={() => setCategory('staking')}
            sx={
              tag === 'Staking'
                ? {
                    background: 'rgba(128, 90, 213, 0.25)',
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      background: 'rgba(128, 90, 213, 0.25)',
                    },
                  }
                : {}
            }
            startIcon={<Icon color="secondary">auto_graph</Icon>}
          >
            Staking
          </SortButton>
          <SortButton
            variant="contained"
            disableElevation
            onClick={() => setCategory('company')}
            sx={
              tag === 'company'
                ? {
                    background: 'rgba(90, 103, 216, 0.25)',
                    color: theme.palette.tertiary.main,
                    '&:hover': {
                      background: 'rgba(90, 103, 216, 0.25)',
                    },
                  }
                : {}
            }
            startIcon={
              <Icon sx={{ color: theme.palette.tertiary.main }}>business</Icon>
            }
          >
            Company
          </SortButton>
        </Box>
        {loading ? (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-12px',
            }}
          />
        ) : data.length != 0 ? (
          <AccordionComponent
            accordionItems={data.map((faq) => {
              return { ...faq, title: faq.question, bodyText: faq.solution };
            })}
            uniqueId="faq"
          />
        ) : (
          <Typography variant="body2">No questions found</Typography>
        )}
      </Section>
    </>
  );
};

export default Faq;
