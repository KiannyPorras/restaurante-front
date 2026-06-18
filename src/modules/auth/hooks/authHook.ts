import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  clearSession,
  getStoredSession,
  signInService,
} from "@/modules/auth/services/authServices";

export function useSignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["signIn"],
    mutationFn: signInService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Sesión iniciada correctamente");
      await navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getStoredSession,
    retry: false,
    staleTime: 1000 * 60,
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    clearSession();
    queryClient.clear();
    toast.success("Sesión cerrada correctamente");
    await navigate({ to: "/auth", replace: true });
  };
}
