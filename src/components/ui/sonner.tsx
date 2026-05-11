"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={"dark" as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#171717",
          "--normal-text": "#fff",
          "--normal-border": "#171717",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      mobileOffset={{ bottom: "50px", right: "0", left: "0" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "rounded-xl! bg-[#171717] text-base px-6 py-[12.5px] rounded-md max-w-fit! left-0 right-0 mx-auto! shadow-md h-12",
          title: "font-roboto text-xs/[22.5px] text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
