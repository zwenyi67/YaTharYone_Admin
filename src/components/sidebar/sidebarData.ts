import {
  ArrowRightLeft,
  BoxIcon,
  Gauge,
  Grid2X2Icon,
  LayoutDashboard,
  SaladIcon,
  Store,
  User2Icon,
} from "lucide-react";

export const sidebarData = [
  {
    routeNames: ["/dashboard"],
    name: "title.dashboard",
    icon: Gauge,
  },
  {
    routeNames: [""],
    name: "title.inventory-management",
    icon: BoxIcon,
    subMenu: [
      {
        routeNames: ["/inventory-management/item-categories"],
        name: "title.item-category",
        icon: LayoutDashboard,
      },
      {
        routeNames: ["/inventory-management/inventories"],
        name: "title.inventory",
        icon: BoxIcon,
      },
    ],
  },
  {
    routeNames: [""],
    name: "title.supplier-management",
    icon: Store,
    subMenu: [
      {
        routeNames: ["/supplier-management/suppliers"],
        name: "title.suppliers",
        icon: Store,
      },
      {
        routeNames: ["/supplier-management/purchasehistories"],
        name: "title.purchases",
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    routeNames: [""],
    name: "title.menu-management",
    icon: SaladIcon,
    subMenu: [
      {
        routeNames: ["/menu-management/menu-categories"],
        name: "title.menu-category",
        icon: LayoutDashboard,
      },
      {
        routeNames: ["/menu-management/menus"],
        name: "title.menu",
        icon: SaladIcon,
      },
    ],
  },
  {
    routeNames: ["/employee-management"],
    name: "title.employee-management",
    icon: User2Icon,
    subMenu: [],
  },
  {
    routeNames: ["/table-management"],
    name: "title.table-management",
    icon: Grid2X2Icon,
    subMenu: [],
  },
  {
    routeNames: [""],
    name: "title.order-management",
    icon: SaladIcon,
    subMenu: [
      {
        routeNames: ["/order-management/orders"],
        name: "title.order",
        icon: SaladIcon,
      },
    ],
  },
];
