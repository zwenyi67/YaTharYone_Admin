import * as auth from "./auth";
import * as employee from "./employee";
import * as supplier from "./supplier";
import * as table from "./table";




class API {
  auth: typeof auth;
  employee: typeof employee;
  supplier: typeof supplier;
  table: typeof table;


  constructor() {
    this.auth = auth;
    this.employee = employee;
    this.supplier = supplier;
    this.table = table;
  }
}

const api = new API();

export default api;
