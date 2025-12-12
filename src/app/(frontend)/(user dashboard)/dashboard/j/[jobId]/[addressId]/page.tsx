"use client";
import { notFound, useParams } from "next/navigation";
import { jobReferences } from "@/utilities/demo_datas/demoJobRefData";
import Link from "next/link";
import { ArrowLeft } from "@/components/uikit/icons";
import { ButtonListItem } from "@/components/uikit/buttons/buttonListItem";
import { Separator } from "@/components/uikit/separator";
import { useGETJobRefAddressByIds } from "@/lib/db/helpers/jobRefHelpers";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";

export default function EditAddressPage() {
  const { jobId, addressId } = useParams<{
    jobId: string;
    addressId: string;
  }>();

  const { data, error, isLoading } = useSWR(
    `/a/job-ref/${jobId}/address/${addressId}`,
    fetcher
  );

  const address = data;

  if (!isLoading && address === undefined) {
    notFound();
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/j/${jobId}`}>
              <ArrowLeft />
            </Link>
            <h6>Edit Address</h6>
          </div>
        </div>
      </header>

      <div className="overflow-scroll w-full h-full pt-18 pb-22 px-4 no-scrollbar">
        <div className="grid gap-3">
          <Link
            href={`/dashboard/j/${jobId}/${addressId}/edit-address-details`}
          >
            <ButtonListItem text="Edit Address Details" />
          </Link>
          <Separator />
          <Link href={`/dashboard/j/${jobId}/${addressId}/edit-recipient`}>
            <ButtonListItem text="Edit Recipient" />
          </Link>
        </div>
      </div>
    </>
  );
}
