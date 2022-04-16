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
import React, { useState, useEffect } from 'react';
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
  address: 'No assets',
  balance: {
    ERG: {
      blockchain: 'ergo',
      balance: 0,
      unconfirmed: 0,
      tokens: [
        {
          tokenId: 'abcdefg',
          amount: 1,
          decimals: 0,
          name: 'No assets',
          price: 1,
        },
      ],
      price: 1,
    },
  },
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

const initStakedData = {
  totalStaked: 0,
  addresses: {},
};

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
  const [priceHistoryData, setPriceHistoryData] = useState([]);
  const [addVestingTableTokens, setAddVestingTable] = useState(true);
  const [addStakingTableTokens, setAddStakingTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingVestingTable, setLoadingVestingTable] = useState(false);
  const [loadingStakingTable, setLoadingStakingTable] = useState(false);
  const checkSmall = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [navigatorLanguage, setNavigatorLanguage] = useState('en-US');
  
  useEffect(() => {
    setNavigatorLanguage(navigator.language)
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

  useEffect(() => {
    async function getWalletData(addresses) {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: auth?.accessToken ? `Bearer ${auth.accessToken}` : '',
        },
      };

      setLoading(true);
      const balancePromises = addresses.map((address) =>
        axios
          .get(`${process.env.API_URL}/asset/balance/${address}`, {
            ...defaultOptions,
          })
          .catch((err) => {
            console.log('ERROR FETCHING: ', err);
          })
      );
      const resolvedBalances = await Promise.all(balancePromises);
      const balances = resolvedBalances.map((res) => res?.data);
      const balance = reduceBalances(balances);

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
            const promise = axios
              .get(
                `https://api.ergoplatform.com/api/v0/assets/${initialAssetList[i].id}/issuingBox`,
                { ...defaultOptions }
              )
              .catch((err) => {
                console.log('ERROR FETCHING: ', err);
              });
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
            const tokenObject = {
              name: data[0].assets[0].name,
              ch: data[0].creationHeight,
              description: toUtf8String(data[0].additionalRegisters.R5).substr(
                2
              ),
              r7: data[0].additionalRegisters.R7,
              r9: data[0].additionalRegisters?.R9
                ? resolveIpfs(
                    toUtf8String(data[0].additionalRegisters?.R9).substr(2)
                  )
                : undefined,
              r5: toUtf8String(data[0].additionalRegisters.R5).substr(2),
              ext: toUtf8String(data[0].additionalRegisters.R9)
                .substr(2)
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

      const vestedPromises = addresses.map((address) =>
        axios
          .get(`${process.env.API_URL}/vesting/vested/${address}`, {
            ...defaultOptions,
          })
          .catch((e) => {
            console.log('ERROR FETCHING', e);
          })
      );
      const resolvedVested = await Promise.all(vestedPromises);
      const vested = resolvedVested
        .map((res) => (res?.data?.status === 'success' ? res.data.vested : []))
        .filter((vested) => vested.length);
      setVestedTokens(reduceVested(vested));

      const vestedTokensNFTResponse = await axios
        .post(
          `${process.env.API_URL}/vesting/vestedWithNFT/`,
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
      try {
        const defaultOptions = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const request = {
          addresses: addresses,
        };
        const res = await axios.post(
          `${process.env.API_URL}/staking/staked/`,
          request,
          { ...defaultOptions }
        );
        setStakedTokens(res.data);
      } catch (e) {
        console.log('ERROR FETCHING', e);
      }
      setLoadingStakingTable(false);
    };

    const walletAddresses = [wallet, ...dAppWallet.addresses].filter(
      (x, i, a) => a.indexOf(x) == i && x
    );
    if (walletAddresses.length) {
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
      if (priceDataErgopad.ergopad) {
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
    if (addStakingTableTokens && priceDataErgopad.ergopad) {
      try {
        const ergopadValue =
          stakedTokens.totalStaked * priceDataErgopad.ergopad;
        if (ergopadValue) {
          holdingState.push({ x: 'ergopad (staked)', y: ergopadValue });
        }
        const ergopadHistoryOpt = priceHistoryData.filter(
          (token) => token.token === 'ergopad'
        );
        if (ergopadValue && ergopadHistoryOpt.length) {
          const history = ergopadHistoryOpt[0].history.map((pt) => {
            return {
              timestamp: pt.timestamp,
              value: pt.price * stakedTokens.totalStaked,
            };
          });
          historyState.push({ token: 'ergopad (staked)', history: history });
        }
      } catch (e) {
        console.log(e);
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
                  <Typography variant="p">
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
                  <AssetList assets={assetList} title="Assets" navigatorLanguage={navigatorLanguage} />
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
                    type="NFT"
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
                {stakedTokens.totalStaked > 0 && (
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
  const tokenObject = data.balance.ERG.tokens;
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
    y: data.balance.ERG.price * data.balance.ERG.balance,
  };
  if (ergoValue.y > 0) res.unshift(ergoValue);
  return res;
}

const historyDataOrdering = (data) => {
  const tokenObject = data.balance.ERG.tokens;
  const keys = Object.keys(tokenObject);
  const res = {};
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    if (token.price > 0) res[token.name.toLowerCase()] = i;
  }
  const ergoValue = data.balance.ERG.balance;
  if (ergoValue > 0) res['ergo'] = -1;
  return res;
};

const historyDataArray = (data) => {
  const tokenObject = data.balance.ERG.tokens;
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
  const ergoValue = data.balance.ERG.balance;
  if (ergoValue > 0) res['ergo'] = { name: 'Ergo', amount: ergoValue };
  return res;
};

function assetListArray(data) {
  const tokenObject = data.balance.ERG.tokens;
  const keys = Object.keys(tokenObject);
  const res = [];
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    const amount = +parseFloat(
      (token.amount * Math.pow(10, -token.decimals))
    );
    const price = (token.price * amount);
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
    amount: data.balance.ERG.balance,
    amountUSD: (data.balance.ERG.price * data.balance.ERG.balance),
  };
  res.unshift(ergoValue);
  return res;
}

function sumTotals(data) {
  const value = data.map((item) => item.y).reduce((a, b) => a + b);
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
  if (!url.startsWith(ipfsPrefix)) return url;
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
  if (balances.length === 0) {
    return null;
  }
  // deep copy
  const ret = JSON.parse(JSON.stringify(balances[0]));
  // aggregate
  const ergo = balances
    .map((balance) => balance.balance.ERG.balance)
    .reduce((a, c) => a + c, 0);
  ret.balance.ERG.balance = ergo;
  // aggregate tokens
  const tokenMap = {};
  balances.forEach((balance) => {
    const tokens = balance.balance.ERG.tokens;
    tokens.forEach((token) => {
      if (tokenMap[token.tokenId]) {
        tokenMap[token.tokenId].amount += token.amount;
      } else {
        tokenMap[token.tokenId] = token;
      }
    });
  });
  const tokens = Object.values(tokenMap);
  ret.balance.ERG.tokens = tokens;
  return ret;
};

const reduceVested = (vestedData) => {
  const vestedArray = JSON.parse(JSON.stringify(vestedData));
  if (vestedArray.length === 0) {
    return [];
  }

  const addOutstanding = (a, b) => {
    const outMap = {};
    a.outstanding.forEach((pt) => {
      outMap[pt.date] = pt;
    });
    b.outstanding.forEach((pt) => {
      if (outMap[pt.date]) {
        outMap[pt.date].amount += pt.amount;
      } else {
        outMap[pt.date] = pt;
      }
    });
    const compute = Object.values(outMap);
    compute.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    const ret = JSON.parse(JSON.stringify(a));
    ret.totalVested += b.totalVested;
    ret.outstanding = compute;
    return ret;
  };

  const vestedMap = {};
  vestedArray.forEach((vestedList) => {
    vestedList.forEach((vested) => {
      const tokenId = vested.tokenId;
      if (vestedMap[tokenId]) {
        vestedMap[tokenId] = addOutstanding(vestedMap[tokenId], vested);
      } else {
        vestedMap[tokenId] = vested;
      }
    });
  });
  const vested = Object.values(vestedMap);
  return vested;
};

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

export default Dashboard;
