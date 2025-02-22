import { TimeStamps } from "@/shared/types";


export interface GetTablesType extends TimeStamps {
  id: number;
  table_no: string;
  capacity: number;
  status: string;
}

export interface AddTablePayloadType {
  table_no: string;
  capacity: number;
  status: string;
  createby?: number;
}

export interface UpdateTablePayloadType {
  id: number;
  table_no: string;
  capacity: number;
  status: string;
  updateby?: number;
}

export interface DeleteTableType {
  employee_id: string | number;
}

export interface GetRolesType {
  id: number;
  name: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


