import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetOrdersType, GetPaymentsType } from "./types";

const order_URL = "/admin/orders";
const payment_URL = "/admin/payments";


export const getOrders = {
  useQuery: (statusProp: string, opt?: UseQueryOptions<GetOrdersType[], Error>) =>
    useQuery<GetOrdersType[], Error>({
      queryKey: ["getOrders", statusProp],
      queryFn: async () => {
        const response = await axios.get(`${order_URL}?status=${statusProp}`);

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

export const getPayments = {
  useQuery: (statusProp: string, opt?: UseQueryOptions<GetPaymentsType[], Error>) =>
    useQuery<GetPaymentsType[], Error>({
      queryKey: ["getPayments", statusProp],
      queryFn: async () => {
        const response = await axios.get(`${payment_URL}?status=${statusProp}`);

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



