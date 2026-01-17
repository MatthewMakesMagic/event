"use client";

import { EmergentEvent } from "@/lib/db";
import { MapPin, Clock, User, Trash2, Sparkles, ExternalLink } from "lucide-react";

interface EmergentEventCardProps {
  event: EmergentEvent;
  isOwn: boolean;
  onDelete?: (eventId: string) => void;
}

export default function EmergentEventCard({ event, isOwn, onDelete }: EmergentEventCardProps) {
  return (
    <div className="rounded-xl glass border border-twilight-pink/30 card-hover">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-2xl flex-shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6 text-twilight-pink" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xs font-medium text-twilight-pink bg-twilight-pink/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Community
              </span>
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-white leading-tight mb-1">
              {event.title}
            </h3>
            
            {/* Host */}
            <p className="text-sm text-twilight-pink/80 mb-2 flex items-center gap-1">
              <User className="w-3 h-3" />
              Hosted by {event.hostName}
            </p>
            
            {/* Description */}
            {event.description && (
              <p className="text-sm text-white/60 mb-2 line-clamp-2">
                {event.description}
              </p>
            )}
            
            {/* Meta Row */}
            <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.startTime}
                {event.endTime && event.endTime !== event.startTime && ` - ${event.endTime}`}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.venueName}
                {event.venueArea && ` (${event.venueArea})`}
              </span>
            </div>
            
            {/* Google Maps Link */}
            {event.googleMapsUrl && (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MapPin className="w-3.5 h-3.5" />
                Open in Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          
          {/* Delete button for own events */}
          {isOwn && onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-golden-coral hover:bg-golden-coral/10 transition-colors"
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

