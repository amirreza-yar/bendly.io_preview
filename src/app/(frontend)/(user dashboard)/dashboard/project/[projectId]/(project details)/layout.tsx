import RemoveProjectModal from "@/components/dashboard/project/remove-project-modal";
import { ArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Project } from "@/types/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

const onFetchProjectDetails: (
  id: string | number,
) => Promise<Project | undefined> = async (id) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(`/a/job-ref/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const onRemoveProject: (
  projectId: string | number,
) => Promise<{ ok: boolean }> = async (projectId) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    await api.delete(`/a/job-ref/${projectId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export default async function ProjectDetailsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  const project = await onFetchProjectDetails(projectId);

  return (
    <>
      <div className="fixed top-0 w-full">
        <div className="flex items-center gap-2 absolute top-2 left-2 text-primary-foreground">
          <Button variant="ghost" size="icon-lg" asChild>
            <Link href="/dashboard/project">
              <ArrowLeft />
            </Link>
          </Button>

          <h6>PRJ - {project?.code}</h6>
        </div>

        <RemoveProjectModal onAction={onRemoveProject} projectId={projectId} />
      </div>
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          {children}
        </div>
      </div>
    </>
  );
}
