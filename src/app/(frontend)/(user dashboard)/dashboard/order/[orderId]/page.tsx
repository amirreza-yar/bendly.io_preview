"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import BottomNav from "@/components/dashboard/bottom-nav";
import { fetcher } from "@/lib/axios";
import { notFound, useRouter } from "next/navigation";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Delivery,
  Info,
  Phone,
  ProfileNav,
  Search,
  WareHouse,
} from "@/components/icons";
import { use, useState } from "react";
import { cn } from "@/utilities/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Filter, X } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import { useDebounce } from "use-debounce";
import { OrderContent, OrderFilterContent } from "@/components/order/content";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Material, Order } from "@/types/api";
import { OrderStatusBadge } from "@/components/order/badge";
import {
  formatDateTime,
  formatDateWithDay,
  formatPrice,
  formatStatus,
} from "@/components/order/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ProgressionObject,
  RejectedProgressionObject,
} from "@/components/order/progressionObject";
import { NewOrderSummaryAccordion } from "@/components/order/accordion";

export default function LibraryPage({
  params,
}: {
  params: Promise<{ orderId: string | number }>;
}) {
  const orderId = use(params).orderId;

  const router = useRouter();

  const { data: order } = useSWR<Order>(`/a/order/${orderId}/`, fetcher, {
    onError: notFound,
    suspense: true,
  });

  if (!order) {
    return <></>;
  }

  return (
    <div className="order__details py-5 px-7">
      <div className="space-y-2 typography">
        <div className="pb-1 flex__between">
          <p>Status</p>
          <span>
            <OrderStatusBadge
              status={formatStatus(order.status, order.fulfillment.type)}
            />
          </span>
        </div>
        <div className="flex__between">
          <p>Order #</p>
          <span>{order.id}</span>
        </div>
        <div className="flex__between">
          <p>Order Date</p>
          <span>{formatDateTime(order.created_at)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex__between">
          <p>Job Refrence</p>
          <span>JR-{order.job_reference?.code}</span>
        </div>
        {order.job_reference?.project_name && (
          <div className="flex__between">
            <p>Project</p>
            <span>{order.job_reference?.project_name}</span>
          </div>
        )}
      </div>

      {order.status !== "rejected" && (
        <div className="space-y-2 typography">
          {order.fulfillment?.type === "delivery" ? (
            <h6>Delivery Information</h6>
          ) : (
            <h6>Pickup Information</h6>
          )}
          {order.fulfillment?.type === "delivery" ? (
            <div className="flex__start gap-1 ">
              <Delivery />
              <span>{order.fulfillment.address?.full_address}</span>
            </div>
          ) : (
            <div className="flex__start items-start gap-2 ">
              <WareHouse />
              <span className=" grid gap-1">
                <span>{order.fulfillment.address.factory_address}</span>
                <p className=" opacity-70">
                  {order.fulfillment.address.factory_work_desc}
                </p>
              </span>
            </div>
          )}
          <div className="flex__start gap-1">
            <ProfileNav />
            <span>
              {order.fulfillment.address.recipient_name} +
              {order.fulfillment.address.recipient_phone}
            </span>
          </div>
          <div className="flex__between">
            <p>Delivery Date</p>
            <span>{formatDateWithDay(order.fulfillment.date ?? 0)}</span>
          </div>
          {order.status !== "pending" &&
            order.fulfillment?.type === "delivery" && (
              <div className="flex__between">
                <p>Delivery ID</p>
                <span>{order.fulfillment.id}</span>
              </div>
            )}
          {order.fulfillment?.type === "delivery" &&
            order.status === "ready" &&
            (() => {
              const driver = order.fulfillment.driver;
              return (
                <>
                  {order.status === "ready" ? (
                    <>
                      <div className="flex__between">
                        <p>Driver Information</p>
                        <span>{driver?.name}</span>
                      </div>

                      <div className="flex justify-end items-center pt-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`tel:+67${driver?.phone}`}>
                            <Phone className="size-5" />
                            Call Driver
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex__between">
                      <p>Driver Information</p>
                      <span>Shown when order progressed</span>
                    </div>
                  )}
                </>
              );
            })()}
        </div>
      )}

      {order.status === "completed" &&
        (() => {
          const req = {
            requestDateTime: undefined,
            requestProgress: undefined,
          };

          if (req !== undefined) {
            return (
              <div className="grid gap-4 p-4">
                <h6>Post-Delivery Actions</h6>
                <div className="flex items-start gap-3 p-3 rounded-md body-small bg-surface-info-subtle text-primary">
                  <Info className="size-5" />
                  <p>
                    You have submitted a replacement request for this order on{" "}
                    {formatDateTime(req.requestDateTime ?? 0)} <br /> Status:{" "}
                    {req.requestProgress}
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div className="grid gap-2 p-4">
                <h6>Post-Delivery Actions</h6>
                <p className="body-small text-body">
                  Something wrong with your delivery? Request a replacement
                  easily.
                </p>
                <Link
                  className="w-full"
                  // href={`/dashboard/orders/${orderId}/replacement-request`}
                  href=""
                >
                  <Button variant="secondary" className="mt-2 w-full">
                    Request Replacement
                  </Button>
                </Link>
              </div>
            );
          }
        })()}

      <div className="space-y-2">
        <h6 className="pb-4">Progress</h6>
        {order.status !== "rejected" ? (
          <ProgressionObject status={order.status} />
        ) : (
          <>
            <RejectedProgressionObject />
            <Separator className="my-2 mt-1" />
            <p>Reasons for Reject:</p>
            <span className="text-body">
              {order.reject_reason ? order.reject_reason : "Not provided"}
            </span>
          </>
        )}
      </div>

      {order.status !== "rejected" && (
        <div className="space-y-2">
          <h6 className="pt-8">Summary</h6>
          {order.flashings && (
            <NewOrderSummaryAccordion flashings={order.flashings} />
          )}
          <Separator className="mb-2" />
          <div className="space-y-2 pr-8 typography">
            {order.fulfillment.type === "delivery" && (
              <div>
                <div className="flex__between">
                  <span>Delivery</span>
                  <p className="text-success text-caption-sm">
                    {order.fulfillment?.method?._dm_type === "freight"
                      ? "Freight Collect"
                      : formatPrice(order.fulfillment.cost)}
                  </p>
                </div>
                <p className="text-caption-sm">
                  {order.fulfillment?.method?._dm_type !== "freight"
                    ? "Factory will deliver your order"
                    : "Order delivered via freight transport"}
                </p>
              </div>
            )}
            <div className="flex__between">
              <span>GST</span>
              <p className="text-success text-caption-sm">
                {formatPrice(
                  (order.payment_history?.flashings_cost +
                    order.payment_history?.delivery_cost) *
                    order.payment_history?.gst,
                )}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex__between pr-8">
            <span className="text-label">Total</span>
            <p className="text-label text-success">
              {formatPrice(order.payment_history?.amount)}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h6>Payment History</h6>
        <div className="space-y-3 typography">
          <div className="flex__between">
            <p>Total</p>
            <span>$ {order.payment_history?.amount.toFixed(2)}</span>
          </div>
          <div className="flex__between">
            <p>Payment Date</p>
            <span>{formatDateTime(order.payment_history?.date ?? 0)}</span>
          </div>
          <div className="flex__between">
            <p>Transaction ID</p>
            <span>{order.payment_history?.transaction_id}</span>
          </div>
          <div className="flex__between">
            <p>Via</p>
            <span className="capitalize">{order.payment_history?.method}</span>
          </div>
        </div>
      </div>

      {order.status !== "completed" && (
        <div>
          <h6>Need Help?</h6>
          <div className="flex flex-col gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link href="tel:+9876543210">
                <Phone className="size-5" />
                Call Support
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="mailto:name@domain.com">
                <Phone className="size-5" />
                Send Mail
              </Link>
            </Button>
            <p className="text-center pt-2 text-caption-sm">
              Support hours: Mon-Fri 8AM-6PM EST
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
