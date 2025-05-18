"use client";
import { FC, FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../Typography/Text";
import { useCreateComment } from "@/hooks/use-create-comment";
import { QUERIES } from "@/constants/queries";
import { useQueryClient } from "@tanstack/react-query";
import { PipefyNode } from "@/types/pipefy";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { PopoverAnchor } from "@radix-ui/react-popover";
import {
  HiringPositionData,
  HiringResponsibleUser,
  NotificationType,
} from "@/types";
import { useCreateNotification } from "@/hooks/use-create-notification";
interface CommentBoxProps {
  pipeId: string;
  card: PipefyNode;
  stakeHolders?: HiringResponsibleUser[];
  position?: HiringPositionData;
}

export const CommentBox: FC<CommentBoxProps> = ({
  card,
  stakeHolders,
  pipeId,
  position,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastKeyRef = useRef("");
  const [showUsers, setShowUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const { mutate: createNotification } = useCreateNotification({
    onSuccess: () => {
      console.log(
        "%c[Debug] sucess",
        "background-color: teal; font-size: 20px; color: white",
      );
    },
    onError: () => {
      console.log(
        "%c[Debug] error",
        "background-color: teal; font-size: 20px; color: white",
      );
    },
  });
  const { mutate: addComment } = useCreateComment({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: QUERIES.PIPE_DATA(pipeId),
      });
      if (!editorRef.current) return;
      const comment = editorRef.current?.textContent || "";
      const mentionedUsers = extractMentionedUserIds(comment);
      const hiringProcess = position?.hiring_processes.find(
        (process) => process.card_id === card.id,
      );
      if (hiringProcess && mentionedUsers.length > 0) {
        createNotification({
          phase_id: hiringProcess.phase_id,
          message: "Mencionado en un comentation",
          notification_type: NotificationType.TAGGED_IN_COMMENT,
          user_id: mentionedUsers,
          business_id: hiringProcess?.business_id,
          hiring_process_id: hiringProcess?._id,
        });
      }

      editorRef.current.textContent = "";
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  function convertToStorageFormat(text: string) {
    if (!stakeHolders?.length) return text;
    return text.replace(/@([\w-]+(?:\s[\w-]+)?)/g, (match, name) => {
      const user = stakeHolders.find((u) => u.user_name === name);
      return user ? `{{user:${user.user_id}}}` : match;
    });
  }

  function extractMentionedUserIds(text: string): string[] {
    if (!stakeHolders?.length) return [];

    const mentions = text.match(/@([\w-]+(?:\s[\w-]+)?)/g);
    if (!mentions) return [];

    const mentionedUserIds = mentions
      .map((mention) => mention.slice(1)) // remove '@'
      .map((name) => stakeHolders.find((u) => u.user_name === name)?.user_id)
      .filter((id): id is string => Boolean(id)); // filter out undefined

    return [...new Set(mentionedUserIds)]; // dedupe
  }
  const handleAddComment = () => {
    const comment = editorRef.current?.textContent || "";
    const text = convertToStorageFormat(comment);
    addComment({
      cardId: card.id,
      text: `${text} [{${currentUser?.name}}] {{phase:${card.current_phase.name}}}`,
    });
  };

  const onUserSelect = (user: HiringResponsibleUser) => {
    setShowUsers(false);
    setSearchQuery("");
    const mention = document.createElement("span");
    mention.textContent = `${user.user_name}`;
    mention.classList.add("font-bold", "text-blue-600");
    mention.contentEditable = "false";
    mention.classList.add("mention");
    if (!editorRef.current) return;
    editorRef.current.appendChild(mention);
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(editorRef.current, editorRef.current.childNodes.length);
    range.collapse(true);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    editorRef.current.focus();
    setCanSubmit(true);
  };

  return (
    <div className="relative flex flex-col gap-4">
      <Popover open={showUsers} onOpenChange={setShowUsers}>
        <PopoverAnchor></PopoverAnchor>
        <div
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            const { key } = event;
            lastKeyRef.current = key;
          }}
          ref={editorRef}
          className="relative h-24 w-full overflow-auto rounded-md border border-gray-300 p-2 focus:outline-none"
          onInput={(event: FormEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement;
            const text = target.innerText.replace(/\u00A0/g, " ");

            setCanSubmit(text.length > 1);
            if (!stakeHolders?.length) return;
            const words = text.match(/(?:^|\s)(@\S*)$/);
            const lastWord = words ? words[1] : "";
            if (lastWord.trim() === "@" && lastKeyRef.current !== "Backspace") {
              return setShowUsers(true);
            }
          }}
          contentEditable
        ></div>

        <PopoverContent className="w-64 p-2">
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {stakeHolders?.map((user) => (
                <CommandItem
                  key={user.user_name}
                  onSelect={() => onUserSelect(user)}
                >
                  @{user.user_name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Text className="text-xs text-muted-foreground">
        Puedes @mencionar a otras personas de la organización.
      </Text>
      <Button
        disabled={!canSubmit}
        onClick={handleAddComment}
        variant="talentGreen"
        className="h-9 place-self-end px-4 py-2"
      >
        Publicar comentario
      </Button>
    </div>
  );
};
