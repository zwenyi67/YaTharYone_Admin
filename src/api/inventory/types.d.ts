import { TimeStamps } from "@/shared/types";
import { ItemType } from "../purchase-item/types";

export interface GetInventoriesType extends TimeStamps {
  id: number;
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  expiry_period_inDay: number;
  item_category_id: number;
  description: string;
  inventory_item_category: InventoryItemCategory;
  status: string;
}
export interface InventoryItemCategory {
  id: number;
  name: string;
}

export interface AddInventoryPayloadType {
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  expiry_period_inDay: number;
  item_category_id: number | string;
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
  expiry_period_inDay: number;
  item_category_id: number | string;
  description: string;
  updateby?: number;
}

export interface DeleteInventoryType {
  id: string | number;
}

export interface GetItemCategoriesType {
  id: number;
  name: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}

export interface GetStockAdjustmentsType extends TimeStamps {
  id: number;
  adjustment_type: string;
  quantity: number;
  reason: string;
  adjustment_date: Date;
  item: Item;
}

export interface Item {
  id: number;
  name: string;
  unit_of_measure: string;
}

export interface AddStockAdjustmentPayloadType {
  item_id: number | string;
  quantity: number | any;
  reason: string;
  adjustment_date: Date;
  adjustment_type: string;
  createby?: number;
}

export interface UpdateStockAdjustmentPayloadType {
  id: number;
  item_id: number | string;
  quantity: number | any;
  reason: string;
  adjustment_date: Date;
  adjustment_type: string;
  updateby?: number;
}


