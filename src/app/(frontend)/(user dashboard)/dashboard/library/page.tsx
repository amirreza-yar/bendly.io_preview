"use client";
import { Tabs, TabsContent } from "@/components/uikit/tabs";
import { LibraryTemplateItem } from "@/components/dashboard/library/libraryTemplateItem";
import BottomNav from "@/components/dashboard/bottomNav";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import FlashingSVG from "@/components/utils/flashingSVG";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import { upsertPartialFlashing } from "@/lib/db/helpers/flashingHelpers";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  // Load templates from IndexedDB (offline-first)
  const { data: myTemplates, mutate: mutateTemplates } = useSWR(
    "/a/template/",
    fetcher
  );

  const router = useRouter();

  const onTemplateEditName = async (data: { id: number; name: string }) => {
    try {
      await api.patch(`/a/template/${data.id}/`, {
        name: data.name,
      });
      mutateTemplates();
    } catch (err: any) {
      toast("Something went wrong");
    }
  };

  const onTemplateDelete = async (id: number) => {
    try {
      await api.delete(`/a/template/${id}/`);
      mutateTemplates();
    } catch (err: any) {
      toast("Something went wrong");
    }
  };

  const onTemplateClick = async (id: number) => {
    try {
      const template = myTemplates?.results?.find(
        (temp: any) => temp.id === id
      );

      await upsertPartialFlashing("1", {
        nodes: template.nodes,
        crushFoldDir: template.color_side_dir,
        startCrushFold: template.start_crush_fold,
        endCrushFold: template.end_crush_fold,
      });

      router.replace("/f/material");
      toast("Flashing loaded from template");
    } catch (err: any) {
      toast("Something went wrong");
    }
  };

  return (
    <>
      <Header title="Library" returnHref="/dashboard">
        {/* <Link href="/dashboard/library/search">
          <Magnifier />
        </Link> */}
      </Header>
      <div className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4">
        <ContentWrapper className="no-scrollbar pt-14">
          <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pt-4">
            <Tabs defaultValue="my-templates">
              {/* <TabsList className="sticky top-4 bg-white z-20 w-full md:w-auto">
                <TabsTrigger value="my-templates">My Templates</TabsTrigger>
                <TabsTrigger value="app-templates">App Templates</TabsTrigger>
              </TabsList> */}

              <TabsContent value="my-templates">
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
              </TabsContent>

              {/* <TabsContent value="app-templates">
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
              </TabsContent> */}
            </Tabs>
          </div>
        </ContentWrapper>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
      \
      <div className="md:max-w-[1000px] md:mx-auto">
        <div className="hidden md:block">
          <BottomNav />
        </div>
      </div>
    </>
  );
}
