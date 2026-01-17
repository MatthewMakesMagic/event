"use client";

import { useState } from "react";
import { X, Plus, MapPin, Clock, User, ExternalLink } from "lucide-react";
import { CONFERENCE_DATES } from "@/data/events";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime?: string;
    venueName: string;
    venueArea?: string;
    googleMapsUrl?: string;
    hostName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  defaultDate?: string;
}

export default function AddEventModal({ isOpen, onClose, onSubmit, defaultDate }: AddEventModalProps) {
  // Valid dates for side events (excludes main conference days, except Jan 18)
  const sideEventDates = CONFERENCE_DATES.filter(d => !d.isMainConference || d.date === "2026-01-18");
  
  // Validate defaultDate is in valid dates, otherwise use first valid date
  const getValidDate = () => {
    if (defaultDate && sideEventDates.some(d => d.date === defaultDate)) {
      return defaultDate;
    }
    return sideEventDates[0]?.date || "2026-01-18";
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getValidDate);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:00");
  const [venueName, setVenueName] = useState("");
  const [venueArea, setVenueArea] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [hostName, setHostName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await onSubmit({
      title,
      description,
      date,
      startTime,
      endTime,
      venueName,
      venueArea,
      googleMapsUrl: googleMapsUrl || undefined,
      hostName,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setTitle("");
      setDescription("");
      setVenueName("");
      setVenueArea("");
      setGoogleMapsUrl("");
      setHostName("");
      onClose();
    } else {
      setError(result.error || "Failed to add event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-midnight-surface to-midnight-deep rounded-t-3xl sm:rounded-3xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-midnight-surface/90 backdrop-blur rounded-t-3xl">
          <h2 className="text-lg font-semibold text-white">Host a Community Event</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-golden-coral/20 border border-golden-coral/30 text-golden-coral text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Coffee & AI Chat"
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your event about?"
              rows={2}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50 resize-none"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Date *</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-dawn-teal/50"
              >
                {sideEventDates.map((d) => (
                  <option key={d.date} value={d.date}>
                    {d.day} {d.dayNum}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Start *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-dawn-teal/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-dawn-teal/50"
              />
            </div>
          </div>

          {/* Venue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Venue Name *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g., Maya Mall"
                  required
                  maxLength={100}
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Area</label>
              <input
                type="text"
                value={venueArea}
                onChange={(e) => setVenueArea(e.target.value)}
                placeholder="e.g., Nimman"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50"
              />
            </div>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Google Maps Link</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                maxLength={500}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50"
              />
            </div>
            <p className="text-xs text-white/40 mt-1">Paste a Google Maps link so others can find you</p>
          </div>

          {/* Host Name */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Host Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Your name or handle"
                required
                maxLength={50}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-dawn-teal/50"
              />
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-white/40">
            Max 3 community events per hour slot. Be respectful and show up!
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-golden-coral to-golden-dusty text-white font-semibold flex items-center justify-center gap-2 touch-feedback disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {isSubmitting ? "Adding..." : "Add Community Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

