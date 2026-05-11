import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
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
    const res = await api.get(`/a/order/${orderId}/`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    order = res.data;
  } catch {}

  return (
    <>
      <div className="w-full h-full space-y-6 py-8 px-4 items-center justify-center">
        <div className="flex flex-col items-center text-center p-4 gap-2">
          <svg
            width="101"
            height="101"
            viewBox="0 0 101 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50.5"
              cy="50.5"
              r="48.5"
              fill="url(#paint0_linear_11097_72990)"
              stroke="#0E742A"
              strokeWidth="4"
            />
            <circle
              opacity="0.3"
              cx="50.5"
              cy="50.5"
              r="37.5"
              fill="url(#paint1_linear_11097_72990)"
            />
            <circle
              opacity="0.5"
              cx="50.5"
              cy="50.5"
              r="44.5"
              stroke="white"
              strokeWidth="4"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M65.5928 33.412C67.0292 31.5877 69.6726 31.2735 71.4971 32.7098C73.3216 34.1462 73.6365 36.7896 72.2002 38.6141L48.2549 69.0311C48.1179 69.2051 47.9697 69.3652 47.8125 69.5116C46.204 71.0873 43.6249 71.1195 41.9785 69.5565L26.5322 54.8934C24.8482 53.2947 24.7793 50.6332 26.3779 48.9491C27.9767 47.265 30.6382 47.196 32.3223 48.7948L44.4326 60.2909L65.5928 33.412Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_11097_72990"
                x1="24"
                y1="11.5"
                x2="78"
                y2="93"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B5E384" />
                <stop offset="1" stopColor="#009933" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_11097_72990"
                x1="26.0645"
                y1="19.2903"
                x2="40"
                y2="51"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <h5 className="text-2xl text-success pt-4">Payment successfull</h5>
          <p className="text-sm">Your order has been submitted</p>
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-sm">Transaction ID</p>
            <p className="text-sm font-bold">{id ?? "unknown"}</p>
          </div>
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-[13px]">Order ID</p>
            <p className="text-[13px] font-bold">{orderId ?? "unknown"}</p>
          </div>
          <div className="flex w-full items-center gap-4 justify-between">
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
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button className="w-full" size="lg" asChild>
            <Link href={`/dashboard/order/${orderId}`}>Track This Order</Link>
          </Button>
          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link href={`/dashboard`}>Back to Home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
