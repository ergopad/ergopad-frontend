import useSWR from "swr";
import { axiosGetFetcher } from "../utils/axios";

export const useProjectInfo = (projectName: any) => {
  const { data, error } = useSWR(`${process.env.API_URL}/projects/${projectName}`, axiosGetFetcher);

  return {
    projectInfo: data,
    isLoading: !error && !data,
    isError: error,
  };
};
