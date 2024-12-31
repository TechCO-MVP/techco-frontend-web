"use client";
import { Dictionary } from "@/types/i18n";
import { FC, useState } from "react";
import { CompanyDetailsForm } from "../CompanyDetailsForm/CompanyDetailsForm";
import { SmilePlusIcon } from "lucide-react";
import { Text } from "../Typography/Text";
import { Heading } from "../Typography/Heading";
import { Button } from "../ui/button";

type CompaniesTabProps = {
  dictionary: Dictionary;
};
export const AboutCompanyTab: FC<Readonly<CompaniesTabProps>> = ({
  dictionary,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { companiesPage: i18n } = dictionary;
  return (
    <>
      {showForm ? (
        <CompanyDetailsForm dictionary={dictionary} />
      ) : (
        <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-4">
          <SmilePlusIcon color="#71717A" width="33px" />
          <Heading
            level={1}
            className="text-center text-xl font-semibold leading-7"
          >
            {i18n.missingInfoTitle}
          </Heading>
          <Text
            size="small"
            type="p"
            className="text-muted-foreground] text-center font-normal"
          >
            {i18n.missingInfoDescription}
          </Text>
          <Button onClick={() => setShowForm(true)}>
            {i18n.enterCompanyInfoButton}
          </Button>
        </div>
      )}
    </>
  );
};
