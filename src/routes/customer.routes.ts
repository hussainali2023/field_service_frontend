import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  User,
} from "lucide-react";
import { SidebarItems } from "@/types";

const prefix = "/dashboard";

export const customerRoutes: SidebarItems = [
  {
    title: "My Activity",
    items: [
      {
        title: "Overview & Orders",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Request a Service",
        url: `${prefix}/requests/new`,
        icon: PlusCircle,
      },
      {
        title: "Invoices & Payments",
        url: `${prefix}/invoices`,
        icon: Receipt,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile Settings",
        url: `${prefix}/profile`,
        icon: User,
      },
    ],
  },
];
