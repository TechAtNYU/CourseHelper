import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

export function AppHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
      </div>
    </header>
  );
}
