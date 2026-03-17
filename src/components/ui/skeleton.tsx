import { cn } from "@/utilities/ui";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray rounded-md animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };
