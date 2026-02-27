"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import { LibraryTemplateItem } from "@/components/dashboard/library/libraryTemplateItem";
import BottomNav from "@/components/dashboard/bottom-nav";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import FlashingSVG from "@/components/utils/flashingSVG";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import { upsertPartialFlashing } from "@/lib/db/helpers/flashingHelpers";
import { useRouter } from "next/navigation";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/utilities/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { X } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "@/components/ui/spinner";
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
        className="w-full h-[calc(100vh-215px)] overflow-y-auto  px-4"
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

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-1 w-full text-primary-foreground">
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
              <Tabs
                defaultValue="my-templates"
                value={tabValue}
                onValueChange={setTabValue}
              >
                {tabValue !== "search-templates" && (
                  <TabsList className="mx-4">
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
}
