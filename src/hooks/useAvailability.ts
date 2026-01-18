"use client";

import { useState, useEffect, useCallback } from "react";
import { StoredAvailability } from "@/lib/db";

interface AvailabilityResponse {
  availability: Record<string, StoredAvailability>;
  lastChecked: number | null;
  staleness: number | null;
}

export function useAvailability() {
  const [availability, setAvailability] = useState<Record<string, StoredAvailability>>({});
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [staleness, setStaleness] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability");
      if (res.ok) {
        const data: AvailabilityResponse = await res.json();
        setAvailability(data.availability || {});
        setLastChecked(data.lastChecked);
        setStaleness(data.staleness);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
    
    // Refresh every 5 minutes (cron runs every 15, but check more often for updates)
    const interval = setInterval(fetchAvailability, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAvailability]);

  /**
   * Get availability for a specific event
   * Falls back to the event's default data if no live data
   */
  const getEventAvailability = useCallback(
    (eventId: string, defaultSpots?: number, defaultSoldOut?: boolean) => {
      const live = availability[eventId];
      if (live) {
        return {
          spotsAvailable: live.spotsAvailable,
          isSoldOut: live.isSoldOut,
          isLive: true,
          lastChecked: live.lastChecked,
        };
      }
      return {
        spotsAvailable: defaultSpots ?? null,
        isSoldOut: defaultSoldOut ?? false,
        isLive: false,
        lastChecked: null,
      };
    },
    [availability]
  );

  return {
    availability,
    lastChecked,
    staleness,
    isLoading,
    getEventAvailability,
    refresh: fetchAvailability,
  };
}



