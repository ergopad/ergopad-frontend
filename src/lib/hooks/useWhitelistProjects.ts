import { useMemo } from 'react';
import useSWR from 'swr';
import { axiosGetFetcher } from '../utils/axios';

export const useWhitelistProjects = () => {
  const { data, error } = useSWR(
    `${process.env.API_URL}/whitelist/events`,
    axiosGetFetcher,
  );

  const whiteListProjectsActive = useMemo(() => {
    if (data) {
      return data
        .filter((project: any) => project.additionalDetails.add_to_footer)
        .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
    } else {
      return [];
    }
  }, [data]);

  return {
    whitelistProjects: data,
    whiteListProjectsActive,
    isLoading: !error && !data,
    isError: error,
  };
};
