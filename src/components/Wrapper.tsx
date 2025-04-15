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
import MenuCategoryView from "@/modules/menu-management/menu-category/MenuCategoryView";
import MenuCategoryFormView from "@/modules/menu-management/menu-category/MenuCategoryFormView";
import MenuView from "@/modules/menu-management/menu/MenuView";
import MenuFormView from "@/modules/menu-management/menu/MenuFormView";
import SupplierView from "@/modules/supplier-management/supplier/SupplierView";
import SupplierFormView from "@/modules/supplier-management/supplier/SupplierFormView";
import PurchasesView from "@/modules/supplier-management/purchases/PurchasesView";
import SupplierListView from "@/modules/supplier-management/purchases/SupplierListView";
import PurchasesFormView from "@/modules/supplier-management/purchases/PurchasesFormView";
import InventoryView from "@/modules/inventory-management/inventory/InventoryView";
import InventoryFormView from "@/modules/inventory-management/inventory/InventoryFormView";
import ItemCategoryFormView from "@/modules/inventory-management/item-category/ItemCategoryFormView";
import ItemCategoryView from "@/modules/inventory-management/item-category/ItemCategoryView";
import OrderView from "@/modules/order-management/order/OrderView";
import PaymentView from "@/modules/order-management/payment/PaymentView";
import StockAdjustmentView from "@/modules/inventory-management/waste-control/StockAdjustmentView";
import StockAdjustmentFormView from "@/modules/inventory-management/waste-control/StockAdjustmentFormView";
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
      // Dashboard Start
      {
        path: "dashboard",
        element: <DashboardView />,
      },
      // Dashboard End

      // Supplier Management Start

      // Suppliers
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

      // Supplier Management End

      // Inventory Management Start

      // Inventory Item Category
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

      // Inventory
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
      // Stock Adjustment
      {
        path: "inventory-management/stock-adjustment",
        element: <StockAdjustmentView />,
      },
      {
        path: "inventory-management/stock-adjustment/create",
        element: <StockAdjustmentFormView />,
      },
      {
        path: "inventory-management/stock-adjustment/:id/edit",
        element: <StockAdjustmentFormView />,
      },

      // Inventory Management End

      // Menu Management Start

      // Menu Category
      {
        path: "menu-management/menu-categories",
        element: <MenuCategoryView />,
      },
      {
        path: "menu-management/menu-categories/create",
        element: <MenuCategoryFormView />,
      },
      {
        path: "menu-management/menu-categories/:id/edit",
        element: <MenuCategoryFormView />,
      },

      // Menu
      {
        path: "menu-management/menus",
        element: <MenuView />,
      },
      {
        path: "menu-management/menus/create",
        element: <MenuFormView />,
      },
      {
        path: "menu-management/menus/:id/edit",
        element: <MenuFormView />,
      },
      {
        path: "menu-management/menus/:id/edit",
        element: <MenuFormView />,
      },

      // Menu Management Start

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

      //Order Managment

      //Order
      {
        path: "/order-management/orders",
        element: <OrderView />,
      },
      //Payment
      {
        path: "/order-management/payments",
        element: <PaymentView />,
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
