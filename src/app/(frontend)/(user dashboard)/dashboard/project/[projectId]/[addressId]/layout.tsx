import { ArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default async function EditAddressLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  return (
    <>
      <div className="fixed flex items-center gap-2 absolute top-2 left-2 text-primary-foreground">
        <Button variant="ghost" size="icon-lg" asChild>
          <Link href={`/dashboard/project/${projectId}`}>
            <ArrowLeft />
          </Link>
        </Button>

        <h6>Edit Address</h6>
      </div>

      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pb-0! h-full shadow-md">
          {children}
        </div>
      </div>
    </>
  );
}
