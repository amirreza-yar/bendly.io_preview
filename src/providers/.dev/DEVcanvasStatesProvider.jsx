"use client";
import { createContext, useContext, useRef, useState } from "react";

const CanvasContext = createContext(null);

export const CanvasContextProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const gridGroupRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);
  const lastDotRef = useRef(null);
  const [canvasIsEmpty, setCanvasIsEmpty] = useState(true);
  const [objectIdCount, setObjectIdCount] = useState(1);
  const [drawingsGrouped, setDrawingsGrouped] = useState(false);
  const [isPan, setIsPan] = useState(true);
  const [isPinchZoom, setIsPinchZoom] = useState(true);
  const [isDrawing, setIsDrawing] = useState(true);

  // const createCanvas = useCanvas();

  // Function to set canvasRef and save it in DB
  const setCanvasRef = (canvas) => {
    canvasRef.current = canvas;
    // saveCanvasState(canvas);
  };

  // Function to set canvasInstance and save it in DB
  const setCanvasInstance = (canvas) => {
    // var json = JSON.stringify(canvas);

    // clear canvas
    // canvas.clear();

    // and load everything from the same json
    // canvas.loadFromJSON(json, function () {
    //   // making sure to render canvas at the end
    //   canvas.renderAll();

    //   // and checking if object's "name" is preserved
    //   console.log(canvas.item(0).name);
    // });
    canvasInstance.current = canvas;
    // saveCanvasState(canvas);
  };

  const setGridGroupRef = (gridGroup) => {
    gridGroupRef.current = gridGroup;
  };

  const setLastDotRef = (lastDot) => {
    lastDotRef.current = lastDot;
  };

  // useEffect(() => {
  //   async function loadCanvasState() {
  //     const savedState = await getCanvasState();
  //     if (savedState) {
  //       console.log("Loaded canvas state inside effect:", savedState.json);
  //       canvasInstance.current.clear();
  //       canvasInstance.current.loadFromJSON(savedState.json, () => {
  //         canvasInstance.current.renderAll();
  //         // console.log(canvasInstance.current.item(0).name);
  //       }); // Restore JSON
  //       setCanvasInstance(canvasInstance.current);
  //       setLastDotRef(savedState.lastDotRef.current)
  //     } else {
  //       console.log("NOT Loaded canvas state inside effect");
  //     }
  //     // setIsLoaded(true);
  //   }
  //   loadCanvasState();
  // }, []);

  // useEffect(() => {
  //   const circleObjs = canvasInstance.current
  //     .getObjects()
  //     .filter((obj) => obj.type === "circle");
  //   console.log("Circles are: " + circleObjs);
  //   setCanvasIsEmpty(circleObjs.length === 0);
  //   // console.log("canvas is empty: " + canvasIsEmpty);
  // }, [lastDotRef]);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        canvasInstance,
        setCanvasRef,
        setCanvasInstance,
        gridGroupRef,
        setGridGroupRef,
        isDrawing,
        setIsDrawing,
        circles,
        setCircles,
        lines,
        setLines,
        lastDotRef,
        setLastDotRef,
        canvasIsEmpty,
        scale,
        setScale,
        setCanvasIsEmpty,
        objectIdCount,
        setObjectIdCount,
        drawingsGrouped,
        setDrawingsGrouped,
        isPan,
        setIsPan,
        isPinchZoom,
        setIsPinchZoom,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => useContext(CanvasContext);
