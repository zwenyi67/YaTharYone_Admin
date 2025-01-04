import {
  ArrowRightLeft,
  BoxIcon,
  Gauge,
  LayoutDashboardIcon,
  ListPlus,
  Store,
  User2Icon,
  Utensils,

} from "lucide-react";

export const sidebarData = [
  {
    routeNames: ["/dashboard"],
    name: "title.dashboard",
    icon: Gauge,
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
        routeNames: ["/supplier-management/transcations"],
        name: "title.transcations",
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    routeNames: [""],
    name: "title.inventory-management",
    icon: BoxIcon,
    subMenu: [
      {
        routeNames: ["/inventory/create"],
        name: "title.employee-management",
        icon: User2Icon,
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
    icon: LayoutDashboardIcon,
    subMenu: [],
  },
  {
    routeNames: ["/categories"],
    name: "title.category-management",
    icon: BoxIcon,
    subMenu: [],
  },
  {
    routeNames: ["/menu-management"],
    name: "title.menu-management",
    icon: Utensils,
    subMenu: [],
  },
  {
    routeNames: ["/addons"],
    name: "title.menuitem-addon-management",
    icon: ListPlus,
    subMenu: [],
  },
];
