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

export default function RemoveProjectModal({
  projectId,
  onAction,
}: {
  projectId: string | number;
  onAction: (projectId: string | number) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();

  const handleRemoveProject = async () => {
    const res = await onAction(projectId);

    if (res.ok) {
      toast("Project removed");
      router.replace("/dashboard/project");
    } else {
      toast("Something went wrong");
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-2 top-2 text-primary-foreground hover:bg-transparent hover:text-primary-light"
          >
            <Remove className="size-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRemoveProject}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
