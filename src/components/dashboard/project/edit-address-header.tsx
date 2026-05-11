"use client";

import { ArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EditAddressHeader({
  projectId,
}: {
  projectId: string | number;
}) {
  const returnHref = useSearchParams().get("return");

  return (
    <div className="fixed flex items-center gap-2 absolute top-2 left-2 text-primary-foreground">
      <Button variant="ghost" size="icon-lg" asChild>
        <Link
          href={
            returnHref === "cart"
              ? "/cart/fulfill"
              : `/dashboard/project/${projectId}`
          }
        >
          <ArrowLeft />
        </Link>
      </Button>

      <h6>Edit Address</h6>
    </div>
  );
}
