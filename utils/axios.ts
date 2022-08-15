import axios from "axios";

export const axiosGetFetcher = url => axios.get(url).then(res => res.data)