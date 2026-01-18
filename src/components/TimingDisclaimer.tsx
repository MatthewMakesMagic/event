"use client";

import { Heart } from "lucide-react";

export default function TimingDisclaimer() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
      <Heart className="w-4 h-4 text-dawn-light flex-shrink-0 mt-0.5" />
      <p className="text-xs text-white/60 leading-relaxed">
        <span className="text-dawn-light font-medium">Thanks for an amazing event, Christoph and Alexandra!</span>
      </p>
    </div>
  );
}



