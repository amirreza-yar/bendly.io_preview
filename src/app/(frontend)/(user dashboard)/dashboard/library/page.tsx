import TemplateCard from "@/components/dashboard/library/template-card";
import { Templates } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { Template } from "@/types/api";
import { cookies } from "next/headers";
import Link from "next/link";

const onFetchTemplates: () => Promise<Template[] | []> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/template", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data?.results;
  } catch (error) {
    console.log(error.response.data);
    return [];
  }
};

const onEditTemplate: (
  id: string | number,
  name: string,
) => Promise<{ data?: any; ok: boolean; error?: string }> = async (
  id,
  name,
) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.patch(
      `/a/template/${id}/`,
      { name: name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return { data: res.data, ok: true };
  } catch {
    return { ok: false };
  }
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const isAppTemplate = (await searchParams).type === "app";

  const templates = await onFetchTemplates();

  if (!templates?.length) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Templates />
          </EmptyMedia>
          <EmptyTitle>No Templates Yet</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            Start designing your first flashing.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="h-full gap-2 flex flex-col">
        <div className="px-4 flex justify-center pb-2">
          <div className="w-full sm:w-130 border rounded-md p-1 grid grid-cols-2 gap-1">
            <Button
              size="sm"
              className="text-xs h-8 rounded-md"
              variant={isAppTemplate ? "ghost" : "default"}
              asChild
            >
              <Link href="/dashboard/library">My Templates</Link>
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 rounded-md"
              variant={isAppTemplate ? "default" : "ghost"}
              asChild
            >
              <Link href="/dashboard/library?type=app">App Templates</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 pb-4 px-4 sm:px-6">
              {templates?.map((temp, index) => (
                <TemplateCard
                  template={temp}
                  key={index}
                  isAppTemplate={isAppTemplate}
                  onEditTemplate={onEditTemplate}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
