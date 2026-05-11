"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Orders } from "../icons";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";

export default function CartNoFlashings({
  onDiscardCart,
}: {
  onDiscardCart: () => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();

  const handleDiscardCart = async () => {
    const res = await onDiscardCart();

    if (res.ok) {
      toast("Cart discarded");
      router.replace("/dashboard");
    } else {
      toast("Something went wrong");
    }
  };

  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Orders />
        </EmptyMedia>
        <EmptyTitle>No Flashings</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          There are no drawings for this order
        </EmptyDescription>
        <div className="flex flex-col gap-3 pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                Add New Flashing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Flashing</DialogTitle>

              <DialogDescription>
                Choose whether you want to import flashing from templates or
                create a new one
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard/library?return=cart">
                      Add from Library
                    </Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button size="lg" asChild>
                    <a href="/canvas?return=cart">Create new Flashing</a>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleDiscardCart}>
            Go Home
          </Button>
        </div>
      </EmptyHeader>
    </Empty>
  );
}
