import { TimeStamps } from "@/shared/types";


export interface GetInventoriesType extends TimeStamps {
  id: number;
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  is_perishable: boolean;
  expiry_date: boolean;
  item_category_id: number;
  description: string;
}

export interface AddInventoryPayloadType {
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  is_perishable: boolean;
  expiry_date: boolean;
  item_category_id: number;
  description: string;
  createby?: number;
}

export interface UpdateInventoryPayloadType {
  id: string | number ;
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  is_perishable: boolean;
  expiry_date: boolean;
  item_category_id: number;
  description: string;
  updateby?: number;
}

export interface DeleteInventoryType {
  id: string | number;
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


