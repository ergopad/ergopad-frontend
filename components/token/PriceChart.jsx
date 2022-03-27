import {
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from '@components/MuiNextLink';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import theme from '@styles/theme';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const stepUnitMapper = {
  '1h': {
    stepSize: 1,
    stepUnit: 'h',
  },
  '4h': {
    stepSize: 4,
    stepUnit: 'h',
  },
  '1d': {
    stepSize: 1,
    stepUnit: 'd',
  },
  '1w': {
    stepSize: 1,
    stepUnit: 'w',
  },
  '1m': {
    stepSize: 1,
    stepUnit: 'm',
  },
};

const pairBaseCurrencyMapper = {
  ergopad_sigusd: ' SigUSD',
  ergopad_erg: ' Erg',
};

const initHistoryData = {
  token: 'xyzpad_erg',
  resolution: 10,
  history: [
    {
      timestamp: new Date().toISOString(),
      price: 1,
    },
    {
      timestamp: new Date(0).toISOString(),
      price: 0,
    },
  ],
};

const PriceChart = () => {
  const mtheme = useTheme();
  const matches = useMediaQuery(mtheme.breakpoints.up('md'));
  const [rawData, setRawData] = useState(initHistoryData);
  const [stepUnit, setStepUnit] = useState('1h');
  const [pair, setPair] = useState('ergopad_sigusd');

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `${process.env.API_URL}/asset/price/chart/${pair}?stepSize=${stepUnitMapper[stepUnit].stepSize}&stepUnit=${stepUnitMapper[stepUnit].stepUnit}`
        );
        setRawData(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, [stepUnit, pair]);

  const priceData = rawData.history.map((dataPoint) => {
    return {
      x: dataPoint.timestamp,
      y: dataPoint.price,
    };
  });
  const lastPrice = priceData.length
    ? Math.round(priceData[0].y * 10000) / 10000
    : 1;

  const handleStepChange = (e, newAlignment) => {
    if (newAlignment !== null) {
      setStepUnit(newAlignment);
    }
  };

  const handlePairChange = (e, newAlignment) => {
    if (newAlignment !== null) {
      setPair(newAlignment);
    }
  };

  return (
    <>
      <Typography variant="h4">
        1 ErgoPad = {lastPrice}
        {pairBaseCurrencyMapper[pair]}
      </Typography>
      <Grid>
        <Grid container>
          <Grid item md={6} xs={12}>
            <ToggleButtonGroup
              color="info"
              value={pair}
              exclusive
              onChange={handlePairChange}
              sx={{ mb: 2, mt: 0 }}
              size="small"
            >
              <ToggleButton value="ergopad_sigusd">SigUSD</ToggleButton>
              <ToggleButton value="ergopad_erg">Erg</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: matches ? 'flex-end' : 'flex-start',
            }}
          >
            <ToggleButtonGroup
              color="info"
              value={stepUnit}
              exclusive
              onChange={handleStepChange}
              sx={{ mb: 2, mt: 0 }}
              size="small"
            >
              <ToggleButton value="1h">1 hour</ToggleButton>
              <ToggleButton value="4h">4 hours</ToggleButton>
              <ToggleButton value="1d">1 day</ToggleButton>
              <ToggleButton value="1w">1 week</ToggleButton>
              {/* <ToggleButton value="1m">1 month</ToggleButton> */}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <VictoryChart
          height={matches ? 150 : 250}
          padding={{ top: 10, bottom: 30, right: 30, left: 40 }}
          domainPadding={{ y: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              id="victory-stack-chart-container"
              style={{
                touchAction: 'auto',
              }}
              labelComponent={<VictoryTooltip style={{ fontSize: 6 }} />}
              labels={(d) => {
                return (
                  Math.floor(d.datum.y * 10000) / 10000 +
                  pairBaseCurrencyMapper[pair]
                );
              }}
            />
          }
        >
          <VictoryLine
            style={{
              data: { stroke: theme.palette.tertiary.main },
            }}
            animate={{ easing: 'exp' }}
            interpolation="natural"
            data={priceData}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(price) => {
              return price;
            }}
            style={{
              axis: { stroke: 'white' },
              ticks: { stroke: 'white' },
              tickLabels: { fill: 'white', fontSize: 6 },
            }}
          />
          <VictoryAxis
            fixLabelOverlap
            crossAxis
            invertAxis
            tickFormat={(timestamp) => {
              let theDate = new Date(Date.parse(timestamp));
              let parseDate = (theDate.getMonth() + 1) + '/' + theDate.getDate();
              return parseDate;
            }}
            style={{
              axis: { stroke: 'white' },
              ticks: { stroke: 'white' },
              tickLabels: { fill: 'white', fontSize: 7 },
            }}
          />
        </VictoryChart>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            underline="none"
            href={'https://app.ergodex.io/swap'}
            aria-label="ergodex"
            title="Trade"
            rel="noreferrer"
            target="_blank"
            sx={{ mb: 1, mx: 3 }}
          >
            <Button
              variant="contained"
              sx={{
                color: '#fff',
                fontSize: '1rem',
                py: '0.6rem',
                px: '1.6rem',
                backgroundColor: theme.palette.tertiary.main,
                '&:hover': {
                  backgroundColor: theme.palette.tertiary.hover,
                  boxShadow: 'none',
                },
                '&:active': {
                  backgroundColor: theme.palette.tertiary.active,
                },
              }}
            >
              Trade
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default PriceChart;
