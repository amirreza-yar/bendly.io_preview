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
} from "../ui/alert-dialog";
import { Logout } from "../icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
  ItemMedia,
} from "../ui/item";
import { ChevronRight } from "lucide-react";

export default function LogoutModal({
  onAction,
}: {
  onAction: () => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();

  const handleRemoveAddress = async () => {
    const res = await onAction();

    if (res.ok) {
      toast("Signed out ");
      router.replace("/auth");
    } else {
      toast("Something went wrong");
    }
    router.refresh();
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Item className="py-3 px-5 text-destructive hover:bg-destructive-subtle/30 cursor-pointer bg-destructive/8 mt-2">
            <ItemMedia className="p-0">
              <Logout className="size-6" />
            </ItemMedia>
            <ItemContent className="p-0">
              <ItemHeader>Log out</ItemHeader>
            </ItemContent>
            <ItemActions>
              <ChevronRight />
            </ItemActions>
          </Item>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sure about logging out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want ti sign out? You&apos;ll need to log in
              again to access your account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRemoveAddress}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
