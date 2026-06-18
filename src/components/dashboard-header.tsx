import { Link } from "@tanstack/react-router";
import { Menu, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/app-sidebar/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SessionUser } from "@/modules/auth/models/SignInDto";

type DashboardHeaderProps = {
  user: SessionUser;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" className="md:hidden" aria-label="Abrir menu">
        <Menu className="size-5" />
      </Button>
      <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
        <Utensils className="size-5" />
        <span className="font-semibold">Restaurante</span>
      </Link>
      <div className="ml-auto hidden md:block">
        <p className="text-sm text-muted-foreground">
          Sesion iniciada como {user.username}
        </p>
      </div>
      <ThemeToggle />
      <div className="ml-auto w-56 md:hidden">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
