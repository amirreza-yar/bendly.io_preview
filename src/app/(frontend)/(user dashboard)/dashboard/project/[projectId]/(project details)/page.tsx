import RemoveProjectAddressModal from "@/components/dashboard/project/remove-project-address-modal";
import { Edit, MapMarker, User } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { Project } from "@/types/api";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export const onFetchProjectDetails: (
  id: string | number,
) => Promise<Project | undefined> = async (id) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(`/a/job-ref/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const onRemoveAddress: (
  projectId: string | number,
  addressId: string | number,
) => Promise<{ ok: boolean }> = async (projectId, addressId) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    await api.delete(`/a/job-ref/${projectId}/address/${addressId}/`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  const project = await onFetchProjectDetails(projectId);

  // eslint-disable-next-line
  const demoFlashing = {
    id: 1,
    name: "Demo Flashing2",
    start_crush_fold: false,
    end_crush_fold: false,
    color_side_dir: false,
    tapered: false,
    nodes: [
      {
        node_id: "gwomd9",
        left: 100,
        top: 350,
        next_node_id: "9rnao4",
      },
      {
        node_id: "9rnao4",
        left: 50,
        top: 500,
        prev_node_id: "gwomd9",
        next_node_id: "jeq3bi",
      },
      {
        node_id: "jeq3bi",
        left: 150,
        top: 500,
        prev_node_id: "9rnao4",
        next_node_id: "6jagob",
      },
      {
        node_id: "6jagob",
        left: 200,
        top: 400,
        prev_node_id: "jeq3bi",
        next_node_id: "b7lk16",
      },
      {
        node_id: "b7lk16",
        left: 150,
        top: 350,
        prev_node_id: "6jagob",
      },
    ],
    created_at: "2025-12-27T04:36:55.375396Z",
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-full w-full overflow-hidden">
        <div className="px-4">
          <div className="py-3 pr-2 pl-4 border rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <h6>PRJ - {project?.code}</h6>
              <p className="text-sm">{project?.project_name}</p>
            </div>
            <Button variant="ghost" size="icon-lg" asChild>
              <Link href={`/dashboard/project/${projectId}/edit`}>
                <Edit />
              </Link>
            </Button>
          </div>
        </div>
        {/* <div className="overflow-hidden w-full shrink-0">
          <ScrollArea className="w-full h-full pb-3">
            <div className="flex gap-2 w-max px-4">
              {[0, 0, 0, 0, 0].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl border p-2 w-40 h-35"
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xs">123456</p>
                    <OrderStatusBadge
                      status={formatStatus("pending", "delivery")}
                    />
                  </div>
                  <FlashingSVG
                    flashing={demoFlashing}
                    className="size-25 px-1"
                  />
                  <p className="text-xs">Steel . Black Mate</p>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div> */}

        <div className="pl-6 pr-4 flex pb-1 justify-between -mt-1">
          <p className="text-sm">Delivery Addresses</p>
          <Button size="sm" className="text-xs h-7" variant="outline" asChild>
            <Link href={`/dashboard/project/${projectId}/new-address`}>
              <Plus />
              Add New Address
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden h-full">
          {(project?.addresses.length ?? 0) > 0 ? (
            <ScrollArea className="h-full">
              <div className="grid gap-4 md:grid-cols-2 md:gap-6 px-4 pb-6">
                {project?.addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-xl border px-4 py-3"
                  >
                    <div className="flex gap-2 pb-3">
                      <MapMarker className="size-5 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <h6 className="font-semibold">{addr.title}</h6>
                        <p className="text-sm line-clamp-2">
                          {addr.full_address}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <User className="size-4 mb-0.5 shrink-0" />

                      <p className="text-sm line-clamp-1">
                        {addr.recipient_name} +61{addr.recipient_phone}
                      </p>
                    </div>
                    <div className="flex items-center justify-end -mr-2">
                      <RemoveProjectAddressModal
                        addressId={addr.id}
                        projectId={projectId}
                        onAction={onRemoveAddress}
                      />
                      <Button variant="ghost" size="icon-lg" asChild>
                        <Link
                          href={`/dashboard/project/${project.id}/${addr.id}`}
                        >
                          <Edit />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapMarker />
                </EmptyMedia>
                <EmptyTitle>No Addresses</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                  All of the addresses have been removed.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href={`/dashboard/project/${projectId}/new-address`}>
                    <Plus />
                    Add new address
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </>
  );
}
