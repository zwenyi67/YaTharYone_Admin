import { TimeStamps } from "@/shared/types";

export interface GetOverallStaticDataType extends TimeStamps {
  inventory_items: number;
  suppliers: number;
  menu_items: number;
  employees: number;
  tables: number;
  customers: number;
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

export interface Order {
  id: number;
  order_number: string;
}

export interface Waiter {
  id: number;
  username: string;
}

export interface Cashier {
  id: number;
  username: string;
}

export interface GetPaymentsType extends TimeStamps {
  id: number;
  payment_number: string;
  payment_method: number;
  payment_status: string;
  order: Order;
  cashier: Cashier;
  waiter: Waiter;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


