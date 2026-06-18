import { Link, useRouterState } from "@tanstack/react-router";
import { navItems } from "@/components/app-sidebar/navigation";
import { cn } from "@/lib/utils";

function isActive(href: string, currentPath: string, exact?: boolean) {
  if (exact) {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function NavMain() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav className="grid gap-1 px-2">
      <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Menu
      </p>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, pathname, item.exact);

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
              active && "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
