"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useEffect, useMemo, useState, useTransition } from "react";
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import LoadingSkeleton from "./LoadingSkeleton";

import { useUsers } from "@/hooks/use-users";
import { useBusinesses } from "@/hooks/use-businesses";
import { User } from "@/types";
import { QUERIES } from "@/constants/queries";
import { EditUserDialog } from "../EditUserDialog/EditUserDialog";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";

type UserSettingsTabProps = {
  dictionary: Dictionary;
};
export const UserSettingsTab: FC<Readonly<UserSettingsTabProps>> = ({
  dictionary,
}) => {
  const params = useParams<{ lang: Locale; id: string }>();
  const { id } = params;

  const queryClient = useQueryClient();
  const { userSettingsPage: i18n, positionsPage: paginationI18n } = dictionary;
  const [searchTerm, setSearchTerm] = useState("");
  const { rootBusiness, businesses } = useBusinesses();
  const selectedCompany = useMemo(() => {
    return businesses.find((business) => business._id === id);
  }, [id, businesses]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelecterUser] = useState<User | null>();
  const { users, isLoading } = useUsers({
    businessId: selectedCompany?._id,
    all: true,
  });

  const { users: allUsers } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
    excludeBusinessId: selectedCompany?._id,
  });

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    if (sortOrder === "asc") return a.status.localeCompare(b.status);
    return b.status.localeCompare(a.status);
  });

  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize, setUsersPageSize] = useState(5);

  const paginatedUsers = useMemo(() => {
    if (!sortedUsers) return [];
    const start = (usersPage - 1) * usersPageSize;
    return sortedUsers.slice(start, start + usersPageSize);
  }, [sortedUsers, usersPage, usersPageSize]);

  useEffect(() => {
    setUsersPage(1);
  }, [users.length, searchTerm]);

  const onUpdateState = async (user: User, status: "enabled" | "disabled") => {
    try {
      startTransition(async () => {
        const updateUserResponse = await actions.updateUserStatus({
          id: user._id,
          email: user.email,
          status,
        });
        if (updateUserResponse.success) {
          queryClient.invalidateQueries({
            queryKey: QUERIES.USER_LIST(selectedCompany?._id),
          });
        }
      });
    } catch (error: unknown) {
      console.error("Error@onUpdateState", error);
    }
  };

  useEffect(() => {
    if (selectedUser && !showEditModal) {
      setSelecterUser(null);
    }
  }, [showEditModal, selectedUser]);

  if (isLoading) return <LoadingSkeleton />;

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
        <CreateUserDialog
          business={selectedCompany}
          users={allUsers}
          dictionary={dictionary}
        />
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
            {paginatedUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user?.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company_position}</TableCell>
                <TableCell>
                  {
                    user.roles.find(
                      (role) => role.business_id === selectedCompany?._id,
                    )?.role
                  }
                </TableCell>
                <TableCell className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      "flex items-center gap-2 rounded-sm border border-[#E4E4E7] px-2.5 py-0.5 font-semibold capitalize text-[#34C759]",
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
                        onClick={() => {
                          console.log("user", user);
                          setSelecterUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isPending}
                        className="cursor-pointer"
                        onClick={() =>
                          onUpdateState(
                            user,
                            user.status === "enabled" ? "disabled" : "enabled",
                          )
                        }
                      >
                        {user.status === "enabled"
                          ? "Inhabilitar"
                          : "Habilitar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          <label htmlFor="users-page-size" className="text-sm font-medium">
            {paginationI18n.paginationPageSizeLabel || "per page"}
          </label>
          <select
            id="users-page-size"
            value={usersPageSize}
            onChange={(e) => {
              setUsersPageSize(Number(e.target.value));
              setUsersPage(1);
            }}
            className="rounded border px-2 py-1"
            aria-label={paginationI18n.paginationPageSizeLabel || "Page size"}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
            disabled={usersPage === 1}
            aria-label={paginationI18n.paginationPrevious}
          >
            {paginationI18n.paginationPrevious}
          </Button>
          <span>
            {paginationI18n.paginationPage} {usersPage}{" "}
            {paginationI18n.paginationOf}{" "}
            {Math.ceil((sortedUsers?.length ?? 0) / usersPageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setUsersPage((p) =>
                Math.min(
                  Math.ceil((sortedUsers?.length ?? 0) / usersPageSize),
                  p + 1,
                ),
              )
            }
            disabled={
              usersPage ===
              Math.ceil((sortedUsers?.length ?? 0) / usersPageSize)
            }
            aria-label={paginationI18n.paginationNext}
          >
            {paginationI18n.paginationNext}
          </Button>
        </div>
      </div>
      {selectedUser && (
        <EditUserDialog
          open={showEditModal}
          setOpen={setShowEditModal}
          user={selectedUser}
          dictionary={dictionary}
        />
      )}
    </div>
  );
};
