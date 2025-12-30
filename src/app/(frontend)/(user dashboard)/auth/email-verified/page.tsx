import { Button } from "@/components/uikit/buttons/button";
import { FeaturedSuccess, MainLogo } from "@/components/uikit/icons";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <div className="flex h-full w-full items-center justify-center relative">
      <div className="absolute flex items-center gap-2 mx-auto top-4 text-[14px] font-semibold">
        <MainLogo className="size-6 text-primary" />
        Bendly.io
      </div>

      <div className="flex flex-col items-center gap-2 rounded-lg">
        <FeaturedSuccess className="size-10 mb-4" />
        <h6>Your email has been verified</h6>
        <p className="text-[13px]">You can now login to your account</p>
        <Button
          variant="secondary"
          size="default"
          className="mt-6 w-full"
          asChild
        >
          <Link href="/auth">Login</Link>
        </Button>
      </div>
    </div>
  );
}
