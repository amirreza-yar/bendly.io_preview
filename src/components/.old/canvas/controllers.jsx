'use client'
import { useCanvasContext } from '@/providers/canvasContextProvider'

import {
  CrushFold,
  Ruler,
  Drawing,
  Modify,
  Taper,
  CrushFoldBold,
  RulerBold,
  DrawingBold,
  ModifyBold,
  TaperBold,
  Crosshair,
  CircleQuestion,
  XIcon,
  ArrowRight,
  UTurnLeftUp,
  UTurnRightUp,
  Earaser,
  Move,
  Resize,
  EaraserBold,
  MoveBold,
  ResizeBold,
} from '@/components/ui/icon'
import { SingleButton } from '@/components/ui/canvas/button'
import { BottomNavbar } from '@/components/ui/canvas/navbar'
import useObejctUtils from '@/hooks/canvas/useObjectUtils'

export default function CanvasControllers({ handleRedo, handleUndo }) {
  const { setIsDrawing, setIsResizing , objectsZoomScale,} = useCanvasContext()
  const { centerDrawingGroup } = useObejctUtils()

  // const centerGroupWithPadding = (padding = 80, duration = 500) => {
  //   const canvas = canvasInstance.current;

  //   const { drawingGroup } = groupDrawings();

  //   const canvasWidth = canvas.getWidth();
  //   const canvasHeight = canvas.getHeight();

  //   const groupBounds = drawingGroup.getBoundingRect(); // Absolute bounding box
  //   const groupCenter = {
  //     x: groupBounds.left + groupBounds.width / 2,
  //     y: groupBounds.top + groupBounds.height / 2,
  //   };

  //   // 🔍 Calculate scale to fit with padding
  //   const availableWidth = canvasWidth - 2 * padding;
  //   const availableHeight = canvasHeight - 2 * padding;

  //   const scaleX = availableWidth / groupBounds.width;
  //   const scaleY = availableHeight / groupBounds.height;

  //   let targetScale = Math.max(0.5, Math.min(10, Math.min(scaleX, scaleY)));

  //   // 🛑 Clamp scale (optional, adjust as needed)
  //   targetScale = Math.min(Math.max(targetScale, 0.1), 2); // Between 0.1 and 2

  //   // 🎯 Translate to center the group after scaling
  //   const dx = canvasWidth / 2 - groupCenter.x * targetScale;
  //   const dy = canvasHeight / 2 - groupCenter.y * targetScale;

  //   const endTransform = [targetScale, 0, 0, targetScale, dx, dy];
  //   const startTransform = canvas.viewportTransform.slice();

  //   // canvas.viewportTransform = endTransform;

  //   // 🌀 Animate
  //   util.animate({
  //     startValue: 0,
  //     endValue: 1,
  //     duration,
  //     easing: util.ease.easeOutQuad,
  //     onChange: (t) => {
  //       const interpolated = startTransform.map((start, i) => {
  //         const end = endTransform[i];
  //         return start + (end - start) * t;
  //       });

  //       canvas.viewportTransform = interpolated;
  //       canvas.requestRenderAll();
  //     },
  //     onComplete: () => {
  //       canvas.viewportTransform = endTransform;
  //       unGroupDrawings();
  //       createGrid();
  //       canvas.setZoom(targetScale);
  //       setZoomTargetRef(targetScale);

  //       canvas.renderAll();
  //     },
  //   });
  // };

  // const crossHairFunction = () => {
  //   const canvas = canvasInstance.current;
  //   if (!canvas) return;

  //   const startTransform = canvas.viewportTransform.slice(); // Clone current transform
  //   const endTransform = [0.5, 0, 0, 0.5, 0, 0]; // Target transform

  //   const duration = 300; // Animation duration in ms

  //   // const objects = canvas
  //   //   .getObjects()
  //   //   .filter((obj) => obj.type === "circle" || obj.type === "line");

  //   // if (objects.length === 0) return; // No objects to group

  //   // const group = new Group(objects, {
  //   //   name: "drawing_group",
  //   //   // selectable: true,
  //   //   // evented: true,
  //   //   selectable: false,
  //   //   evented: false,
  //   //   hasControls: false,
  //   //   hasBorders: false,
  //   //   lockRotation: true,
  //   //   lockScalingX: true,
  //   //   lockScalingY: true,
  //   //   lockMovementX: true,
  //   //   lockMovementY: true,
  //   //   objectCaching: true,
  //   //   statefullCache: true,
  //   // });

  //   // // Add the group to the canvas
  //   // canvas.add(group);

  //   // // Remove individual objects from the canvas
  //   // objects.forEach((obj) => canvas.remove(obj));

  //   // canvas.requestRenderAll();

  //   // Animate each component of the transform array
  //   util.animate({
  //     startValue: 0,
  //     endValue: 1,
  //     duration,
  //     easing: util.ease.easeOutQuad,
  //     onChange: (t) => {
  //       // Linear interpolation between start and end transforms
  //       const interpolated = startTransform.map((start, i) => {
  //         const end = endTransform[i];
  //         return start + (end - start) * t;
  //       });

  //       createGrid();
  //       canvas.viewportTransform = interpolated;
  //       canvas.requestRenderAll();
  //     },
  //     onComplete: () => {
  //       canvas.viewportTransform = endTransform;
  //       canvas.requestRenderAll();
  //     },
  //   });
  // };

  const navItems = [
    {
      icon: Ruler,
      label: 'Ruler',
      iconActive: RulerBold,
      onClick: () => {
        console.log('Ruler clicked!')
      },
    },
    {
      icon: Modify,
      label: 'Modify',
      iconActive: ModifyBold,
      onClick: () => {
        console.log('Modify clicked!')
      },
    },
    {
      icon: Drawing,
      label: 'Drawing',
      iconActive: DrawingBold,
      onClick: () => setIsDrawing((prev) => !prev),
    },
    {
      icon: Taper,
      label: 'Taper',
      iconActive: TaperBold,
      onClick: () => {
        console.log('Taper clicked!')
      },
    },
    {
      icon: CrushFold,
      label: 'CrushFold',
      iconActive: CrushFoldBold,
      onClick: () => {
        console.log('CrushFold clicked!')
      },
    },
  ]

  const ModifyMenuItems = [
    { icon: Earaser, label: 'Remove', iconActive: EaraserBold },
    { icon: Move, label: 'Move', iconActive: MoveBold },
    { icon: Resize, label: 'Resize', iconActive: ResizeBold },
  ]

  return (
    <>
      <div className="fixed top-0 right-0 left-0 border-b z-50">
        <div className="flex justify-between items-center bg-white h-[56px] px-4">
          <button className="cursor-pointer">
            <XIcon className="ml-4" />
          </button>

          <h1 className="font-bold">Canvas</h1>

          <button className="cursor-pointer">
            <ArrowRight className="mr-4" />
          </button>
        </div>
      </div>
      {/* Top Row: Question Button */}
      <div className="fixed top-[56px] mt-4 left-0 right-0 mx-auto -md px-4 z-50">
        <div className="flex justify-between mb-4">
          <SingleButton>
            <div onClick={() => handleUndo()}>
              <UTurnLeftUp />
            </div>
            <hr className="border-r border-gray-300 h-4" />
            <div onClick={() => handleRedo()}>
              <UTurnRightUp />
            </div>
          </SingleButton>
          <SingleButton>
            <CircleQuestion />
          </SingleButton>
        </div>
      </div>

      {/* Bottom Section: Crosshair + Navbar */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto -sm px-4 z-50">
        <div
          className="flex justify-end mb-4"
          onClick={() => {
            console.log('crosshair clicked!')
            centerDrawingGroup(50, 150, 150)
          }}
        >
          <SingleButton>
            <Crosshair onClick={() => {}} />
          </SingleButton>
        </div>

        {/* Navigation Bar */}
        <BottomNavbar navItems={navItems} dropDownMenuItems={ModifyMenuItems} />
      </div>
    </>
  )
}
