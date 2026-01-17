"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import DayTabs from "@/components/DayTabs";
import EventTypeToggle from "@/components/EventTypeToggle";
import HappeningNow from "@/components/HappeningNow";
import Timeline from "@/components/Timeline";
import TimingDisclaimer from "@/components/TimingDisclaimer";
import AddEventModal from "@/components/AddEventModal";
import EmergentEventCard from "@/components/EmergentEventCard";
import { useSharedInterest } from "@/hooks/useSharedInterest";
import { useEmergentEvents } from "@/hooks/useEmergentEvents";
import { Plus } from "lucide-react";
import {
  ALL_EVENTS,
  getEventsByDate,
  getCurrentDateICT,
  CONFERENCE_DATES,
  Event,
} from "@/data/events";

export default function Home() {
  // State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [eventType, setEventType] = useState<"all" | "main_conference" | "side_event">("main_conference");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Shared interest system (syncs across devices)
  const { toggleInterest, hasInterest, getInterestCount, isLoaded } = useSharedInterest();
  
  // Community/emergent events
  const { 
    getEventsByDate: getEmergentEventsByDate, 
    addEvent, 
    deleteEvent, 
    isOwnEvent,
  } = useEmergentEvents();
  
  // Initialize with current date in Bangkok timezone
  useEffect(() => {
    const today = getCurrentDateICT();
    const isConferenceDay = CONFERENCE_DATES.some(d => d.date === today);
    setSelectedDate(isConferenceDay ? today : "2026-01-17");
  }, []);
  
  // Update current time every 30 seconds
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Change default date when switching event types
  useEffect(() => {
    if (!selectedDate) return;
    
    if (eventType === "main_conference") {
      const isMainConferenceDay = CONFERENCE_DATES.find(
        (d) => d.date === selectedDate && d.isMainConference
      );
      if (!isMainConferenceDay) {
        setSelectedDate("2026-01-17");
      }
    } else if (eventType === "side_event") {
      const isSideEventDay = CONFERENCE_DATES.find(
        (d) => d.date === selectedDate && (!d.isMainConference || d.date === "2026-01-18")
      );
      if (!isSideEventDay) {
        setSelectedDate("2026-01-18");
      }
    }
  }, [eventType, selectedDate]);
  
  // Filter official events based on selected date and type
  const filteredEvents = useMemo(() => {
    if (!selectedDate) return [];
    
    let events = getEventsByDate(selectedDate);
    
    if (eventType === "main_conference") {
      events = events.filter((e) => e.type === "main_conference");
    } else if (eventType === "side_event") {
      events = events.filter((e) => e.type === "side_event");
    }
    
    return events;
  }, [selectedDate, eventType]);
  
  // Get emergent events for selected date
  const emergentEvents = useMemo(() => {
    if (!selectedDate || eventType === "main_conference") return [];
    return getEmergentEventsByDate(selectedDate);
  }, [selectedDate, eventType, getEmergentEventsByDate]);
  
  // All events for "Happening Now"
  const allEventsForLive = useMemo(() => ALL_EVENTS, []);
  
  // Handle event click from HappeningNow
  const handleEventClick = (event: Event) => {
    setSelectedDate(event.date);
    setEventType(event.type === "main_conference" ? "main_conference" : "side_event");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Get day info for header
  const selectedDayInfo = CONFERENCE_DATES.find((d) => d.date === selectedDate);
  
  // Loading state
  if (!selectedDate || !isLoaded) {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }
  
  const totalEvents = filteredEvents.length + emergentEvents.length;
  const showEmergentSection = eventType === "side_event";
  
  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header */}
      <Header currentTime={currentTime} onEventSelect={handleEventClick} />
      
      {/* Main Content */}
      <main className="flex-1 px-4 py-4 safe-bottom">
        {/* Event Type Toggle */}
        <div className="mb-4">
          <EventTypeToggle eventType={eventType} onTypeChange={setEventType} />
        </div>
        
        {/* Day Tabs */}
        <div className="mb-4">
          <DayTabs
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            eventType={eventType}
          />
        </div>
        
        {/* Timing Disclaimer - show only for main conference */}
        {eventType === "main_conference" && <TimingDisclaimer />}
        
        {/* Happening Now */}
        <HappeningNow
          events={allEventsForLive}
          currentTime={currentTime}
          onEventClick={handleEventClick}
        />
        
        {/* Day Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedDayInfo?.day}, Jan {selectedDayInfo?.dayNum}
              {selectedDayInfo?.isMainConference && (
                <span className="ml-2 text-sm font-normal text-dawn-light">
                  Main Conference
                </span>
              )}
            </h2>
            <p className="text-sm text-white/50">
              {totalEvents} event{totalEvents !== 1 ? "s" : ""}
              {eventType === "side_event" && " • Tap ⭐ to show interest"}
            </p>
          </div>
          
          {/* Add Event Button (only for Nomad Week) */}
          {showEmergentSection && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-twilight-pink/20 text-twilight-pink text-sm font-medium touch-feedback"
            >
              <Plus className="w-4 h-4" />
              Host
            </button>
          )}
        </div>
        
        {/* Community Events Section */}
        {showEmergentSection && emergentEvents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-twilight-pink mb-3 flex items-center gap-2">
              <span>✨</span>
              Community Events ({emergentEvents.length})
            </h3>
            <div className="space-y-3">
              {emergentEvents.map((event) => (
                <EmergentEventCard
                  key={event.id}
                  event={event}
                  isOwn={isOwnEvent(event)}
                  onDelete={deleteEvent}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Official Events Timeline */}
        {filteredEvents.length > 0 && (
          <>
            {showEmergentSection && emergentEvents.length > 0 && (
              <h3 className="text-sm font-medium text-dawn-light mb-3">
                Official Events ({filteredEvents.length})
              </h3>
            )}
            <Timeline 
              events={filteredEvents} 
              currentTime={currentTime}
              hasInterest={hasInterest}
              getInterestCount={getInterestCount}
              onToggleInterest={toggleInterest}
            />
          </>
        )}
        
        {/* Empty State */}
        {totalEvents === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-white mb-2">No events this day</h3>
            <p className="text-sm text-white/50 mb-4">
              Check other days or switch event types
            </p>
            {showEmergentSection && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-twilight-pink/20 text-twilight-pink text-sm font-medium touch-feedback"
              >
                <Plus className="w-4 h-4" />
                Host a Community Event
              </button>
            )}
          </div>
        )}
        
        {/* Bottom Padding */}
        <div className="h-8" />
      </main>
      
      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addEvent}
        defaultDate={selectedDate}
      />
    </div>
  );
}
