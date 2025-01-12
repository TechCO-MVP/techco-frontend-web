"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { setAuthState } from "@/lib/store/features/auth/auth";

import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";

import { X } from "lucide-react";
export const WalkthroughDialog = ({ closeLabel }: { closeLabel: string }) => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleModalClose = () => {
    dispatch(
      setAuthState({
        ...authState,
        firstSignIn: false,
      }),
    );
  };
  return (
    <Dialog defaultOpen={authState.firstSignIn}>
      <DialogContent
        hideClose
        className="flex min-w-full items-center justify-center border-none bg-transparent shadow-none"
      >
        <DialogHeader>
          <DialogTitle className="hidden">Empty State</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col items-center gap-4 py-4">
          <div className="flex w-full max-w-screen-xl justify-end">
            <DialogClose className="max-w-32" asChild>
              <Button
                onClick={handleModalClose}
                className="!outline-none !ring-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
              >
                <X className="h-3 w-3" />
                {closeLabel}
              </Button>
            </DialogClose>
          </div>
          <video
            poster="/assets/background.jpeg"
            className="max-w-screen-lg rounded-[40px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
