// TopBar.jsx
"use client";
import React from "react";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import { XIcon } from "@/components/uikit/icons";
import { ArrowRight } from "@/components/uikit/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { AlertDialogContent, AlertModal } from "../../../uikit/alertModal";
import { cn } from "@/utilities/ui";
import { Button } from "../../../uikit/buttons/button";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const slideFromTop = {
  hidden: {
    y: "-100%",
    opacity: 0,
    transition: { type: "tween", duration: 0.25 },
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "tween", duration: 0.25 },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { type: "tween", duration: 0.2 },
  },
};

const TopBar = ({ onClose, onNext, canvasIsEmpty }) => {
  return (
    <motion.div
      variants={slideFromTop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 left-0 border-b-[1px] border-neutral-midlight z-50"
    >
      <div className="flex justify-between items-center bg-white h-[56px] px-0.5">
        {!canvasIsEmpty ? (
          <AlertDialogPrimitive.Root data-slot="alert-dialog">
            <AlertDialogPrimitive.Trigger
              data-slot="alert-dialog-trigger"
              asChild
            >
              <IconButton
                variant="ghost"
                black
                className="hover:bg-white"
                // onClick={() => router.push('dashboard')}
              >
                <XIcon />
              </IconButton>
            </AlertDialogPrimitive.Trigger>
            <AlertDialogContent className="font-roboto">
              <div
                data-slot="alert-dialog-header"
                className="flex flex-col gap-4"
              >
                <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
                  <XIcon className="text-neutral-dark" variant="secondary" />
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Title
                  data-slot="alert-dialog-title"
                  className="text-sm/[19px] font-semibold"
                >
                  Discard Drawing?
                </AlertDialogPrimitive.Title>

                <AlertDialogPrimitive.Description
                  data-slot="alert-dialog-description"
                  className="text-muted-foreground text-sm"
                >
                  Are you sure you want to discard this drawing? If you discard,
                  your work will be lost.
                </AlertDialogPrimitive.Description>
              </div>
              <div
                data-slot="alert-dialog-footer"
                className={"flex flex-col gap-4 sm:flex-row sm:justify-end"}
              >
                <AlertDialogPrimitive.Action asChild>
                  <Button
                    // onClick={() => {
                    //   // window.location.assign("/dashboard");
                    // }}
                    onClick={onClose}
                    variant="ghost"
                  >
                    Discard
                  </Button>
                </AlertDialogPrimitive.Action>

                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="ghost">Stay</Button>
                </AlertDialogPrimitive.Cancel>
              </div>
            </AlertDialogContent>
          </AlertDialogPrimitive.Root>
        ) : (
          <IconButton
            // onClick={() => {
            //   // window.location.assign("/dashboard");
            // }}
            onClick={onClose}
            variant="ghost"
            black
            className="hover:bg-white"
          >
            <XIcon />
          </IconButton>
        )}

        <h6 className="text-smd font-semibold">Canvas</h6>

        <IconButton
          onClick={onNext}
          variant="ghost"
          black
          className="hover:bg-white"
        >
          <ArrowRight />
        </IconButton>
      </div>
    </motion.div>
  );
};

export default TopBar;
