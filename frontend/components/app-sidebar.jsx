import { Home, Inbox, User, List } from "lucide-react";
import Link from "next/link"; // Import Link for client-side navigation

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Course Management",
    url: "/admin/courseManagement",
    icon: Inbox,
  },
  {
    title: "User Management",
    url: "/admin/UserManagement", // Update URL as needed
    icon: User,
  },
  {
    title: "Master Data",
    url: "#", // Update URL as needed
    icon: List,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl font-bold text-jecBlue p-7">
            E-Learning
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-base py-5 font-bold text-jecBlue  hover:text-jecGreen"
                  >
                    <Link href={item.url}>
                      {" "}
                      {/* Use Link instead of a */}
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
