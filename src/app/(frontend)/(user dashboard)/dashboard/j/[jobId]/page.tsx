"use client";
import {
  ArrowLeft,
  Edit,
  MapMarker,
  Plus,
  ProfileNav,
  Remove,
} from "@/components/uikit/icons";
import Link from "next/link";
import { jobReferences } from "@/utilities/demo_datas/demoJobRefData";
import { notFound, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/uikit/buttons/button";
import JobRefHeader from "@/components/dashboard/jobReference/header";
import { JobRefInfoCard } from "@/components/dashboard/jobReference/cards";
import { JobRefAddressCard } from "@/components/dashboard/jobReference/cards";
import JobRefFooter from "@/components/dashboard/jobReference/footer";
import {
  deleteJobRefAddressByIds,
  deleteJobRefById,
  useGETJobRefById,
} from "@/lib/db/helpers/jobRefHelpers";
import { toast } from "sonner";
import { useState } from "react";
import { Footer } from "@/components/dashboard/footer";
import { Header } from "@/components/dashboard/header";
import { RemoveJobRefModal } from "@/components/dashboard/jobReference/modals";
import useSWR, { mutate } from "swr";
import api, { fetcher } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";

export default function OrderJobReferencePage() {
  const { jobId } = useParams<{ jobId: string }>();

  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const { data, error, isLoading } = useSWR(
    jobId ? `/a/job-ref/${jobId}` : null,
    fetcher,
    {
      onError: () => notFound(),
    }
  );

  const onJobRefDelete = async () => {
    setIsDeleted(true);
    await api.delete(`/a/job-ref/${jobId}/`).then(() => {
      toast("Job Reference deleted");
      router.replace("/dashboard/j");
    });
  };

  const onJobRefAddressDelete = async (addressId: string) => {
    await api.delete(`/a/job-ref/${jobId}/address/${addressId}/`).then(() => {
      toast("Job Reference deleted");
      router.replace(`/dashboard/j/${jobId}`);
    });
    mutate(
      `/a/job-ref/${jobId}`,
      (currentData: any) => {
        return {
          ...currentData,
          addresses: currentData.addresses.filter(
            (a: any) => a.id !== addressId
          ),
        };
      },
      false
    );
  };

  return (
    <>
      <Header title={`Job Ref: JR-${data?.code}`} returnHref="/dashboard/j">
        {isLoading ? (
          <Skeleton className="h-7 w-7 rounded-xs" />
        ) : (
          <RemoveJobRefModal
            trigger={<Remove className="size-6" />}
            onJobRefDelete={onJobRefDelete}
          />
        )}
      </Header>
      <ContentWrapper className="pt-14">
        <div className="grid gap-4 pt-4">
          {isLoading ? (
            <Skeleton className="h-16.5" />
          ) : (
            <JobRefInfoCard jobReference={data ?? null} />
          )}
          <div className="grid gap-4">
            <h6>Associated Addresses</h6>
            {isLoading ? (
              <>
                <Skeleton className="h-31" />
                <Skeleton className="h-31" />
              </>
            ) : (data?.addresses?.length ?? 0) > 0 ? (
              <>
                {data?.addresses?.map((address: any, index: number) => (
                  <JobRefAddressCard
                    address={address}
                    key={index}
                    jobId={data.id}
                    onJobRefAddressDelete={onJobRefAddressDelete}
                  />
                ))}
              </>
            ) : (
              <div className="h-[50vh]">
                <div className="h-full grid items-center justify-center opacity-40">
                  <h6>No addresses for JR-{data?.code}</h6>
                </div>
              </div>
            )}
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        {isLoading ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <Link
            className="w-full"
            href={`/dashboard/j/${data?.id}/new-address`}
          >
            <Button className="w-full">
              <Plus />
              Add New Address
            </Button>
          </Link>
        )}
      </Footer>
    </>
  );
}
