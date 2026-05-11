import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";

export const AddNewFlashingToCartModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Add New Flashing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Flashing</DialogTitle>

        <DialogDescription>
          Choose whether you want to import flashing from templates or create a
          new one
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
  );
};
