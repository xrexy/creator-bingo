"use client";

import { useEffect, useState } from "react";

export type BetaOverlayProps = {};

export function BetaOverlay({}: BetaOverlayProps) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hidden = localStorage.getItem("beta-overlay-hidden");
    setHidden(hidden === "true");
  }, []);

  if (hidden) return null;

  return (
    <div className="absolute z-10 p-2 bg-black border-2 rounded-md border-gray-200/10 bottom-4 right-4">
      <p>
        This is a <span className="font-semibold text-sky-400">Beta</span>{" "}
        build.
      </p>
      <p className="text-sm ">Everything is subject to change.</p>

      <button
        className="absolute top-2 right-2"
        onClick={() => {
          setHidden(true);
          localStorage.setItem("beta-overlay-hidden", "true");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default BetaOverlay;

