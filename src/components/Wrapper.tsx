import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "./ui/toaster";

import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";

import Loader from "@/components/Loader.tsx";
import LoginView from "@/modules/auth/login/LoginView";
import NotFoundView from "@/modules/not-found/NotFoundView";

import ErrorView from "@/modules/error/ErrorView";
import DashboardView from "@/modules/dashboard/DashboardView";
import EmployeeView from "@/modules/employee/EmployeeView";
import EmployeeFormView from "@/modules/employee/EmployeeFormView";
import TableView from "@/modules/table/TableView";
import TableFormView from "@/modules/table/TableFormView";
import MenuCategoryView from "@/modules/menu-category/MenuCategoryView";
import MenuCategoryFormView from "@/modules/menu-category/MenuCategoryFormView";
import MenuView from "@/modules/menu/MenuView";
import MenuFormView from "@/modules/menu/MenuFormView";
import SupplierView from "@/modules/supplier-management/supplier/SupplierView";
import SupplierFormView from "@/modules/supplier-management/supplier/SupplierFormView";
import PurchasesView from "@/modules/supplier-management/purchases/PurchasesView";
import SupplierListView from "@/modules/supplier-management/purchases/SupplierListView";
import PurchasesFormView from "@/modules/supplier-management/purchases/PurchasesFormView";
import InventoryView from "@/modules/inventory-management/inventory/InventoryView";
import InventoryFormView from "@/modules/inventory-management/inventory/InventoryFormView";
import ItemCategoryFormView from "@/modules/inventory-management/item-category/ItemCategoryFormView";
import ItemCategoryView from "@/modules/inventory-management/item-category/ItemCategoryView";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardView />,
      },
      //Supplier Management
      {
        path: "supplier-management/suppliers",
        element: <SupplierView />,
      },
      {
        path: "supplier-management/suppliers/create",
        element: <SupplierFormView />,
      },
      {
        path: "supplier-management/suppliers/:id/edit",
        element: <SupplierFormView />,
      },
      // Purchasing Transcations
      {
        path: "supplier-management/purchasehistories",
        element: <PurchasesView />,
      },
      {
        path: "/supplier-management/purchasehistories/supplierlist",
        element: <SupplierListView />,
      },
      {
        path: "/supplier-management/purchasehistories/supplierlist/:id/create",
        element: <PurchasesFormView />,
      },
      
      //Inventory Management
      {
        path: "inventory-management/inventories",
        element: <InventoryView />,
      },
      {
        path: "inventory-management/inventories/create",
        element: <InventoryFormView />,
      },
      {
        path: "inventory-management/inventories/:id/edit",
        element: <InventoryFormView />,
      },
      {
        path: "inventory-management/item-categories",
        element: <ItemCategoryView />,
      },
      {
        path: "inventory-management/item-categories/create",
        element: <ItemCategoryFormView />,
      },
      {
        path: "inventory-management/item-categories/:id/edit",
        element: <ItemCategoryFormView />,
      },

      //Employee Management
      {
        path: "employee-management",
        element: <EmployeeView />,
      },
      {
        path: "employee-management/create",
        element: <EmployeeFormView />,
      },
      {
        path: "employee-management/:id/edit",
        element: <EmployeeFormView />,
      },

      //Table Management
      {
        path: "table-management",
        element: <TableView />,
      },
      {
        path: "table-management/create",
        element: <TableFormView />,
      },
      {
        path: "table-management/:id/edit",
        element: <TableFormView />,
      },

      //Category Management
      {
        path: "categories",
        element: <MenuCategoryView />,
      },
      {
        path: "categories/create",
        element: <MenuCategoryFormView />,
      },
      {
        path: "categories/:id/edit",
        element: <MenuCategoryFormView />,
      },

      //Menu Management
      {
        path: "menu-management",
        element: <MenuView />,
      },
      {
        path: "menu-management/create",
        element: <MenuFormView />,
      },
      {
        path: "menu-management/:id/edit",
        element: <MenuFormView />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
]);

const Wrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.DEV ? false : "always", // close refetch on window focus in development
      },
    },
  });

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Loader />
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default Wrapper;
