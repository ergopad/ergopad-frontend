import useSWR from 'swr'
import { axiosGetFetcher } from '../utils/axios'

export const useProjectList = () => {
  const { data, error } = useSWR(
    `${process.env.API_URL}/projects/`,
    axiosGetFetcher
  )

  return {
    projectList: data,
    isLoading: !error && !data,
    isError: error,
  }
}
