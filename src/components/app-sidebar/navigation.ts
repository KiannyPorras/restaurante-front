import {
  Armchair,
  Ban,
  CalendarClock,
  ClipboardList,
  Clock,
  LayoutDashboard,
  MapPinned,
  UserRound,
  Users,
} from "lucide-react";

export const navItems = [
  {
    label: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Clientes",
    href: "/dashboard/clientes",
    icon: UserRound,
  },
  {
    label: "Zonas",
    href: "/dashboard/zonas",
    icon: MapPinned,
  },
  {
    label: "Mesas",
    href: "/dashboard/mesas",
    icon: Armchair,
  },
  {
    label: "Bloqueos",
    href: "/dashboard/bloqueos",
    icon: Ban,
  },
  {
    label: "Turnos",
    href: "/dashboard/turnos",
    icon: Clock,
  },
  {
    label: "Reservas",
    href: "/dashboard/reservas",
    icon: CalendarClock,
  },
  {
    label: "Lista de espera",
    href: "/dashboard/lista-espera",
    icon: ClipboardList,
  },
];
