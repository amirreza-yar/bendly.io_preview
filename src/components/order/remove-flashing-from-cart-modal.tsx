"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Remove } from "../icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeleteFlashingFromCartModal = ({
  flashingId,
  deleteFlashing,
}: {
  flashingId: string | number;
  deleteFlashing: (flashingId: string | number) => Promise<{
    ok: boolean;
  }>;
}) => {
  const router = useRouter();

  const handleDeleteFlashing = async () => {
    const res = await deleteFlashing(flashingId);

    if (res.ok) {
      toast("Flashing was removed from order");
      router.refresh();
    } else {
      toast("Something went wrong");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          Delete
          <Remove />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete Flashing?</AlertDialogTitle>

        <AlertDialogDescription>
          Are you sure you want to delete this Flashing This action cannot be
          undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction variant="outline">No</AlertDialogAction>

          <AlertDialogCancel
            variant="destructive"
            onClick={handleDeleteFlashing}
          >
            Yes
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
