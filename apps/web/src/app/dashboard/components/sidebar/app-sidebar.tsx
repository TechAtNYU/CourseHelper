"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowUpCircleIcon,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Map as MapIcon,
  Send,
  Settings,
  TrendingUp,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/app/dashboard/components/sidebar/nav-main";
import { NavUser } from "@/app/dashboard/components/sidebar/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavBottom } from "@/app/dashboard/components/sidebar/nav-buttom";

const config = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Schedule", url: "/dashboard/schedule", icon: Calendar },
    { title: "4-Year Plan", url: "/dashboard/plan", icon: MapIcon },
    { title: "Degree Progress", url: "/dashboard/progress", icon: TrendingUp },
    { title: "Course Catalog", url: "/dashboard/courses", icon: BookOpen },
  ],
  navBottom: [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 "
            >
              <a href="/dashboard">
                <ArrowUpCircleIcon className="!size-5" />
                <span className="text-base font-semibold">Course Helper</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={config.navMain} />
        <NavBottom items={config.navBottom} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.fullName || "Unknown User",
            email: user.primaryEmailAddress?.emailAddress || "",
            avatar: user.imageUrl || "",
            initial: user.firstName?.[0] || user.lastName?.[0] || "UU",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
