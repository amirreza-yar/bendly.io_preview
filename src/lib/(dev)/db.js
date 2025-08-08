import Dexie from "dexie";

// Initialize IndexedDB
const db = new Dexie("CanvasDB");
db.version(1).stores({
  canvasData: "id, json, lastDotRef", // Storing JSON state & image
});

export async function saveCanvasState(canvas, lastDotRef) {
  try {
    if (!canvas) return;

    // Get only lines and circles
    const filteredObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "line" || obj.type === "circle");

    // Convert to JSON with only filtered objects
    const json = JSON.stringify({ objects: filteredObjects });

    // Save the canvas state
    await db.canvasData.put({ id: 1, json, lastDotRef });
    // console.log("Canvas state saved.");
  } catch (error) {
    console.error("Failed to save canvas state:", error);
  }
}

// Load the Canvas State
export async function getCanvasState() {
  try {
    const state = await db.canvasData.get(1);
    console.log("Loaded canvas state:", state);
    return state;
  } catch (error) {
    console.error("Failed to load canvas state:", error);
    return null;
  }
}
