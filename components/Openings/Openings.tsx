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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-businesses";
import { Business } from "@/types";

type OpeningsProps = {
  dictionary: Dictionary;
};
export const Openings: FC<Readonly<OpeningsProps>> = ({ dictionary }) => {
  console.log(dictionary);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const { rootBusiness, businesses } = useBusinesses();
  const { isLoading, error, positions } = useOpenPositions();
  const [selectedCompany, setSelectedCompany] = useState<Business | null>(
    rootBusiness,
  );

  useEffect(() => {
    setSelectedCompany(rootBusiness);
  }, [rootBusiness]);

  if (error) return <div className="text-red-400"> {error.message}</div>;
  if (isLoading) return <LoadingSkeleton />;

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  const filteredPositions = positions.filter((position) =>
    position.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedPositions = [...filteredPositions].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    if (sortOrder === "asc") return a.status.localeCompare(b.status);
    return b.status.localeCompare(a.status);
  });

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
          <div className="mt-4 flex gap-4">
            <span>
              Vacantes activas <Badge>03</Badge>
            </span>
            <span>
              Notificaciones <Badge>+9</Badge>
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
              <TableHead className="font-bold text-black">Proredad</TableHead>
              <TableHead className="font-bold text-black">
                Responsable
              </TableHead>
              <TableHead className="font-bold text-black">Reclutador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPositions.map((position) => (
              <TableRow
                key={position.id}
                className="cursor-pointer"
                onClick={() => router.push("opening-tracking")}
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
                <TableCell>{position.name}</TableCell>
                <TableCell>
                  {formatDate(position.created_at.toString())}
                </TableCell>
                <TableCell>{position.candidates}</TableCell>
                <TableCell>{position.priority}</TableCell>
                <TableCell>{position.responsible}</TableCell>
                <TableCell className="flex items-center justify-between gap-4">
                  <span>{position.recruiter}</span>
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
                        onClick={() => console.log("disable")}
                      >
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => console.log("dupe")}
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
