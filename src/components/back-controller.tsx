"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "./icons";

export default function BackController({
  target,
  asButton = false,
}: {
  target: string;
  asButton?: boolean;
}) {
  const router = useRouter();

  const handlePopState = useRef(() => undefined);

  useEffect(() => {
    history.pushState(null, "", location.href);

    handlePopState.current = () => {
      //   history.pushState(null, "", location.href);
      router.replace(target);
    };

    window.addEventListener("popstate", handlePopState.current);

    return () => {
      window.removeEventListener("popstate", handlePopState.current);
    };
  }, [router, target]);

  if (asButton)
    return (
      <Button
        variant="ghost"
        size="icon-lg"
        className="text-primary-foreground hover:bg-transparent hover:text-primary-light"
        onClick={() => handlePopState.current()}
      >
        <ArrowLeft className="size-6" />
      </Button>
    );
  else return null;
}
