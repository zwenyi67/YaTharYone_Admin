import { TimeStamps } from "@/shared/types";

export interface GetOverallStaticDataType extends TimeStamps {
  inventory_items: number;
  suppliers: number;
  menu_items: number;
  employees: number;
  tables: number;
  customers: number;
  this_month_purchase_total: number;
  last_month_purhcase_total: number;
  all_month_purhcase_total: number;
  monthly_purchase_chart: ChartType[];
  this_month_revenue: number;
  last_month_revenue: number;
  all_time_revenue: number;
  monthly_revenue_chart: ChartType[];
  top_menu_items: TopMenuItems[];
}

export type TopMenuItems = {
  id: number;
  name: string;
  sold: string;
  revenue: string;
  percentage: number;
}

export type ChartType = {
  name: string;
  value: number;
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


