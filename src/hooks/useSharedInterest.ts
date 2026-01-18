"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DEVICE_ID_KEY = "pangia_device_id";
const LOCAL_INTERESTS_KEY = "pangia_local_interests";

// Get or create device ID
const getDeviceId = (): string => {
  if (typeof window === "undefined") return "";
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

// Store local interests for optimistic UI
const getLocalInterests = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const data = localStorage.getItem(LOCAL_INTERESTS_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
};

const saveLocalInterests = (interests: Set<string>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_INTERESTS_KEY, JSON.stringify([...interests]));
};

export function useSharedInterest() {
  const [interestCounts, setInterestCounts] = useState<Record<string, number>>({});
  const [localInterests, setLocalInterests] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const deviceIdRef = useRef<string>("");

  // Initialize
  useEffect(() => {
    deviceIdRef.current = getDeviceId();
    setLocalInterests(getLocalInterests());
    setIsLoaded(true);
    
    // Initial fetch
    fetchInterests();
    
    // Poll every 10 seconds for updates from other users
    const interval = setInterval(fetchInterests, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchInterests = async () => {
    try {
      const res = await fetch("/api/interests");
      if (res.ok) {
        const data = await res.json();
        setInterestCounts(data.counts || {});
      }
    } catch (error) {
      console.error("Failed to fetch interests:", error);
    }
  };

  const toggleInterest = useCallback(async (eventId: string) => {
    const deviceId = deviceIdRef.current;
    if (!deviceId) return;

    const currentInterests = getLocalInterests();
    const hasInterest = currentInterests.has(eventId);
    const action = hasInterest ? "remove" : "add";

    // Optimistic update
    const newInterests = new Set(currentInterests);
    if (hasInterest) {
      newInterests.delete(eventId);
    } else {
      newInterests.add(eventId);
    }
    setLocalInterests(newInterests);
    saveLocalInterests(newInterests);

    // Update server
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, deviceId, action }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setInterestCounts(prev => ({
          ...prev,
          [eventId]: data.count,
        }));
      }
    } catch (error) {
      console.error("Failed to update interest:", error);
      // Revert optimistic update on error
      setLocalInterests(currentInterests);
      saveLocalInterests(currentInterests);
    }
  }, []);

  const hasInterest = useCallback((eventId: string): boolean => {
    return localInterests.has(eventId);
  }, [localInterests]);

  const getInterestCount = useCallback((eventId: string): number => {
    return interestCounts[eventId] || 0;
  }, [interestCounts]);

  return {
    toggleInterest,
    hasInterest,
    getInterestCount,
    isLoaded,
    deviceId: deviceIdRef.current,
  };
}



