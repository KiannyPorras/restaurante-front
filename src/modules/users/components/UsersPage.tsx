import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Home, MoreHorizontal, Search, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateUser } from "@/modules/users/components/CreateUser";
import { DeleteUser } from "@/modules/users/components/DeleteUser";
import { UpdateUser } from "@/modules/users/components/UpdateUser";
import { useGetUsers } from "@/modules/users/hooks/usersHooks";

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function UsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = searchInput.trim().toLowerCase();
  const { data: users, isError, isLoading, error } = useGetUsers();
  const filteredUsers = users?.filter((user) => {
    if (!deferredSearch) {
      return true;
    }

    return `${user.username} ${user.email} ${user.cedula}`
      .toLowerCase()
      .includes(deferredSearch);
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-1.5"
              to="/dashboard"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Usuarios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestion de Usuarios
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {users
              ? `${filteredUsers?.length ?? 0} de ${users.length} usuarios registrados`
              : "Administra los usuarios de la aplicacion"}
          </p>
        </div>

        <CreateUser />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por usuario, email o cédula..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center gap-4 px-4 py-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="ml-auto hidden h-6 w-20 sm:block" />
                </div>
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="p-4">
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            </div>
          ) : null}

          {!isLoading && filteredUsers?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Users className="size-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">No se encontraron usuarios</p>
              <p className="text-xs text-muted-foreground">
                Prueba ajustando la busqueda
              </p>
            </div>
          ) : null}

          {!isLoading && filteredUsers && filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Usuario
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cédula
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ID
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-semibold text-primary">
                            {getInitials(user.username)}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-sm font-medium">
                            {user.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Administrador
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.cedula || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-100">
                        Activo
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{user.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="size-9 px-0"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Abrir acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <UpdateUser user={user} />
                            <DropdownMenuSeparator />
                            <DeleteUser user={user} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Mostrando {filteredUsers?.length ?? 0} usuarios</span>
        <div className="hidden items-center gap-2 sm:flex">
          <span>Modulo Administracion</span>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/dashboard" className="transition hover:text-foreground">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
