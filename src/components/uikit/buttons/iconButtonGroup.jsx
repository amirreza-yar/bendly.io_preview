import * as React from "react";
import { cn } from "@/lib/utils";

function IconButtonGroup({ className, ...props }) {
  return (
    <div
      className={cn("icon_group_button_style", className)}
      {...props}
    />
  );
}

export { IconButtonGroup };
