// NavButton.jsx
import React from "react";

const NavButton = ({
  icon: Icon,
  iconActive: IconActive,
  label,
  active,
  disabled,
  onClick,
}) => (
  <>
    {/* <button
      onClick={() => !disabled && onClick()}
      className={`inline-flex flex-col items-center justify-center mx-1 p-2 w-16 h-16 rounded ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : active
          ? "text-blue-600"
          : "text-gray-800"
      }`}
    >
      {active ? <IconActive className="mb-1" /> : <Icon className="mb-1" />}
      <span className="text-xs font-medium">{label}</span>
    </button> */}
    <button
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={`font-roboto text-xs/[14px] font-medium flex flex-col justify-between items-center flex-grow-0 flex-shrink-0 h-14 w-15 relative [&_svg:not([class*='size-'])]:size-6 pt-2 ${
        disabled
          ? "text-neutral-midlight cursor-not-allowed"
          : active
          ? "text-primary"
          : "text-neutral-dark"
      }`}
    >
      {active ? <IconActive /> : <Icon />}
      <p className="flex-grow-0 flex-shrink-0 text-center pb-2">{label}</p>
    </button>
  </>
);

export default NavButton;
