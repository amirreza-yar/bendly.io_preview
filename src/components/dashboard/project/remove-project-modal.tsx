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
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This project will be permanently deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRemoveProject}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
