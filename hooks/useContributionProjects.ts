import { useMemo } from 'react';
import useSWR from 'swr';
import { axiosGetFetcher } from '../utils/axios';

export const useContributionProjects = () => {
    const { data, error } = useSWR(`${process.env.API_URL}/contribution/events`, axiosGetFetcher)

    const contributionProjectsActive = useMemo(() => {
        if (data) {
            return data.filter(project => project.additionalDetails.add_to_footer)
                .sort(((a, b) => a.id - b.id))
        } else {
            return [];
        }
    }, [data])

    return {
        contributionProjects: data,
        contributionProjectsActive,
        isLoading: !error && !data,
        isError: error
    }
}
