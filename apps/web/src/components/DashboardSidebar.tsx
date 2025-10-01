import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  TrendingUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "4-Year Plan", url: "/four-year-plan", icon: MapIcon },
  { title: "Degree Progress", url: "/degree-progress", icon: TrendingUp },
  { title: "Course Catalog", url: "/course-catalog", icon: BookOpen },
];

const footer = {
  title: "Settings",
  url: "/settings",
  icon: Settings,
};

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Course Helper</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={footer.url}>
                <footer.icon />
                <span>{footer.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
