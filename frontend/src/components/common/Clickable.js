// frontend/src/components/common/Clickable.js
import React from "react";

export default function Clickable({ onClick, className = "", children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className={["w-full text-left", className].join(" ")}
    >
      {children}
    </div>
  );
}
