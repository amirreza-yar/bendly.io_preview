"use client";
import { useState } from "react";

import { useCanvasContext } from "@/providers/canvasContextProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useObejctUtils from "@/hooks/canvas/useObjectUtils";
import { Line } from "fabric";

const BottomNavbar = ({ navItems, dropDownMenuItems }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { canvasIsEmpty, isResizing, setIsResizing, canvasInstance, isDrawing } =
    useCanvasContext();
  const { centerDrawingGroup } = useObejctUtils();

  return (
    <div
      className="flex justify-center items-center rounded-[12px] bg-white mx-auto mb-4 overflow-x-auto"
      style={{ boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.15)" }}
    >
      {navItems.map((item, index) => {
        const isActive = index === activeIndex;
        if (index == 1)
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex flex-col items-center relative bg-white cursor-pointer mx-1
                        p-2 gap-1
                        w-16 h-16"
                  onClick={() => {
                    if (!canvasIsEmpty) return;
                    setActiveIndex(-1);
                  }}
                >
                  {!canvasIsEmpty ? (
                    <item.icon className="text-gray-800" />
                  ) : (
                    <item.icon fill={"#808080"} />
                  )}

                  <div
                    className={`relative w-fit text-center text-[10px]
                              ${
                                !canvasIsEmpty
                                  ? "font-medium text-gray-800"
                                  : "font-medium text-gray-500"
                              }
                              `}
                  >
                    {item.label}
                  </div>

                  <svg
                    className="absolute right-1.5 top-1.5 md:right-2 md:top-2"
                    width="8"
                    height="8"
                    viewBox="0 0 9 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.3 0.936157H0.982843C0.804662 0.936157 0.715428 1.15159 0.841421 1.27758L8.15858 8.59474C8.28457 8.72073 8.5 8.6315 8.5 8.45331V1.13616C8.5 1.0257 8.41046 0.936157 8.3 0.936157Z"
                      fill={!canvasIsEmpty ? "#13193A" : "#808080"}
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col justify-center items-center rounded-[12px] bg-white mb-2 w-full p-1"
                style={{
                  boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                {dropDownMenuItems.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className="inline-flex flex-col items-center relative bg-white cursor-pointer
                            p-2 gap-1
                            w-16 h-16"
                      onClick={() => {
                        if (item.label === "Resize") {
                          console.log("resizing clicked!");
                          // centerDrawingGroup();
                          setIsResizing(!isResizing);
                        }
                      }}
                    >
                      <item.icon className="text-gray-800" />

                      <div className="relative w-fit text-center text-[10px]">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          );
        return (
          <button
            key={index}
            className="inline-flex flex-col items-center relative bg-white cursor-pointer mx-1
                p-2 gap-1
                w-16 h-16"
            onClick={() => {
              if (index !== 2) {
                if (!canvasIsEmpty) {
                  activeIndex === index
                    ? setActiveIndex(-1)
                    : setActiveIndex(index);
                  item.onClick();
                }
              } else {
                activeIndex === index
                  ? setActiveIndex(-1)
                  : setActiveIndex(index);
                item.onClick();
              }
            }}
          >
            {index === 2 ? (
              isActive ? (
                <item.iconActive className="text-[#3C50D3]" />
              ) : (
                <item.icon className="text-gray-800" />
              )
            ) : !canvasIsEmpty ? (
              isActive ? (
                <item.iconActive className="text-[#3C50D3]" />
              ) : (
                <item.icon className="text-gray-800" />
              )
            ) : (
              <item.icon fill="#808080" />
            )}

            <div
              className={`relative w-fit text-center text-[10px]
                            ${
                              (
                                index === 2
                                  ? isActive
                                  : !canvasIsEmpty && isActive
                              )
                                ? "font-bold text-[#3C50D3]"
                                : canvasIsEmpty
                                ? "font-medium text-gray-500"
                                : "font-medium text-gray-800"
                            }
                            `}
            >
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export { BottomNavbar };
