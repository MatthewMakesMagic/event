"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, MapPin, Clock, Calendar } from "lucide-react";
import { ALL_EVENTS, Event, CONFERENCE_DATES } from "@/data/events";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: Event) => void;
}

export default function SearchModal({ isOpen, onClose, onEventSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Clear query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    return ALL_EVENTS.filter((event) => {
      if (event.isBreak) return false;
      
      const searchableText = [
        event.title,
        event.description,
        event.shortDescription,
        event.venue.name,
        event.venue.area,
        event.organizer,
        ...(event.speakers?.map(s => s.name) || []),
        ...(event.speakers?.map(s => s.company) || []),
        ...event.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    }).slice(0, 10); // Limit to 10 results
  }, [query]);

  // Get date label
  const getDateLabel = (dateStr: string) => {
    const dateInfo = CONFERENCE_DATES.find(d => d.date === dateStr);
    return dateInfo ? `${dateInfo.day}, Jan ${dateInfo.dayNum}` : dateStr;
  };

  const handleSelect = (event: Event) => {
    onEventSelect(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative flex flex-col max-h-[85vh] mt-4 mx-4 rounded-2xl bg-midnight-surface border border-white/10 overflow-hidden animate-slide-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-white/50 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, speakers, venues..."
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sm text-dawn-teal font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                Search by event name, speaker, venue, or topic
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/50 text-sm">
                No events found for "{query}"
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {results.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleSelect(event)}
                  className="w-full text-left p-4 hover:bg-white/5 transition-colors touch-feedback"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{event.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white leading-tight mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      {/* Speaker or Organizer */}
                      {event.speakers && event.speakers.length > 0 && (
                        <p className="text-sm text-dawn-light mb-1.5">
                          {event.speakers.map(s => s.name).join(", ")}
                        </p>
                      )}
                      {event.organizer && !event.speakers?.length && (
                        <p className="text-sm text-twilight-pink/80 mb-1.5">
                          Hosted by {event.organizer}
                        </p>
                      )}
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {getDateLabel(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.startTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.venue.name}
                        </span>
                      </div>
                      
                      {/* Type badge */}
                      <div className="mt-2">
                        <span className={`text-2xs px-2 py-0.5 rounded-full ${
                          event.type === "main_conference"
                            ? "bg-dawn-teal/20 text-dawn-teal"
                            : "bg-golden-coral/20 text-golden-coral"
                        }`}>
                          {event.type === "main_conference" ? "Main Conference" : "Nomad Week"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



