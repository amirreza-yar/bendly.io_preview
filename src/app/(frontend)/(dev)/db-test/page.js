"use client";

import { useEffect, useState } from "react";
import { saveDrawing, getDrawings } from "@/lib/(dev)/db";

export default function CanvasPage() {
    const [name, setName] = useState("");
    const [drawings, setDrawings] = useState([]);

    useEffect(() => {
        // Load saved drawings on component mount
        getDrawings().then(setDrawings);
    }, []);

    const handleSave = () => {
        const fakeCanvasData = "base64-image-data"; // Replace with actual Fabric.js canvas data
        saveDrawing(name, fakeCanvasData).then(() => {
            getDrawings().then(setDrawings); // Refresh list
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Offline Drawing Storage</h1>
            <input
                type="text"
                placeholder="Enter drawing name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
            />
            <button onClick={handleSave} className="bg-blue-500 text-white p-2 ml-2 rounded">
                Save Drawing
            </button>

            <h2 className="mt-4 text-lg">Saved Drawings:</h2>
            <ul>
                {drawings.map((d) => (
                    <li key={d.id} className="mt-2 border p-2 rounded">
                        {d.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
