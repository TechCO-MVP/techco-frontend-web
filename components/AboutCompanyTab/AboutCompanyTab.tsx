"use client";
import { useEffect, useState } from "react";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";
import { CompanyDetailsForm } from "../CompanyDetailsForm/CompanyDetailsForm";
import { Business, ListBusinessApiResponse } from "@/types";
import LoadingSkeleton from "./LoadingSkeleton";

type CompaniesTabProps = {
  dictionary: Dictionary;
};
export const AboutCompanyTab: FC<Readonly<CompaniesTabProps>> = ({
  dictionary,
}) => {
  const [companies, setCompanies] = useState<Business[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/business/list");

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: ListBusinessApiResponse = await response.json();

      if (!Array.isArray(data.body)) {
        throw new Error("Unexpected API response format");
      }
      setCompanies(data.body);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch companies:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
  if (loading) return <LoadingSkeleton />;
  return (
    <>
      <CompanyDetailsForm
        rootBusiness={companies?.[0]}
        dictionary={dictionary}
      />
    </>
  );
};
