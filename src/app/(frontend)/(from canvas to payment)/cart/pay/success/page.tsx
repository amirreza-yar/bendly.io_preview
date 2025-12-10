import { Button } from "@/components/uikit/buttons/button";
import { FeaturedSuccess } from "@/components/uikit/icons";
import api from "@/lib/axios";
import { Download } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SuccessPayPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; orderId: string }>;
}) {
  const { id, orderId } = await searchParams;

  let order: any = null;
  try {
    const res = await api.get(`/d/order/${orderId}/`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    order = res.data;
  } catch (err: any) {
    console.log(err.response);
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
        <div className="grid text-center p-4 gap-2 bg-gray-50 border border-gray-200 rounded-md">
          <FeaturedSuccess className="size-12 w-full my-6" />
          <h5>Payment successfull</h5>
          <p className="text-[13px]">Your order has been submitted</p>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Transaction ID</p>
            <p className="text-[13px] font-bold">{id}</p>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Order ID</p>
            <p className="text-[13px] font-bold">{orderId}</p>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Date</p>
            <p className="text-[13px] font-bold">
              {new Date(order?.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Button size="default" variant="ghost" className="mt-2 bg-gray-50">
            Get Reciept
            <Download />
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-84">
          <Link href={`/dashboard/orders/${orderId}`} className="w-full">
            <Button className="w-full">Track Order</Button>
          </Link>
          <Link href={`/dashboard`} className="w-full">
            <Button variant="ghost" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
