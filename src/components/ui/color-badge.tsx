import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/utilities/ui";

const colorBadgeVariants = cva(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        green: "bg-success-subtle/60 text-green-700",
        orange: "bg-alert-subtle/60 text-orange-700",
        red: "bg-destructive-subtle/60 text-red-700",
        blue: "bg-primary-lightest/60 text-blue-700",
        gray: "bg-gray text-black/60",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

function ColorBadge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof colorBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(colorBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ColorBadge, colorBadgeVariants };
