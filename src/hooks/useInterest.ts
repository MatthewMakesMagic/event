"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pangia_interests";

export interface InterestData {
  [eventId: string]: number; // Total interest count
}

export interface UserInterestData {
  [eventId: string]: boolean; // Whether this device has expressed interest
}

// Get a simple device ID (stays same per browser)
const getDeviceId = (): string => {
  if (typeof window === "undefined") return "";
  
  let deviceId = localStorage.getItem("pangia_device_id");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("pangia_device_id", deviceId);
  }
  return deviceId;
};

// Get global interest counts from localStorage
const getInterestCounts = (): InterestData => {
  if (typeof window === "undefined") return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Get this device's interests
const getDeviceInterests = (): UserInterestData => {
  if (typeof window === "undefined") return {};
  
  try {
    const deviceId = getDeviceId();
    const data = localStorage.getItem(`${STORAGE_KEY}_${deviceId}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Save interest counts
const saveInterestCounts = (data: InterestData): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Save device interests
const saveDeviceInterests = (data: UserInterestData): void => {
  if (typeof window === "undefined") return;
  const deviceId = getDeviceId();
  localStorage.setItem(`${STORAGE_KEY}_${deviceId}`, JSON.stringify(data));
};

export function useInterest() {
  const [interestCounts, setInterestCounts] = useState<InterestData>({});
  const [deviceInterests, setDeviceInterests] = useState<UserInterestData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setInterestCounts(getInterestCounts());
    setDeviceInterests(getDeviceInterests());
    setIsLoaded(true);
  }, []);

  // Toggle interest for an event
  const toggleInterest = useCallback((eventId: string) => {
    const currentDeviceInterests = getDeviceInterests();
    const currentCounts = getInterestCounts();
    
    const hasInterest = currentDeviceInterests[eventId] || false;
    
    // Update device interests
    const newDeviceInterests = { ...currentDeviceInterests };
    if (hasInterest) {
      delete newDeviceInterests[eventId];
    } else {
      newDeviceInterests[eventId] = true;
    }
    saveDeviceInterests(newDeviceInterests);
    setDeviceInterests(newDeviceInterests);
    
    // Update global counts
    const newCounts = { ...currentCounts };
    const currentCount = newCounts[eventId] || 0;
    if (hasInterest) {
      newCounts[eventId] = Math.max(0, currentCount - 1);
    } else {
      newCounts[eventId] = currentCount + 1;
    }
    saveInterestCounts(newCounts);
    setInterestCounts(newCounts);
  }, []);

  // Check if device has expressed interest
  const hasInterest = useCallback((eventId: string): boolean => {
    return deviceInterests[eventId] || false;
  }, [deviceInterests]);

  // Get interest count for an event
  const getInterestCount = useCallback((eventId: string): number => {
    return interestCounts[eventId] || 0;
  }, [interestCounts]);

  return {
    toggleInterest,
    hasInterest,
    getInterestCount,
    isLoaded,
  };
}


