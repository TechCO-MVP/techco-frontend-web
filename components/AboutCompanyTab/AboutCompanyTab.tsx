"use client";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";
import { CompanyDetailsForm } from "../CompanyDetailsForm/CompanyDetailsForm";

type CompaniesTabProps = {
  dictionary: Dictionary;
};
export const AboutCompanyTab: FC<Readonly<CompaniesTabProps>> = ({
  dictionary,
}) => {
  return (
    <>
      <CompanyDetailsForm dictionary={dictionary} />
    </>
  );
};
