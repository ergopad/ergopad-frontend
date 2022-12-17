import SumsubWebSdk from "@sumsub/websdk-react";
import React, { useEffect, useState } from "react";
import { AccessToken, Address } from "@components/KycComponent/types/types";
import { getAccessToken } from "@components/KycComponent/api";

interface KycComponentProps {
  // User active ERG address
  // This ERG address will be used to identify a user
  address: Address;
  onMessage?: (msg: any, payload: any) => void;
}

const KycComponent: React.FC<KycComponentProps> = ({ address, onMessage }) => {
  const accessToken = useAccessToken(address);

  return (
    <>
      {accessToken && (
        <SumsubWebSdk
          accessToken={accessToken}
          expirationHandler={expirationHandler(address)}
          onMessage={onMessage}
        />
      )}
    </>
  );
};

const useAccessToken = (address: Address) => {
  const [accessToken, setAccessToken] = useState<AccessToken | undefined>(
    undefined
  );

  useEffect(() => {
    getAccessToken(address).then((token) => {
      setAccessToken(token);
    });
  }, []);

  return accessToken;
};

const expirationHandler = (address: Address) => () => getAccessToken(address);

export { KycComponent };
