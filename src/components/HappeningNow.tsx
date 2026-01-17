"use client";

import { useEffect, useState } from "react";
import { Event, isEventLive, getMinutesRemaining, getMinutesUntilEvent } from "@/data/events";
import { MapPin, Clock, ChevronRight } from "lucide-react";

interface HappeningNowProps {
  events: Event[];
  currentTime: Date;
  onEventClick: (event: Event) => void;
}

function getNextEvent(events: Event[], currentTime: Date): { event: Event; minutesUntil: number } | null {
  const currentDateStr = currentTime.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  
  // Filter to non-break events
  const validEvents = events.filter(e => !e.isBreak);
  
  const futureEvents = validEvents
    .filter((event) => {
      const minutesUntil = getMinutesUntilEvent(event, currentTime);
      return minutesUntil > 0;
    })
    .sort((a, b) => {
      const aMinutes = getMinutesUntilEvent(a, currentTime);
      const bMinutes = getMinutesUntilEvent(b, currentTime);
      return aMinutes - bMinutes;
    });
  
  if (futureEvents.length === 0) return null;
  
  const nextEvent = futureEvents[0];
  const minutesUntil = getMinutesUntilEvent(nextEvent, currentTime);
  
  return { event: nextEvent, minutesUntil };
}

export default function HappeningNow({ events, currentTime, onEventClick }: HappeningNowProps) {
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [nextEvent, setNextEvent] = useState<{ event: Event; minutesUntil: number } | null>(null);
  
  useEffect(() => {
    // Filter out breaks for live events
    const live = events.filter((event) => !event.isBreak && isEventLive(event, currentTime));
    setLiveEvents(live);
    
    if (live.length === 0) {
      setNextEvent(getNextEvent(events, currentTime));
    } else {
      setNextEvent(null);
    }
  }, [events, currentTime]);
  
  if (liveEvents.length === 0 && !nextEvent) {
    return null;
  }
  
  if (liveEvents.length > 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-daybreak-gold animate-pulse" />
          <span className="text-sm font-medium text-daybreak-gold uppercase tracking-wide">
            Live Now
          </span>
        </div>
        
        <div className="space-y-3">
          {liveEvents.map((event) => {
            const minsRemaining = getMinutesRemaining(event, currentTime);
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="w-full text-left live-pulse rounded-2xl bg-gradient-to-br from-midnight-surface/80 to-midnight-deep/80 border border-daybreak-gold/30 p-4 touch-feedback"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{event.emoji}</span>
                      <span className="text-xs font-medium text-daybreak-gold bg-daybreak-gold/10 px-2 py-0.5 rounded-full">
                        ends in {minsRemaining}m
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white leading-tight mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    {event.speakers && event.speakers.length > 0 && (
                      <p className="text-sm text-dawn-light mb-2">
                        {event.speakers.map((s) => s.name).join(", ")}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue.name}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-daybreak-gold flex-shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Show "Up Next" if nothing is live
  if (nextEvent) {
    const { event, minutesUntil } = nextEvent;
    const hoursUntil = Math.floor(minutesUntil / 60);
    const minsUntil = minutesUntil % 60;
    
    let timeLabel = "";
    if (hoursUntil > 24) {
      const days = Math.floor(hoursUntil / 24);
      timeLabel = `${days}d`;
    } else if (hoursUntil > 0) {
      timeLabel = `${hoursUntil}h ${minsUntil}m`;
    } else {
      timeLabel = `${minsUntil}m`;
    }
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-dawn-light" />
          <span className="text-sm font-medium text-dawn-light uppercase tracking-wide">
            Up Next in {timeLabel}
          </span>
        </div>
        
        <button
          onClick={() => onEventClick(event)}
          className="w-full text-left rounded-2xl glass border border-white/10 p-4 touch-feedback card-hover"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{event.emoji}</span>
                <span className="text-xs text-white/50">
                  {event.startTime}
                </span>
              </div>
              
              <h3 className="text-base font-semibold text-white leading-tight mb-1 line-clamp-2">
                {event.title}
              </h3>
              
              <div className="flex items-center gap-3 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.venue.name}
                </span>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0 mt-1" />
          </div>
        </button>
      </div>
    );
  }
  
  return null;
}
