"use client";

import { Event, isEventLive } from "@/data/events";
import EventCard from "./EventCard";

interface TimelineProps {
  events: Event[];
  currentTime: Date;
  hasInterest: (eventId: string) => boolean;
  getInterestCount: (eventId: string) => number;
  onToggleInterest: (eventId: string) => void;
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
}: TimelineProps) {
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
    <div className="space-y-6">
      {timeSlots.map((timeSlot) => (
        <div key={timeSlot} className="relative">
          {/* Time Marker */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-16 text-xs font-medium text-white/50">
              {formatTimeSlot(timeSlot)}
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          
          {/* Events */}
          <div className="pl-[76px] space-y-3">
            {groupedEvents.get(timeSlot)!.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isLive={isEventLive(event, currentTime)}
                hasInterest={hasInterest(event.id)}
                interestCount={getInterestCount(event.id)}
                onToggleInterest={onToggleInterest}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
