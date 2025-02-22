import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetOrdersType } from "./types";

const order_URL = "/admin/orders";

export const getOrders = {
  useQuery: (opt?: UseQueryOptions<GetOrdersType[], Error>) =>
    useQuery<GetOrdersType[], Error>({
      queryKey: ["getOrders"],
      queryFn: async () => {
        const response = await axios.get(`${order_URL}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};



