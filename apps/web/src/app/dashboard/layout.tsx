import { cookies } from "next/headers";

import { DashboardSidebar } from "@/app/dashboard/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./components/app-header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
