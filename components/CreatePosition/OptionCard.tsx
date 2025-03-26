import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import React, { FC } from "react";

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  selectBtnLabel: string;
}

export const OptionCard: FC<Readonly<OptionCardProps>> = ({
  icon,
  title,
  description,
  details,
  selectBtnLabel,
}) => {
  return (
    <div className="flex min-w-[306px] max-w-[306px] flex-col justify-between gap-5 rounded-md border px-6 py-8">
      <div className="flex w-full items-center justify-center">{icon}</div>
      <Heading level={2} className="text-lg font-semibold leading-5">
        {title}
      </Heading>
      <Text type="p" className="text-sm leading-5 text-muted-foreground">
        {description}
      </Text>
      <Text type="p" className="text-sm leading-5 text-muted-foreground">
        {details}
      </Text>

      <Button className="text-xs">{selectBtnLabel}</Button>
    </div>
  );
};
