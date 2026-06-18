import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteMesa } from "@/modules/mesas/hooks/mesasHooks";
import type { Mesa } from "@/modules/mesas/models/Mesa";

type DeleteMesaProps = {
  mesa: Mesa;
  trigger?: "item" | "button";
  onDeleted?: () => void;
};

export function DeleteMesa({
  mesa,
  trigger = "item",
  onDeleted,
}: DeleteMesaProps) {
  const deleteMesaMutation = useDeleteMesa();
  const remove = () => {
    if (window.confirm(`Eliminar mesa ${mesa.numero}?`))
      deleteMesaMutation.mutate(mesa.id, { onSuccess: onDeleted });
  };

  return trigger === "item" ? (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteMesaMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        remove();
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  ) : (
    <Button
      type="button"
      className="bg-destructive text-white hover:bg-destructive/90"
      disabled={deleteMesaMutation.isPending}
      onClick={remove}
    >
      <Trash2 className="size-4" />
      Eliminar
    </Button>
  );
}
