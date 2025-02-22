import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddTablePayloadType,
  GetTablesType,
  PostResponse,
  UpdateTablePayloadType,
} from "./types";

const table_URL = "/admin/tables";

export const getTables = {
  useQuery: (opt?: UseQueryOptions<GetTablesType[], Error>) =>
    useQuery<GetTablesType[], Error>({
      queryKey: ["getTables"],
      queryFn: async () => {
        const response = await axios.get(`${table_URL}`);

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

export const addTable = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddTablePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addTable"],
      mutationFn: async (payload: AddTablePayloadType) => {
        const response = await axios.post(
          `${table_URL}/create`,
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

export const updateTable = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateTablePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateTable"],
      mutationFn: async (payload: UpdateTablePayloadType) => {
        const response = await axios.post(
          `${table_URL}/edit`,
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

export const deleteEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteEmployee"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${table_URL}/${id}/delete`
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


