"use client";

import { CONFERENCE_DATES, isTodayICT } from "@/data/events";
import { useRef, useEffect } from "react";

interface DayTabsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  eventType: "all" | "main_conference" | "side_event";
}

export default function DayTabs({ selectedDate, onDateChange, eventType }: DayTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  
  // Filter dates based on event type
  const dates = eventType === "main_conference"
    ? CONFERENCE_DATES.filter((d) => d.isMainConference)
    : eventType === "side_event"
    ? CONFERENCE_DATES.filter((d) => !d.isMainConference || d.date === "2026-01-18") // Include pool party day
    : CONFERENCE_DATES;
  
  // Scroll selected date into view
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = selectedRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      const scrollLeft = element.offsetLeft - container.offsetLeft - (containerRect.width / 2) + (elementRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedDate]);
  
  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-4 px-4"
    >
      {dates.map((dateInfo) => {
        const isSelected = dateInfo.date === selectedDate;
        const isTodayDate = isTodayICT(dateInfo.date);
        
        return (
          <button
            key={dateInfo.date}
            ref={isSelected ? selectedRef : null}
            onClick={() => onDateChange(dateInfo.date)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all touch-feedback ${
              isSelected
                ? "bg-gradient-to-br from-daybreak-gold to-daybreak-mid text-pangia-black"
                : "glass text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className={`text-xs font-medium uppercase tracking-wide ${
              isSelected ? "text-pangia-black/70" : "text-white/50"
            }`}>
              {dateInfo.day}
            </span>
            <span className={`text-lg font-bold ${
              isSelected ? "text-pangia-black" : ""
            }`}>
              {dateInfo.dayNum}
            </span>
            {isTodayDate && (
              <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                isSelected ? "bg-pangia-black/50" : "bg-daybreak-gold"
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

