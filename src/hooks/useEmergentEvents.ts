"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EmergentEvent } from "@/lib/db";

const DEVICE_ID_KEY = "pangia_device_id";

const getDeviceId = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DEVICE_ID_KEY) || "";
};

export function useEmergentEvents() {
  const [events, setEvents] = useState<EmergentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deviceIdRef = useRef<string>("");

  useEffect(() => {
    deviceIdRef.current = getDeviceId();
    fetchEvents();
    
    // Poll every 15 seconds for new community events
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/emergent-events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch emergent events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = useCallback(async (eventData: {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime?: string;
    venueName: string;
    venueArea?: string;
    googleMapsUrl?: string;
    hostName: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const deviceId = deviceIdRef.current;
    if (!deviceId) return { success: false, error: "Device not initialized" };

    setError(null);
    
    try {
      const res = await fetch("/api/emergent-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventData, deviceId }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
        return { success: false, error: data.error };
      }
      
      // Add to local state immediately
      setEvents(prev => [...prev, data.event].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      }));
      
      return { success: true };
    } catch (err) {
      const errorMsg = "Failed to add event";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    const deviceId = deviceIdRef.current;
    if (!deviceId) return false;

    try {
      const res = await fetch("/api/emergent-events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, deviceId }),
      });
      
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const isOwnEvent = useCallback((event: EmergentEvent): boolean => {
    return event.deviceId === deviceIdRef.current;
  }, []);

  const getEventsByDate = useCallback((date: string): EmergentEvent[] => {
    return events.filter(e => e.date === date);
  }, [events]);

  return {
    events,
    isLoading,
    error,
    addEvent,
    deleteEvent,
    isOwnEvent,
    getEventsByDate,
    refetch: fetchEvents,
  };
}

