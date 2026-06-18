import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LoginPage } from "@/modules/auth/components/LoginPage";
import { BloqueosPage } from "@/modules/bloqueos/components/BloqueosPage";
import { ClientesPage } from "@/modules/clientes/components/ClientesPage";
import { MesasPage } from "@/modules/mesas/components/MesasPage";
import { UsersPage } from "@/modules/users/components/UsersPage";
import { TurnosPage } from "@/modules/turnos/components/TurnosPage";
import { ZonasPage } from "@/modules/zonas/components/ZonasPage";
import { ReservasPage } from "@/modules/reservas/components/ReservasPage";
import { ListasEsperaPage } from "@/modules/listas-espera/components/ListasEsperaPage";
import { DashboardHomePage } from "@/pages/DashboardHomePage";
import { DashboardLayout } from "@/pages/DashboardLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PublicReservationPage } from "@/pages/PublicReservationPage";
//
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: LoginPage,
});

const publicReservationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reservar",
  component: PublicReservationPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: DashboardHomePage,
});

const dashboardUsersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/users",
  component: UsersPage,
});

const dashboardClientesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/clientes",
  component: ClientesPage,
});

const dashboardZonasRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/zonas",
  component: ZonasPage,
});

const dashboardMesasRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/mesas",
  component: MesasPage,
});

const dashboardBloqueosRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/bloqueos",
  component: BloqueosPage,
});

const dashboardTurnosRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/turnos",
  component: TurnosPage,
});

const dashboardReservationsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/reservas",
  component: ReservasPage,
});

const dashboardWaitlistRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/lista-espera",
  component: ListasEsperaPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  publicReservationRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    dashboardUsersRoute,
    dashboardClientesRoute,
    dashboardZonasRoute,
    dashboardMesasRoute,
    dashboardBloqueosRoute,
    dashboardTurnosRoute,
    dashboardReservationsRoute,
    dashboardWaitlistRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
