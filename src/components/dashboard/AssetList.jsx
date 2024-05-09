import { Box, Typography } from '@mui/material';
import React from 'react';
import AssetItem from './AssetItem';

/* const mockData = [
  { token: 'ERG', name: 'Ergo', amount: 400, amountUSD: '4320' },
  { token: 'ADA', name: 'Cardano', amount: 200, amountUSD: '450' },
  { token: 'BTC', name: 'Bitcoin', amount: 1, amountUSD: '55,000' },
  { token: 'ETH', name: 'Etherium', amount: 1, amountUSD: '2,800' },
  { token: 'XRP', name: 'XRP', amount: 200, amountUSD: '430' },
]; */

const AssetList = ({ assets, title, type, navigatorLanguage }) => {
  return (
    <Box>
      <Typography align="center" variant="h4">
        {title}
      </Typography>
      <Box
        sx={{
          px: '0',
          maxHeight: '400px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          mr: '-18px',
          pr: '12px',
        }}
      >
        {assets.map((asset, i) => {
          if (asset.name != '')
            return (
              <AssetItem
                key={i}
                asset={asset}
                type={type}
                navigatorLanguage={navigatorLanguage}
              />
            );
        })}
      </Box>
    </Box>
  );
};

export default AssetList;
