"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useState, useTransition } from "react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { CreateUserDialog } from "../CreateUserDialog/CreateUserDialog";
import { useQueryClient } from "@tanstack/react-query";
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
import * as actions from "@/actions";

import { Input } from "../ui/input";
import { ArrowUpDown, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import LoadingSkeleton from "./LoadingSkeleton";

import { useUsers } from "@/hooks/use-users";
import { useBusinesses } from "@/hooks/use-businesses";
import { User } from "@/types";
import { QUERIES } from "@/constants/queries";

type UserSettingsTabProps = {
  dictionary: Dictionary;
};
export const UserSettingsTab: FC<Readonly<UserSettingsTabProps>> = ({
  dictionary,
}) => {
  const queryClient = useQueryClient();
  const { userSettingsPage: i18n } = dictionary;
  const [searchTerm, setSearchTerm] = useState("");
  const { rootBusiness } = useBusinesses();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [isPending, startTransition] = useTransition();
  const { users, isLoading } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };
  if (isLoading) return <LoadingSkeleton />;

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    if (sortOrder === "asc") return a.status.localeCompare(b.status);
    return b.status.localeCompare(a.status);
  });

  const onDisableUser = async (user: User) => {
    try {
      startTransition(async () => {
        const updateUserResponse = await actions.updateUserStatus({
          id: user._id,
          email: user.email,
          status: "disabled",
        });
        if (updateUserResponse.success) {
          queryClient.invalidateQueries({ queryKey: QUERIES.USER_LIST });
        }
      });
    } catch (error: unknown) {
      console.error("Error@onDisableUser", error);
    }
  };

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
                <TableCell>{user?.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company_position}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      "rounded-sm border border-[#E4E4E7] px-2.5 py-0.5 font-semibold capitalize text-[#34C759]",
                      user.status !== "enabled" && "text-red-500",
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
                        disabled={isPending}
                        className="cursor-pointer"
                        onClick={() => onDisableUser(user)}
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
