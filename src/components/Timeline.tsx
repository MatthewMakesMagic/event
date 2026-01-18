"use client";

import { useEffect, useRef } from "react";
import { Event, isEventLive } from "@/data/events";
import EventCard from "./EventCard";

interface TimelineProps {
  events: Event[];
  currentTime: Date;
  hasInterest: (eventId: string) => boolean;
  getInterestCount: (eventId: string) => number;
  onToggleInterest: (eventId: string) => void;
  scrollToEventId?: string | null;
  getEventAvailability?: (
    eventId: string,
    defaultSpots?: number,
    defaultSoldOut?: boolean
  ) => {
    spotsAvailable: number | null;
    isSoldOut: boolean;
    isLive: boolean;
    lastChecked: number | null;
  };
}

function groupEventsByTime(events: Event[]): Map<string, Event[]> {
  const groups = new Map<string, Event[]>();
  
  events.forEach((event) => {
    const hour = event.startTime.split(":")[0];
    const timeSlot = `${hour}:00`;
    
    if (!groups.has(timeSlot)) {
      groups.set(timeSlot, []);
    }
    groups.get(timeSlot)!.push(event);
  });
  
  return groups;
}

function formatTimeSlot(time: string): string {
  const [hours] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:00 ${ampm}`;
}

export default function Timeline({ 
  events, 
  currentTime,
  hasInterest,
  getInterestCount,
  onToggleInterest,
  scrollToEventId,
  getEventAvailability,
}: TimelineProps) {
  const eventRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Scroll to event when scrollToEventId changes
  useEffect(() => {
    if (scrollToEventId) {
      const element = eventRefs.current.get(scrollToEventId);
      if (element) {
        // Small delay to ensure DOM is ready after date/type changes
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add a brief highlight effect
          element.classList.add("ring-2", "ring-dawn-teal", "ring-opacity-50");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-dawn-teal", "ring-opacity-50");
          }, 2000);
        }, 100);
      }
    }
  }, [scrollToEventId]);
  
  const sortedEvents = [...events].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  const groupedEvents = groupEventsByTime(sortedEvents);
  const timeSlots = Array.from(groupedEvents.keys()).sort();
  
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-lg font-medium text-white mb-2">No events this day</h3>
        <p className="text-sm text-white/50">
          Check other days or switch event types
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      {timeSlots.map((timeSlot) => (
        <div key={timeSlot} className="relative">
          {/* Time Marker */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-shrink-0 text-2xs font-medium text-white/40 tabular-nums min-w-[52px]">
              {formatTimeSlot(timeSlot)}
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          
          {/* Events - reduced left indent for more screen space */}
          <div className="space-y-3">
            {groupedEvents.get(timeSlot)!.map((event) => {
              // Get live availability if available, fallback to event defaults
              const availability = getEventAvailability
                ? getEventAvailability(event.id, event.spotsAvailable, event.isSoldOut)
                : {
                    spotsAvailable: event.spotsAvailable ?? null,
                    isSoldOut: event.isSoldOut ?? false,
                    isLive: false,
                    lastChecked: null,
                  };
              
              return (
                <div
                  key={event.id}
                  ref={(el) => {
                    if (el) {
                      eventRefs.current.set(event.id, el);
                    }
                  }}
                  className="transition-all duration-300"
                >
                  <EventCard
                    event={event}
                    isLive={isEventLive(event, currentTime)}
                    hasInterest={hasInterest(event.id)}
                    interestCount={getInterestCount(event.id)}
                    onToggleInterest={onToggleInterest}
                    liveAvailability={availability}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
