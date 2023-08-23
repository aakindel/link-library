"use client";

import { Button } from "@/components/Button";
import { useLinkStore } from "./store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { PlusCircleIcon } from "lucide-react";
import LinkForm from "./LinkForm";
import { prefillLinks } from "./data";

export default function AddLinkDialog({
  showAddLinkDialog,
  setShowAddLinkDialog,
}: {
  showAddLinkDialog: boolean;
  setShowAddLinkDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const addedLinks = useLinkStore((state) => state.addedLinks);
  const setAddedLinks = useLinkStore((state) => state.setAddedLinks);

  return (
    <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
      {!addedLinks.length && (
        <DialogTrigger asChild>
          {/* https://stackoverflow.com/questions/39386497/can-i-nest-button-inside-another-button#comment123824472_39386497 */}
          <div className="relative h-72 w-72">
            <button
              className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-white transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900"
              onSelect={() => {
                setShowAddLinkDialog(true);
              }}
            >
              <PlusCircleIcon className="mb-1 h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              <span className="block text-base text-neutral-400 dark:text-neutral-500">
                Add a link
              </span>
            </button>
            <Button
              variant={"outline"}
              className="absolute bottom-0 left-1/2 z-10 mb-5 flex w-48 -translate-x-1/2 items-center justify-center bg-white font-normal text-neutral-400 hover:bg-neutral-50 hover:text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-500"
              onClick={(e) => {
                e.preventDefault();
                setAddedLinks([...prefillLinks]);
              }}
            >
              <span className="block text-sm">(or prefill 5 demo links)</span>
            </Button>
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="w-96 p-3">
        <div className="flex flex-col gap-2.5">
          <LinkForm closeDialog={() => setShowAddLinkDialog(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
