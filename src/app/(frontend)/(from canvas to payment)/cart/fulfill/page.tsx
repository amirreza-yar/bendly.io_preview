"use client";

import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/uikit/buttons/button";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import DividerWithText from "@/components/uikit/dividerWithText";
import { Drawer } from "vaul";
import {
  AlertTriangle,
  ChevronRight,
  Delivery,
  Edit,
  FeaturedCheckSmall,
  Magnifier,
  MapMarker,
  Plus,
  ProfileNav,
  WareHouse,
  XIcon,
} from "@/components/uikit/icons";
import { TabsContent } from "@/components/uikit/tabs";
import api, { fetcher } from "@/lib/axios";
import { cn } from "@/utilities/ui";
import { Tabs } from "@radix-ui/react-tabs";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Footer } from "@/components/dashboard/footer";
import { Input } from "@/components/uikit/input";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/uikit/carousel";
import {
  formatPrettyDate,
  getDayAbbrString,
  getDayMonthNumber,
} from "@/utilities/datetime";
import { House } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/uikit/textarea";
import { Separator } from "@/components/uikit/separator";

function generateSequentialDates(date: string): string[] {
  if (!date) return [];

  const first = new Date(date);
  const result = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i);
    result.push(d.toISOString().split("T")[0]);
  }

  return result;
}

export function searchJobReferences(data: any, query: any) {
  const normalizedQuery = query.toLowerCase();

  return data?.filter((job: any) => {
    const valuesToSearch: string[] = [];

    const extractValues = (obj: any) => {
      if (typeof obj === "string" || typeof obj === "number") {
        valuesToSearch.push(String(obj).toLowerCase());
      } else if (Array.isArray(obj)) {
        obj.forEach(extractValues);
      } else if (typeof obj === "object" && obj !== null) {
        Object.values(obj).forEach(extractValues);
      }
    };

    extractValues(job);

    return valuesToSearch.some((value) => value.includes(normalizedQuery));
  });
}

const snapPoints = [0.6, 1];

const fulFillmentFormSchema = z
  .object({
    job_reference_id: z.number("Select a job reference").nullable(),
    address_id: z.number("Select a job reference").nullable(),
    delivery_date: z
      .string("Select a delivery date")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a delivery date"),
    delivery_type: z.enum(["delivery", "pickup"], "Delivery type is required"),
  })
  .refine((data) => data.job_reference_id && data.address_id, {
    message: "Select a job reference",
    path: ["job_reference_id"], // where you want the single error to appear
  });

type FulFillmentFormValue = z.infer<typeof fulFillmentFormSchema>;

export default function FulFillPage({
  searchParams,
}: {
  searchParams: Promise<{ job_ref_id: number; address_id: number }>;
}) {
  const [tabValue, setTabValue] = useState("main-tab");

  const { job_ref_id, address_id } = use(searchParams);

  const [jobReferenceDrawerOpen, setJobReferenceDrawerOpen] =
    useState<boolean>(false);
  const [jobReferenceDrawerSnap, setJobReferenceDrawerSnap] = useState<
    number | string | null
  >(snapPoints[0]);

  const [searchValue, setSearchValue] = useState<string>("");

  const [searchResults, setSearchResults] = useState<any[] | null>();

  const { data: fetched_job_references } = useSWR("/a/job-ref/", fetcher, {
    onSuccess: (data) => {
      setSearchResults(data.results);
    },
  });

  const fulFillmentForm = useForm<FulFillmentFormValue>({
    resolver: zodResolver(fulFillmentFormSchema),
    defaultValues: {
      delivery_type: "delivery",
    },
  });

  useEffect(() => {
    if (!fulFillmentForm) return;
    const err = fulFillmentForm.formState.errors;
    if (err.job_reference_id || err.address_id || err.delivery_date) {
      if (err.address_id || err.job_reference_id) {
        toast(err.job_reference_id?.message);
      }

      if (err.delivery_date) {
        toast(err.delivery_date.message);
      }
    }
  }, [fulFillmentForm.formState]);

  const jobId = useWatch({
    name: "job_reference_id",
    control: fulFillmentForm.control,
  });
  const addressId = useWatch({
    name: "address_id",
    control: fulFillmentForm.control,
  });
  const deliveryType = useWatch({
    name: "delivery_type",
    control: fulFillmentForm.control,
  });
  const deliveryDate = useWatch({
    name: "delivery_date",
    control: fulFillmentForm.control,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  const DELIVERY_DESC = "Open from 9:00 to 18:00";

  const { data: cart, isLoading: isCartLoading } = useSWR("/a/cart/", fetcher, {
    onError: notFound,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (!cart) return;

    if (cart && cart?.address?.id && cart?.delivery_date) {
      fulFillmentForm.setValue("job_reference_id", cart?.job_reference.id);
      fulFillmentForm.setValue("address_id", cart?.address.id);
      fulFillmentForm.setValue("delivery_date", cart?.delivery_date);
      fulFillmentForm.setValue("delivery_type", cart?.delivery_type);
    }

    if (job_ref_id && address_id) {
      fulFillmentForm.setValue("job_reference_id", Number(job_ref_id));
      fulFillmentForm.setValue("address_id", Number(address_id));
    }
  }, [cart, fulFillmentForm, job_ref_id, address_id]);

  // const checkForEstimatedDeliveryDate = async (address_id: number | string) => {
  //   console.log(address_id);
  //   try {
  //     const res = await api.post("/a/cart/estimate-delivery/", {
  //       address_id: address_id,
  //     });

  //     console.log(res.data);
  //   } catch (error: any) {
  //     console.log(error.response.data);
  //   }
  // };

  const router = useRouter();

  // useEffect(() => {
  //   if (jobReference?.address_id) {
  //     checkForEstimatedDeliveryDate(jobReference.address_id);
  //   }
  // }, [jobReference]);

  const onSubmitUpdateCartForm = async (data: FulFillmentFormValue) => {
    try {
      await api.post("/a/cart/update/", {
        address_id: data.address_id,
        delivery_date: data.delivery_date,
        delivery_type: data.delivery_type,
      });
      router.replace("/cart/checkout/");
    } catch (error: any) {
      toast("Something went wrong");
    }
  };

  return (
    <>
      <Tabs className="h-full" value={tabValue} onValueChange={setTabValue}>
        <TabsContent value="main-tab">
          <Header title="Shipping & Delivery" returnHref="/cart" />
          <ContentWrapper className="pt-14 pb-22 px-0 bg-surface-page-body md:px-0">
            <div className="bg-white px-4 pt-4">
              <div className="grid grid-cols-2 text-center rounded-md border-2 p-0.5 md:mx-4 border-gray-300">
                <div
                  className={cn(
                    "rounded-md py-1.5 text-[13px]",
                    deliveryType === "delivery"
                      ? "bg-primary text-white"
                      : "text-body"
                  )}
                  onClick={() =>
                    fulFillmentForm.setValue("delivery_type", "delivery")
                  }
                >
                  Delivery
                </div>
                <div
                  className={cn(
                    "rounded-md py-1.5 text-[13px]",
                    deliveryType === "pickup"
                      ? "bg-primary text-white"
                      : "text-body"
                  )}
                  onClick={() =>
                    fulFillmentForm.setValue("delivery_type", "pickup")
                  }
                >
                  Pickup
                </div>
              </div>

              <div className="flex flex-col pb-2 pt-6 px-2">
                <div className="flex items-center gap-2">
                  <House className="size-5" />
                  <h6>Job Reference</h6>
                </div>
                {fetched_job_references && jobId ? (
                  (() => {
                    const job = fetched_job_references?.results?.find(
                      (j: any) => String(j.id) === String(jobId)
                    );
                    const addr = job?.addresses?.find(
                      (a: any) => String(a.id) === String(addressId)
                    );

                    return (
                      <div className="flex flex-col gap-1">
                        <div
                          data-slot="card"
                          className="flex flex-col gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mt-4"
                        >
                          <IconButton
                            onClick={() => {
                              fulFillmentForm.setValue(
                                "job_reference_id",
                                null
                              );
                              fulFillmentForm.setValue("address_id", null);
                            }}
                            variant="ghost"
                            black
                            className="absolute top-0 right-0"
                          >
                            <XIcon className="size-5" />
                          </IconButton>
                          <div className="flex flex-col gap-1">
                            <p className="text-[16px] font-bold">
                              JR-{job?.code}
                            </p>
                            <p className="text-[14px] font-semibold">
                              {job?.project_name ?? "Not Provided"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <MapMarker className="size-5" />
                            <div className="flex flex-col gap-1 truncate">
                              <>
                                {deliveryType === "delivery" ? (
                                  <>
                                    <p className="label-regular">
                                      {addr?.title}
                                    </p>
                                    <p className="body-small">
                                      {addr?.full_address}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="label-regular">Self Pickup</p>
                                    <p className="body-small">
                                      No Delivery Address
                                    </p>
                                  </>
                                )}
                              </>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <ProfileNav className="size-5" />
                            <div className="truncate">
                              <>
                                <p className="body-small">
                                  {addr?.recipient_name} +
                                  {addr?.recipient_phone}
                                </p>
                              </>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="default"
                          onClick={() => setJobReferenceDrawerOpen(true)}
                          variant="ghost"
                          className="pr-0 self-end w-fit"
                        >
                          Edit or Change
                          <ChevronRight className="size-5" />
                        </Button>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <div className="flex flex-col gap-3 pt-2 pb-4">
                      <p className="subtitle-regular pb-2">
                        Choose an existing job reference or create a new one to
                        organize this order
                      </p>

                      <button
                        onClick={() => setJobReferenceDrawerOpen(true)}
                        className=" flex gap-2 item-center justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Magnifier className="size-5" />
                        View And Search Job Reference
                      </button>
                      <DividerWithText text="OR" />
                      <Link
                        href="/cart/new-job"
                        className=" flex gap-2 item-start justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Plus className="size-5" />
                        Create New Job Reference
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-2 py-6 px-6 bg-white">
              <div className="flex items-center gap-2 pb-2">
                {deliveryType === "delivery" ? (
                  <Delivery className="size-6" />
                ) : (
                  <WareHouse className="size-6" />
                )}
                <h6>Select your {deliveryType} date</h6>
              </div>

              <p className="subtitle-regular">
                Please select your preferred {deliveryType} date
              </p>

              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full pt-4"
              >
                <CarouselContent className="-ml-4 w-screen">
                  {generateSequentialDates(cart?.estimated_delivery_date)?.map(
                    (date, index) => (
                      <CarouselItem
                        key={index}
                        className="last:pr-6 pb-2"
                        onClick={() =>
                          fulFillmentForm.setValue("delivery_date", date)
                        }
                      >
                        <div
                          className={cn(
                            "flex flex-col items-center text-center rounded-md border p-2",
                            deliveryDate === date
                              ? "border-primary bg-primary-lightest/40 ring-primary text-primary-dark font-bold"
                              : "border-border-default"
                          )}
                        >
                          <p className="text-[13px]">
                            {getDayAbbrString(date)}
                          </p>
                          <p className="text-[12px] opacity-70">
                            {getDayMonthNumber(date)}
                          </p>
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
              </Carousel>
              {deliveryType === "pickup" && (
                <p className="text-center caption-small pt-4">
                  {DELIVERY_DESC}
                </p>
              )}

              <Separator className="my-4" />
              <h6 className="pb-3">Order Notes</h6>
              <Textarea
                placeholder="Add an optional note (if needed)"
                className="px-4 py-3 resize-none min-h-21"
                maxLength={300}
              />
            </div>
          </ContentWrapper>

          <Footer className="px-0 w-full">
            <form
              // id="fulfillment-form"
              className="w-full flex items-center justify-between px-4"
              onSubmit={fulFillmentForm.handleSubmit(onSubmitUpdateCartForm)}
            >
              <div className="flex flex-col items-start">
                <p className="text-[12px]">
                  You{" "}
                  {deliveryType === "delivery" ? "will recieve" : "can pickup"}{" "}
                  your order on
                </p>
                <p className="text-[14px] font-bold">
                  {deliveryDate ? formatPrettyDate(deliveryDate) : "Not Set"}
                </p>
              </div>
              <Button type="submit" className="min-w-30">
                Next
              </Button>
            </form>
          </Footer>

          <Drawer.Root
            open={jobReferenceDrawerOpen}
            onOpenChange={setJobReferenceDrawerOpen}
            // snapPoints={snapPoints}
            // activeSnapPoint={jobReferenceDrawerSnap}
            // setActiveSnapPoint={setJobReferenceDrawerSnap}
            // snapToSequentialPoint
          >
            <Drawer.Overlay className="fixed z-90 inset-0 backdrop-blur-lg" />
            <Drawer.Portal>
              <Drawer.Content
                data-testid="content"
                className="fixed z-99 flex flex-col border-2 border-gray-200 border-b-none rounded-t-md bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] bg-white shadow-lg"
              >
                <div
                  className={cn(
                    "no-scrollbar overflow-y-scroll flex flex-col mx-auto w-full",
                    {
                      // 'overflow-y-auto': jobReferenceDrawerSnap === 1,
                      // 'overflow-hidden': jobReferenceDrawerSnap !== 1,
                    }
                  )}
                >
                  <Drawer.Title className="hidden" />

                  {fetched_job_references?.results?.length !== 0 ? (
                    <>
                      <div className="h-full no-scrollbar overflow-y-scroll">
                        <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-2" />
                        <div className="flex flex-col">
                          <div className="w-full sticky top-0 z-10 bg-white border-b">
                            <div className="w-full py-3 flex items-center relative px-4 max-w-[500px] mx-auto">
                              <Magnifier className="size-5 absolute left-8" />
                              <Input
                                type="text"
                                ref={searchInputRef}
                                value={searchValue}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const value = e.target.value;
                                  setSearchValue(value);
                                  const results = searchJobReferences(
                                    fetched_job_references?.results,
                                    value
                                  );
                                  setSearchResults(results);
                                }}
                                placeholder="Search template..."
                                className="pl-11 bg-white"
                              />
                              {searchValue !== "" && (
                                <XIcon
                                  className="size-5 absolute right-4 cursor-pointer"
                                  onClick={() => {
                                    setSearchValue("");
                                    setSearchResults(
                                      fetched_job_references?.results
                                    );
                                    searchInputRef.current?.focus();
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          <div
                            className={cn(
                              "flex flex-col w-full pt-4 px-4 pb-22 gap-4 max-w-[900px] mx-auto",
                              {
                                // 'overflow-y-auto': jobReferenceDrawerSnap === 1,
                                // 'overflow-hidden': jobReferenceDrawerSnap !== 1,
                              }
                            )}
                          >
                            {searchResults?.map((job) => (
                              <Drawer.NestedRoot
                                key={job?.id}
                                // snapPoints={snapPoints}
                                activeSnapPoint={jobReferenceDrawerSnap}
                                setActiveSnapPoint={setJobReferenceDrawerSnap}
                              >
                                <Drawer.Trigger asChild>
                                  <button
                                    data-slot="card"
                                    className={cn(
                                      "grid gap-4 rounded-md border-1 border-border-default py-3 px-4 relative text-start",
                                      jobId === Number(job.id) && "bg-gray-100"
                                    )}
                                    // disabled
                                  >
                                    {jobId === Number(job.id) && (
                                      <div className="absolute z-110 right-4 top-4">
                                        <FeaturedCheckSmall className="size-5" />
                                      </div>
                                    )}
                                    <ChevronRight className="absolute top-4 right-4" />
                                    <div className="grid gap-1 label-regular">
                                      <p>JR-{job?.code}</p>
                                      <p>{job?.project_name}</p>
                                    </div>
                                    {(job.addresses?.length ?? 0) > 0 ? (
                                      <>
                                        <div className="grid gap-2">
                                          <div className="flex gap-2">
                                            <MapMarker className="size-5" />
                                            <div className="flex flex-col gap-1 truncate">
                                              <p className="label-regular">
                                                {job?.addresses?.[0]?.title}
                                              </p>
                                              <p className="body-small">
                                                {
                                                  job?.addresses?.[0]
                                                    ?.street_address
                                                }
                                                , {job?.addresses?.[0]?.suburb},{" "}
                                                {job?.addresses?.[0]?.state}{" "}
                                                {job?.addresses?.[0]?.postcode}
                                              </p>
                                            </div>
                                          </div>
                                          {job?.addresses?.[1] ? (
                                            <>
                                              <div className="flex items-center gap-2">
                                                <p className="label-small">
                                                  Other Address:
                                                </p>
                                                <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                                  {job?.addresses?.[1].title}
                                                </span>
                                                {job?.addresses?.length > 2 && (
                                                  <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                                    +
                                                    {job?.addresses?.length - 2}
                                                  </span>
                                                )}
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div className="flex items-center gap-2">
                                                <p className="label-small">
                                                  Other Address:
                                                </p>
                                                <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                                  ---
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="flex gap-3 items-start text-alert-default bg-surface-alert-subtle p-3 rounded-md">
                                          <AlertTriangle className="size-4 mt-1" />
                                          <div className="grid">
                                            <p className="text-[14px] font-semibold">
                                              Associated addresses deleted
                                            </p>
                                            <p className="body-small">
                                              Add an address to continue or
                                              delete this Job Reference.
                                            </p>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </button>
                                </Drawer.Trigger>

                                <Drawer.Portal>
                                  <Drawer.Overlay className="fixed z-100 inset-0 backdrop-blur-sm bg-black/20" />
                                  <Drawer.Content className="bg-white border-t z-101 flex flex-col rounded-t-[10px] lg:h-[327px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0">
                                    <Drawer.Title className="hidden" />
                                    <ContentWrapper className="flex flex-col gap-4 pt-0">
                                      <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4" />
                                      {(searchResults?.find(
                                        (job_ref) => job_ref.id === job?.id
                                      )?.addresses?.length ?? 0) > 0 ? (
                                        <>
                                          {searchResults
                                            ?.find(
                                              (job_ref) =>
                                                job_ref.id === job?.id
                                            )
                                            ?.addresses?.map((address: any) => (
                                              <Drawer.Close
                                                key={address.id}
                                                onClick={() => {
                                                  fulFillmentForm.setValue(
                                                    "job_reference_id",
                                                    Number(job.id)
                                                  );
                                                  fulFillmentForm.setValue(
                                                    "address_id",
                                                    Number(address.id)
                                                  );
                                                  setJobReferenceDrawerOpen(
                                                    false
                                                  );
                                                }}
                                                className={cn(
                                                  "rounded-md border-1 border-border-default py-3 px-4 relative",
                                                  addressId ===
                                                    Number(address.id)
                                                    ? "bg-gray-100"
                                                    : ""
                                                )}
                                              >
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex flex-col gap-2 text-start">
                                                    <div className="flex gap-2">
                                                      <MapMarker className="size-5" />
                                                      <div className="flex flex-col gap-1">
                                                        <p className="label-regular truncate">
                                                          {address.title}
                                                        </p>
                                                        <p className="body-small truncate">
                                                          {address.full_address}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                      <ProfileNav className="size-5 mt-[2px]" />
                                                      <div className="flex flex-col gap-1">
                                                        <p className="body-small truncate">
                                                          {
                                                            address.recipient_name
                                                          }{" "}
                                                          {" +"}
                                                          {
                                                            address.recipient_phone
                                                          }
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex justify-end items-center [&_svg]:size-5 gap-6">
                                                    <Edit />
                                                  </div>
                                                </div>

                                                {addressId ===
                                                  Number(address.id) && (
                                                  <div className="absolute z-110 right-4 top-4">
                                                    <FeaturedCheckSmall className="size-5" />
                                                  </div>
                                                )}
                                              </Drawer.Close>
                                            ))}
                                        </>
                                      ) : (
                                        <div className="h-[50vh]">
                                          <div className="h-full grid items-center justify-center opacity-40">
                                            <h6>
                                              No addresses for this job
                                              reference
                                            </h6>
                                          </div>
                                        </div>
                                      )}
                                    </ContentWrapper>

                                    <Footer>
                                      <Button className="w-full" asChild>
                                        <Link
                                          href={`/cart/new-address?job_ref_id=${job.id}`}
                                        >
                                          <Plus />
                                          Add New Address
                                        </Link>
                                      </Button>
                                    </Footer>
                                  </Drawer.Content>
                                </Drawer.Portal>
                              </Drawer.NestedRoot>
                            ))}
                          </div>
                          {searchResults?.length === 0 && (
                            <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
                              <div className="text-center">
                                <h5>No results found</h5>
                                <p className="subtitle-large text-subtitle">
                                  Please check your spelling or try different
                                  keywords
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Footer>
                        <Button className="w-full" asChild>
                          <Link href="/cart/new-job">
                            <Plus />
                            Create New Job References
                          </Link>
                        </Button>
                      </Footer>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-10 max-w-[600px] mx-auto pt-30">
                      <p className="text-center subtitle-large text-subtitle">
                        No job references have been created yet{" "}
                      </p>

                      <Button className="w-full" asChild>
                        <Link href="/cart/new-job">
                          <Plus />
                          Create New Job References
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </TabsContent>
      </Tabs>
    </>
  );
}
