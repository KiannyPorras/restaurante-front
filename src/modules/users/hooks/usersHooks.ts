import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdateUserDto } from "@/modules/users/models/User";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/modules/users/services/usersServices";

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario creado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser", id],
    mutationFn: (dto: UpdateUserDto) => updateUser(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
