"use client";

import { Button } from "@/components/Button";
import { useLinkStore } from "./store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";

export default function DeleteAllLinksDialog({
  showDeleteAllLinksDialog,
  setShowDeleteAllLinksDialog,
}: {
  showDeleteAllLinksDialog: boolean;
  setShowDeleteAllLinksDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const setAddedLinks = useLinkStore((state) => state.setAddedLinks);

  return (
    <AlertDialog
      open={showDeleteAllLinksDialog}
      onOpenChange={setShowDeleteAllLinksDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete all links?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All the links you&apos;ve added will
            no longer be accessible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              setAddedLinks([]);
              setShowDeleteAllLinksDialog(false);
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
