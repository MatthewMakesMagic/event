"use client";

import { useState } from "react";
import { Search, Smartphone } from "lucide-react";
import { formatTimeICT, Event } from "@/data/events";
import PangiaLogo from "./PangiaLogo";
import SearchModal from "./SearchModal";

interface HeaderProps {
  currentTime: Date;
  onEventSelect?: (event: Event) => void;
}

export default function Header({ currentTime, onEventSelect }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  const formattedTime = formatTimeICT(currentTime);
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  });

  const handleEventSelect = (event: Event) => {
    if (onEventSelect) {
      onEventSelect(event);
    }
    setShowSearch(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-dark border-b border-white/10 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PangiaLogo className="w-9 h-9" />
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  Pangia.
                </h1>
                <p className="text-xs text-white/50">
                  {formattedDate} · {formattedTime} ICT
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSearch(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 touch-feedback"
              aria-label="Search events"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          {/* Pangiapass Promo Banner */}
          <a
            href="https://pangiapass.com/nomad-summit"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-dawn-teal/20 to-dawn-sand/20 border border-dawn-teal/30 touch-feedback"
          >
            <Smartphone className="w-4 h-4 text-dawn-teal flex-shrink-0" />
            <p className="text-xs text-white/80 flex-1">
              <span className="text-dawn-teal font-medium">Free global data!</span>
              {" "}Get 10 days unlimited eSIM with Pangia →
            </p>
          </a>
        </div>
      </header>
      
      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onEventSelect={handleEventSelect}
      />
    </>
  );
}
