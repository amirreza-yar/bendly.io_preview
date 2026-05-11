import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
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
              fill="url(#paint0_linear_11097_72983)"
              stroke="#781C1C"
              strokeWidth="4"
            />
            <circle
              opacity="0.3"
              cx="50.5"
              cy="50.5"
              r="37.5"
              fill="url(#paint1_linear_11097_72983)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M63.3401 32.1027C64.8104 30.6324 67.1949 30.6324 68.6652 32.1027C70.1355 33.5731 70.1355 35.9577 68.6652 37.4279L55.7092 50.384L68.6652 63.3401C70.1355 64.8104 70.1356 67.1949 68.6652 68.6652C67.1949 70.1355 64.8104 70.1355 63.3401 68.6652L50.384 55.7092L37.4279 68.6652C35.9577 70.1355 33.5731 70.1355 32.1027 68.6652C30.6324 67.1949 30.6324 64.8104 32.1027 63.3401L45.0588 50.384L32.1027 37.4279C30.6324 35.9576 30.6325 33.5731 32.1027 32.1027C33.5731 30.6324 35.9576 30.6324 37.4279 32.1027L50.384 45.0588L63.3401 32.1027Z"
              fill="white"
            />
            <circle
              opacity="0.5"
              cx="50.5"
              cy="50.5"
              r="44.5"
              stroke="white"
              strokeWidth="4"
            />
            <defs>
              <linearGradient
                id="paint0_linear_11097_72983"
                x1="20.2"
                y1="11.8"
                x2="79"
                y2="92.8"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE8E8E" />
                <stop offset="1" stopColor="#CD0404" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_11097_72983"
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

          <h5 className="text-2xl text-destructive pt-4">Payment failed</h5>
          <p className="text-sm">
            Something went wrong. Please try again later
          </p>
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-sm">Transaction ID</p>
            <p className="text-sm font-bold">{id ?? "unknown"}</p>
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
            <Link href={``}>Try Again</Link>
          </Button>
          <Button variant="ghost" className="w-full text-primary" asChild>
            <Link href={``}>
              Need help?
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
