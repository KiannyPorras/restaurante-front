import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "@/lib/form";
import { useCreateZona } from "@/modules/zonas/hooks/zonasHooks";
import { zonaDefaultValues } from "@/modules/zonas/models/Zona";

export function CreateZona() {
  const [open, setOpen] = useState(false);
  const createZonaMutation = useCreateZona();
  const form = useForm({
    defaultValues: zonaDefaultValues,
    onSubmit: async ({ value }) => {
      await createZonaMutation.mutateAsync({
        ...value,
        nombre: value.nombre.trim(),
        photoUrl: value.photoUrl?.trim() || null,
      });
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear zona</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-lg">
          <SheetHeader className="border-b p-5 pr-12">
            <SheetTitle>Crear zona</SheetTitle>
            <SheetDescription>
              Pega un enlace en Photo URL para mostrar la imagen.
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
              <form.Field name="nombre">
                {(field) => (
                  <Field label="Nombre" htmlFor="create-zona-nombre">
                    <Input
                      id="create-zona-nombre"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Terraza"
                      required
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="disponibilidad">
                {(field) => (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.checked)
                      }
                    />
                    Zona disponible
                  </label>
                )}
              </form.Field>
              <form.Field name="photoUrl">
                {(field) => (
                  <>
                    <Field label="Photo URL" htmlFor="create-zona-photoUrl">
                      <Input
                        id="create-zona-photoUrl"
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
                          alt="Vista previa de zona"
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
              {createZonaMutation.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createZonaMutation.error.message}
                </p>
              ) : null}
            </div>
            <SheetFooter className="border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createZonaMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createZonaMutation.isPending}>
                {createZonaMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
