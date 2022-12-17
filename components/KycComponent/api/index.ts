import axios from "axios";

import { Address } from "@components/KycComponent/types/types";

const BASE_URL = "http://88.99.59.114:1234/v1/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export const getAccessToken = async (address: Address) => {
  return await api
    .post("verification/getAccessToken", {
      reqId: address,
      userId: address,
    })
    .then((data) => data.data.token);
};

// Checks is the applicant suitable for participation in the token sale
// The check is done according to the country of the applicant
// Verification is possible only after SamSab verification
export const getApplicantStatus = async (address: Address) => {
  return await api.get(`verification/status/${address}`);
};

// Checks is the applicant suitable for participation in the "community" round of the token sale
export const isAddressValidForCommunityRound = async (address: Address) => {
  return await api.get(`validation/community/${address}`);
};
