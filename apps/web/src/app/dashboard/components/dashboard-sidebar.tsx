"use client";

import {
  ArrowUpCircleIcon,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Map as MapIcon,
  TrendingUp,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/app/dashboard/components/nav-main";

import { NavUser } from "@/app/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "tech@nyu",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Schedule", url: "/schedule", icon: Calendar },
    { title: "4-Year Plan", url: "/four-year-plan", icon: MapIcon },
    { title: "Degree Progress", url: "/degree-progress", icon: TrendingUp },
    { title: "Course Catalog", url: "/course-catalog", icon: BookOpen },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Course Helper</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
