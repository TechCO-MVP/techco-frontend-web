"use client";
import { useBusinesses } from "@/hooks/use-businesses";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";
import { CompanyDetailsForm } from "../CompanyDetailsForm/CompanyDetailsForm";
import LoadingSkeleton from "./LoadingSkeleton";

type CompaniesTabProps = {
  dictionary: Dictionary;
};
export const AboutCompanyTab: FC<Readonly<CompaniesTabProps>> = ({
  dictionary,
}) => {
  const { rootBusiness, isLoading } = useBusinesses();

  if (isLoading) return <LoadingSkeleton />;
  return (
    <>
      {rootBusiness ? (
        <CompanyDetailsForm
          rootBusiness={rootBusiness}
          dictionary={dictionary}
        />
      ) : null}
    </>
  );
};
