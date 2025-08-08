import * as React from "react";
import { cn } from '@/utilities/ui';

function IconButtonGroup({ className, ...props }) {
  return (
    <div
      className={cn("icon_group_button_style", className)}
      {...props}
    />
  );
}

export { IconButtonGroup };
