import { CalendarClock, Users, Utensils } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cards = [
  {
    title: "Reservas",
    description: "Base lista para conectar el flujo de reservas.",
    icon: CalendarClock,
  },
  {
    title: "Usuarios",
    description: "Gestiona el acceso administrativo del sistema.",
    icon: Users,
  },
  {
    title: "Restaurante",
    description: "Panel preparado para mesas, zonas y turnos.",
    icon: Utensils,
  },
];

export function DashboardHomePage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Esta estructura replica la referencia: autenticacion, layout
            protegido, sidebar y modulo de usuarios listos para crecer con las
            siguientes pantallas.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
