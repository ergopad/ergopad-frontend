import { Typography, SvgIcon } from '@mui/material';
import { styled } from '@mui/system';
import AssetModal from './AssetModal';
import { getNautilusAddressMapper, ASSET_URL } from '../../utils/LogoMapper';
import { useEffect, useState } from 'react';

const SIGUSD_TOKEN_ID =
  '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';

const StyledAsset = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  cursor: 'pointer',
  // marginBottom: theme.spacing(2),
  // padding: theme.spacing(1),
  // borderRadius: '10px',
  // justifyContent: 'space-between',
  // backgroundColor: `rgba( 255, 255, 255, 0.04)`,
}));

const AssetIcon = styled('img')(() => ({
  width: '50px',
  height: '50px',
  borderRadius: '12px',
}));

const TokenIcon = styled('img')(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '12px',
}));

const IconWrapper = styled('div')(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'rgba(102, 102, 102, 0.3)',
}));

const AssetNameContainer = styled('div')(({ theme }) => ({
  flexGrow: 2,
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  maxWidth: '240px',
  '& .MuiTypography-root': {
    padding: 2,
  },
}));
const AssetAmountContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'right',
  flexDirection: 'column',
  justifyContent: 'right',
}));

const AssetItem = ({
  asset,
  stableDenominator = 'USD',
  type,
  navigatorLanguage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [assetMapper, setAssetMapper] = useState({});

  useEffect(() => {
    const loadMapper = async () => {
      const mapper = await getNautilusAddressMapper();
      setAssetMapper(mapper);
    };

    loadMapper();
  }, []);

  const AssetImage = () => {
    if (asset?.r9) {
      return <AssetIcon src={asset?.r9} />;
    } else {
      return assetMapper[asset.id] ? (
        <TokenIcon src={ASSET_URL + '/' + assetMapper[asset.id]} />
      ) : (
        <IconWrapper>
          <SvgIcon fontSize="large" />
        </IconWrapper>
      );
    }
  };

  return (
    <>
      <StyledAsset className="asset" onClick={() => setShowModal(true)}>
        <AssetImage />
        <AssetNameContainer>
          <Typography
            sx={{
              maxWidth: '180px',
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {asset.name}
          </Typography>
        </AssetNameContainer>
        {type != 'NFT' && (
          <AssetAmountContainer>
            <Typography sx={{ textAlign: 'right' }}>
              {asset.amount?.toLocaleString(navigatorLanguage, {
                maximumFractionDigits: 0,
              })}
            </Typography>
            {asset.amountUSD != 0 ? (
              <Typography variant="caption">
                $
                {asset.id == SIGUSD_TOKEN_ID
                  ? asset.amount?.toLocaleString(navigatorLanguage, {
                      maximumFractionDigits: 2,
                    })
                  : asset.amountUSD?.toLocaleString(navigatorLanguage, {
                      maximumFractionDigits: 2,
                    })}{' '}
                {stableDenominator}
              </Typography>
            ) : null}
          </AssetAmountContainer>
        )}
      </StyledAsset>
      <AssetModal
        key={asset.id + '-modal'}
        open={showModal}
        handleClose={() => setShowModal(false)}
        asset={asset}
        navigatorLanguage={navigatorLanguage}
      />
    </>
  );
};

export default AssetItem;
