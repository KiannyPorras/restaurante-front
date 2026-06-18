import { NavMain } from "@/components/app-sidebar/nav-main";
import { NavUser } from "@/components/app-sidebar/nav-user";
import { SidebarBrand } from "@/components/app-sidebar/sidebar-brand";
import type { SessionUser } from "@/modules/auth/models/SignInDto";

type AppSidebarProps = {
  user?: SessionUser | null;
};

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-background md:flex md:min-h-svh md:flex-col">
      <div className="border-b p-3">
        <SidebarBrand />
      </div>
      <div className="flex-1 py-3">
        <NavMain />
      </div>
      <div className="p-3">
        <NavUser user={user} />
      </div>
    </aside>
  );
}
