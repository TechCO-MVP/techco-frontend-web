import { useState, useMemo } from "react";
import { BoardState, PipefyFieldValues } from "@/types/pipefy";

export function useBoardFilters(board?: BoardState) {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchFilter, setMatchFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

  const handleMatchChange = (value: string) => {
    setMatchFilter((prev) => (prev === value ? null : value));
  };

  const handleSourceChange = (value: string) => {
    setSourceFilter((prev) => (prev === value ? null : value));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter((prev) => (prev === value ? null : value));
  };

  const toggleQuickFilter = (value: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const clearQuickFilters = () => setActiveQuickFilters([]);
  const phases = board?.pipe.phases ?? [];

  const quickFilterMap: Record<string, string[]> = {
    "Revisión inicial": ["Inbox", "Doing"],
    "Primer entrevista": ["Done", "Prueba", "Final Interview"],
    "Habilidades blandas": ["No está interesado"],
  };

  const activePhaseNames = activeQuickFilters.length
    ? activeQuickFilters.flatMap((filter) => quickFilterMap[filter] || [])
    : [];

  const quickFilterCounts = useMemo(() => {
    if (!board) return {};

    const counts: Record<string, number> = {};

    Object.entries(quickFilterMap).forEach(([label, phaseNames]) => {
      let count = 0;

      board.pipe.phases.forEach((phase) => {
        if (!phaseNames.includes(phase.name)) return;

        phase.cards.nodes.forEach((node) => {
          const fieldMap = Object.fromEntries(
            node.fields.map((field) => [field.indexName, field.value]),
          );

          const matchesSearch =
            !searchTerm ||
            String(fieldMap[PipefyFieldValues.CandidateName] || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          const matchesMatch =
            !matchFilter ||
            String(
              fieldMap[PipefyFieldValues.RoleAlignment] || "",
            ).toLowerCase() === matchFilter.toLowerCase();

          const matchesSource =
            !sourceFilter ||
            String(
              fieldMap[PipefyFieldValues.CandidateSource] || "",
            ).toLowerCase() === sourceFilter.toLowerCase();

          const matchesStatus =
            !statusFilter ||
            String(
              fieldMap[PipefyFieldValues.CandidateStatus] || "",
            ).toLowerCase() === statusFilter.toLowerCase();

          if (matchesSearch && matchesMatch && matchesSource && matchesStatus) {
            count += 1;
          }
        });
      });

      counts[label] = count;
    });

    return counts;
  }, [board, searchTerm, matchFilter, sourceFilter, statusFilter]);

  const { filteredBoard, resultCount } = useMemo(() => {
    let count = 0;

    const filtered = phases
      .filter((phase) => {
        return (
          !activePhaseNames.length || activePhaseNames.includes(phase.name)
        );
      })
      .map((column) => {
        const filteredNodes = column.cards.nodes.filter((node) => {
          const fieldMap = Object.fromEntries(
            node.fields.map((field) => [field.indexName, field.value]),
          );

          const matchesSearch =
            !searchTerm ||
            String(fieldMap[PipefyFieldValues.CandidateName] || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          const matchesMatch =
            !matchFilter ||
            String(
              fieldMap[PipefyFieldValues.RoleAlignment] || "",
            ).toLowerCase() === matchFilter.toLowerCase();

          const matchesSource =
            !sourceFilter ||
            String(
              fieldMap[PipefyFieldValues.CandidateSource] || "",
            ).toLowerCase() === sourceFilter.toLowerCase();

          const matchesStatus =
            !statusFilter ||
            String(
              fieldMap[PipefyFieldValues.CandidateStatus] || "",
            ).toLowerCase() === statusFilter.toLowerCase();

          const isMatch =
            matchesSearch && matchesMatch && matchesSource && matchesStatus;

          if (isMatch) count += 1;

          return isMatch;
        });

        return {
          ...column,
          cards: {
            ...column.cards,
            nodes: filteredNodes,
          },
        };
      });

    return { filteredBoard: filtered, resultCount: count };
  }, [
    searchTerm,
    board,
    matchFilter,
    sourceFilter,
    statusFilter,
    activeQuickFilters,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    matchFilter,
    sourceFilter,
    statusFilter,
    handleMatchChange,
    handleSourceChange,
    handleStatusChange,
    activeQuickFilters,
    toggleQuickFilter,
    filteredBoard,
    resultCount,
    quickFilterCounts,
    clearQuickFilters,
  };
}
