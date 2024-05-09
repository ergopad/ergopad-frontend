import { FC } from 'react';
import { Typography, SvgIcon, Box } from '@mui/material';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { styled } from '@mui/system';
import AssetModal from './AssetModal';
import {
  getNautilusAddressMapper,
  ASSET_URL,
} from '../../lib/utils/LogoMapper';
import { useEffect, useState } from 'react';
import { formatNumber } from '@utils/general';

const SIGUSD_TOKEN_ID =
  '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';

const AssetIcon = styled('img')(() => ({
  width: '40px',
  height: '40px',
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

const AssetItem: FC<{
  asset: any;
  stableDenominator: string;
  type: any;
  navigatorLanguage: any;
}> = ({ asset, stableDenominator = 'USD', type, navigatorLanguage }) => {
  const [showModal, setShowModal] = useState(false);
  const [assetMapper, setAssetMapper] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let isMounted = true;
    const loadMapper = async () => {
      const mapper = await getNautilusAddressMapper();
      if (isMounted) setAssetMapper(mapper);
    };
    loadMapper();
    return () => {
      isMounted = false;
    };
  }, []);

  const AssetImage: FC = () => {
    if (type === 'AudioNFT') {
      return (
        <IconWrapper>
          <AudiotrackIcon fontSize="large" sx={{ mt: '3px', ml: '2px' }} />
        </IconWrapper>
      );
    } else if (asset?.r9) {
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
      <Box
        className="asset"
        onClick={() => setShowModal(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 2,
          pb: 1,
          cursor: 'pointer',
          flexDirection: 'row',
          // justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <Box sx={{ width: '40px', height: '40px' }}>
            <AssetImage />
          </Box>
          <Box>
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
          </Box>
        </Box>

        {type !== 'NFT' && type !== 'AudioNFT' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'right',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ textAlign: 'right' }}>
              {asset.amount > 100000000
                ? formatNumber(asset.amount)
                : asset.amount?.toLocaleString(navigatorLanguage, {
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
          </Box>
        )}
      </Box>
      <AssetModal
        key={asset.id + '-modal'}
        open={showModal}
        handleClose={() => setShowModal(false)}
        asset={asset}
        type={type}
        navigatorLanguage={navigatorLanguage}
      />
    </>
  );
};

export default AssetItem;
