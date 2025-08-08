import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from '@/utilities/ui';

const iconButtonVariants = cva("icon_button_style", {
  variants: {
    variant: {
      default: "icon_button_style_default",
      black_default: "icon_button_black_style_default",

      secondary: "icon_button_style_secondary",
      black_secondary: "icon_button_black_style_secondary",

      ghost: "icon_button_style_ghost",
      black_ghost: "icon_button_black_style_ghost",
    },
    size: {
      small: "icon_button_style_small",
      medium: "icon_button_style_medium",
      large: "icon_button_style_large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "large",
  },
});

function IconButton({ className, variant = "default", size = "large", black = false, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  // Compose the variant key like "black_default" or just "default"
  const finalVariant = black ? `black_${variant}` : variant;

  return (
    <Comp
      data-slot="button"
      className={cn(iconButtonVariants({ variant: finalVariant, size, className }))}
      {...props}
    />
  );
}

export { IconButton, iconButtonVariants };
