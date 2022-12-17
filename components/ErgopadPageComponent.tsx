import "@styles/App.css";
import React from "react";
import { Address } from "@components/KycComponent/types/types";
import ErgopadWhitelistFormTemplate from "@components/ErgopadWhitelistFormTemplate/ErgopadWhitelistFormTemplate";

const TEST_USER_ERGO_ADDRESS: Address = "i-am-test-user-4";

export const ErgopadPageComponent = () => {
  return (
    <div className="App">
      <header className="header">
        <h1>KYC test app</h1>
      </header>
      <body>
        <ErgopadWhitelistFormTemplate address={TEST_USER_ERGO_ADDRESS} />
      </body>
    </div>
  );
};