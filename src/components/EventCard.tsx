"use client";

import { useState } from "react";
import { Event } from "@/data/events";
import { MapPin, Clock, Users, Calendar, ChevronDown, ChevronUp, Ticket, ExternalLink, Share2 } from "lucide-react";
import InterestButton from "./InterestButton";

// App domain
const APP_DOMAIN = "https://theschedule.vercel.app";

// Detect if user is on Android
function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

// Generate ICS calendar file content (for iOS/Mac - respects default calendar app)
function generateICS(event: Event): string {
  const [year, month, day] = event.date.split("-").map(Number);
  const [startHour, startMin] = event.startTime.split(":").map(Number);
  
  let endHour = startHour;
  let endMin = startMin + 45;
  if (event.endTime) {
    [endHour, endMin] = event.endTime.split(":").map(Number);
  }
  
  const formatDate = (y: number, m: number, d: number, h: number, min: number) => {
    return `${y}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}${String(min).padStart(2, "0")}00`;
  };
  
  const dtStart = formatDate(year, month, day, startHour, startMin);
  const dtEnd = formatDate(year, month, day, endHour, endMin);
  const now = new Date();
  const dtStamp = formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
  
  const escapeICS = (text: string) => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  
  let description = event.shortDescription || event.description;
  if (event.bookingUrl) {
    description += `\n\nBook: ${event.bookingUrl}`;
  }
  description += `\n\nView all events: ${APP_DOMAIN}/?event=${event.id}`;
  
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pangia Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Bangkok",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
    `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
    `DTSTAMP:${dtStamp}Z`,
    `UID:${event.id}@theschedule`,
    `SUMMARY:${escapeICS(`${event.emoji || ""} ${event.title}`.trim())}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(event.venue.name + ", " + event.venue.address)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// Generate Google Calendar URL (for Android)
function generateGoogleCalendarUrl(event: Event): string {
  const [year, month, day] = event.date.split("-").map(Number);
  const [startHour, startMin] = event.startTime.split(":").map(Number);
  
  let endHour = startHour;
  let endMin = startMin + 45;
  if (event.endTime) {
    [endHour, endMin] = event.endTime.split(":").map(Number);
  }
  
  const formatDate = (y: number, m: number, d: number, h: number, min: number) => {
    return `${y}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}${String(min).padStart(2, "0")}00`;
  };
  
  const dtStart = formatDate(year, month, day, startHour, startMin);
  const dtEnd = formatDate(year, month, day, endHour, endMin);
  
  let description = event.shortDescription || event.description;
  if (event.bookingUrl) {
    description += `\n\n🎟️ Book: ${event.bookingUrl}`;
  }
  description += `\n\n📱 View all events: ${APP_DOMAIN}/?event=${event.id}`;
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.emoji || "📅"} ${event.title}`,
    dates: `${dtStart}/${dtEnd}`,
    details: description,
    location: `${event.venue.name}, ${event.venue.address}`,
    ctz: "Asia/Bangkok",
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Add to calendar - uses ICS for iOS/Mac (respects default calendar), Google Calendar for Android
function addToCalendar(event: Event) {
  if (isAndroid()) {
    // Android: Use Google Calendar URL (opens in app)
    window.open(generateGoogleCalendarUrl(event), "_blank");
  } else {
    // iOS/Mac/Desktop: Download ICS file (opens in default calendar app like Vimcal, Apple Calendar, etc.)
    const ics = generateICS(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, "_").substring(0, 40)}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Generate shareable event URL
function getEventShareUrl(event: Event): string {
  return `${APP_DOMAIN}/?event=${event.id}`;
}

// Share event using Web Share API or fallback
async function shareEvent(event: Event) {
  const shareUrl = getEventShareUrl(event);
  const shareTitle = `${event.emoji || "📅"} ${event.title}`;
  
  // Format date nicely
  const dateObj = new Date(event.date + "T00:00:00");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${dayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
  
  // Format time nicely (convert 24h to 12h)
  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  
  const shareText = `${shareTitle}

📍 ${event.venue.name}
📅 ${formattedDate}
🕐 ${formatTime(event.startTime)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ""}

${event.shortDescription || event.description.slice(0, 150)}${event.description.length > 150 ? "..." : ""}

👉 Select to view and add to calendar:`;

  // Try Web Share API first (works great on mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return;
    } catch (err) {
      // User cancelled or share failed, fall through to clipboard
      if ((err as Error).name === "AbortError") return;
    }
  }
  
  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    // Show a brief toast/notification
    showToast("Link copied to clipboard!");
  } catch {
    // Last resort: prompt user to copy
    prompt("Copy this link to share:", shareUrl);
  }
}

// Simple toast notification
function showToast(message: string) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium z-50 animate-fade-in";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

interface LiveAvailability {
  spotsAvailable: number | null;
  isSoldOut: boolean;
  isLive: boolean;
  lastChecked: number | null;
}

interface EventCardProps {
  event: Event;
  isLive?: boolean;
  hasInterest: boolean;
  interestCount: number;
  onToggleInterest: (eventId: string) => void;
  liveAvailability?: LiveAvailability;
}

export default function EventCard({ 
  event, 
  isLive = false, 
  hasInterest,
  interestCount,
  onToggleInterest,
  liveAvailability,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isFree = event.pricing.premiumAttendee === 0 && event.pricing.standardAttendee === 0;
  const isPremium = event.pricing.premiumAttendee > 0 || event.pricing.nonAttendee > 500;
  
  // Use live availability data if available, otherwise fall back to event data
  const spotsAvailable = liveAvailability?.spotsAvailable ?? event.spotsAvailable ?? null;
  const isSoldOut = liveAvailability?.isSoldOut ?? event.isSoldOut ?? false;
  const hasLiveData = liveAvailability?.isLive ?? false;
  
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
              {isSoldOut && (
                <span className="text-2xs font-medium text-golden-coral bg-golden-coral/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Sold Out{hasLiveData && " ✓"}
                </span>
              )}
              {isPremium && !isSoldOut && (
                <span className="text-2xs font-medium text-twilight-magenta bg-twilight-magenta/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Premium
                </span>
              )}
              {isFree && !isSoldOut && !event.isBreak && (
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
              isSoldOut || event.isBreak ? "text-white/50" : "text-white"
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
              {spotsAvailable !== null && spotsAvailable > 0 && !isSoldOut && event.type === "side_event" && (
                <span className="flex items-center gap-1 text-daybreak-gold/70">
                  <Users className="w-3 h-3" />
                  {spotsAvailable} public spots{hasLiveData && " ✓"}
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
            <div className="flex gap-2 flex-wrap">
              {/* Book button - only for side events with booking URL */}
              {event.bookingUrl && event.type === "side_event" && (
                <a
                  href={event.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium touch-feedback ${
                    isSoldOut 
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-golden-coral to-golden-dusty text-white"
                  }`}
                  onClick={(e) => isSoldOut && e.preventDefault()}
                >
                  <Ticket className="w-4 h-4" />
                  {isSoldOut ? "Sold Out" : "Book Now"}
                  {!isSoldOut && <ExternalLink className="w-3 h-3" />}
                </a>
              )}
              
              {/* Calendar button - opens Google Calendar */}
              <button
                onClick={() => addToCalendar(event)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-twilight-magenta/30 to-twilight-pink/20 text-twilight-pink text-sm font-medium touch-feedback border border-twilight-pink/30 hover:bg-twilight-magenta/40 active:bg-twilight-magenta/50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Add to Cal
              </button>
              
              {/* Share button */}
              <button
                onClick={() => shareEvent(event)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-dawn-teal/30 to-dawn-light/20 text-dawn-teal text-sm font-medium touch-feedback border border-dawn-teal/30 hover:bg-dawn-teal/40 active:bg-dawn-teal/50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              {/* Maps button */}
              <a
                href={event.venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/10 text-white/70 text-sm font-medium touch-feedback hover:bg-white/20 active:bg-white/30 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Map
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
