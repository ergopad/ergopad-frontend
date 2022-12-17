import React, { useState, useEffect } from "react";
import { Address } from "@components/KycComponent/types/types";
import { getApplicantStatus } from "@components/KycComponent/api";
import { KycComponent } from "@components/KycComponent/KycComponent";
import { Typography, Button } from "@mui/material";

interface ErgopadWhitelistFormProps {
  address: Address;
  applicantStatus: string;
  setApplicantStatus: React.Dispatch<React.SetStateAction<string>>;
}

// In the Ergopad whitelist form we need to add validation for different rounds

// For the "Stakers" round only addresses which have staked ergopad are eligible

// For the "Community" round only addresses which have participated in the Spectrum Finance protocol
// Use the isAddressValidForCommunityRound function from /api/index.js for that validation
// This method is not implemented yet (12-12-2022)

// For the "Public" round every address is eligible

const ErgopadWhitelistFormTemplate: React.FC<ErgopadWhitelistFormProps> = ({
  address, applicantStatus, setApplicantStatus
}) => {
  const [sumsubStatus, setSumsubStatus] = useState<string | undefined>();
  const [keyChange, setKeyChange] = useState<number>(0)

  const showStatus = () => {
    if (sumsubStatus === "completed") {
      getApplicantStatus(address)
        .then((resp) => {
          setApplicantStatus(`APPLICANT STATUS: "${resp.data}"`);
        })
        .catch((err) => {
          setApplicantStatus(`GET STATUS ERROR: ${err.message}`);
        });
    } else {
      setApplicantStatus("Waiting for SumSub verification");
    }
  };

  useEffect(() => {
    if (keyChange === 0) { setKeyChange(1) }
    else setKeyChange(0)
    console.log(address)
  }, [address])

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {address === "" ? (
        <Typography>Enter wallet address</Typography>
      ) : (
        <>
          <div style={{ width: "100%" }}>
            <KycComponent
              key={keyChange}
              address={address}
              onMessage={
                (msg: any, payload: any) => {
                  if (
                    msg === "idCheck.applicantStatus" &&
                    payload &&
                    payload.reviewStatus === "completed"
                  ) {
                    setSumsubStatus(payload.reviewStatus);
                  }
                }}
            />
          </div>
          <div>
            <Button variant="contained" onClick={showStatus}>
              Check is an applicant suitable for participation in the token sale
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ErgopadWhitelistFormTemplate;
