import { cn } from "@/utilities/ui";
import { ReactNode } from "react";

export function UILayoutBackground({
  className,
  variant = "short",
}: {
  className?: string;
  variant?: "short" | "long";
}) {
  return (
    <div
      className={cn(
        "fixed top-0 w-full h-[283px] bg-gradient-to-t from-[#132a55] to-[#295cbb]",
        variant === "short"
          ? "h-[195px] sm:h-[324px]"
          : "h-[283px] sm:h-[420px]",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export function UILayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={cn("relative", className)}>
        <UILayoutBackground variant="long" />
        {children}
      </div>
    </>
  );
}

export function UILayoutHeader({ children }: { children: ReactNode }) {
  return (
    <>
      <UILayoutBackground variant="long" />
      {children}
    </>
  );
}

export function UILayoutContentWrapper({
  className,
  children,
  //   ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="div"
      className={cn("absolute top-44 left-1/2 -translate-x-1/2", className)}
    >
      {children}
    </div>
  );
}

export function UILayoutContent({
  className,
  children,
  //   ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "px-4 py-6 rounded-lg shadow-md w-[calc(100vw-32px)] sm:w-[calc(100vw-65px)] bg-background",
        className,
      )}
    >
      {children}
    </div>
  );
}
