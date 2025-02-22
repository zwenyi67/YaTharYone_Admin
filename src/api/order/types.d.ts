import { TimeStamps } from "@/shared/types";


export interface GetOrdersType extends TimeStamps {
  id: number;
  order_number: string;
  total_price: number;
  status: string;
  
  order_details: OrderDetails[];
  table: Table;
  waiter: Waiter;
}

export interface OrderDetails {
  id: number;
  menu_id: number;
  quantity: number;
  note: string;
  menu: Menu;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
}

export interface Table {
  id: number;
  table_no: string;
}

export interface Waiter {
  id: number;
  username: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


