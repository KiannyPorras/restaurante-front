import { Navigate, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/modules/auth/hooks/authHook";

export function DashboardLayout() {
  const { data: user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="grid min-h-svh place-items-center bg-background p-6">
        <Skeleton className="h-24 w-full max-w-md" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
