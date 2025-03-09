import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  ConfirmPurchaseItemsPayloadType,
  GetItemType,
  GetPurchaseType,
  PostResponse,
} from "./types";

const purchase_URL = "/admin/purchases";

export const getPurchases = {
  useQuery: (statusProp: string, opt?: UseQueryOptions<GetPurchaseType[], Error>) =>
    useQuery<GetPurchaseType[], Error>({
      queryKey: ["getPurchases", statusProp], // Ensure queryKey is provided
      queryFn: async () => {
        const response = await axios.get(`${purchase_URL}?status=${statusProp}`);
        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message); // Proper error handling
        }

        return data;
      },
      throwOnError: true,
      retry: false, // Disable retries if the network request fails
      enabled: !!statusProp, // Ensures query only runs when statusProp is available
      ...opt, // Spread additional options
    }),
};


export const getItems = {
  useQuery: (categoryId: string | null, opt?: UseQueryOptions<GetItemType[], Error>) =>
    useQuery<GetItemType[], Error>({
      queryKey: ["getItems", categoryId], // Pass queryKey
      queryFn: async () => {
        if (!categoryId) throw new Error("Category ID is required");
        const response = await axios.get(
          `${purchase_URL}/itemListbyCategory?categoryId=${categoryId}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      enabled: !!categoryId, // Enable query only if categoryId is provided
      ...opt, // Pass additional options if provided
    }),
};

export const requestPurchase = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      ConfirmPurchaseItemsPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["requestPurchase"],
      mutationFn: async (payload: ConfirmPurchaseItemsPayloadType) => {
        const response = await axios.post(
          `${purchase_URL}/requestPurchase`,
          payload
        )

        const { data, status, message } = response.data

        if (status !== 0) {
          throw new Error(
            message ||
            "An error occurred while processing the request."
          )
        }

        return data
      },
      ...opt,
    })
  },
}

export const ConfirmPurchase = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["ConfirmPurchase"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${purchase_URL}/${id}/confirm`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    });
  },
};

export const CancelPurchase = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["CancelPurchase"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${purchase_URL}/${id}/cancel`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    });
  },
};



