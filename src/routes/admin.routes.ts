import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Users,
  UserCog,
  Receipt,
  History,
} from "lucide-react";
import { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Operations",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Service Requests",
        url: `${prefix}/requests`,
        icon: ClipboardList,
      },
      {
        title: "Service Catalog",
        url: `${prefix}/services`,
        icon: Wrench,
      },
    ],
  },
  {
    title: "Workforce & Users",
    items: [
      {
        title: "Technicians",
        url: `${prefix}/technicians`,
        icon: Users,
      },
      {
        title: "User Management",
        url: `${prefix}/users`,
        icon: UserCog,
      },
    ],
  },
  {
    title: "Finance & Audit",
    items: [
      {
        title: "Invoices & Billing",
        url: `${prefix}/invoices`,
        icon: Receipt,
      },
      {
        title: "Audit Trail",
        url: `${prefix}/audit-logs`,
        icon: History,
      },
    ],
  },
];
