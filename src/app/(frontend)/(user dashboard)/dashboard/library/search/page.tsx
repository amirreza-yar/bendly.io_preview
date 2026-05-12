import TemplateCard from "@/components/dashboard/library/template-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  onDeleteTemplate,
  onEditTemplate,
  onFetchTemplates,
} from "../(library page)/page";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Templates } from "@/components/icons";
import LibrarySearchHeader from "@/components/dashboard/library/library-search-header";

export default async function TemplatesSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q ?? "";

  const templates = await onFetchTemplates(query);

  return (
    <div className="h-full gap-2 flex flex-col">
      <div className="flex-1 min-h-0">
        <LibrarySearchHeader query={query} />
        <ScrollArea className="h-full">
          {!templates?.length ? (
            <Empty className="h-fit mt-[5rem]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Templates />
                </EmptyMedia>
                <EmptyTitle>No templates found</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                  Try another keyword or adjust your search
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <p className="text-xs text-muted-foreground pl-4 pb-3">
                Found templates:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 pb-4 px-4 sm:px-6">
                {templates?.map((temp, index) => (
                  <TemplateCard
                    template={temp}
                    key={index}
                    isAppTemplate={false}
                    onEditTemplate={onEditTemplate}
                    onDeleteTemplate={onDeleteTemplate}
                  />
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
