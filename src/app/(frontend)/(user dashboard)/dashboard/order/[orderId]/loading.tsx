"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoader() {
  return (
    <div className="space-y-2 py-5 px-7 [&>div]:flex [&>div]:justify-between">
      <div>
        <Skeleton className="bg-gray h-4 w-15 " />
        <Skeleton className="bg-gray h-4 w-15 " />
      </div>
      <div className="pb-2">
        <Skeleton className="bg-gray h-4 w-12 " />
        <Skeleton className="bg-gray h-4 w-40 " />
      </div>
      <Skeleton className="w-full h-0.5" />
      <div className="pt-2">
        <Skeleton className="bg-gray h-4 w-25 " />
        <Skeleton className="bg-gray h-4 w-15 " />
      </div>
      <div>
        <Skeleton className="bg-gray h-4 w-25 " />
        <Skeleton className="bg-gray h-4 w-15 " />
      </div>
      <div>
        <Skeleton className="bg-gray h-4 w-15 " />
        <Skeleton className="bg-gray h-4 w-30 " />
      </div>

      <Skeleton className="bg-gray h-6 w-50  mt-12" />

      <Skeleton className="bg-gray h-4 w-40 " />
      <Skeleton className="bg-gray h-4 w-60 " />

      <div>
        <Skeleton className="bg-gray h-4 w-12 " />
        <Skeleton className="bg-gray h-4 w-20 " />
      </div>
      <div>
        <Skeleton className="bg-gray h-4 w-20 " />
        <Skeleton className="bg-gray h-4 w-35 " />
      </div>

      <Skeleton className="bg-gray h-6 w-40  mt-12" />

      <div className="justify-start! items-start pt-2">
        <Skeleton className="bg-gray h-8 w-8 rounded-full mr-2" />
        <div className="space-y-1">
          <Skeleton className="bg-gray h-5 w-25" />
          <Skeleton className="bg-gray h-3 w-65" />
        </div>
      </div>
      <div className="justify-start! items-start pt-2">
        <Skeleton className="bg-gray h-8 w-8 rounded-full mr-2" />
        <div className="space-y-1">
          <Skeleton className="bg-gray h-5 w-25" />
          <Skeleton className="bg-gray h-3 w-65" />
        </div>
      </div>
      <div className="justify-start! items-start pt-2">
        <Skeleton className="bg-gray h-8 w-8 rounded-full mr-2" />
        <div className="space-y-1">
          <Skeleton className="bg-gray h-5 w-25" />
          <Skeleton className="bg-gray h-3 w-65" />
        </div>
      </div>
      <div className="justify-start! items-start pt-2">
        <Skeleton className="bg-gray h-8 w-8 rounded-full mr-2" />
        <div className="space-y-1">
          <Skeleton className="bg-gray h-5 w-25" />
          <Skeleton className="bg-gray h-3 w-65" />
        </div>
      </div>

      <Skeleton className="bg-gray h-6 w-30  mt-12" />

      <div className="block! mt-4 space-y-3">
        <div className="flex items-center">
          <Skeleton className="bg-gray h-15 w-15 mr-4" />
          <div className="h-full space-y-2">
            <Skeleton className="bg-gray h-5 w-25" />
            <Skeleton className="bg-gray h-4 w-60" />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton className="bg-gray h-15 w-15 mr-4" />
          <div className="h-full space-y-2">
            <Skeleton className="bg-gray h-5 w-25" />
            <Skeleton className="bg-gray h-4 w-60" />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton className="bg-gray h-15 w-15 mr-4" />
          <div className="h-full space-y-2">
            <Skeleton className="bg-gray h-5 w-25" />
            <Skeleton className="bg-gray h-4 w-60" />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton className="bg-gray h-15 w-15 mr-4" />
          <div className="h-full space-y-2">
            <Skeleton className="bg-gray h-5 w-25" />
            <Skeleton className="bg-gray h-4 w-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
