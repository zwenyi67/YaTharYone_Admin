import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddEmployeePayloadType,
  GetEmployeesType,
  GetRolesType,
  PostResponse,
  UpdateEmployeePayloadType,
} from "./types";

const employee_URL = "/admin/employees";
const role_URL = "/admin/roles";

export const getEmployees = {
  useQuery: (role_id: number, opt?: UseQueryOptions<GetEmployeesType[], Error>) =>
    useQuery<GetEmployeesType[], Error>({
      queryKey: ["getEmployees", role_id], // Dynamic queryKey
      queryFn: async () => {
        const response = await axios.get(`${employee_URL}?role_id=${role_id}`);
        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message); // Proper error handling
        }

        return data;
      },
      throwOnError: true,
      retry: false, // Disable retries if the network request fails
      enabled: !!role_id, // Ensures query only runs when role_id is available
      ...opt, // Spread additional options
    }),
};

export const getRoles = {
  useQuery: (opt?: UseQueryOptions<GetRolesType[], Error>) =>
    useQuery<GetRolesType[], Error>({
      queryKey: ["getRoles"],
      queryFn: async () => {
        const response = await axios.get(`${role_URL}`);

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

export const addEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddEmployeePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addEmployee"],
      mutationFn: async (payload: AddEmployeePayloadType) => {
        const response = await axios.post(
          `${employee_URL}/create`,
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

export const updateEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateEmployeePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateEmployee"],
      mutationFn: async (payload: UpdateEmployeePayloadType) => {
        const response = await axios.post(
          `${employee_URL}/edit`,
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
          `${employee_URL}/${id}/delete`
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


