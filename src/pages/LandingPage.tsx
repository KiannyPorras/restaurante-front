import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#3f1d1d_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-5xl flex-col items-center justify-center text-center">
        <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
          Restaurante Progra IV
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Solicita tu reserva y espera nuestra confirmación.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          Elige fecha, turno, zona y mesa preferida. Nuestro equipo revisará la
          disponibilidad y confirmará tu solicitud.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/reservar">
            <Button className="h-11 w-full gap-2 px-6 sm:w-auto">
              <CalendarClock className="size-4" />
              Solicitar reserva
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
