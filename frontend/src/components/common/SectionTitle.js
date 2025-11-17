import React from "react";

export function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="inline-block text-xs tracking-widest uppercase font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h2>
      {desc && <p className="mt-2 text-gray-600">{desc}</p>}
    </div>
  );
}
