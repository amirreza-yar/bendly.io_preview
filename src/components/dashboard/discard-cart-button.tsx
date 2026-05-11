"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
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

export default function DiscardCartButton({
  onDiscard,
}: {
  onDiscard: () => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="outline">
          Discard
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Discard Order?</AlertDialogTitle>
        <AlertDialogDescription>
          Sure about discarding your order? Data will be lost apon discarding
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction
            size="lg"
            variant="destructive"
            onClick={async () => {
              const res = await onDiscard();

              if (res.ok) {
                toast("Cart discarded");
                router.refresh();
              } else {
                toast("Couldn't discard cart");
              }
            }}
          >
            Discard
          </AlertDialogAction>
          <AlertDialogCancel size="lg">Nevermind</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
