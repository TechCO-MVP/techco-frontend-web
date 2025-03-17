"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useEffect, useState } from "react";
import { useOpenPositions } from "@/hooks/use-open-positions";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, countryLabelLookup, formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
  Settings,
  BadgeInfo,
} from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-businesses";
import { Business, HiringPositionData } from "@/types";
import { usePipefyPipe } from "@/hooks/use-pipefy-pipe";
import { Notifications } from "../Notifications/Notifications";
import { usePipefyPipes } from "@/hooks/use-pipefy-pipes";

type OpeningsProps = {
  dictionary: Dictionary;
};
export const Openings: FC<Readonly<OpeningsProps>> = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { pipes } = usePipefyPipes({
    ids: ["305713420", "305713420"],
  });
  console.log("pipes", pipes);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const {
    rootBusiness,
    businesses,
    isLoading: loadingBusiness,
  } = useBusinesses();

  const { isLoading, error, positions, isPending } = useOpenPositions({
    businessId: "679077da2d6626a2b007f8f9",
  });

  const { isLoading: loadingPipe, data } = usePipefyPipe({
    pipeId: "305713420",
  });

  const [selectedCompany, setSelectedCompany] = useState<Business | null>(
    rootBusiness,
  );

  useEffect(() => {
    setSelectedCompany(rootBusiness);
  }, [rootBusiness]);

  if (error) return <div className="text-red-400"> {error.message}</div>;
  if (!data || isLoading || isPending || loadingBusiness || loadingPipe)
    return <LoadingSkeleton />;
  const { pipe } = data;

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  const filteredPositions = positions.filter((position) =>
    position.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedPositions = [...filteredPositions].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    if (sortOrder === "asc")
      return a.hiring_priority.localeCompare(b.hiring_priority);
    return b.hiring_priority.localeCompare(a.hiring_priority);
  });

  const getStakeHolders = (position: HiringPositionData) => {
    if (position.responsible_users.length === 1)
      return <span>{position.responsible_users[0].user_name}</span>;
    return (
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-4">
              <Badge className="border-[#E4E4E7] bg-white px-[10px] pt-[2px] text-foreground hover:bg-white">
                {position.responsible_users.length}
              </Badge>
              <BadgeInfo />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {position.responsible_users.map((user) => (
              <DropdownMenuItem key={user.user_id}>
                {user.user_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col px-8 py-6">
      {/* Top Section */}

      <div className="mb-12 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="px-3 py-2.5">
                <div className="h-8 border-b-[1px] border-b-[#E4E4E7] font-bold">
                  Tus empresas
                </div>
                {businesses.map((business) => {
                  return (
                    <DropdownMenuItem
                      key={business._id}
                      className="flex cursor-pointer flex-col items-start gap-0"
                      onClick={() => setSelectedCompany(business)}
                    >
                      <div className="flex items-center gap-2">
                        <Heading
                          level={1}
                          className="text-center text-xl font-bold leading-8"
                        >
                          {business.name}
                        </Heading>
                        <CountryLabel
                          label={countryLabelLookup(business.country_code)}
                        />
                      </div>
                      <Text className="text-muted-foreground">
                        Creado por Mao Molina |{formatDate(business.created_at)}
                      </Text>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Heading
              level={1}
              className="text-center text-2xl font-bold leading-8"
            >
              {selectedCompany?.name}
            </Heading>

            <CountryLabel
              label={countryLabelLookup(selectedCompany?.country_code || "co")}
            />
            <Link href="companies">
              <Button
                variant="ghost"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]"
              >
                <Settings
                  width={14}
                  height={14}
                  stroke="#09090B
"
                />
              </Button>
            </Link>
          </div>
          <Text className="text-muted-foreground">
            Creado por Mao Molina | {formatDate(rootBusiness?.created_at)}
          </Text>
          <div className="mt-4 flex items-center gap-4">
            <span>
              Vacantes activas <Badge>03</Badge>
            </span>
            <span>
              <Notifications />
            </span>
          </div>
        </div>
        <Button variant="ghost" className="flex items-center bg-secondary">
          <Plus /> Crear vacante
        </Button>
      </div>
      {/* Filters */}
      <div className="mb-8 flex justify-between">
        <Input
          className="max-w-[18rem] shadow-sm"
          type="tex"
          placeholder="Buscar vacante...."
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
              <TableHead className="text-black">Estado</TableHead>
              <TableHead className="font-bold text-black">
                Nombre de la vacante
              </TableHead>
              <TableHead className="font-bold text-black">
                Fecha de Creación
              </TableHead>
              <TableHead className="font-bold text-black">Candidatos</TableHead>
              <TableHead className="font-bold text-black">Prioridad</TableHead>
              <TableHead className="font-bold text-black">
                Responsable
              </TableHead>
              <TableHead className="font-bold text-black">Reclutador</TableHead>
              <TableHead className="font-bold text-black">
                Stakeholders
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPositions.map((position) => (
              <TableRow
                key={position._id}
                className="cursor-pointer"
                onClick={() => router.push(`positions/${position._id}`)}
              >
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md",
                      "text-[#34C759]",
                      position.status === "Inactiva" && "text-[#FF9500]",
                      position.status === "Cancelada" && "text-[#FF3B30]",
                    )}
                  >
                    {position.status}
                  </Badge>
                </TableCell>
                <TableCell
                  title={position.role}
                  className="max-w-[100px] truncate"
                >
                  {position.role}
                </TableCell>
                <TableCell>{formatDate(new Date().toString())}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center gap-4">
                          {pipe.cards_count} <BadgeInfo />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {pipe.phases.map((phase) => (
                          <DropdownMenuItem
                            onClick={(e) => e.preventDefault()}
                            key={phase.id}
                          >
                            {phase.cards_count} Candidatos{" "}
                            <strong>{phase.name}</strong>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {position.hiring_priority}
                </TableCell>
                <TableCell>{position.owner_position_user_name}</TableCell>
                <TableCell>
                  <span>{position.recruiter_user_name}</span>
                </TableCell>
                <TableCell className="flex items-center justify-between gap-4">
                  {getStakeHolders(position)}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal width="16" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Cambiar de estado
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Cancelada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Activa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Terminada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Inactiva
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Borrador
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
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
