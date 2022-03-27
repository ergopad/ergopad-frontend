import { useMediaQuery } from '@mui/material';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLegend,
  VictoryStack,
} from 'victory';

const toValueText = (value) => {
  if (value < 1000) {
    return `$${Math.round(value * 100) / 100}`;
  } else if (value < 1000000) {
    return `$${Math.round(value / 100) / 10}k`;
  } else {
    return `$${Math.round(value / 100000) / 10}m`;
  }
};

const StackedAreaPortfolioHistory = (props) => {
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <VictoryChart
      padding={{ top: 10, bottom: 60, left: 40, right: 40 }}
      domainPadding={{ y: 20 }}
      containerComponent={
        <VictoryContainer
          id="victory-stack-chart-container"
          style={{
            touchAction: 'auto',
          }}
        />
      }
    >
      <VictoryLegend
        borderPadding={10}
        gutter={30}
        orientation="horizontal"
        colorScale="cool"
        itemsPerRow={3}
        x={40}
        y={checkSmall ? -80 : -40}
        data={props.data.map((priceHistory, index) => {
          return {
            id: index,
            name: priceHistory.token,
          };
        })}
        style={{ labels: { fill: 'white' } }}
        name="legend"
      />
      <VictoryStack
        colorScale="cool"
        animate={{ easing: 'exp' }}
        style={{ labels: { fill: 'white' } }}
      >
        {props.data.map((priceHistory) => (
          <VictoryArea
            name={priceHistory.token}
            key={priceHistory.token}
            data={priceHistory.history.map((dataPoint) => {
              return {
                x: dataPoint.timestamp,
                y: dataPoint.value,
              };
            })}
          />
        ))}
      </VictoryStack>
      <VictoryAxis
        dependentAxis
        tickFormat={(value) => {
          const formatted = toValueText(value);
          return formatted;
        }}
        style={{
          axis: { stroke: 'white' },
          ticks: { stroke: 'white' },
          tickLabels: { fill: 'white', fontSize: 8 },
        }}
      />
      <VictoryAxis
        fixLabelOverlap
        crossAxis
        invertAxis
        tickFormat={(timestamp) => {
          return new Date(Date.parse(timestamp)).toDateString();
        }}
        style={{
          axis: { stroke: 'white' },
          ticks: { stroke: 'white' },
          tickLabels: { fill: 'white', fontSize: 7 },
        }}
      />
    </VictoryChart>
  );
};

export default StackedAreaPortfolioHistory;
