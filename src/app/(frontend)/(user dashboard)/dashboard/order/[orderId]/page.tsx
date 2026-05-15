import api from "@/lib/axios";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Delivery,
  Info,
  Mail,
  Phone,
  ProfileNav,
  WareHouse,
} from "@/components/icons";
import { Order } from "@/types/api";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
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
import { cookies } from "next/headers";
import ExportOrderPDFLink from "@/components/pdf-export";
import { Download } from "lucide-react";

const onFetchOrderDetails: (
  orderId: string | number,
) => Promise<{ ok: boolean; data?: Order }> = async (orderId) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(`/a/order/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data as Order };
  } catch {
    return { ok: false };
  }
};

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ orderId: string | number }>;
}) {
  const orderId = (await params).orderId;

  const { data: order } = await onFetchOrderDetails(orderId);

  if (!order) return notFound();

  return (
    <div className="px-7 py-5 space-y-14">
      <div className="space-y-2 text-label-sm">
        <div className="pb-1 flex__between">
          <p className="text-muted-foreground">Order Status</p>
          <span>
            <OrderStatusBadge
              status={formatStatus(order.status, order.fulfillment.type)}
            />
          </span>
        </div>
        <div className="flex__between">
          <p className="text-muted-foreground">Order #</p>
          <span>{order.id}</span>
        </div>
        <div className="flex__between">
          <p className="text-muted-foreground">Order Date</p>
          <span>{formatDateTime(order.created_at)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex__between">
          <p className="text-muted-foreground">Project Code</p>
          <span>PRJ-{order.job_reference?.code ?? order.project?.code}</span>
        </div>
        {order.job_reference?.project_name && (
          <div className="flex__between">
            <p className="text-muted-foreground">Project</p>
            <span>{order.job_reference?.project_name ?? order.project?.project_name}</span>
          </div>
        )}
      </div>

      {order.status !== "rejected" && (
        <div className="space-y-2 text-label-sm">
          {order.fulfillment?.type === "delivery" ? (
            <h6>Delivery Information</h6>
          ) : (
            <h6>Pickup Information</h6>
          )}
          <p className="pt-1">Address:</p>
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
              {order.fulfillment.address.recipient_name} +61
              {order.fulfillment.address.recipient_phone}
            </span>
          </div>
          <div className="flex__between">
            <p className="text-muted-foreground">Delivery Date</p>
            <span>{formatDateWithDay(order.fulfillment.date ?? 0)}</span>
          </div>
          {order.status !== "pending" &&
            order.fulfillment?.type === "delivery" && (
              <div className="flex__between">
                <p className="text-muted-foreground">Delivery ID</p>
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
                        <p className="text-muted-foreground">
                          Driver Information
                        </p>
                        <span>{driver?.name}</span>
                      </div>

                      <div className="flex justify-end items-center pt-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`tel:+61${driver?.phone}`}>
                            <Phone className="size-5" />
                            Call Driver
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex__between">
                      <p className="text-muted-foreground">
                        Driver Information
                      </p>
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
                  <p className="text-muted-foreground">
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
        <h6 className="pb-4">Order Progress</h6>
        {order.status !== "rejected" ? (
          <ProgressionObject status={order.status} />
        ) : (
          <>
            <RejectedProgressionObject />

            <p className="text-muted-foreground text-xs pt-2">
              Reasons for Reject:
            </p>
            <span className="text-sm pl-2">
              {order.reject_reason ? order.reject_reason : "Not provided"}
            </span>
          </>
        )}
      </div>

      {order.status !== "rejected" && (
        <div className="space-y-1">
          <h6 className="pb-5">Order Summary</h6>
          {order.flashings && (
            <NewOrderSummaryAccordion flashings={order.flashings} />
          )}
          <Separator className="mb-2" />
          <div className="space-y-2 pr-8 text-label-sm">
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
        <h6 className="pb-2">Payment History</h6>
        <div className="space-y-3 text-label-sm">
          <div className="flex__between">
            <p className="text-muted-foreground">Total</p>
            <span>$ {order.payment_history?.amount.toFixed(2)}</span>
          </div>
          <div className="flex__between">
            <p className="text-muted-foreground">Payment Date</p>
            <span>{formatDateTime(order.payment_history?.date ?? 0)}</span>
          </div>
          <div className="flex__between">
            <p className="text-muted-foreground">Transaction ID</p>
            <span>{order.payment_history?.transaction_id}</span>
          </div>
          <div className="flex__between">
            <p className="text-muted-foreground">Via</p>
            <span className="capitalize">{order.payment_history?.method}</span>
          </div>
        </div>
      </div>

      {/* <Button size="lg" className="w-full">
        <ExportOrderPDFLink order={order} className="flex items-center gap-2">
          <Download className="size-5" />
          Export Invoice
        </ExportOrderPDFLink>
      </Button> */}

      {order.status !== "completed" && (
        <div>
          <div className="flex flex-col gap-4">
            <h6 className="pb-2">Need Help?</h6>
            <Button variant="outline" size="lg" asChild>
              <Link href="tel:+61404050208">
                <Phone className="size-5" />
                Call Support
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="mailto:info@bendly.io">
                <Mail className="size-5" />
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
