import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteZona } from "@/modules/zonas/hooks/zonasHooks";
import type { Zona } from "@/modules/zonas/models/Zona";

export function DeleteZona({ zona }: { zona: Zona }) {
  const deleteZonaMutation = useDeleteZona();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteZonaMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (window.confirm(`Eliminar zona ${zona.nombre}?`))
          deleteZonaMutation.mutate(zona.id);
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
