"use client";

import { useState } from "react";
import { Event } from "@/data/events";
import { MapPin, Clock, Users, Calendar, ChevronDown, ChevronUp, Ticket, ExternalLink } from "lucide-react";
import InterestButton from "./InterestButton";

interface EventCardProps {
  event: Event;
  isLive?: boolean;
  hasInterest: boolean;
  interestCount: number;
  onToggleInterest: (eventId: string) => void;
}

export default function EventCard({ 
  event, 
  isLive = false, 
  hasInterest,
  interestCount,
  onToggleInterest,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isFree = event.pricing.premiumAttendee === 0 && event.pricing.standardAttendee === 0;
  const isPremium = event.pricing.premiumAttendee > 0 || event.pricing.nonAttendee > 500;
  
  // Don't show interest for breaks/announcements
  const showInterest = !event.isBreak && event.type === "side_event";
  
  // Can expand if not a break
  const canExpand = !event.isBreak;
  
  const toggleExpand = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div
      className={`rounded-xl transition-all duration-200 ${
        isLive
          ? "live-pulse bg-gradient-to-br from-midnight-surface to-midnight-deep border border-daybreak-gold/30"
          : event.isBreak
          ? "glass border border-white/5 opacity-60"
          : "glass border border-white/10 card-hover"
      }`}
    >
      {/* Main clickable area */}
      <div 
        className={`p-4 ${canExpand ? "cursor-pointer active:bg-white/5" : ""}`}
        onClick={toggleExpand}
        role={canExpand ? "button" : undefined}
        tabIndex={canExpand ? 0 : undefined}
        onKeyDown={(e) => {
          if (canExpand && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            toggleExpand();
          }
        }}
      >
        <div className="flex items-start gap-3">
          {/* Emoji */}
          <div className="text-2xl flex-shrink-0 mt-0.5">
            {event.emoji}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Tags Row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {isLive && (
                <span className="text-2xs font-medium text-daybreak-gold bg-daybreak-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Live
                </span>
              )}
              {event.isSoldOut && (
                <span className="text-2xs font-medium text-golden-coral bg-golden-coral/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Sold Out
                </span>
              )}
              {isPremium && !event.isSoldOut && (
                <span className="text-2xs font-medium text-twilight-magenta bg-twilight-magenta/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Premium
                </span>
              )}
              {isFree && !event.isSoldOut && !event.isBreak && (
                <span className="text-2xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Free
                </span>
              )}
              {event.track && (
                <span className="text-2xs text-dawn-light/70 uppercase tracking-wide">
                  {event.track}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className={`font-semibold leading-tight mb-1.5 ${isExpanded ? "" : "line-clamp-2"} ${
              event.isSoldOut || event.isBreak ? "text-white/50" : "text-white"
            }`}>
              {event.title}
            </h3>
            
            {/* Speaker (for main conference) */}
            {event.speakers && event.speakers.length > 0 && (
              <p className="text-sm text-dawn-light mb-2">
                {event.speakers.map((s) => s.name).join(", ")}
              </p>
            )}
            
            {/* Organizer (for side events) */}
            {event.organizer && !event.speakers?.length && (
              <p className="text-sm text-twilight-pink/80 mb-2">
                Hosted by {event.organizer}
              </p>
            )}
            
            {/* Meta Row */}
            <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
              {!event.isBreak && (
                <span 
                  className="flex items-center gap-1 text-dawn-teal"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.venue.googleMapsUrl, "_blank");
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  {event.venue.name}
                </span>
              )}
              {event.spotsAvailable !== undefined && event.spotsAvailable > 0 && !event.isSoldOut && event.type === "side_event" && (
                <span className="flex items-center gap-1 text-daybreak-gold/70">
                  <Users className="w-3 h-3" />
                  {event.spotsAvailable} public spots
                </span>
              )}
            </div>
          </div>
          
          {/* Right side: Interest + Expand */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {showInterest && (
              <div onClick={(e) => e.stopPropagation()}>
                <InterestButton
                  eventId={event.id}
                  hasInterest={hasInterest}
                  interestCount={interestCount}
                  onToggle={onToggleInterest}
                  size="sm"
                />
              </div>
            )}
            {canExpand && (
              <div className="text-white/30">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && canExpand && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="border-t border-white/10 pt-4 mt-1">
            {/* Description */}
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {event.description}
            </p>
            
            {/* Pricing */}
            {!isFree && (
              <div className="mb-4 p-3 rounded-lg bg-white/5">
                <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">Pricing</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-white/50 text-xs">Premium</p>
                    <p className="font-medium text-white">
                      {event.pricing.premiumAttendee === 0 ? "Free" : `${event.pricing.premiumAttendee}฿`}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Attendees</p>
                    <p className="font-medium text-white">
                      {event.pricing.standardAttendee === 0 ? "Free" : `${event.pricing.standardAttendee}฿`}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Public</p>
                    <p className="font-medium text-white">
                      {event.pricing.nonAttendee === 0 ? "Free" : `${event.pricing.nonAttendee}฿`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Booking disclaimer for side events */}
            {event.type === "side_event" && event.bookingUrl && (
              <p className="text-2xs text-white/40 mb-3 italic">
                Availability may have changed. Tap "Book Now" to check current status on the official site.
              </p>
            )}
            
            {/* Actions */}
            <div className="flex gap-2">
              {/* Book button - only for side events with booking URL */}
              {event.bookingUrl && event.type === "side_event" && (
                <a
                  href={event.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium touch-feedback ${
                    event.isSoldOut 
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-golden-coral to-golden-dusty text-white"
                  }`}
                  onClick={(e) => event.isSoldOut && e.preventDefault()}
                >
                  <Ticket className="w-4 h-4" />
                  {event.isSoldOut ? "Sold Out" : "Book Now"}
                  {!event.isSoldOut && <ExternalLink className="w-3 h-3" />}
                </a>
              )}
              
              {/* Maps button */}
              <a
                href={event.venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${event.bookingUrl && event.type === "side_event" ? "" : "flex-1"} flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-dawn-teal/30 to-dawn-light/20 text-dawn-teal text-sm font-medium touch-feedback border border-dawn-teal/30`}
              >
                <MapPin className="w-4 h-4" />
                {event.bookingUrl && event.type === "side_event" ? "Map" : "Open in Maps"}
              </a>
              
              {/* Calendar button - only show if no booking URL or for main conference */}
              {(!event.bookingUrl || event.type === "main_conference") && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/10 text-white/70 text-sm font-medium touch-feedback"
                >
                  <Calendar className="w-4 h-4" />
                  Add to Cal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
