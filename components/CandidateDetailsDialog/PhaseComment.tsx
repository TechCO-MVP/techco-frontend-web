import React, { FC } from "react";
import { Text } from "../Typography/Text";
import { parseComment } from "@/lib/utils";
import { HiringProcessData } from "@/types";

interface PhaseCommentProps {
  date: string;
  phase: string;
  comment: string;
  hiringProcess: HiringProcessData | null;
}

const PhaseComment: FC<Readonly<PhaseCommentProps>> = ({
  date,
  phase,
  comment,
  hiringProcess,
}) => {
  const { author, comment: text } = parseComment(comment);

  function convertToFormattedDisplay(text: string) {
    if (!hiringProcess) return null;
    const stakeholders = hiringProcess?.stakeholders;
    const allUsers = [
      ...stakeholders,
      {
        stakeholder_name: hiringProcess.owner_name,
        stakeholder_id: hiringProcess.owner_id,
      },
      {
        stakeholder_name: hiringProcess.recruiter_name,
        stakeholder_id: hiringProcess.recruiter_id,
      },
    ];

    const parts = text.split(/(\{\{user:[a-fA-F0-9]{24}\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{user:([a-fA-F0-9]{24})\}\}/);
      if (match) {
        const userId = match[1];
        const user = allUsers?.find(
          (u) => u.stakeholder_id.toString() === userId,
        );
        if (user) {
          return (
            <span
              key={index}
              className="cursor-pointer font-bold text-blue-600"
            >
              @{user.stakeholder_name}
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
        {date} ~ Fase: {phase}
      </Text>
      <Text type="p" className="text-sm text-muted-foreground">
        {convertToFormattedDisplay(text)}
      </Text>
    </div>
  );
};

export default PhaseComment;
