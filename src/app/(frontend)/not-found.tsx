"use client";
import { redirect } from "next/navigation";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 max-w-[1000px]">
      <div className="grid text-center lg:gap-12 md:gap-10 gap-6">
        <h1 className="lg:text-[10rem] md:text-[7rem] text-[5rem]">404</h1>
        <p className="lg:text-[2rem] md:text-[1.5rem] text-[1rem]">
          This page could not be found
        </p>

        <button
          onClick={() => redirect("/")}
          className="bg-gray-200 rounded-md lg:p-8 md:p-6 p-4 lg:text-[1.8rem] md:text-[1.3rem] text-[1.2rem]"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
