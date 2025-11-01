import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader({
  title,
  center,
}: {
  title: string;
  center?: React.ReactNode;
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-background/80 backdrop-blur">
      <div className="flex w-full items-center gap-2 px-4 relative">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 mr-2"
        />
        <h1 className="text-base font-medium">{title}</h1>
        {center && (
          <div className="absolute left-1/2 -translate-x-1/2">{center}</div>
        )}
      </div>
    </header>
  );
}
