import React, { FC } from "react";
import { Text } from "../Typography/Text";
import { parseComment } from "@/lib/utils";
import { HiringResponsibleUser } from "@/types";

interface PhaseCommentProps {
  date: string;
  comment: string;
  phaseLabel: string;
  stakeHolders?: HiringResponsibleUser[];
}

const PhaseComment: FC<Readonly<PhaseCommentProps>> = ({
  date,
  comment,
  phaseLabel,
  stakeHolders,
}) => {
  const { author, phaseName, comment: text } = parseComment(comment);

  function convertToFormattedDisplay(text: string) {
    const parts = text.split(/(\{\{user:[a-fA-F0-9]{24}\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{user:([a-fA-F0-9]{24})\}\}/);
      if (match) {
        const userId = match[1];

        const user = stakeHolders?.find((u) => u.user_id.toString() === userId);
        if (user) {
          return (
            <span
              key={index}
              className="cursor-pointer font-bold text-blue-600"
            >
              @{user.user_name}
            </span>
          );
        }
      }
      return part;
    });
  }
  return (
    <div className="flex flex-col gap-1">
      <Text className="text-sm font-bold text-foreground">{author}</Text>
      <Text className="text-xs text-[#999999]">
        {date} ~ {phaseLabel}: {phaseName}
      </Text>
      <Text type="p" className="text-sm text-muted-foreground">
        {convertToFormattedDisplay(text)}
      </Text>
    </div>
  );
};

export default PhaseComment;
