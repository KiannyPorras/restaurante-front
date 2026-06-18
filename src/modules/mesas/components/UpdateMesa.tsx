import { useState } from "react";
import { ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useUpdateMesa } from "@/modules/mesas/hooks/mesasHooks";
import type { Mesa } from "@/modules/mesas/models/Mesa";
import type { Zona } from "@/modules/zonas/models/Zona";

type UpdateMesaProps = {
  mesa: Mesa;
  zonas: Zona[];
  trigger?: "item" | "button";
};

export function UpdateMesa({ mesa, zonas, trigger = "item" }: UpdateMesaProps) {
  const [open, setOpen] = useState(false);
  const updateMesaMutation = useUpdateMesa(mesa.id);
  const form = useForm({
    defaultValues: {
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      zonaId: mesa.zonaId,
      photoUrl: mesa.photoUrl ?? "",
      posicionX: mesa.posicionX ?? null,
      posicionY: mesa.posicionY ?? null,
    },
    onSubmit: async ({ value }) => {
      await updateMesaMutation.mutateAsync({
        ...value,
        photoUrl: value.photoUrl?.trim() || null,
      });
      setOpen(false);
    },
  });

  return (
    <>
      {trigger === "item" ? (
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <Pencil className="size-4" />
          Editar
        </DropdownMenuItem>
      ) : (
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Pencil className="size-4" />
          Editar
        </Button>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Editar mesa</SheetTitle>
            <SheetDescription>
              Asigna zona, capacidad y un enlace de foto.
            </SheetDescription>
          </SheetHeader>
          <form
            className="flex flex-1 flex-col overflow-hidden"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="flex flex-col flex-1 gap-4 overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="numero">
                  {(field) => (
                    <Field label="Numero" htmlFor="update-mesa-numero">
                      <Input
                        id="update-mesa-numero"
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                        required
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="capacidad">
                  {(field) => (
                    <Field label="Capacidad" htmlFor="update-mesa-capacidad">
                      <Input
                        id="update-mesa-capacidad"
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                        required
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
              <form.Field name="zonaId">
                {(field) => (
                  <Field label="Zona" htmlFor="update-mesa-zonaId">
                    <Select
                      value={String(field.state.value)}
                      onValueChange={(value) =>
                        field.handleChange(Number(value))
                      }
                    >
                      <SelectTrigger id="update-mesa-zonaId" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {zonas.map((zona) => (
                          <SelectItem key={zona.id} value={String(zona.id)}>
                            {zona.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
              <form.Field name="photoUrl">
                {(field) => (
                  <>
                    <Field label="Photo URL" htmlFor="update-mesa-photoUrl">
                      <Input
                        id="update-mesa-photoUrl"
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="https://..."
                      />
                    </Field>
                    <div className="overflow-hidden rounded-lg border bg-muted/30">
                      {field.state.value ? (
                        <img
                          src={field.state.value}
                          alt="Vista previa de mesa"
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                          <ImageIcon className="size-8" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </form.Field>
              {updateMesaMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {updateMesaMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateMesaMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMesaMutation.isPending}>
                {updateMesaMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
