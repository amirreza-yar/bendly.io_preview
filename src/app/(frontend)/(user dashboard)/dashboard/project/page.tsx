"use client";
import { Tabs, TabsContent } from "@/components/ui/custom-tabs";
import BottomNav from "@/components/dashboard/bottom-nav";
import { fetcher } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  MapMarker,
  Search,
} from "@/components/icons";
import { useRef, useState } from "react";
import { cn } from "@/utilities/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, X } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import { SquareLoader } from "@/components/ui/loader";
import { useDebounce } from "use-debounce";

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

type Address = {
  id?: number;
  title: string;
  street_address: string;
  suburb: string;
  state: string;
  postcode: number;
  recipient_name: string;
  recipient_phone: number;
  full_address: string;
  distance_to_factory?: number;
};

type Project = {
  id: number;
  code: number;
  project_name: string;
  addresses: Address[];
};

const ProjectsContent = ({
  projects,
  isLoadingMore,
  loadMore,
  className,
}: {
  projects: Project[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  className?: string;
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
        ref={ref}
        onScroll={handleScroll}
        className={cn("w-full overflow-y-auto px-4", className)}
      >
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
          {projects?.map((proj) => (
            <div
              // href={`/dashboard/j/${proj.id}`}
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
                <Link href="">
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
              <div className="space-y-1 text-label">
                <p>JR-{proj.code}</p>
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
                        <p className="text-caption font-normal truncate">
                          {proj.addresses[0].full_address}
                        </p>
                      </div>
                    </div>
                    {proj.addresses?.[1] ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-label-sm">Other Address:</p>
                          <span className="text-caption rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                            {proj.addresses?.[1].title}
                          </span>
                          {proj.addresses?.length > 2 && (
                            <span className="text-caption rounded-full border px-2.5 py-1 bg-secondary text-secondary-foreground">
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
                      <p className="text-label">Associated addresses deleted</p>
                      <p className="text-body-sm">
                        Add an address to continue or delete this Job Reference.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {isLoadingMore && (
          <div className="col-span-2 flex justify-center pb-4 pt-8">
            <SquareLoader />
          </div>
        )}
      </div>
      <div
        className={`pointer-events-none absolute top-0 left-0 h-4 w-full
                              bg-gradient-to-b from-gray-400/50 to-transparent 
                              transition-opacity duration-200
                              ${showShadow ? "opacity-100" : "opacity-0"}`}
      />
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
        className="w-full h-[calc(100vh-215px)] overflow-y-auto px-4"
      >
        <div className="grid grid-cols-2 gap-2">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="flex flex-col gap-1.5 justify-center rounded-md p-2 pt-1 border"
            >
              <div className="h-21  border-b" />
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

  const [tabValue, setTabValue] = useState("all-projects");
  const [searchVal, setSearchVal] = useState<string>("");

  const [debouncedSearch] = useDebounce(searchVal, 400);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.next) return null;

    const base = `/a/job-ref?page=${pageIndex + 1}`;

    if (debouncedSearch) {
      return `${base}&search=${encodeURIComponent(debouncedSearch)}`;
    }

    return base;
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
  );

  const projects = data ? data.flatMap((page) => page.results) : [];

  const hasMore = data ? !!data[data.length - 1]?.next : true;

  const isLoadingMore = isValidating && size > 0;

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      setSize(size + 1);
    }
  };

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-1 w-full text-primary-foreground">
          {tabValue === "search-projects" ? (
            <div className="flex items-center h-13 pl-1 pr-4 data-[showsearch=false]:hidden transition-all">
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-transparent hover:text-primary-light"
                onClick={() => setTabValue("all-projects")}
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
              <h6>Projects</h6>
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-transparent hover:text-primary-light mr-5"
                onClick={() => setTabValue("search-projects")}
              >
                <Search />
              </Button>
            </div>
          )}
        </div>
        <UILayoutContentWrapper className="top-0 mt-15 pb-20 fixed">
          <UILayoutContent className="py-4 flex flex-col px-0">
            {isLoading ? (
              <div className="space-y-2 px-4 animate-pulse">
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
              <Tabs value={tabValue} onValueChange={setTabValue}>
                <TabsContent value="all-projects">
                  <div className="flex items-center justify-between pb-3 px-4">
                    <p className="text-label-sm">Associated Addresses</p>
                    <Button
                      className=" border-border"
                      variant="outline"
                      size="xs"
                    >
                      <Plus />
                      Add new address
                    </Button>
                  </div>
                  <div className="relative">
                    <ProjectsContent
                      projects={projects}
                      hasMore={hasMore}
                      isLoadingMore={isLoadingMore}
                      loadMore={loadMore}
                      className="h-[calc(100vh-205px)]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="search-projects" className="relative pt-1">
                  <p className="text-label-sm pl-4 pb-3 text-gray-darkest">
                    Search results
                  </p>
                  <div className="relative">
                    <ProjectsContent
                      projects={projects}
                      hasMore={hasMore}
                      isLoadingMore={isLoadingMore}
                      loadMore={loadMore}
                      className="h-[calc(100vh-175px)]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>

      <BottomNav />
    </>
  );
}
