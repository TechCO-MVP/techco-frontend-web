"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useEffect, useMemo, useState, useTransition } from "react";
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
import { Button } from "../ui/button";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-businesses";
import {
  Business,
  HiringPositionData,
  UpdatePositionStatusData,
} from "@/types";
import { Notifications } from "@/components/Notifications/Notifications";
import { usePipefyPipes } from "@/hooks/use-pipefy-pipes";
import * as actions from "@/actions";
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

type OpeningsProps = {
  dictionary: Dictionary;
};
export const Openings: FC<Readonly<OpeningsProps>> = ({ dictionary }) => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const businessParam = searchParams.get("business_id");
  const positionParam = searchParams.get("position_id");
  const defaultTab =
    tabParam === "actives" || tabParam === "drafts" ? tabParam : "actives";

  const [priorityFilter, setPriorityFilter] = useState<string | null>();
  const [statusFilter, setStatusFilter] = useState<string | null>();
  const priorityOptions = ["high", "medium", "low"];
  const statusOptions = ["CANCELED", "ACTIVE", "FINISHED", "INACTIVE", "DRAFT"];
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

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

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const {
    rootBusiness,
    businesses,
    isLoading: loadingBusiness,
  } = useBusinesses();
  const [selectedCompany, setSelectedCompany] = useState<Business | null>(
    rootBusiness,
  );
  const { data } = usePositionConfigurations({
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

  console.log("[Debug]", {
    rootBusiness,
    localUser,
    params: Boolean(rootBusiness?._id && localUser?._id),
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
    console.log(
      "%c[Debug] ",
      "background-color: teal; font-size: 20px; color: white",
      selectedCompany,
    );
    console.log("/position/list response", positions);
  }, [positions, selectedCompany]);

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

      const statusMatch =
        !statusFilter ||
        position.status
          ?.toLowerCase()
          .includes(statusFilter.toLocaleLowerCase());

      const dateMatch =
        !dateCutoff || new Date(position.created_at) >= dateCutoff;

      const isMatch = searchMatch && priorityMatch && statusMatch && dateMatch;

      return isMatch;
    });
    return filtered;
  }, [searchTerm, priorityFilter, positions, statusFilter, dateFilter]);

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

  const onUpdateState = async (
    position: HiringPositionData,
    status: UpdatePositionStatusData["status"],
  ) => {
    try {
      if (!localUser) return;
      startTransition(async () => {
        const updatePositionResponse = await actions.updatePositionStatus({
          status,
          positionId: position._id,
          userId: localUser?._id,
        });
        console.log("updatePositionResponse", updatePositionResponse);
        if (updatePositionResponse.success) {
          queryClient.invalidateQueries({
            queryKey: QUERIES.POSITION_LIST(rootBusiness?._id, localUser?._id),
          });
        }
      });
    } catch (error: unknown) {
      console.error("Error@onUpdateState", error);
    }
  };

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

  const handleStatusChange = (value: string) => {
    setStatusFilter((prev) => (prev === value ? null : value));
  };

  const handleDateChange = (value: number) => {
    setDateFilter((prev) => (prev === value ? null : value));
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
            {formatDate(rootBusiness?.created_at)}
          </Text>
          <div className="mt-4 flex items-center gap-4">
            <span>
              {i18n.activePositions} <Badge>{positions.length}</Badge>
            </span>
            <span>
              <Notifications label={i18n.notifications} />
            </span>
          </div>
        </div>
        <Link href={`companies/${selectedCompany?._id}/positions/create`}>
          <Button variant="ghost" className="flex items-center bg-secondary">
            <Plus /> {i18n.createPosition}
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className="flex h-full w-full flex-col items-center justify-start bg-white"
      >
        <TabsList className="min-w-full justify-start rounded-none border-b-[1px] bg-white">
          <TabsTrigger
            className="rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            value="actives"
          >
            Activas
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            value="drafts"
          >
            En construcción
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
                            {i18n.stateLabel}
                          </h4>
                        </div>

                        {statusOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option}
                              checked={statusFilter === option}
                              onCheckedChange={() => handleStatusChange(option)}
                            />
                            <label
                              htmlFor={option}
                              className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.toLowerCase()}
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
                  <TableHead className="font-bold text-black">
                    {i18n.stakeholdersHeading}
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
                            {i18n.editLabel}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {i18n.duplicateLabel}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              {i18n.changeStateLabel}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={isPending}
                                  onClick={(e) => {
                                    onUpdateState(position, "CANCELED");
                                    e.stopPropagation();
                                  }}
                                >
                                  {i18n.cancelStateLabel}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={isPending}
                                  onClick={(e) => {
                                    onUpdateState(position, "ACTIVE");
                                    e.stopPropagation();
                                  }}
                                >
                                  {i18n.activeStateLabel}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={isPending}
                                  onClick={(e) => {
                                    onUpdateState(position, "FINISHED");
                                    e.stopPropagation();
                                  }}
                                >
                                  {i18n.terminatedStateLabel}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={isPending}
                                  onClick={(e) => {
                                    onUpdateState(position, "INACTIVE");
                                    e.stopPropagation();
                                  }}
                                >
                                  {i18n.inactiveStateLabel}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={isPending}
                                  onClick={(e) => {
                                    onUpdateState(position, "DRAFT");
                                    e.stopPropagation();
                                  }}
                                >
                                  {i18n.draftStateLabel}
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
        </TabsContent>
        <TabsContent value="drafts" className="h-full w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">{i18n.stateLabel}</TableHead>
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
                  {i18n.currentPhaseStatus}
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
              {positionConfigurationList?.map((position) => (
                <TableRow
                  key={position._id}
                  className={cn(
                    "cursor-pointer",
                    positionParam === position._id &&
                      "border-2 border-green-500 bg-green-200",
                  )}
                  onClick={() => {
                    if (
                      position.status === "DRAFT" ||
                      position.status === "IN_PROGRESS"
                    ) {
                      router.push(
                        `companies/${selectedCompany?._id}/positions/${position._id}`,
                      );
                    } else {
                      router.push(
                        `companies/${selectedCompany?._id}/positions/${position._id}/preview`,
                      );
                    }
                  }}
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
                    title={position.phases[0]?.data?.role}
                    className="max-w-[100px] truncate"
                  >
                    {position.phases[0]?.data?.role}
                  </TableCell>
                  <TableCell>
                    {formatDate(new Date(position.created_at).toString())}
                  </TableCell>
                  <TableCell>
                    {
                      position.phases.find(
                        (phase) => phase.status === "IN_PROGRESS",
                      )?.name
                    }
                  </TableCell>

                  <TableCell>
                    {
                      position.phases.find(
                        (phase) => phase.status === "IN_PROGRESS",
                      )?.status
                    }
                  </TableCell>

                  <TableCell>
                    {formatDate(new Date(position.updated_at).toString())}
                  </TableCell>

                  <TableCell>
                    {
                      users.find((user) => user._id === position.user_id)
                        ?.full_name
                    }
                  </TableCell>

                  <TableCell className="flex items-center justify-between gap-4">
                    <Button variant="talentOrange">
                      {i18n.continueEditing}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
