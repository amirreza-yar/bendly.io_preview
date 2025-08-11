// UnitSwitcher.jsx
import React from "react";

const units = ["mm", "cm", "inch"];

const UnitSwitcher = ({ unit, onChange, className }) => (
    <p className={className}>Unit: {unit}</p>
//   <button
//     onClick={() => {
//       const next = units[(units.indexOf(unit) + 1) % units.length];
//       onChange(next);
//       console.log(`Unit switched to ${next}`);
//     }}
//     className="bg-white rounded shadow px-3 py-2"
//   >
//     Unit: {unit}
//   </button>
);

export default UnitSwitcher;
