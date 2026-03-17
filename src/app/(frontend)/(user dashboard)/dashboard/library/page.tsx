"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import BottomNav from "@/components/dashboard/bottom-nav";
import { fetcher } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "@/components/icons";
import { useRef, useState } from "react";
import { cn } from "@/utilities/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { X } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import { SquareLoader } from "@/components/ui/loader";
import { useDebounce } from "use-debounce";
import FlashingSVG from "@/components/utils/flashingSVG";

function useScrollShadow(threshold = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  const onScroll = () => {
    if (!ref.current) return;
    setShowShadow(ref.current.scrollTop > threshold);
  };

  return { ref, showShadow, onScroll };
}

type Node = {
  node_id: string;
  left: number;
  top: number;
  prev_node_id?: string;
  next_node_id?: string;
};

type Template = {
  id: number;
  name: string;
  start_crush_fold: boolean;
  end_crush_fold: boolean;
  color_side_dir: boolean;
  tapered: boolean;
  nodes: Node[];
};

const TemplateContent = ({
  templates,
  isLoadingMore,
  loadMore,
}: {
  templates: Template[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}) => {
  const { showShadow, ref, onScroll } = useScrollShadow(25);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;

    if (nearBottom) {
      loadMore();
    }

    onScroll();
  };

  return (
    <>
      <div
        className={`pointer-events-none absolute top-0 left-0 h-4 w-full
                              bg-gradient-to-b from-gray-400/50 to-transparent 
                              transition-opacity duration-200
                              ${showShadow ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="w-full h-[calc(100vh-215px)] sm:h-fit overflow-y-auto px-4 sm:px-8"
      >
        {templates?.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {templates?.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-1.5 justify-center rounded-md p-2 pt-1 border"
              >
                <FlashingSVG
                  flashing={template}
                  className="h-20 sm:h-35 pb-1 sm:p-4"
                />
                <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
                  {template.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-175px)] flex flex-col items-center justify-center px-9 text-center">
            <h6 className="text-subtitle">No templates</h6>
            <p className="subtitle-regular text-gray-400 mt-1">
              You have&apos;nt created any templates yet. Start a new design
              first.
            </p>
          </div>
        )}
        {isLoadingMore && (
          <div className="col-span-2 flex justify-center pb-4 pt-8">
            <SquareLoader />
          </div>
        )}
      </div>
    </>
  );
};

const TemplateSearchContent = ({
  templates,
  isLoadingMore,
  loadMore,
}: {
  templates: Template[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}) => {
  const { showShadow, ref, onScroll } = useScrollShadow(25);
  const [searchFilter, setSearchFilter] = useState<
    "all" | "app-templates" | "my-templates"
  >("all");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;

    if (nearBottom) {
      loadMore();
    }

    onScroll();
  };

  if (templates.length === 0) {
    return (
      <div className="h-[calc(100vh-175px)] flex flex-col items-center justify-center px-9 text-center">
        <h6 className="text-subtitle">No templates found</h6>
        <p className="subtitle-regular text-gray-400 mt-1">
          Please check your spelling or try different keywords
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center px-4 gap-2 overflow-y-auto pb-4">
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "transition-[border,background,color]",
            searchFilter === "all"
              ? "bg-primary-lightest"
              : "border-border text-foreground",
          )}
          onClick={() => setSearchFilter("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "transition-[border,background,color]",
            searchFilter === "my-templates"
              ? "bg-primary-lightest"
              : "border-border text-foreground",
          )}
          onClick={() => setSearchFilter("my-templates")}
        >
          My Templates
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "transition-[border,background,color]",
            searchFilter === "app-templates"
              ? "bg-primary-lightest"
              : "border-border text-foreground",
          )}
          onClick={() => setSearchFilter("app-templates")}
        >
          App Templates
        </Button>
      </div>
      <div
        className={`pointer-events-none absolute top-12 left-0 h-4 w-full
                              bg-gradient-to-b from-gray-400/50 to-transparent 
                              transition-opacity duration-200
                              ${showShadow ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="w-full h-[calc(100vh-215px)] sm:h-fit overflow-y-auto px-4"
      >
        <div className="grid grid-cols-2 gap-2">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="flex flex-col gap-1.5 justify-center rounded-md p-2 pt-1 border"
            >
              <FlashingSVG
                flashing={template}
                className="h-20 sm:h-35 pb-1 sm:p-4"
              />
              <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
                {template.name}
              </p>
            </div>
          ))}
        </div>
        {isLoadingMore && (
          <div className="col-span-2 flex justify-center pb-4 pt-8">
            <SquareLoader />
          </div>
        )}
      </div>
    </>
  );
};

export default function LibraryPage() {
  const router = useRouter();

  const [tabValue, setTabValue] = useState("my-templates");
  const [searchVal, setSearchVal] = useState<string>("");

  const [debouncedSearch] = useDebounce(searchVal, 400);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.next) return null;

    const base = `/a/template?page=${pageIndex + 1}`;

    if (debouncedSearch) {
      return `${base}&search=${encodeURIComponent(debouncedSearch)}`;
    }

    return base;
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
  );

  const templates = data ? data.flatMap((page) => page.results) : [];

  const hasMore = data ? !!data[data.length - 1]?.next : true;

  const isLoadingMore = isValidating && size > 0;

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      setSize(size + 1);
    }
  };

  // const onTemplateEditName = async (data: { id: number; name: string }) => {
  //   try {
  //     await api.patch(`/a/template/${data.id}/`, {
  //       name: data.name,
  //     });
  //     mutateTemplates();
  //   } catch (err: any) {
  //     toast("Something went wrong");
  //   }
  // };

  // const onTemplateDelete = async (id: number) => {
  //   try {
  //     await api.delete(`/a/template/${id}/`);
  //     mutateTemplates();
  //   } catch (err: any) {
  //     toast("Something went wrong");
  //   }
  // };

  // const onTemplateClick = async (id: number) => {
  //   try {
  //     const template = myTemplates?.results?.find(
  //       (temp: any) => temp.id === id,
  //     );

  //     await upsertPartialFlashing("1", {
  //       nodes: template.nodes,
  //       crushFoldDir: template.color_side_dir,
  //       startCrushFold: template.start_crush_fold,
  //       endCrushFold: template.end_crush_fold,
  //     });

  //     router.replace("/f/material");
  //     toast("Flashing loaded from template");
  //   } catch (err: any) {
  //     toast("Something went wrong");
  //   }
  // };

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-1 sm:top-3 sm:px-4 w-full text-primary-foreground">
          {tabValue === "search-templates" ? (
            <div className="flex items-center h-13 pl-1 pr-4 data-[showsearch=false]:hidden transition-all">
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-transparent hover:text-primary-light"
                onClick={() => setTabValue("my-templates")}
              >
                <ArrowLeft />
              </Button>
              <InputGroup className="bg-background text-foreground">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="Search tempplate..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />

                <InputGroupButton
                  onClick={() => setSearchVal("")}
                  className={cn(
                    "transition-opacity duration-200",
                    searchVal.length > 0
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none",
                  )}
                >
                  <X />
                </InputGroupButton>
              </InputGroup>
            </div>
          ) : (
            <div className="data-[showheader=false]:hidden transition-all flex items-center justify-between pl-4">
              <h6>Library</h6>
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-transparent hover:text-primary-light mr-5"
                onClick={() => setTabValue("search-templates")}
              >
                <Search />
              </Button>
            </div>
          )}
        </div>
        <UILayoutContentWrapper className="top-0 sm:top-2 mt-15 pb-20 fixed">
          <UILayoutContent className="py-4 sm:py-8 flex flex-col px-0">
            {isLoading ? (
              <div className="space-y-2 px-4 sm:space-y-2 sm:px-4 animate-pulse">
                <div className="grid grid-cols-2 gap-1 p-1 h-10 border rounded-md">
                  <div className="bg-gray-300 rounded rounded-md" />
                  <div className="bg-gray-300 rounded rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1.5 justify-center rounded-md p-2 border"
                    >
                      <div className="h-21 rounded-md bg-gray-300" />
                      <p className="bg-gray-300 h-3 rounded-md"></p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Tabs
                defaultValue="my-templates"
                value={tabValue}
                onValueChange={setTabValue}
              >
                {tabValue !== "search-templates" && (
                  <TabsList className="mx-4 sm:w-100 sm:mx-auto sm:mb-2">
                    <TabsTrigger value="my-templates">My Templates</TabsTrigger>
                    <TabsTrigger value="app-templates">
                      App Templates
                    </TabsTrigger>
                  </TabsList>
                )}
                <TabsContent value="my-templates" className="relative">
                  <TemplateContent
                    templates={templates}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    loadMore={loadMore}
                  />
                </TabsContent>
                <TabsContent value="app-templates" className="relative">
                  {/* <TemplateContent templates={templates} /> */}
                </TabsContent>

                <TabsContent value="search-templates" className="relative pt-1">
                  <TemplateSearchContent
                    templates={templates}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    loadMore={loadMore}
                  />
                </TabsContent>
              </Tabs>
            )}
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>

      <BottomNav />
    </>
  );
  {
    /* <TabsContent value="my-templates">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {myTemplates?.results?.length > 0 ? (
                    myTemplates?.results?.map((template: any) => (
                      <LibraryTemplateItem
                        key={template.id}
                        title={template.name}
                        isMyTemplate={true}
                        templateId={template.id}
                        onTemplateDelete={onTemplateDelete}
                        onTemplateEditName={onTemplateEditName}
                        onTemplateClick={onTemplateClick}
                      >
                        <FlashingSVG flashing={template} className="h-20" />
                      </LibraryTemplateItem>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-subtitle">No templates found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Create your first template to get started
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent> */
    /* <TabsContent value="app-templates">
                          <div className="grid grid-cols-2 pt-2 gap-4">
                            {appTemplates.length > 0 ? (
                              appTemplates.map((template, index) => (
                                <LibraryTemplateItem key={template.name + index} title={template.name}>
                                  <FlashingSVG flashing={template.flashing} className="h-20" />
                                </LibraryTemplateItem>
                              ))
                            ) : (
                              <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-subtitle">No app templates available</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Check back later for new templates
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent> */
  }
}
