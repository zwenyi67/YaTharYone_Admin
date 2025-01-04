import * as auth from "./auth";
import * as employee from "./employee";
import * as table from "./table";



class API {
  auth: typeof auth;
  employee: typeof employee;
  table: typeof table;


  constructor() {
    this.auth = auth;
    this.employee = employee;
    this.table = table;
  }
}

const api = new API();

export default api;
