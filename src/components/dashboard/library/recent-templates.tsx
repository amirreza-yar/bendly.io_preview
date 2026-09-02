import api from "@/lib/axios";
import { ScrollArea } from "../../ui/scroll-area";
import { cookies } from "next/headers";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty";
import { Templates } from "../../icons";
import { Template } from "@/types/api";
import RecentTemplateCard from "./recent-template-card";

export function RecentTemplatesLoading() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1 md:gap-2 pb-4 px-4 sm:px-6">
      {[0, 0, 0, 0, 0, 0].map((temp, index) => (
        <div
          key={index}
          className="flex flex-col gap-1.5 justify-center rounded-md p-2 border animate-pulse"
        >
          <div className="h-18 bg-gray-300 rounded-md" />
          <div className="bg-gray-300 h-3 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

const onFetchRecentTemplates: () => Promise<Template[] | []> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/template", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return (
      res.data.results ?? [
        {
          id: 1,
          name: "Demo Flashing",
          start_crush_fold: true,
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
        },
        {
          id: 2,
          name: "Demo Flashing 2",
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
          created_at: "2025-12-27T04:37:18.892653Z",
        },
        {
          id: 3,
          name: "New Flashing tst",
          start_crush_fold: false,
          end_crush_fold: false,
          color_side_dir: false,
          tapered: false,
          nodes: [
            {
              node_id: "xl3lwx",
              left: 150,
              top: 300,
              next_node_id: "6ak18v",
            },
            {
              node_id: "6ak18v",
              left: 100,
              top: 500,
              prev_node_id: "xl3lwx",
              next_node_id: "chcuja",
            },
            {
              node_id: "chcuja",
              left: 250,
              top: 600,
              prev_node_id: "6ak18v",
              next_node_id: "fjpxip",
            },
            {
              node_id: "fjpxip",
              left: 250,
              top: 500,
              prev_node_id: "chcuja",
              next_node_id: "byya4a",
            },
            {
              node_id: "byya4a",
              left: 250,
              top: 450,
              prev_node_id: "fjpxip",
              next_node_id: "k0g6g1",
            },
            {
              node_id: "k0g6g1",
              left: 200,
              top: 400,
              prev_node_id: "byya4a",
            },
          ],
          created_at: "2025-12-28T05:27:17.667585Z",
        },
        {
          id: 5,
          name: "New Template",
          start_crush_fold: false,
          end_crush_fold: false,
          color_side_dir: false,
          tapered: false,
          nodes: [
            {
              node_id: "47eqnr",
              left: 100,
              top: 350,
              next_node_id: "wfd8vi",
            },
            {
              node_id: "wfd8vi",
              left: 50,
              top: 500,
              prev_node_id: "47eqnr",
              next_node_id: "v9fesv",
            },
            {
              node_id: "v9fesv",
              left: 150,
              top: 500,
              prev_node_id: "wfd8vi",
              next_node_id: "7xsm71",
            },
            {
              node_id: "7xsm71",
              left: 200,
              top: 400,
              prev_node_id: "v9fesv",
              next_node_id: "iayzk7",
            },
            {
              node_id: "iayzk7",
              left: 150,
              top: 350,
              prev_node_id: "7xsm71",
              next_node_id: "4k8nzj",
            },
            {
              node_id: "4k8nzj",
              left: 150,
              top: 250,
              prev_node_id: "iayzk7",
            },
          ],
          created_at: "2025-12-28T05:50:50.489167Z",
        },
      ]
    );
  } catch {
    return [];
  }
};

export default async function RecentTemplates() {
  const templates = await onFetchRecentTemplates();

  if (!templates?.length) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Templates />
          </EmptyMedia>
          <EmptyTitle>No Templates Yet</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            Start designing your first flashing.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 md:gap-2 pb-4 px-4 sm:px-6">
        {templates?.slice(0, 6).map((temp) => (
          <RecentTemplateCard template={temp} key={temp.id} />
        ))}
      </div>
    </ScrollArea>
  );
}
