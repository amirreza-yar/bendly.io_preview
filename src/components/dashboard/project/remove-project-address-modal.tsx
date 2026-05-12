"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { Remove } from "../../icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RemoveProjectAddressModal({
  addressId,
  projectId,
  onAction,
}: {
  addressId: string | number;
  projectId: string | number;
  onAction: (
    projectId: string | number,
    addressId: string | number,
  ) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();

  const handleRemoveAddress = async () => {
    const res = await onAction(projectId, addressId);

    if (res.ok) {
      toast("Address removed");
      router.refresh();
    } else {
      toast("Something went wrong");
    }
    router.refresh();
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon-lg">
            <Remove />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
            <AlertDialogDescription>
              This address will be permanently deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRemoveAddress}
            >
              Delete Address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
