import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteCliente } from "@/modules/clientes/hooks/clientesHooks";
import type { Cliente } from "@/modules/clientes/models/Cliente";

export function DeleteCliente({ cliente }: { cliente: Cliente }) {
  const deleteClienteMutation = useDeleteCliente();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteClienteMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (
          window.confirm(
            `¿Eliminar cliente ${cliente.nombre} ${cliente.apellido}?`,
          )
        )
          deleteClienteMutation.mutate(cliente.id);
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
