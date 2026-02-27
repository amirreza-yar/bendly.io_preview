"use client";
import BottomNav from "@/components/dashboard/bottom-nav";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Plus, Settings } from "lucide-react";
import Link from "next/link";

type Node = {
  node_id: string;
  left: number;
  top: number;
  prev_node_id?: string;
  next_node_id?: string;
};

type Template = {
  id: number;
  name: string;
  start_crush_fold: boolean;
  end_crush_fold: boolean;
  color_side_dir: boolean;
  tapered: boolean;
  nodes: Node[];
};

export default function Page() {
  // const router = useRouter();
  // const { data: jobReferences } = useSWR("/a/job-ref/", fetcher);

  // const { data: cart, mutate: mutateCart } = useSWR("/a/cart/", fetcher);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // console.log('sw registered!')
          // console.log(reg)
        })
        .catch((error) => {
          // console.log('sw reg failed!')
          // console.log(error)
        });
    }
  }, []);

  // const newFlashing = () => {
  //   router.push(`/f/material`);
  // };

  // const onDiscardCart = async () => {
  //   try {
  //     await api.post("/a/cart/discard-cart/");

  //     toast("Card discarded");
  //     mutateCart();
  //   } catch (err: any) {
  //     toast("Something went wrong");
  //   }
  // };

  const { data, isLoading: templatesLoading } = useSWR<{ results: Template[] }>(
    "/a/template",
    fetcher,
  );

  const templates = data ? data.results : [];

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-0 w-full">
          <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
            Bendly
          </h6>

          <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-1 top-1 text-primary-foreground hover:bg-transparent hover:text-primary-light"
            asChild
          >
            <Link href="/dashboard/setting">
              <Settings className="size-6" />
            </Link>
          </Button>

          <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 text-primary-foreground text-center">
            <h5 className="overflow-hidden">Start Your Flashing Design!</h5>
            <p className="caption-small">
              Create a new order or use a template to begin
            </p>
          </div>
        </div>
        <UILayoutContentWrapper className="top-40 pb-17">
          <UILayoutContent className="py-4">
            <div className="flex flex-col gap-2">
              <Button size="lg">
                <Plus />
                New Order
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard/library">
                  Use Templates
                  <ArrowRight />
                </Link>
              </Button>

              <div className="flex items-center justify-between caption-small pt-1 pb-1">
                Recent Templates
                <Button variant="link" size="xs" asChild>
                  <Link href="/dashboard/library">
                    View All
                    <ChevronRight />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {templatesLoading
                  ? [0, 0, 0, 0, 0, 0].map((temp, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1.5 justify-center rounded-md p-2 border animate-pulse"
                      >
                        <div className="h-18 bg-gray-300 rounded-md" />
                        <div className="bg-gray-300 h-3 w-full rounded-md" />
                      </div>
                    ))
                  : templates?.slice(0, 6).map((temp) => (
                      <div
                        key={temp.id}
                        className="flex flex-col gap-1.5 justify-center rounded-md p-2 pt-1 border"
                      >
                        <div className="h-18  border-b" />
                        <p className="w-full text-center label-xxsmall px-2 py-1 border rounded-full truncate">
                          {temp.name}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>
      <BottomNav />
    </>
  );
}
