import { useMemo, useEffect, useState } from 'react';
import useSWR from 'swr';
import { axiosGetFetcher } from './axios';
import { useWhitelistProjects } from "@hooks/useWhitelistProjects";
import { useContributionProjects } from "@hooks/useContributionProjects";

const ListActiveProjects = () => {
  let projectList = []

  const { whiteListProjectsActive, isLoading: whiteListProjectsIsLoading } =
    useWhitelistProjects();
  const {
    contributionProjectsActive,
    isLoading: contributionProjectsIsLoading,
  } = useContributionProjects();

  useEffect(() => {
    projectList.push(whiteListProjectsActive)
    projectList.push(contributionProjectsActive)
  }, [whiteListProjectsActive, contributionProjectsActive])
}

export default ListActiveProjects;