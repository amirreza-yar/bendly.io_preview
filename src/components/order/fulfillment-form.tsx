"use client";

import {
  ArrowRight,
  Delivery,
  Edit,
  LibraryNav,
  MapMarker,
  Plus,
  Search,
  User,
  WareHouse,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Flashing } from "@/types/api";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDayAbbrString, getDayMonthNumber } from "@/utilities/datetime";
import { cn } from "@/utilities/ui";
import { Edit3, XIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import FulFillmentJobRefDrawer from "./fulfillment-job-ref-select-drawer";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

const demo_cart = {
  client: 2,
  delivery_type: "delivery",
  delivery_cost: 0,
  estimated_delivery_date: "2026-05-13",
  flashings_cost: 20095.7,
  delivery_method: "freight",
  gst_ratio: 0.1,
  address: {
    id: 1,
    title: "Home",
    street_address: "123 Main st.",
    suburb: "Sydney",
    state: "NSW",
    postcode: 2020,
    recipient_name: "Amirreza Yarahmadi",
    recipient_phone: 1231231231,
    full_address: "123 Main st., Sydney, NSW 2020, Australia",
  },
  job_reference: {
    id: 1,
    code: 5523,
    project_name: "No project name assigned",
  },
  delivery_date: "2026-05-14",
  total_amount: 22105.27,
};

const demo_jobrefs = [
  {
    id: 1,
    code: 5523,
    project_name: "No project name assigned",
    addresses: [
      {
        id: 1,
        title: "Home",
        street_address: "123 Main st.",
        suburb: "Sydney",
        state: "NSW",
        postcode: 2020,
        recipient_name: "Amirreza Yarahmadi",
        recipient_phone: 1231231231,
        full_address: "123 Main st., Sydney, NSW 2020, Australia",
      },
    ],
  },
];

export type Address = {
  id: number;
  title: string;
  street_address: string;
  suburb: string;
  state: string;
  recipient_name: string;
  postcode: number;
  recipient_phone: number;
  full_address: string;
};

export type JobRef = {
  id: number;
  code: number;
  project_name: string;
  addresses: Address[];
};

export type Cart = {
  delivery_type: "delivery" | "pickup";
  flashings: Flashing[];
  delivery_cost?: number;
  estimated_delivery_date: string;
  flashings_cost: number;
  delivery_method: string;
  gst_ratio: number;
  address?: {
    id: number;
    title: string;
    street_address: string;
    suburb: string;
    state: string;
    postcode: number;
    recipient_name: string;
    recipient_phone: number;
    full_address: string;
  };
  job_reference?: {
    id: number;
    code: number;
    project_name: string;
  };
  delivery_date?: string;
  total_amount: number;
};

const fulFillmentFormSchema = z
  .object({
    job_reference_id: z.string("Select a job reference").regex(/^\d+$/),
    address_id: z.string("Select a job reference").regex(/^\d+$/),
    delivery_date: z
      .string("Select a delivery date")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a delivery date"),
    delivery_type: z.enum(["delivery", "pickup"], "Delivery type is required"),
  })
  .refine((data) => data.address_id, {
    message: "Select a job reference",
    path: ["job_reference_id"], // where you want the single error to appear
  });

type FulFillmentFormValue = z.infer<typeof fulFillmentFormSchema>;

export default function OrderFulfillmentForm({
  cart,
  jobRefs,
  queryAddressId,
  queryProjectId,
}: {
  cart: Cart;
  jobRefs: JobRef[];
  queryAddressId: string | number;
  queryProjectId: string | number;
}) {
  const [jobRefDrawerOpen, setJobRefDrawerOpen] = useState<boolean>(false);

  const fulFillmentForm = useForm<FulFillmentFormValue>({
    resolver: zodResolver(fulFillmentFormSchema),
    defaultValues: {
      job_reference_id: String(queryProjectId ?? cart.job_reference?.id),
      address_id: String(queryAddressId ?? cart.address?.id),
      delivery_type: cart.delivery_type,
      delivery_date: cart.delivery_date,
    },
  });

  //   const deliveryType = fulFillmentForm.getValues("delivery_type");
  const deliveryType = useWatch({
    control: fulFillmentForm.control,
    name: "delivery_type",
  });

  const deliveryDate = useWatch({
    control: fulFillmentForm.control,
    name: "delivery_date",
  });

  const jobReferenceId = useWatch({
    control: fulFillmentForm.control,
    name: "job_reference_id",
  });

  const addressId = useWatch({
    control: fulFillmentForm.control,
    name: "address_id",
  });

  const fetchedJobRef = jobRefs.find((j) => String(j.id) === jobReferenceId);
  const fetchedAddress = fetchedJobRef?.addresses.find(
    (a) => String(a.id) === addressId,
  );

  const router = useRouter();

  const onFulfillFormSubmit = async (data: FulFillmentFormValue) => {
    try {
      await api.post("/a/cart/update/", {
        address_id: data.address_id,
        delivery_date: data.delivery_date,
        delivery_type: data.delivery_type,
      });
      router.push("/cart/checkout/");
    } catch (error: any) {
      toast("Something went wrong");
    }
  };

  return (
    <>
      <form
        className="w-full h-full overflow-y-hidden"
        onSubmit={fulFillmentForm.handleSubmit(onFulfillFormSubmit)}
      >
        <div className="px-4 flex justify-center pb-2 pt-4 md:pt-6 pb-4">
          <div className="w-full sm:w-130 border rounded-md p-1 grid grid-cols-2 gap-1">
            <Button
              size="sm"
              type="button"
              className="text-xs h-8 rounded-md"
              variant={deliveryType === "pickup" ? "ghost" : "default"}
              onClick={() =>
                fulFillmentForm.setValue("delivery_type", "delivery")
              }
            >
              Delivery
            </Button>
            <Button
              size="sm"
              type="button"
              className="text-xs h-8 rounded-md"
              variant={deliveryType === "pickup" ? "default" : "ghost"}
              onClick={() =>
                fulFillmentForm.setValue("delivery_type", "pickup")
              }
            >
              Pickup
            </Button>
          </div>
        </div>
        <ScrollArea className="h-full w-full">
          <div className="space-y-4 pt-2 px-6 md:px-8 pb-40">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base font-semibold">
                <LibraryNav className="size-6" />
                Project <span className="text-destructive">*</span>
              </div>

              {jobReferenceId && addressId ? (
                <div className="p-4 rounded-xl border space-y-1 relative">
                  <h6 className="text-base">PRJ-{fetchedJobRef?.code}</h6>
                  <p className="text-sm text-muted-foreground">
                    {fetchedJobRef?.project_name}
                  </p>

                  <div className="flex items-start gap-2 pt-3">
                    <MapMarker className="size-4" />
                    <div className="space-y-1">
                      <p className="text-sm">{fetchedAddress?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {deliveryType === "delivery"
                          ? fetchedAddress?.full_address
                          : "Self Pickup - ٔNo Delivery Address"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <User className="size-4" />

                    <p className="text-sm font-base">
                      {fetchedAddress?.recipient_name}
                    </p>
                    <p className="text-sm font-base">
                      {fetchedAddress?.recipient_phone}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="absolute top-1 right-1"
                    onClick={() => {
                      fulFillmentForm.setValue("address_id", "");
                      fulFillmentForm.setValue("job_reference_id", "");
                    }}
                  >
                    <XIcon />
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Select an existing project or create a new one to organize
                    this order
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 py-5 pb-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="text-xs h-10"
                      onClick={() => setJobRefDrawerOpen(true)}
                    >
                      <Search className="size-4" />
                      Select Project
                    </Button>
                    <Button variant="outline" className="text-xs h-10" asChild>
                      <Link
                        href={`/dashboard/project/new?next=cart&return=cart`}
                      >
                        <Plus className="size-4" />
                        Create New Project
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Separator />

            <div className="space-y-2 pt-2 overflow-hidden">
              <div className="flex items-center gap-2 text-base font-semibold">
                {cart.delivery_type === "delivery" ? (
                  <Delivery className="size-6" />
                ) : (
                  <WareHouse className="size-6" />
                )}
                Select a {cart.delivery_type} date{" "}
                <span className="text-destructive">*</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose your preferred delivery date
              </p>
              <ScrollArea className="w-full h-full">
                <div className="flex max-w-0 gap-4 py-5">
                  {generateSequentialDates(cart.estimated_delivery_date).map(
                    (d) => (
                      <div
                        key={d}
                        className={cn(
                          "items-center text-center rounded-md border p-2",
                          deliveryDate === d
                            ? "border-primary bg-primary-lightest/40 ring-primary text-primary-dark font-bold"
                            : "border-border-default",
                        )}
                        onClick={() =>
                          fulFillmentForm.setValue("delivery_date", d)
                        }
                      >
                        <p className="text-[13px]">{getDayAbbrString(d)}</p>
                        <p className="text-[12px] opacity-70">
                          {getDayMonthNumber(d)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <Separator />

            <div className="space-y-4 pt-4 overflow-hidden">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Edit className="size-6" />
                Order notes
              </div>

              <Textarea
                placeholder="Add a note ( Optional )"
                className="px-4 py-3 resize-none min-h-21"
                maxLength={300}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end w-full absolute bottom-0 p-4 shadow-md bg-background rounded-b-xl">
          <Button type="submit" className="w-full sm:w-40" size="lg">
            Continue
            <ArrowRight />
          </Button>
        </div>
      </form>

      <FulFillmentJobRefDrawer
        jobRefDrawerOpen={jobRefDrawerOpen}
        setJobRefDrawerOpen={setJobRefDrawerOpen}
        jobRefs={jobRefs}
        selectedJobRefId={jobReferenceId}
        selectedAddressId={addressId}
        fulfillmentForm={fulFillmentForm}
      />
    </>
  );
}
