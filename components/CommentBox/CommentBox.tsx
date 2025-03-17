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
import { useHiringProcess } from "@/hooks/use-hiring-process";
import { Stakeholder } from "@/types";
interface CommentBoxProps {
  card: PipefyNode;
}

export const CommentBox: FC<CommentBoxProps> = ({ card }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastKeyRef = useRef("");
  const [showUsers, setShowUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const { hiringProcess, isLoading } = useHiringProcess({
    hiringProcessId: "67c930fe1ad8328f2a3184c2",
  });

  const { mutate: addComment } = useCreateComment({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: QUERIES.PIPE_DATA("305713420"),
      });
      if (!editorRef.current) return;
      editorRef.current.textContent = "";
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  if (isLoading || !hiringProcess) return <div>Loading</div>;
  const { stakeholders } = hiringProcess;
  const allUsers = [
    {
      stakeholder_name: hiringProcess.owner_name,
      stakeholder_id: hiringProcess.owner_id,
    },
    {
      stakeholder_name: hiringProcess.recruiter_name,
      stakeholder_id: hiringProcess.recruiter_id,
    },
    ...stakeholders,
  ];

  const uniqueUsers = [
    ...new Map(allUsers.map((user) => [user.stakeholder_id, user])).values(),
  ];
  function convertToStorageFormat(text: string) {
    return text.replace(/@([\w-]+(?:\s[\w-]+)?)/g, (match, name) => {
      const user = uniqueUsers.find((u) => u.stakeholder_name === name);
      return user ? `{{user:${user.stakeholder_id}}}` : match;
    });
  }
  const handleAddComment = () => {
    const comment = editorRef.current?.textContent || "";
    const text = convertToStorageFormat(comment);
    addComment({
      cardId: card.id,
      text: `${text} [{${currentUser?.name}}]`,
    });
  };

  const onUserSelect = (user: Partial<Stakeholder>) => {
    setShowUsers(false);
    setSearchQuery("");
    const mention = document.createElement("span");
    mention.textContent = `${user.stakeholder_name}`;
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
              {uniqueUsers.map((user) => (
                <CommandItem
                  key={user.stakeholder_id}
                  onSelect={() => onUserSelect(user)}
                >
                  @{user.stakeholder_name}
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
        className="h-9 place-self-end px-4 py-2"
      >
        Publicar comentario
      </Button>
    </div>
  );
};
