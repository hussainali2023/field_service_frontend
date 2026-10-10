import {
  Briefcase,
  User,
} from "lucide-react";
import { SidebarItems } from "@/types";

const prefix = "/provider";

export const providerRoutes: SidebarItems = [
  {
    title: "Technician Desk",
    items: [
      {
        title: "Assigned Jobs Queue",
        url: `${prefix}`,
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Technician Profile",
    items: [
      {
        title: "Skills & Availability",
        url: `${prefix}/profile`,
        icon: User,
      },
    ],
  },
];
