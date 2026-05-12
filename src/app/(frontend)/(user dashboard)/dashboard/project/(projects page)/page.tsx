import {
  AlertTriangle,
  ChevronRight,
  LibraryNav,
  MapMarker,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { Project } from "@/types/api";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const onFetchprojects: (q?: string) => Promise<Project[] | []> = async (q) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(!!q ? `/a/job-ref?search=${q}` : `/a/job-ref`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data?.results;
  } catch {
    return [];
  }
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q ?? "";

  const projects = await onFetchprojects(query);

  if (!projects?.length) {
    return (
      <Empty className="h-full">
        <EmptyContent>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LibraryNav />
            </EmptyMedia>
            <EmptyTitle>
              {!!query ? "No projects found" : "No Projects Yet"}
            </EmptyTitle>
            <EmptyDescription className="max-w-xs text-pretty">
              {!!query
                ? "Try another keyword or adjust your search"
                : "No projects have been created yet"}
            </EmptyDescription>
          </EmptyHeader>
          {!query && (
            <Button>
              <Plus />
              Create New Project
            </Button>
          )}
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="h-full gap-2 flex flex-col">
      <div className="px-4 flex pb-1 justify-between">
        <p className="text-sm">Projects list</p>
        <Button size="sm" className="text-xs h-7" variant="outline" asChild>
          <Link href="/dashboard/project/new">
            <Plus />
            Create new project
          </Link>
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="grid gap-2 md:gap-3 pb-4 px-4 sm:px-6 md:grid-cols-2">
            {projects?.map((proj) => (
              <div
                key={proj.code}
                data-slot="card"
                className="grid gap-4 rounded-md border py-3 px-4 relative"
              >
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="absolute right-0"
                  asChild
                >
                  <Link href={`/dashboard/project/${proj.id}`}>
                    <ChevronRight className="size-5" />
                  </Link>
                </Button>
                <div className="space-y-1 text-label">
                  <p className="font-semibold text-[15px]">PRJ-{proj.code}</p>
                  <p>{proj.project_name}</p>
                </div>
                {(proj.addresses?.length ?? 0) > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <MapMarker className="size-5" />
                        <div className="space-y-1">
                          <p className="text-caption">
                            {proj.addresses?.[0]?.title}
                          </p>
                          <p className="text-caption font-normal line-clamp-1">
                            {proj.addresses[0].full_address}
                          </p>
                        </div>
                      </div>
                      {proj.addresses?.[1] ? (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="text-label-sm">Other Address:</p>
                            <span className="text-xs rounded-[900px] border-1 border-border-default px-2 py-0.5 bg-surface-disable">
                              {proj.addresses?.[1].title}
                            </span>
                            {proj.addresses?.length > 2 && (
                              <span className="text-xs rounded-full border px-2 py-0.5 bg-secondary text-secondary-foreground">
                                +{proj.addresses?.length - 2}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="text-label-sm">Other Address:</p>
                            <span className="text-caption rounded-full border px-2.5 py-1 bg-secondary text-secondary-foreground">
                              ---
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3 items-start text-alert bg-alert-subtle p-3 rounded-md">
                      <AlertTriangle className="size-5 mt-0.5" />
                      <div className="grid">
                        <p className="text-label">
                          Associated addresses deleted
                        </p>
                        <p className="text-body-sm">
                          Add an address to continue or delete this Job
                          Reference.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
