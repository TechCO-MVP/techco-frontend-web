"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useEffect, useMemo, useState } from "react";
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
import {
  cn,
  countryLabelLookup,
  formatDate,
  isPositionDescriptionComplete,
  timeAgo,
} from "@/lib/utils";
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
  SlidersHorizontal,
  Settings,
  BadgeInfo,
  SquarePenIcon,
  TrashIcon,
  MoreHorizontal,
} from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-businesses";
import {
  Assessment,
  Business,
  DraftPositionData,
  PositionConfiguration,
  PositionConfigurationPhaseTypes,
  PositionConfigurationTypes,
  TechnicalAssessment,
  // UpdatePositionStatusData,
} from "@/types";
import { Notifications } from "@/components/Notifications/Notifications";
import { usePipefyPipes } from "@/hooks/use-pipefy-pipes";
// import * as actions from "@/actions";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { useUsers } from "@/hooks/use-users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Search } from "./Search";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearchParams } from "next/navigation";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import EmptyTableState from "../EmptyTableState/EmptyTableState";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { useDeletePositionConfiguration } from "@/hooks/use-delete-position-configuration";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import AnimatedModal from "../ChatBot/AnimatedModal";
import { MODE_SELECTION_ONBOARDING_HIDE_KEY } from "../ChatBot/OnboardingStepper";
import { Input } from "../ui/input";
import { Locale } from "@/i18n-config";
import { WeightsSheet } from "./WeightsSheet";
import { EvaluationWeight } from "@/types";
import { updateCompanyAction } from "@/actions/companies/update";
import { useTransition } from "react";

type OpeningsProps = {
  dictionary: Dictionary;
};
export const Openings: FC<Readonly<OpeningsProps>> = ({ dictionary }) => {
  const showOnboarding = !localStorage.getItem(
    `${MODE_SELECTION_ONBOARDING_HIDE_KEY}-first_time_onboarding`,
  );
  const { toast } = useToast();
  const params = useParams<{ lang: Locale; id: string }>();
  const { lang } = params;
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const businessParam = searchParams.get("business_id");
  const positionParam = searchParams.get("position_id");
  const [searchQuery, setSearchQuery] = useState("");
  const defaultTab =
    tabParam === "actives" || tabParam === "drafts" ? tabParam : "actives";
  const [positionToDelete, setPositionToDelete] = useState<string>();
  const [priorityFilter, setPriorityFilter] = useState<string | null>();
  const [isWeightsSheetOpen, setIsWeightsSheetOpen] = useState(false);
  const [, startTransition] = useTransition();

  const priorityOptions = ["high", "medium", "low"];

  // const [_, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const { positionsPage: i18n } = dictionary;
  const dateOptions = [
    {
      value: 7,
      label: i18n["7daysFilter"],
    },
    {
      value: 14,
      label: i18n["14daysFilter"],
    },
    {
      value: 30,
      label: i18n["30daysFilter"],
    },
    {
      value: 90,
      label: i18n["90daysFilter"],
    },
  ];
  const [dateFilter, setDateFilter] = useState<number | null>();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: deletePositionConfiguration, isPending: isDeleting } =
    useDeletePositionConfiguration({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
        });
        toast({
          title: "Vacante eliminada",
          description: "La vacante ha sido eliminada correctamente",
        });
        setIsConfirmDeleteDialogOpen(false);
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error?.message,
        });
        setIsConfirmDeleteDialogOpen(false);
      },
    });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("desc");
  const {
    rootBusiness,
    businesses,
    isLoading: loadingBusiness,
  } = useBusinesses();
  const [selectedCompany, setSelectedCompany] = useState<Business | null>(
    rootBusiness,
  );
  const { data, refetch } = usePositionConfigurations({
    all: true,
    businessId: selectedCompany?._id || "",
  });
  const positionConfigurationList = data?.body.data;

  const { currentUser } = useCurrentUser();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });

  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);

  const {
    isLoading,
    error,
    positions,
    isPending: pendingPositions,
  } = useOpenPositions({
    userId: localUser?._id,
    businessId: selectedCompany?._id,
  });

  const pipeIds = positions
    .map((position) => position.pipe_id)
    .filter((pipe_id) => pipe_id !== null);

  const { pipes } = usePipefyPipes({
    ids: pipeIds,
  });

  useEffect(() => {
    if (businessParam) {
      const business = businesses.find((b) => b._id === businessParam);
      if (business) setSelectedCompany(business);
      return;
    }
    setSelectedCompany(rootBusiness);
  }, [rootBusiness, businessParam, businesses]);

  useEffect(() => {
    console.log("/position/list response", positions);
  }, [positions, selectedCompany]);

  useEffect(() => {
    console.log("/position-configuration/list response", data);
  }, [data, selectedCompany]);

  useEffect(() => {
    if (selectedCompany) {
      const params = new URLSearchParams(window.location.search);
      params.set("business_id", selectedCompany._id);
      router.push(`?${params.toString()}`);
    }
  }, [selectedCompany]);

  const filteredPositions = useMemo(() => {
    const getDaysAgo = (days: number) => {
      const now = new Date();
      now.setDate(now.getDate() - days);
      return now;
    };

    const dateCutoff = (() => {
      switch (dateFilter) {
        case 7:
          return getDaysAgo(7);
        case 14:
          return getDaysAgo(14);
        case 30:
          return getDaysAgo(30);
        case 90:
          return getDaysAgo(90);
        default:
          return null; // no filter
      }
    })();
    const filtered = positions.filter((position) => {
      const searchMatch =
        !searchTerm ||
        position.role?.toLowerCase().includes(searchTerm.toLowerCase());

      const priorityMatch =
        !priorityFilter ||
        position.hiring_priority
          ?.toLowerCase()
          .includes(priorityFilter.toLocaleLowerCase());

      const dateMatch =
        !dateCutoff || new Date(position.created_at) >= dateCutoff;

      const isMatch = searchMatch && priorityMatch && dateMatch;

      return isMatch;
    });
    return filtered;
  }, [searchTerm, priorityFilter, positions, dateFilter]);

  const [draftsPage, setDraftsPage] = useState(1);
  const [draftsPageSize, setDraftsPageSize] = useState(5);
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    if (!sortOrder) return 0; // No sorting
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    if (sortOrder === "asc") return dateA - dateB;
    return dateB - dateA;
  });

  const filteredDrafts = useMemo(() => {
    if (!positionConfigurationList) return [];
    return positionConfigurationList.filter((position) => {
      const isCompleted = position.status === "COMPLETED";
      if (isCompleted) return false;
      const searchMatch =
        !searchQuery ||
        (position.phases[0]?.data as DraftPositionData)?.role
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      return searchMatch;
    });
  }, [positionConfigurationList, searchQuery]);

  const paginatedDrafts = useMemo(() => {
    if (!filteredDrafts) return [];
    const start = (draftsPage - 1) * draftsPageSize;
    return filteredDrafts.slice(start, start + draftsPageSize);
  }, [filteredDrafts, draftsPage, draftsPageSize]);

  useEffect(() => {
    setDraftsPage(1);
  }, [positionConfigurationList, draftsPageSize]);

  const [activesPage, setActivesPage] = useState(1);
  const [activesPageSize, setActivesPageSize] = useState(5);

  const paginatedActives = useMemo(() => {
    if (!sortedPositions) return [];
    const start = (activesPage - 1) * activesPageSize;
    return sortedPositions.slice(start, start + activesPageSize);
  }, [sortedPositions, activesPage, activesPageSize]);

  useEffect(() => {
    setActivesPage(1);
  }, [filteredPositions, activesPageSize]);

  const [pulsingRow, setPulsingRow] = useState<string | null>(null);

  useEffect(() => {
    if (positionParam) {
      setPulsingRow(positionParam);
      const timeout = setTimeout(() => setPulsingRow(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [positionParam]);

  useEffect(() => {
    if (!positionParam) return;
    if (!positionConfigurationList) return;
    const index = positionConfigurationList.findIndex(
      (pos) => pos._id === positionParam,
    );
    if (index === -1) return;
    const page = Math.floor(index / draftsPageSize) + 1;
    if (draftsPage !== page) setDraftsPage(page);
  }, [positionParam, positionConfigurationList, draftsPageSize]);

  useEffect(() => {
    if (
      positionParam &&
      paginatedDrafts.some((pos) => pos._id === positionParam)
    ) {
      setPulsingRow(positionParam);
      const timeout = setTimeout(() => setPulsingRow(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [positionParam, paginatedDrafts]);

  if (error) return <div className="text-red-400"> {error.message}</div>;
  if (isLoading || pendingPositions || loadingBusiness)
    return <LoadingSkeleton />;

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
  };

  // const onUpdateState = async (
  //   position: HiringPositionData,
  //   status: UpdatePositionStatusData["status"],
  // ) => {
  //   try {
  //     if (!localUser) return;
  //     startTransition(async () => {
  //       const updatePositionResponse = await actions.updatePositionStatus({
  //         status,
  //         positionId: position._id,
  //         userId: localUser?._id,
  //       });
  //       console.log("updatePositionResponse", updatePositionResponse);
  //       if (updatePositionResponse.success) {
  //         queryClient.invalidateQueries({
  //           queryKey: QUERIES.POSITION_LIST(rootBusiness?._id, localUser?._id),
  //         });
  //       }
  //     });
  //   } catch (error: unknown) {
  //     console.error("Error@onUpdateState", error);
  //   }
  // };

  const getTitle = (position: PositionConfiguration): string => {
    const totalPhases = position.phases.length;
    switch (position.current_phase) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return `Descripción (1 de ${totalPhases})`;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return `ADN Del Talento (2 de ${totalPhases})`;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return `Caso de Negocio (3 de ${totalPhases})`;
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        return "¡Listo!";
      case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
        return "Entrevista final";
      default:
        return position.current_phase;
    }
  };

  const redirectToPosition = (position: PositionConfiguration) => {
    const phaseToRedirect = position.phases.find(
      (phase) => phase.status === "IN_PROGRESS" || phase.status === "DRAFT",
    );
    console.log(
      "%c[Debug] phaseToRedirect",
      "background-color: teal; font-size: 20px; color: white",
      phaseToRedirect,
    );
    switch (phaseToRedirect?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION: {
        const phase = position.phases.find(
          (phase) => phase.type === PositionConfigurationPhaseTypes.DESCRIPTION,
        );
        if (!phase) return;
        if (phase.status === "DRAFT") {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}`,
          );
          return;
        }
        const isCompleted = isPositionDescriptionComplete(
          phase.data as DraftPositionData,
        );
        if (isCompleted) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/description/preview`,
          );
        } else if (
          phase.configuration_type === PositionConfigurationTypes.AI_TEMPLATE
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/description`,
          );
        } else if (
          phase.configuration_type ===
          PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/description/copy`,
          );
        } else if (
          phase.configuration_type === PositionConfigurationTypes.CUSTOM
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/description?type=${PositionConfigurationTypes.CUSTOM}`,
          );
        }

        break;
      }
      case PositionConfigurationPhaseTypes.SOFT_SKILLS: {
        const phase = position.phases.find(
          (phase) => phase.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
        );
        if (!phase) return;
        if (phase.status === "DRAFT") {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}`,
          );
          return;
        }
        const isCompleted =
          phase.status === "COMPLETED" ||
          (phase.data as Assessment)?.soft_skills?.length > 0;

        if (isCompleted) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/soft-skills/preview`,
          );
        } else if (
          phase.configuration_type === PositionConfigurationTypes.AI_TEMPLATE
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/soft-skills`,
          );
        } else if (
          phase.configuration_type ===
          PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/soft-skills/copy`,
          );
        }
        break;
      }
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        const phase = position.phases.find(
          (phase) =>
            phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
        );
        if (!phase) return;
        if (phase.status === "DRAFT") {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}`,
          );
          return;
        }
        const isCompleted =
          phase.status === "COMPLETED" ||
          (phase.data as TechnicalAssessment)?.your_mission;
        if (isCompleted) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/technical-test`,
          );
        } else if (
          phase.configuration_type ===
          PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE
        ) {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/technical-test/copy`,
          );
        } else {
          router.push(
            `companies/${selectedCompany?._id}/position-configuration/${position._id}/technical-test`,
          );
        }

        break;
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        router.push(
          `companies/${selectedCompany?._id}/position-configuration/${position._id}/publish`,
        );
        break;
      default:
        router.push(
          `companies/${selectedCompany?._id}/position-configuration/${position._id}`,
        );
        break;
    }
  };

  const renderPipeData = (pipeId: string | null) => {
    if (!pipeId) return <span>Pending...</span>;
    const pipe = pipes?.find((p) => p.id === pipeId);
    if (!pipe) return <span>Pending...</span>;
    return (
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
                key={phase.name}
              >
                {phase.cards_count} {i18n.candidates}{" "}
                <strong>{phase.name}</strong>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter((prev) => (prev === value ? null : value));
  };

  const handleDateChange = (value: number) => {
    setDateFilter((prev) => (prev === value ? null : value));
  };

  const handleSaveWeights = async (criteria: {
    HIGH_PROFILE_FLOW: EvaluationWeight[];
    MEDIUM_PROFILE_FLOW: EvaluationWeight[];
    LOW_PROFILE_FLOW: EvaluationWeight[];
  }) => {
    if (!selectedCompany?._id) return;

    try {
      startTransition(async () => {
        // Mapear los datos del negocio al formato esperado por updateCompanyAction
        const businessData = {
          name: selectedCompany.name,
          countryCode: selectedCompany.country_code,
          description: selectedCompany.description || "",
          website: selectedCompany.url || "",
          linkedin: selectedCompany.linkedin_url || "",
          companySize: selectedCompany.company_size,
          industry: selectedCompany.industry || "",
          segment: selectedCompany.segment || "",
          logo: selectedCompany.logo,
          // Incluir la nueva configuración del negocio
          business_configuration: {
            ...selectedCompany.business_configuration,
            evaluation_weights: criteria,
          },
        };
        console.log(
          "%c[Debug] businessData",
          "background-color: teal; font-size: 20px; color: white",
          businessData,
          selectedCompany,
        );

        const updateResponse = await updateCompanyAction(
          businessData,
          selectedCompany._id,
        );

        if (updateResponse.success) {
          toast({
            title: "Pesos actualizados",
            description: "Los pesos han sido guardados correctamente",
          });

          // Invalidar las queries para refrescar los datos
          queryClient.invalidateQueries({
            queryKey: QUERIES.COMPANY_LIST,
          });
        } else {
          toast({
            title: "Error",
            description:
              updateResponse.message || "No se pudieron guardar los pesos",
            variant: "destructive",
          });
        }
      });
    } catch (error: unknown) {
      console.error("Error saving weights:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los pesos",
        variant: "destructive",
      });
      throw error;
    }
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
                <ScrollArea className="h-[420px]">
                  <div className="h-8 border-b-[1px] border-b-[#E4E4E7] font-bold">
                    {i18n.yourCompanies}
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
                          {formatDate(business.created_at)}
                        </Text>
                      </DropdownMenuItem>
                    );
                  })}
                </ScrollArea>
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
            <Link href={`companies/${selectedCompany?._id}`}>
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
            {formatDate(selectedCompany?.created_at)}
          </Text>
          <div className="mt-4 flex items-center gap-4">
            <span>
              <Notifications
                dictionary={dictionary}
                positions={positions}
                businessId={selectedCompany?._id}
              />
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <AnimatedModal
            mode="stepper"
            defaultOpen={showOnboarding}
            dictionary={dictionary}
            type="first_time_onboarding"
          />
          <Link
            href={`companies/${selectedCompany?._id}/position-configuration/create`}
          >
            <Button variant="talentGreen" className="flex items-center">
              {i18n.createPosition}
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className="flex h-full w-full flex-col items-center justify-start bg-white"
      >
        <TabsList className="min-w-full justify-start gap-2 rounded-none border-b-[1px] bg-white">
          <TabsTrigger
            className="rounded-none border-talent-green-500 text-black shadow-none data-[state=active]:border-b-2 data-[state=active]:text-talent-green-500 data-[state=active]:shadow-none"
            value="actives"
          >
            Vacantes
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-talent-green-500 text-black shadow-none data-[state=active]:border-b-2 data-[state=active]:text-talent-green-500 data-[state=active]:shadow-none"
            value="drafts"
          >
            Borradores de vacantes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="actives" className="h-full w-full">
          {/* Filters */}
          <div className="mb-8 flex justify-between">
            <Search
              positions={positions}
              placeholder={i18n.search}
              value={searchTerm}
              setValue={setSearchTerm}
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
                <ArrowUpDown /> {i18n.stateLabel}
              </Button>
              <Button
                onClick={() => setIsWeightsSheetOpen(true)}
                variant="ghost"
                className="border border-dashed shadow-sm"
              >
                <SlidersHorizontal /> Pesos
              </Button>
              {/* <Button variant="ghost" className="border border-dashed shadow-sm">
            <SlidersHorizontal /> {i18n.filterLabel}
          </Button> */}
              <div className="flex gap-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="border border-dashed shadow-sm"
                    >
                      <SlidersHorizontal /> {i18n.filterLabel}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="text-base font-bold">
                          {" "}
                          {i18n.filterLabel}
                        </h4>
                      </div>

                      <Separator />
                      <div className="grid gap-2">
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold">
                            {i18n.priorityFilterLabel}
                          </h4>
                        </div>

                        {priorityOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option}
                              checked={priorityFilter === option}
                              onCheckedChange={() =>
                                handlePriorityChange(option)
                              }
                            />
                            <label
                              htmlFor={option}
                              className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>

                      <Separator />
                      <div className="grid gap-2">
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold">
                            {i18n.dateFilterLabel}
                          </h4>
                        </div>

                        {dateOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option.label}
                              checked={dateFilter === option.value}
                              onCheckedChange={() =>
                                handleDateChange(option.value)
                              }
                            />
                            <label
                              htmlFor={option.label}
                              className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {paginatedActives.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">
                      {i18n.stateLabel}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.positionNameHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.createAtHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.candidatesHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.priorityHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.responsibleHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.recruiterHeading}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedActives.map((position) => (
                    <TableRow
                      id={position._id}
                      key={position._id}
                      className={cn(
                        "cursor-pointer",
                        pulsingRow === position._id &&
                          "animate-blink border-2 border-[#1976D2]",
                      )}
                      onClick={() => {
                        const params = new URLSearchParams(
                          window.location.search,
                        );

                        router.push(
                          `positions/${position._id}?${params.toString()}`,
                        );
                      }}
                    >
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md",
                            "text-[#34C759]",
                            position.status === "INACTIVE" && "text-[#FF9500]",
                            position.status === "CANCELED" && "text-[#FF3B30]",
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
                      <TableCell>
                        {formatDate(new Date(position.created_at).toString())}
                      </TableCell>
                      <TableCell>{renderPipeData(position.pipe_id)}</TableCell>
                      <TableCell className="capitalize">
                        {position.hiring_priority}
                      </TableCell>
                      <TableCell>{position.owner_position_user_name}</TableCell>
                      <TableCell className="flex items-center justify-between gap-4">
                        <span>{position.recruiter_user_name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal width="16" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/${lang}/dashboard/companies/${selectedCompany?._id}/position-configuration/${position.position_configuration_id}?mode=duplicate`,
                                );
                              }}
                            >
                              {i18n.duplicateLabel}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-end gap-2">
                <label
                  htmlFor="actives-page-size"
                  className="text-sm font-medium"
                >
                  {i18n.paginationPageSizeLabel || "per page"}
                </label>
                <select
                  id="actives-page-size"
                  value={activesPageSize}
                  onChange={(e) => {
                    setActivesPageSize(Number(e.target.value));
                    setActivesPage(1);
                  }}
                  className="rounded border px-2 py-1"
                  aria-label={i18n.paginationPageSizeLabel || "Page size"}
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => setActivesPage((p) => Math.max(1, p - 1))}
                  disabled={activesPage === 1}
                  aria-label={i18n.paginationPrevious}
                >
                  {i18n.paginationPrevious}
                </Button>
                <span>
                  {i18n.paginationPage} {activesPage} {i18n.paginationOf}{" "}
                  {Math.ceil(
                    (filteredPositions?.length ?? 0) / activesPageSize,
                  )}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setActivesPage((p) =>
                      Math.min(
                        Math.ceil(
                          (filteredPositions?.length ?? 0) / activesPageSize,
                        ),
                        p + 1,
                      ),
                    )
                  }
                  disabled={
                    activesPage ===
                    Math.ceil(
                      (filteredPositions?.length ?? 0) / activesPageSize,
                    )
                  }
                  aria-label={i18n.paginationNext}
                >
                  {i18n.paginationNext}
                </Button>
              </div>
            </div>
          ) : (
            <EmptyTableState
              title="Aún no has creado vacantes"
              description={`Crea tu primera vacante y comienza a recibir postulaciones.\nNuestra plataforma te acompaña paso a paso para que el proceso sea ágil y claro.`}
              buttonLabel="Crear vacante"
              onClick={() =>
                router.push(
                  `companies/${selectedCompany?._id}/position-configuration/create`,
                )
              }
            />
          )}
        </TabsContent>
        <TabsContent value="drafts" className="h-full w-full">
          {positionConfigurationList?.length &&
          positionConfigurationList.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Buscar  vacante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-0"
                  aria-label="Buscar por nombre de vacante"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">
                      {i18n.stateLabel}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.positionNameHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.createAtHeading}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.currentPhase}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.updatedAt}
                    </TableHead>
                    <TableHead className="font-bold text-black">
                      {i18n.createdBy}
                    </TableHead>
                    <TableHead className="font-bold text-black"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDrafts.map((position) => (
                    <TableRow
                      id={position._id}
                      key={position._id}
                      className={cn(
                        "cursor-pointer",
                        pulsingRow === position._id &&
                          "animate-blink border-2 border-[#1976D2]",
                      )}
                      onClick={() => redirectToPosition(position)}
                    >
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("rounded-md", "text-[#34C759]")}
                        >
                          {position.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        title={
                          (position.phases[0]?.data as DraftPositionData)?.role
                        }
                        className="max-w-[100px] truncate"
                      >
                        {(position.phases[0]?.data as DraftPositionData)?.role}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(position.created_at).toString())} (
                        {timeAgo(
                          Date.now() - new Date(position.created_at).getTime(),
                          dictionary,
                        )}
                        )
                      </TableCell>
                      <TableCell>{getTitle(position)}</TableCell>
                      <TableCell>
                        {formatDate(new Date(position.updated_at).toString())}
                      </TableCell>
                      <TableCell>
                        {
                          users.find((user) => user._id === position.user_id)
                            ?.full_name
                        }
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Button variant="link">
                          <SquarePenIcon className="h-4 w-4" />
                          {i18n.continueEditing}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPositionToDelete(position._id);
                            setIsConfirmDeleteDialogOpen(true);
                          }}
                          variant="ghost"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-end gap-2">
                <label
                  htmlFor="drafts-page-size"
                  className="text-sm font-medium"
                >
                  {i18n.paginationPageSizeLabel || "per page"}
                </label>
                <select
                  id="drafts-page-size"
                  value={draftsPageSize}
                  onChange={(e) => {
                    setDraftsPageSize(Number(e.target.value));
                    setDraftsPage(1);
                  }}
                  className="rounded border px-2 py-1"
                  aria-label={i18n.paginationPageSizeLabel || "Page size"}
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => setDraftsPage((p) => Math.max(1, p - 1))}
                  disabled={draftsPage === 1}
                  aria-label={i18n.paginationPrevious}
                >
                  {i18n.paginationPrevious}
                </Button>
                <span>
                  {i18n.paginationPage} {draftsPage} {i18n.paginationOf}{" "}
                  {Math.ceil(
                    (positionConfigurationList?.length ?? 0) / draftsPageSize,
                  )}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setDraftsPage((p) =>
                      Math.min(
                        Math.ceil(
                          (positionConfigurationList?.length ?? 0) /
                            draftsPageSize,
                        ),
                        p + 1,
                      ),
                    )
                  }
                  disabled={
                    draftsPage ===
                    Math.ceil(
                      (positionConfigurationList?.length ?? 0) / draftsPageSize,
                    )
                  }
                  aria-label={i18n.paginationNext}
                >
                  {i18n.paginationNext}
                </Button>
              </div>
            </>
          ) : (
            <EmptyTableState
              title="Aún no has creado vacantes"
              description={`Crea tu primera vacante y comienza a recibir postulaciones.\nNuestra plataforma te acompaña paso a paso para que el proceso sea ágil y claro.`}
              buttonLabel="Crear vacante"
              onClick={() =>
                router.push(
                  `companies/${selectedCompany?._id}/position-configuration/create`,
                )
              }
            />
          )}
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        isLoading={isDeleting}
        onConfirm={() => {
          if (!positionToDelete) return;
          deletePositionConfiguration({ id: positionToDelete });
        }}
        onCancel={() => setIsConfirmDeleteDialogOpen(false)}
        dictionary={dictionary}
      />
      <WeightsSheet
        open={isWeightsSheetOpen}
        onOpenChange={setIsWeightsSheetOpen}
        onSave={handleSaveWeights}
        initialWeights={
          selectedCompany?.business_configuration?.evaluation_weights
        }
      />
    </div>
  );
};
