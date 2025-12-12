import { cn } from "@/utilities/ui";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  ...props
}: {
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
      data-slot="tabs"
      className="grid"
    />
  );
}

export function TabsList({
  className,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      className={cn("flex flex-wrap gap-2", className)}
    />
  );
}

export function TabsTrigger({
  className,
  value,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  value: string;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      {...props}
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-surface-success-subtle data-[state=active]:border-border-success text-body rounded-md border border-border-default transition-[color,box-shadow] grow py-4 px-3 caption-regular",
        className
      )}
    />
  );
}

export function TabsContent({
  className,
  value,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  value: string;
}) {
  return (
    <TabsPrimitive.Content
      value={value}
      {...props}
      data-slot="tabs-content"
      className={cn("", className)}
    />
  );
}
