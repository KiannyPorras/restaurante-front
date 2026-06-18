import { Link } from "@tanstack/react-router";
import { Utensils } from "lucide-react";

export function SidebarBrand() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-sidebar-accent"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Utensils className="size-5" />
      </div>
      <div className="grid leading-tight">
        <span className="truncate text-sm font-semibold">
          Restaurante Kianny
        </span>
        <span className="truncate text-xs text-muted-foreground">
          Panel administrativo
        </span>
      </div>
    </Link>
  );
}
