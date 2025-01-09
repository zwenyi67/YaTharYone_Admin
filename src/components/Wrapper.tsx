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
import CategoryView from "@/modules/category/CategoryView";
import CategoryFormView from "@/modules/category/CategoryFormView";
import MenuView from "@/modules/menu/MenuView";
import MenuFormView from "@/modules/menu/MenuFormView";
import SupplierView from "@/modules/supplier-management/supplier/SupplierView";
import SupplierFormView from "@/modules/supplier-management/supplier/SupplierFormView";
import PurchasesView from "@/modules/supplier-management/purchases/PurchasesView";
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
      {
        path: "supplier-management/purchasehistories",
        element: <PurchasesView />,
      },
      
      {
        path: "inventory-management/:id/edit",
        element: <EmployeeFormView />,
      },
      //Inventory Management
      {
        path: "inventory-management",
        element: <EmployeeView />,
      },
      {
        path: "inventory-management/create",
        element: <EmployeeFormView />,
      },
      {
        path: "inventory-management/:id/edit",
        element: <EmployeeFormView />,
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
        element: <CategoryView />,
      },
      {
        path: "categories/create",
        element: <CategoryFormView />,
      },
      {
        path: "categories/:id/edit",
        element: <CategoryFormView />,
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
