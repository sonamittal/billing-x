import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Package,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ReceiptText,
  User 
} from "lucide-react";

import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "Invoice",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],

  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/panel/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "All Users",
          url: "/panel/users",
          icon: User,
        },
        {
          title: "Customers",
          url: "/panel/customers",
          icon: Users,
        },
      ],
    },

    {
      title: "Invoices",
      items: [
        {
          title: "Quotes",
          url: "/quotes",
          icon: Package,
        },
        {
          title: "Invoices",
          url: "/panel/invoices",
          badge: "3",
          icon: ReceiptText,
        },
      ],
    },

    {
      title: "Expenses",
      items: [
        {
          title: "Expenses",
          url: "/expenses",
          icon: Users,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: Monitor,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
