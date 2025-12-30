"use client";

import * as React from "react";

interface CustomerCardProps {
  data?: {
    name: string;
    email: string;
    phone: string;
    totalOrder: number;
    totalSpend: number;
  };
}

export default function CustomerCard({ data }: CustomerCardProps) {
  return (
    <div className="border rounded-lg w-full h-[201px] bg-white space-y-5 px-6">
      <div className="mt-6">
        <h6 className="mr-6">{data?.name}</h6>
        <p className="text-subtitle">{data?.email}</p>
        <p className="text-subtitle">{data?.phone}</p>
      </div>
      <div className="w-full h-13 flex-col mb-6">
        <div className="flex justify-between">
          <p>Total Order</p>
          <p>{data?.totalOrder}</p>
        </div>
        <div className="flex justify-between">
          <p>Total Spend</p>
          <p>${data?.totalSpend.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
