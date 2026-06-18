import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createListaEspera,
  getListasEspera,
  promoverListaEspera,
} from "@/modules/listas-espera/services/listasEsperaServices";

export function useGetListasEspera() {
  return useQuery({
    queryKey: ["listas-espera"],
    queryFn: getListasEspera,
    staleTime: 30_000,
  });
}

export function useCreateListaEspera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createListaEspera"],
    mutationFn: createListaEspera,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listas-espera"] });
      toast.success("Solicitud de reserva enviada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function usePromoverListaEspera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["promoverListaEspera"],
    mutationFn: ({
      listaEsperaId,
      mesaId,
    }: {
      listaEsperaId: number;
      mesaId: number;
    }) => promoverListaEspera(listaEsperaId, mesaId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listas-espera"] });
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Solicitud confirmada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
