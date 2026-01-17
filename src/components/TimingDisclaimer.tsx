"use client";

import { Info } from "lucide-react";

export default function TimingDisclaimer() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
      <Info className="w-4 h-4 text-dawn-light flex-shrink-0 mt-0.5" />
      <p className="text-xs text-white/60 leading-relaxed">
        <span className="text-dawn-light font-medium">Live timing note:</span> The schedule 
        may shift slightly throughout the day. The "Live Now" indicator reflects the planned 
        times — actual talks may start a few minutes earlier or later.
      </p>
    </div>
  );
}

