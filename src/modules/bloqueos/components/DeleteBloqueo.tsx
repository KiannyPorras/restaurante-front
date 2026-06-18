import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteBloqueo } from "@/modules/bloqueos/hooks/bloqueosHooks";
import type { Bloqueo } from "@/modules/bloqueos/models/Bloqueo";

export function DeleteBloqueo({ bloqueo }: { bloqueo: Bloqueo }) {
  const deleteBloqueoMutation = useDeleteBloqueo();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteBloqueoMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (window.confirm(`¿Eliminar bloqueo #${bloqueo.id}?`))
          deleteBloqueoMutation.mutate(bloqueo.id);
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
