import { cn } from "@/utilities/ui";

export default function Header({
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
        variant === "short" ? "h-[195px]" : "h-[283px]",
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
