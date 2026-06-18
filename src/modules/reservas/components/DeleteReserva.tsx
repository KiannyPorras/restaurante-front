import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteReserva } from "@/modules/reservas/hooks/reservasHooks";
import type { Reserva } from "@/modules/reservas/models/Reserva";

export function DeleteReserva({ reserva }: { reserva: Reserva }) {
  const deleteReservaMutation = useDeleteReserva();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteReservaMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (window.confirm(`¿Eliminar reserva #${reserva.id}?`))
          deleteReservaMutation.mutate(reserva.id);
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
