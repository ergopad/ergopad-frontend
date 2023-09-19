import AssetList from '@components/dashboard/AssetList';
import {
  Grid,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Switch,
  useMediaQuery,
  FormHelperText,
  FormGroup,
} from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useWallet } from 'utils/WalletContext';
import CenterTitle from '@components/CenterTitle';
import VestingTable from '@components/dashboard/VestingTable';
import StakingTable from '@components/dashboard/StakingTable';
import StackedAreaPortfolioHistory from '@components/dashboard/StackedAreaPortfolioHistory';
import PieChart from '@components/dashboard/PieChart';

// CONFIG for portfolio history
// step size
const STEP_SIZE = 2;
const STEP_UNIT = 'w';

// token
const ERGOPAD_TOKEN =
  'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413';

// placeholder data
const rawData2 = {
  balance: 0,
  tokens: [
    {
      tokenId: '0xdead',
      amount: 1,
      decimals: 0,
      name: 'No assets',
      price: 1,
    },
  ],
  price: 1,
};

const initHistoryData = [
  {
    token: 'No Assets',
    resolution: 1,
    history: [
      {
        timestamp: new Date().toISOString(),
        value: 0,
      },
      {
        timestamp: new Date(0).toISOString(),
        value: 0,
      },
    ],
  },
];

const initStakedData = [];
const wantedHoldingData = tokenDataArray(rawData2);
const portfolioValue = sumTotals(wantedHoldingData);
const defaultHoldingData = wantedHoldingData.map((item) => {
  const container = {};
  container.x = item.x;
  container.y = 0;
  return container;
});

defaultHoldingData[defaultHoldingData.length - 1].y = portfolioValue;

const paperStyle = {
  p: 3,
  borderRadius: 2,
  height: '100%',
};

const Dashboard = () => {
  const { wallet, dAppWallet } = useWallet();
  const [vestedTokens, setVestedTokens] = useState([]);
  const [vestedTokensNFT, setVestedTokensNFT] = useState({});
  const [stakedTokens, setStakedTokens] = useState(initStakedData);
  const [holdingData, setHoldingData] = useState(defaultHoldingData);
  const [holdingDataAggregated, setHoldingDataAggregated] =
    useState(defaultHoldingData);
  const [historyData, setHistoryData] = useState(initHistoryData);
  const [historyDataAggregated, setHistoryDataAggregated] =
    useState(initHistoryData);
  const [assetList, setAssetList] = useState(assetListArray(rawData2));
  const [imgNftList, setImgNftList] = useState([]);
  const [audNftList, setAudNftList] = useState([]);
  const [priceDataErgopad, setPriceDataErgopad] = useState({});
  const [priceDataVested, setPriceDataVested] = useState({});
  const [priceDataStaked, setPriceDataStaked] = useState({});
  const [priceHistoryData, setPriceHistoryData] = useState([]);
  const [addVestingTableTokens, setAddVestingTable] = useState(true);
  const [addStakingTableTokens, setAddStakingTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingVestingTable, setLoadingVestingTable] = useState(false);
  const [loadingStakingTable, setLoadingStakingTable] = useState(false);
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [navigatorLanguage, setNavigatorLanguage] = useState('en-US');

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setNavigatorLanguage(navigator.language);
    }
    return () => mounted = false;
  }, []);

  useEffect(() => {
    setHoldingData(wantedHoldingData); // Setting the data that we want to display
  }, []);

  const noAssetSetup = () => {
    const noAssetList = [
      {
        id: 0,
        name: 'No assets',
      },
    ];
    setAssetList(noAssetList);
    setAudNftList(noAssetList);
    setImgNftList(noAssetList);
    const noAssetArray = tokenDataArray(rawData2);
    setHoldingData(noAssetArray);
    setHistoryData(initHistoryData);
    setStakedTokens(initStakedData);
    setVestedTokens([]);
    setVestedTokensNFT({});
  };

  useMemo(() => {
    async function getWalletData(addresses) {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: auth?.accessToken ? `Bearer ${auth.accessToken}` : '',
        },
      };

      setLoading(true);
      const balances = await axios
        .post(`${process.env.API_URL}/asset/balances/`, {
          addresses: addresses,
        })
        .catch((err) => {
          console.log('ERROR FETCHING: ', err);
          return {
            data: {},
          };
        });
      const balance = reduceBalances(balances.data);

      if (balance) {
        const victoryData = tokenDataArray(balance);
        // create list of assets
        const initialAssetList = assetListArray(balance);

        const newImgNftList = [];
        const newAudNftList = [];
        const newAssetList = [];

        /**
         * Collect promises from ergoplatform and resolve them asynchronously
         */
        const assetListPromises = [];
        const indexMapper = {};
        for (let i = 0; i < initialAssetList.length; i++) {
          if (initialAssetList[i].id != 'ergid') {
            const promise = getIssuingBoxPromise(initialAssetList[i].id);
            indexMapper[initialAssetList[i].id] = i;
            assetListPromises.push(promise);
          } else {
            newAssetList[newAssetList.length] = initialAssetList[i];
          }
        }

        // resolve the promises
        const resolvedAssetList = await Promise.all(assetListPromises);
        resolvedAssetList.forEach((res) => {
          if (res?.data) {
            const data = res?.data;
            const i = indexMapper[data[0].assets[0].tokenId];
            // cache issuing box
            setIssuingBox(initialAssetList[i].id, res);
            const tokenObject = {
              name: data[0].assets[0].name,
              ch: data[0].creationHeight,
              description: toUtf8String(data[0].additionalRegisters.R5).substring(2),
              r7: data[0].additionalRegisters.R7,
              r9: data[0].additionalRegisters?.R9
                ? resolveIpfs(toUtf8String(data[0].additionalRegisters?.R9).substring(2))
                : undefined,
              r5: toUtf8String(data[0].additionalRegisters.R5).substring(2),
              ext: toUtf8String(data[0].additionalRegisters.R9)
                .substring(2)
                .slice(-4),
              token: initialAssetList[i].token,
              id: initialAssetList[i].id,
              amount: initialAssetList[i].amount,
              amountUSD: initialAssetList[i].amountUSD
                ? initialAssetList[i].amountUSD
                : '',
            };

            // if audio NFT
            if (
              tokenObject.ext == '.mp3' ||
              tokenObject.ext == '.ogg' ||
              tokenObject.ext == '.wma' ||
              tokenObject.ext == '.wav' ||
              tokenObject.ext == '.aac' ||
              tokenObject.ext == 'aiff' ||
              tokenObject.r7 == '0e020102'
            ) {
              newAudNftList[newAudNftList.length] = tokenObject;
            }
            // if image NFT
            else if (
              tokenObject.ext == '.png' ||
              tokenObject.ext == '.gif' ||
              tokenObject.ext == '.jpg' ||
              tokenObject.ext == 'jpeg' ||
              tokenObject.ext == '.bmp' ||
              tokenObject.ext == '.svg' ||
              tokenObject.ext == '.raf' ||
              tokenObject.ext == '.nef' ||
              tokenObject.r7 == '0e020101' ||
              tokenObject.r7 == '0e0430313031'
            ) {
              newImgNftList[newImgNftList.length] = tokenObject;
            } else {
              newAssetList[newAssetList.length] = tokenObject;
            }
          }
        });

        try {
          const res = await axios.get(
            `${process.env.API_URL}/asset/price/history/all?stepSize=${STEP_SIZE}&stepUnit=${STEP_UNIT}&limit=26`,
            { ...defaultOptions }
          );
          const priceHistory = res.data;
          const amountData = historyDataArray(balance);
          const orderingData = historyDataOrdering(balance);
          const totals = calculateHistoricTotal(
            priceHistory,
            amountData,
            orderingData
          );
          setHistoryData(totals);
          // store current ergopad price
          const ergopadPrice = res.data
            .filter((pt) => pt.token === 'ergopad')
            .map((token) => token.history[0].price);
          setPriceDataErgopad({
            ergopad: ergopadPrice.length ? ergopadPrice[0] : 0,
          });
          setPriceHistoryData([...res.data]);
        } catch (e) {
          console.log('Error: building history', e);
        }

        setHoldingData(victoryData);
        setAssetList(newAssetList);
        setAudNftList(newAudNftList);
        setImgNftList(newImgNftList);
      }

      setLoading(false);
    }

    const getVestedTokenData = async (addresses) => {
      setLoadingVestingTable(true);
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      /**
       * V1 vested ergopad
       */
      // const vested = await axios
      //   .post(
      //     `${process.env.API_URL}/vesting/v1/`,
      //     { addresses: [...addresses] },
      //     { ...defaultOptions }
      //   )
      //   .catch((e) => {
      //     console.log('ERROR FETCHING', e);
      //     return {
      //       data: {},
      //     };
      //   });
      // setVestedTokens(reduceVested(vested.data));

      /**
       * V2 vested with NFT
       */
      const vestedTokensNFTResponse = await axios
        .post(
          `${process.env.API_URL}/vesting/v2/`,
          { addresses: [...addresses] },
          { ...defaultOptions }
        )
        .catch((e) => {
          console.log('ERROR FETCHING', e);
          return {
            data: [],
          };
        });
      setVestedTokensNFT(vestedTokensNFTResponse.data);

      const tokens = Object.keys(vestedTokensNFTResponse.data);
      try {
        const pricesObject = {};
        const tokenPrices = await axios.post(
          `${process.env.API_URL}/asset/prices`,
          { tokens: tokens }
        );
        tokenPrices.data.forEach((price) => {
          pricesObject[price.name] = price.price;
        });
        setPriceDataVested(pricesObject);
      } catch (e) {
        console.log(e);
      }
      setLoadingVestingTable(false);
    };

    const getStakedTokenData = async (addresses) => {
      setLoadingStakingTable(true);
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const stakedTokens = await axios
        .post(
          `${process.env.API_URL}/staking/staked-all/`,
          { addresses: [...addresses] },
          { ...defaultOptions }
        )
        .catch((e) => {
          console.log('ERROR FETCHING', e);
          return {
            data: [],
          };
        });

      // stakedTokens.data 
      // 
      // {
      //   "ergopad": [
      //     {
      //       "project": "ergopad",
      //       "tokenName": "ergopad",
      //       "totalStaked": 0.00,
      //       "addresses": {
      //         "SOME-ERGO-ADDRESS": {
      //           "totalStaked": 0.00,
      //           "stakeBoxes": [
      //             {
      //               "boxId": "SOME-BOX-ID",
      //               "stakeKeyId": "SOME-STAKE-KEY-ID",
      //               "stakeAmount": 0.00
      //             }
      //           ]
      //         }
      //       }
      //     }
      //   ],
      // }
      if (stakedTokens.data.length > 0) {
        setStakedTokens(stakedTokens.data);
        const tokens = stakedTokens.data.map((token) => token.tokenName);
        try {
          const pricesObject = {};
          const tokenPrices = await axios.post(
            `${process.env.API_URL}/asset/prices`,
            { tokens: tokens }
          );
          tokenPrices.data.forEach((price) => {
            pricesObject[price.name] = price.price;
          });
          setPriceDataStaked(pricesObject);
        } catch (e) {
          console.log(e);
        }
      }
      setLoadingStakingTable(false);
    };

    const walletAddresses = [wallet, ...dAppWallet.addresses].filter(
      (x, i, a) => a.indexOf(x) == i && x
    );
    if (walletAddresses?.length > 0) {
      getWalletData(walletAddresses);
      getVestedTokenData(walletAddresses);
      getStakedTokenData(walletAddresses);
    } else {
      noAssetSetup();
    }
  }, [wallet, dAppWallet.addresses]);

  useEffect(() => {
    // previous state
    const holdingState = JSON.parse(JSON.stringify(holdingData));
    const historyState = JSON.parse(JSON.stringify(historyData));
    // build new state
    if (addVestingTableTokens) {
      if (priceDataErgopad?.ergopad) {
        try {
          // vesting ergopad
          const ergopadValueOpt = vestedTokens.filter(
            (token) => token.tokenId === ERGOPAD_TOKEN
          );
          if (ergopadValueOpt.length) {
            const ergopadValue =
              ergopadValueOpt[0].totalVested * priceDataErgopad.ergopad;
            holdingState.push({ x: 'ergopad (vesting)', y: ergopadValue });
          }
          // vesting ergopad history
          const ergopadHistoryOpt = priceHistoryData.filter(
            (token) => token.token === 'ergopad'
          );
          if (ergopadValueOpt.length && ergopadHistoryOpt.length) {
            const history = ergopadHistoryOpt[0].history.map((pt) => {
              return {
                timestamp: pt.timestamp,
                value: pt.price * ergopadValueOpt[0].totalVested,
              };
            });
            historyState.push({ token: 'ergopad (vesting)', history: history });
          }
        } catch (e) {
          console.log(e);
        }
      }
      // vested with NFT
      const reducedVestedNFT = reduceVestedNFT(vestedTokensNFT).map((price) => {
        return {
          x: price.name + ' (vesting)',
          y: price.amount * (priceDataVested[price.name] ?? 0),
        };
      });
      holdingState.push(...reducedVestedNFT);
    }
    if (addStakingTableTokens) {
      // staked
      if (stakedTokens.length > 0) {
        const reducedStaked = reduceStaked(stakedTokens).map((price) => {
          return {
            x: price.name + ' (staked)',
            y: price.amount * (priceDataStaked[price.name] ?? 0),
          };
        });
        holdingState.push(...reducedStaked);
      }
      // staked ergopad history
      const ergopadHistoryOpt = priceHistoryData.filter(
        (token) => token.token === 'ergopad'
      );

      if (stakedTokens.length > 0) {
        const ergopadValueOpt = reduceStaked(stakedTokens).filter((price) =>
          price.name.toLowerCase().includes('ergopad')
        );
        if ((ergopadValueOpt.length > 0) && (ergopadHistoryOpt.length > 0)) {
          const history = ergopadHistoryOpt[0].history.map((pt) => {
            return {
              timestamp: pt.timestamp,
              value: pt.price * ergopadValueOpt[0].amount,
            };
          });
          historyState.push({
            token: ergopadValueOpt[0].name + ' (staked)',
            history: history,
          });
        }
      }
    }
    setHoldingDataAggregated(holdingState);
    setHistoryDataAggregated(historyState);
  }, [
    addVestingTableTokens,
    addStakingTableTokens,
    holdingData,
    historyData,
    vestedTokens,
    vestedTokensNFT,
    stakedTokens,
    priceDataErgopad,
    priceDataVested,
    priceDataStaked,
    priceHistoryData,
  ]);

  return (
    <>
      <CenterTitle
        title="Dashboard"
        subtitle="Connect wallet above to see all your ergo assets"
        main="true"
      />
      <Container maxWidth="lg" sx={{ mx: 'auto' }}>
        <Grid container spacing={3} alignItems="stretch" sx={{ pt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={paperStyle}>
              <Typography variant="h4">Wallet Holdings</Typography>
              {loading ? (
                <>
                  <CircularProgress color="inherit" />
                </>
              ) : (
                <>
                  <PieChart holdingData={holdingDataAggregated} />
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={paperStyle}>
              <Typography variant="h4" sx={{ mb: loading ? '1rem' : 0 }}>
                Portfolio History {!loading && '*'}
              </Typography>
              {loading ? (
                <>
                  <CircularProgress color="inherit" />
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    Not all tokens are shown in this chart
                  </Typography>
                  <StackedAreaPortfolioHistory data={historyDataAggregated} />
                </>
              )}
            </Paper>
          </Grid>
          {loading ? (
            <></>
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Paper sx={paperStyle}>
                  <AssetList
                    assets={assetList}
                    title="Assets"
                    navigatorLanguage={navigatorLanguage}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={paperStyle}>
                  <AssetList
                    assets={imgNftList}
                    title="Image NFTs"
                    type="NFT"
                    navigatorLanguage={navigatorLanguage}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={paperStyle}>
                  <AssetList
                    assets={audNftList}
                    title="Audio NFTs"
                    type="AudioNFT"
                    navigatorLanguage={navigatorLanguage}
                  />
                </Paper>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Paper sx={paperStyle}>
              <Grid container>
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    Tokens Locked in Vesting Contracts
                  </Typography>
                </Grid>
                {vestedTokens.length + Object.keys(vestedTokensNFT).length >
                  0 && (
                    <Grid
                      item
                      xs={12}
                      md={4}
                      sx={{
                        justifyContent: checkSmall ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <FormGroup
                        sx={{
                          alignItems: checkSmall ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Switch
                          disabled={
                            loading || loadingStakingTable || loadingVestingTable
                          }
                          checked={addVestingTableTokens}
                          onChange={(e) => setAddVestingTable(e.target.checked)}
                        />
                        <FormHelperText>
                          Add to Wallet Holdings for Total
                        </FormHelperText>
                      </FormGroup>
                    </Grid>
                  )}
              </Grid>
              {loadingVestingTable ? (
                <CircularProgress color="inherit" />
              ) : (
                <VestingTable
                  vestedObject={vestedTokens}
                  vestedTokensWithNFT={vestedTokensNFT}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={paperStyle}>
              <Grid container>
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    Tokens Locked in Staking Contracts
                  </Typography>
                </Grid>
                {stakedTokens.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      justifyContent: checkSmall ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <FormGroup
                      sx={{
                        alignItems: checkSmall ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Switch
                        disabled={
                          loading || loadingStakingTable || loadingVestingTable
                        }
                        checked={addStakingTableTokens}
                        onChange={(e) => setAddStakingTable(e.target.checked)}
                      />
                      <FormHelperText>
                        Add to Wallet Holdings for Total
                      </FormHelperText>
                    </FormGroup>
                  </Grid>
                )}
              </Grid>
              {loadingStakingTable ? (
                <CircularProgress color="inherit" />
              ) : (
                <StakingTable data={stakedTokens} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

function tokenDataArray(data) {
  const tokenObject = data.tokens;
  const keys = Object.keys(tokenObject);
  const res = [];
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    const obj = {
      x: token.name,
      y: token.price * (token.amount * Math.pow(10, -token.decimals)),
    };
    if (token.price > 0) res.push(obj);
  }
  const ergoValue = {
    x: 'Ergo',
    y: data.price * data.balance,
  };
  if (ergoValue.y > 0) res.unshift(ergoValue);
  return res;
}

const historyDataOrdering = (data) => {
  const tokenObject = data.tokens;
  const keys = Object.keys(tokenObject);
  const res = {};
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    if (token.price > 0) res[token.name.toLowerCase()] = i;
  }
  const ergoValue = data.balance;
  if (ergoValue > 0) res['ergo'] = -1;
  return res;
};

const historyDataArray = (data) => {
  const tokenObject = data.tokens;
  const keys = Object.keys(tokenObject);
  const res = {};
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    if (token.price > 0)
      res[token.name.toLowerCase()] = {
        name: token.name,
        amount: token.amount * Math.pow(10, -token.decimals),
      };
  }
  const ergoValue = data.balance;
  if (ergoValue > 0) res['ergo'] = { name: 'Ergo', amount: ergoValue };
  return res;
};

function assetListArray(data) {
  const tokenObject = data.tokens;
  const keys = Object.keys(tokenObject);
  const res = [];
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    const amount = +parseFloat(token.amount * Math.pow(10, -token.decimals));
    const price = token.price * amount;
    const obj = {
      token: token.name ? token.name.substring(0, 3).toUpperCase() : '',
      name: token.name ? token.name : '',
      id: token.tokenId,
      amount: amount,
      amountUSD: price,
    };
    res.push(obj);
  }
  const ergoValue = {
    token: 'ERG',
    name: 'Ergo',
    id: 'ergid',
    amount: data.balance,
    amountUSD: data.price * data.balance,
  };
  res.unshift(ergoValue);
  return res;
}

function sumTotals(data) {
  const value = data.map((item) => item.y).reduce((a, b) => a + b, 0);
  return value;
}

function toUtf8String(hex) {
  if (!hex) {
    hex = '';
  }
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function resolveIpfs(url) {
  const ipfsPrefix = 'ipfs://';
  if (!url.startsWith(ipfsPrefix) && url.startsWith('http://')) return 'https://' + url.substring(7);
  else if (!url.startsWith(ipfsPrefix)) return url;
  else return url.replace(ipfsPrefix, `https://cloudflare-ipfs.com/ipfs/`);
}

const calculateHistoricTotal = (priceHistory, amountData, orderingData) => {
  const ret = priceHistory
    .filter((tokenData) => amountData[tokenData.token.toLowerCase()])
    .map((tokenData) => {
      return {
        token: amountData[tokenData.token.toLowerCase()].name,
        history: tokenData.history.map((dataPoint) => {
          return {
            timestamp: dataPoint.timestamp,
            value:
              dataPoint.price *
              amountData[tokenData.token.toLowerCase()].amount,
          };
        }),
      };
    });
  ret.sort(
    (a, b) =>
      orderingData[a.token.toLowerCase()] - orderingData[b.token.toLowerCase()]
  );
  return ret;
};

const reduceBalances = (balances) => {
  try {
    if (Object.keys(balances).length === 0) {
      return null;
    }
    const ret = {
      balance: 0,
      tokens: [],
      price: 1,
    };
    // aggregate
    const ergo = Object.keys(balances.addresses)
      .map((address) => balances.addresses[address].balance ?? 0.0)
      .reduce((a, c) => a + c, 0);
    ret.balance = ergo;
    ret.price = balances.price;
    // aggregate tokens
    const tokenMap = {};
    Object.keys(balances.addresses).forEach((address) => {
      const tokens = balances.addresses[address].tokens ?? [];
      tokens.forEach((token) => {
        if (tokenMap[token.tokenId]) {
          tokenMap[token.tokenId].amount += token.amount;
        } else {
          tokenMap[token.tokenId] = token;
        }
      });
    });
    const tokens = Object.values(tokenMap);
    ret.tokens = tokens;
    return ret;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// const reduceVested = (vestedData) => {
//   const vested = JSON.parse(JSON.stringify(vestedData));
//   const vestedList = Object.keys(vested).map((tokenId) => {
//     return {
//       tokenId: tokenId,
//       ...vested[tokenId],
//       outstanding: Object.keys(vested[tokenId].outstanding).map((date) => {
//         return {
//           date: date,
//           amount: vested[tokenId].outstanding[date].amount,
//         };
//       }),
//     };
//   });
//   return vestedList;
// };

const reduceVestedNFT = (vestedData) => {
  return Object.keys(vestedData).map((token) => {
    return {
      name: token,
      amount: vestedData[token]
        .map((box) => box.Remaining)
        .reduce((a, c) => a + c, 0),
    };
  });
};

const reduceStaked = (stakedData) => {
  return stakedData.map((data) => {
    return {
      name: data.tokenName,
      amount: data.totalStaked,
    };
  });
};

const generateIssueingBoxStorageKey = (id) => {
  return `issuing_box_${id}_87126`;
};

const getIssuingBoxPromise = (id) => {
  const box = localStorage.getItem(generateIssueingBoxStorageKey(id));
  if (box === null) {
    return axios
      .get(`https://api.ergoplatform.com/api/v0/assets/${id}/issuingBox`)
      .catch((err) => {
        console.log("ERROR FETCHING: ", err);
      });
  }
  return JSON.parse(box);
};

const setIssuingBox = (id, res) => {
  if (res?.data) {
    localStorage.setItem(
      generateIssueingBoxStorageKey(id),
      JSON.stringify(res)
    );
  }
};

export default Dashboard;
