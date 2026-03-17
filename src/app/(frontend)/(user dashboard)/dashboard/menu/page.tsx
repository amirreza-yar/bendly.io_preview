// components/GlobalMenu.tsx
"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChatBubleCircleQuestion,
  CircleQuestion,
  Document,
  FeaturedCheckSmall,
  LightBulb,
  Ruler,
  ScrollPrivacyUp,
  XIcon,
} from "@/components/uikit/icons";
import { Drawer, DrawerClose } from "@/components/uikit/drawer";
import { Separator } from "@/components/uikit/separator";
import { cn } from "@/utilities/ui";
import { ButtonListItem } from "@/components/uikit/buttons/buttonListItem";
import Link from "next/link";
import BottomNav from "@/components/dashboard/bottom-nav";

export default function MenuPanel() {
  const [measurement, setMeasurement] = useState("metric");
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before navigating
    setTimeout(() => {
      window.history.back();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 transition-all duration-500 ${
        isVisible && !isClosing
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute top-0 w-full h-full bg-[#eee] transition-all duration-500 ease-out ${
          isVisible && !isClosing ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`bg-surface-card p-4 border-b-1 border-b-border-dark flex items-center gap-xl transition-all duration-700 ${
            isClosing ? "delay-0" : "delay-100"
          } ${
            isVisible && !isClosing
              ? "translate-y-0 opacity-100"
              : "translate-y-[-20px] opacity-0"
          }`}
        >
          <button onClick={handleClose} className="cursor-pointer">
            <ArrowLeft />
          </button>
          <h6 className="text-smd text-heading font-semibold">Menu</h6>
        </div>
        <div className="flex flex-col justify-start items-center flex-grow w-full pb-4">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
            <div
              className={`flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 px-4 pt-4 pb-1 bg-white transition-all duration-700 ${
                isClosing ? "delay-0" : "delay-200"
              } ${
                isVisible && !isClosing
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-20px] opacity-0"
              }`}
            >
              <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-900">
                  Global Setting
                </p>
              </div>
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-12 bg-white cursor-pointer hover:bg-gray-100">
                <div className="flex flex-col justify-center items-start flex-grow">
                  <Drawer
                    trigger={<ButtonListItem text="Measurement" icon={Ruler} />}
                  >
                    <div className="flex flex-col p-6">
                      <div className="flex justify-between pb-6">
                        <h6>Measurement</h6>
                        <DrawerClose asChild>
                          <XIcon className="size-6" />
                        </DrawerClose>
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-between p-4 h-16",
                          measurement === "metric" && "bg-surface-comp-active",
                        )}
                        onClick={() => setMeasurement("metric")}
                      >
                        <span className="label-regular">Metric</span>
                        {measurement === "metric" && <FeaturedCheckSmall />}
                      </div>
                      <div className="w-full px-4">
                        <Separator className="" />
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-between p-4 h-16",
                          measurement === "imperial" &&
                            "bg-surface-comp-active",
                        )}
                        onClick={() => setMeasurement("imperial")}
                      >
                        <div className="flex flex-col gap-2">
                          <span className="label-regular">Imperial</span>
                          <span className="caption-small">Imperial</span>
                        </div>
                        {measurement === "imperial" && <FeaturedCheckSmall />}
                      </div>
                    </div>
                  </Drawer>
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-3 px-4 pt-4 pb-1 bg-white transition-all duration-700 ${
                isClosing ? "delay-0" : "delay-300"
              } ${
                isVisible && !isClosing
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-20px] opacity-0"
              }`}
            >
              <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-900">
                  Help &amp; Support
                </p>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
                <ButtonListItem text="FAQ" icon={CircleQuestion} />

                <ButtonListItem text="Tips" icon={LightBulb} />

                <ButtonListItem text="Support" icon={ChatBubleCircleQuestion} />
              </div>
            </div>
            <div
              className={`flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-3 px-4 pt-4 pb-1 bg-white transition-all duration-700 ${
                isClosing ? "delay-0" : "delay-400"
              } ${
                isVisible && !isClosing
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-20px] opacity-0"
              }`}
            >
              <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-900">
                  Legal
                </p>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
                <ButtonListItem text="Privacy Policy" icon={ScrollPrivacyUp} />
                <ButtonListItem text="Term of Use" icon={Document} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
