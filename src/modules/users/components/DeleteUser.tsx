import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteUser } from "@/modules/users/hooks/usersHooks";
import type { User } from "@/modules/users/models/User";

type DeleteUserProps = {
  user: User;
};

export function DeleteUser({ user }: DeleteUserProps) {
  const deleteUserMutation = useDeleteUser();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={deleteUserMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (window.confirm(`Eliminar usuario ${user.username}?`)) {
          deleteUserMutation.mutate(user.id);
        }
      }}
    >
      <Trash2 className="size-4" />
      Eliminar
    </DropdownMenuItem>
  );
}
