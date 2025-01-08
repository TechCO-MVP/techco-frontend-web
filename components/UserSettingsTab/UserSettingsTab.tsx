"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useState } from "react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { CreateUserDialog } from "../CreateUserDialog/CreateUserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { ArrowUpDown, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const users = [
  {
    name: "Carlos Hernandez",
    email: "carloshernandez@techo.pe",
    position: "VP operaciones",
    role: "Super Administrador",
    status: "Activo",
  },
  {
    name: "Maria Lopez",
    email: "marialopez@techo.pe",
    position: "Gerente Financiero",
    role: "Administrador",
    status: "Activo",
  },
  {
    name: "Juan Perez",
    email: "juanperez@techo.pe",
    position: "Jefe de Proyectos",
    role: "Editor",
    status: "Activo",
  },
  {
    name: "Lucia Gomez",
    email: "luciagomez@techo.pe",
    position: "Coordinadora de Ventas",
    role: "Colaborador",
    status: "Inactivo",
  },
  {
    name: "Pedro Martinez",
    email: "pedromartinez@techo.pe",
    position: "Analista de Datos",
    role: "Colaborador",
    status: "Activo",
  },
  {
    name: "Ana Torres",
    email: "anatorres@techo.pe",
    position: "Asistente Administrativo",
    role: "Colaborador",
    status: "Activo",
  },
];

type UserSettingsTabProps = {
  dictionary: Dictionary;
};
export const UserSettingsTab: FC<Readonly<UserSettingsTabProps>> = ({
  dictionary,
}) => {
  const { userSettingsPage: i18n } = dictionary;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    if (sortOrder === "asc") return a.status.localeCompare(b.status);
    return b.status.localeCompare(a.status);
  });

  return (
    <div className="flex w-full flex-col px-8 py-6">
      {/* Top Section */}

      <div className="mb-12 flex items-start justify-between">
        <div>
          <Heading
            level={1}
            className="text-center text-2xl font-normal leading-8"
          >
            {i18n.formTitle}
          </Heading>
          <Text className="text-muted-foreground" type="span" size="small">
            {i18n.formDescription}
          </Text>
        </div>
        <CreateUserDialog dictionary={dictionary} />
      </div>
      {/* Filters */}
      <div className="mb-8 flex justify-between">
        <Input
          className="max-w-[18rem] shadow-sm"
          type="tex"
          placeholder="Buscar nombre...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-6">
          <Button
            onClick={handleSort}
            variant="ghost"
            className={cn(
              "border border-dashed shadow-sm",
              sortOrder && "bg-secondary/80",
            )}
          >
            <ArrowUpDown /> Estado
          </Button>
          <Button variant="ghost" className="border border-dashed shadow-sm">
            <SlidersHorizontal /> Filtro
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black">Nombre</TableHead>
              <TableHead className="font-bold text-black">
                Correo electrónico
              </TableHead>
              <TableHead className="font-bold text-black">Cargo</TableHead>
              <TableHead className="font-bold text-black">
                Rol asignado
              </TableHead>
              <TableHead className="font-bold text-black">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex items-center justify-center gap-4">
                  <span
                    className={cn(
                      "rounded-sm border border-[#E4E4E7] px-2.5 py-0.5 font-semibold text-[#34C759]",
                      user.status === "Inactivo" && "text-red-500",
                    )}
                  >
                    {user.status}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal width="16" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => console.log("edit")}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => console.log("disbale")}
                      >
                        Inhabilitar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => console.log("delete")}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
