import { TimeStamps } from "@/shared/types";


export interface GetMenusType extends TimeStamps {
  id: number;
  profile: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  category: CategoryType;
}

export interface IngredientType {
  item_id: number | string;
  item_name: string;
  unit_of_measure: string;
  item_category_id: number | string;
  quantity: number | any;
}

export interface GetMenuCategoriesType {
  id: number;
  name: string;
}

export interface CategoryType {
  name: string;
}

export interface AddMenuPayloadType {
  profile: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  ingredients: IngredientType[];
  createby: number;
}

export interface UpdateMenuPayloadType {
  id: string | number ;
  name: string;
  price: number;
  description: string;
  ingredients: IngredientType[];
  updateby?: number;
}

export interface DeleteMenuType {
  id: string | number;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


