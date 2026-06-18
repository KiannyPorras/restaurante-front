import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/modules/auth/hooks/authHook";
import type { SessionUser } from "@/modules/auth/models/SignInDto";

type UserMenuProps = {
  user?: SessionUser | null;
};

function getInitials(user?: SessionUser | null) {
  const source = user?.username || user?.email || "?";
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  const logout = useLogout();

  return (
    <div className="grid gap-3 rounded-lg border bg-card p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
          {getInitials(user)}
        </div>
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <p className="truncate font-medium">{user?.username ?? "Invitado"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? ""}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => void logout()}
      >
        <LogOut className="size-4" />
        Cerrar sesion
      </Button>
    </div>
  );
}
