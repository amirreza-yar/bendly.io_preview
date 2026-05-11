"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Edit,
  LibraryNav,
  MapMarker,
  Plus,
  User,
} from "@/components/icons";
import { cn } from "@/utilities/ui";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { JobRef } from "./fulfillment-form";
import { UseFormReturn } from "react-hook-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent } from "../ui/tabs";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GalleryVerticalEnd } from "lucide-react";

const AddressEmptyStateComp = ({
  activePrjId,
  setTabVal,
}: {
  activePrjId: number | string;
  setTabVal: Dispatch<SetStateAction<string>>;
}) => (
  <Empty className="h-full -mt-20">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <GalleryVerticalEnd />
      </EmptyMedia>
      <EmptyTitle>No Addresses</EmptyTitle>
      <EmptyDescription className="max-w-xs text-pretty">
        There are no addresses for this project. Try creating new address or
        return and choose another project
      </EmptyDescription>
    </EmptyHeader>

    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={() => setTabVal("projects")}>
        <ArrowLeft />
        Return
      </Button>
      <Button asChild>
        <Link
          href={`/dashboard/project/${activePrjId}/new-address?next=cart&return=cart`}
        >
          <Plus />
          Add New Address
        </Link>
      </Button>
    </div>
  </Empty>
);

export default function FulFillmentJobRefDrawer({
  jobRefs,
  jobRefDrawerOpen,
  setJobRefDrawerOpen,
  selectedJobRefId,
  selectedAddressId,
  fulfillmentForm,
}: {
  jobRefs: JobRef[];
  selectedJobRefId: string;
  selectedAddressId: string;
  jobRefDrawerOpen: boolean;
  setJobRefDrawerOpen: Dispatch<SetStateAction<boolean>>;
  fulfillmentForm: UseFormReturn<
    {
      job_reference_id: string;
      address_id: string;
      delivery_date: string;
      delivery_type: "delivery" | "pickup";
    },
    any,
    {
      job_reference_id: string;
      address_id: string;
      delivery_date: string;
      delivery_type: "delivery" | "pickup";
    }
  >;
}) {
  const [tabVal, setTabVal] = useState("projects");

  const [activeJobRefId, setActiveJobRefId] = useState<number>();

  const activeJobRef = jobRefs.find((j) => j.id === activeJobRefId);

  const [localSelectedPrjAddr, setLocalSelectedPrjAddr] = useState<{
    project: number | string;
    address: number | string;
  }>({
    project: selectedJobRefId,
    address: selectedAddressId,
  });

  return (
    <Drawer
      open={jobRefDrawerOpen}
      onOpenChange={setJobRefDrawerOpen}
      // snapPoints={snapPoints}
      // activeSnapPoint={jobReferenceDrawerSnap}
      // setActiveSnapPoint={setJobReferenceDrawerSnap}
      // snapToSequentialPoint
    >
      <Tabs value={tabVal} onValueChange={setTabVal}>
        <DrawerContent data-testid="content" className="h-full max-h-[97%]">
          <TabsContent value="projects" className="h-full">
            <div className="space-y-1 py-6 px-8">
              <div className="-mt-2 bg-secondary mx-auto h-1.5 w-[100px] rounded-full bg-muted mx-auto shrink-0" />
              <div className="flex items-center gap-2 pt-4">
                <LibraryNav />
                <DrawerTitle className="text-xl">Projects List</DrawerTitle>
              </div>
              <DrawerDescription className="text-sm">
                Select a project to continue
              </DrawerDescription>
            </div>
            <ScrollArea className="h-full">
              <div className="grid gap-4 px-6 pb-34">
                {jobRefs?.map((proj) => (
                  <div
                    key={proj.code}
                    data-slot="card"
                    className={cn(
                      "space-y-4 rounded-xl border py-3 px-4 relative",
                      localSelectedPrjAddr?.project === proj.id &&
                        "border-green-600 bg-green-50/50",
                    )}
                    onClick={() => {
                      setActiveJobRefId(proj.id);
                      setTabVal("addresses");
                    }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-lg"
                      className="absolute right-2"
                    >
                      <ChevronRight className="size-5" />
                    </Button>
                    <div className="space-y-1 text-label">
                      <p className="font-semibold text-base">PRJ-{proj.code}</p>
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
          </TabsContent>

          <TabsContent value="addresses" className="h-full relative">
            <div className="space-y-1 py-6 px-8">
              <div className="-mt-2 bg-secondary mx-auto h-1.5 w-[100px] rounded-full bg-muted mx-auto shrink-0" />

              <DrawerTitle className="text-xl">
                PRJ-{activeJobRef?.code}
              </DrawerTitle>

              <DrawerDescription className="text-sm">
                Select the project&apos;s address or add a new one
              </DrawerDescription>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  size="xs"
                  className="self-end"
                  asChild
                >
                  <Link
                    href={`/dashboard/project/${activeJobRef?.id}/new-address?next=cart&return=cart`}
                  >
                    <Plus />
                    Add new address
                  </Link>
                </Button>
              </div>
            </div>
            {(activeJobRef?.addresses.length ?? 0) > 0 ? (
              <ScrollArea className="h-full">
                <div className="grid gap-4 px-6 pb-68">
                  {activeJobRef?.addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      data-slot="card"
                      className={cn(
                        "rounded-xl border py-4 px-5 relative animate-all",
                        localSelectedPrjAddr?.address === addr.id &&
                          "border-green-600 bg-green-50/50",
                      )}
                      onClick={() =>
                        setLocalSelectedPrjAddr({
                          project: activeJobRef.id,
                          address: addr.id,
                        })
                      }
                    >
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        className="absolute right-2 bottom-0 z-10"
                        asChild
                      >
                        <Link
                          href={`/dashboard/project/${activeJobRef.id}/${addr.id}?next=cart&return=cart`}
                        >
                          <Edit className="size-5" />
                        </Link>
                      </Button>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <MapMarker className="size-5 mt-1" />
                          <div className="space-y-1">
                            <p className="text-base font-semibold">
                              {addr.title}
                            </p>
                            <p className="text-caption font-normal line-clamp-1">
                              {addr.full_address}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <User className="size-5 mt-1" />
                          <div className="space-y-1">
                            <p className="text-base">
                              {addr.recipient_name} {addr.recipient_phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <AddressEmptyStateComp
                setTabVal={setTabVal}
                activePrjId={activeJobRef?.id ?? ""}
              />
            )}
            {(activeJobRef?.addresses.length ?? 0) > 0 && (
              <div className="absolute bottom-0 w-full px-10 py-4 bg-background shadow-md grid grid-cols-2 gap-2">
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setTabVal("projects")}
                >
                  Return
                </Button>
                <DrawerClose asChild>
                  <Button
                    size="lg"
                    onClick={() => {
                      fulfillmentForm.setValue(
                        "job_reference_id",
                        String(localSelectedPrjAddr?.project),
                      );
                      fulfillmentForm.setValue(
                        "address_id",
                        String(localSelectedPrjAddr?.address),
                      );
                    }}
                  >
                    Select Address
                  </Button>
                </DrawerClose>
              </div>
            )}
          </TabsContent>
        </DrawerContent>
      </Tabs>
    </Drawer>
  );
}
