import { cookies } from "next/headers";

import { AppSidebar } from "@/app/dashboard/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    redirectToSignIn();
  }

  const user = await currentUser();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        user={{
          name: user?.fullName || user?.username || "Unknown User",
          email: user?.primaryEmailAddress?.emailAddress || "",
          avatar: user?.imageUrl || "",
          initial: `${user?.firstName?.[0]}${user?.lastName?.[0]}` || "UU",
        }}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
