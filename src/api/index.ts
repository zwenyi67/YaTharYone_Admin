import * as auth from "./auth";
import * as employee from "./employee";
import * as supplier from "./supplier";
import * as table from "./table";
import * as inventory from "./inventory";
import * as itemCategory from "./item-category";

class API {
  auth: typeof auth;
  employee: typeof employee;
  supplier: typeof supplier;
  table: typeof table;
  inventory: typeof inventory;
  itemCategory: typeof itemCategory;


  constructor() {
    this.auth = auth;
    this.employee = employee;
    this.supplier = supplier;
    this.table = table;
    this.inventory = inventory;
    this.itemCategory = itemCategory;
  }
}

const api = new API();

export default api;
