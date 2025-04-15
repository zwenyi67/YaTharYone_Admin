import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetOverallStaticDataType } from "./types";

const dashboard_URL = "/admin/dashboard";


export const getOverallStaticData = {
  useQuery: (statusProp: string, opt?: UseQueryOptions<GetOverallStaticDataType, Error>) =>
    useQuery<GetOverallStaticDataType, Error>({
      queryKey: ["getOverallStaticData", statusProp],
      queryFn: async () => {
        const response = await axios.get(`${dashboard_URL}/overallStaticData?status=${statusProp}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      retry: false, // Disable retries if the network request fails
      enabled: !!statusProp, // Ensures query only runs when statusProp is available
      ...opt, // Spread additional options
    }),
};



