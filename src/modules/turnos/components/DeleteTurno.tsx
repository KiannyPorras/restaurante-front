import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteTurno } from "@/modules/turnos/hooks/turnosHooks";
import type { Turno } from "@/modules/turnos/models/Turno";

export function DeleteTurno({ turno }: { turno: Turno }) {
  const deleteTurnoMutation = useDeleteTurno();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteTurnoMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (window.confirm(`¿Eliminar turno ${turno.nombre}?`))
          deleteTurnoMutation.mutate(turno.id);
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
