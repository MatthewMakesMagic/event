import { Redis } from "@upstash/redis";

// Initialize Redis client (only if env vars are set)
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Check if Redis is available
const checkRedis = () => {
  if (!redis) {
    console.warn("Redis not configured - using empty defaults");
    return false;
  }
  return true;
};

// Keys
const INTERESTS_KEY = "pangia:interests"; // Hash: eventId -> count
const INTEREST_DEVICES_KEY = "pangia:interest_devices"; // Hash: eventId -> Set of deviceIds (as JSON)
const EMERGENT_EVENTS_KEY = "pangia:emergent_events"; // List of emergent events
const AVAILABILITY_KEY = "pangia:availability"; // Hash: eventId -> availability JSON
const AVAILABILITY_LAST_RUN_KEY = "pangia:availability_last_run"; // Timestamp of last cron run

// ============ INTERESTS ============

export async function getInterestCounts(): Promise<Record<string, number>> {
  if (!checkRedis()) return {};
  
  try {
    const counts = await redis!.hgetall(INTERESTS_KEY);
    if (!counts) return {};
    
    // Convert string values to numbers
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(counts)) {
      result[key] = typeof value === "number" ? value : parseInt(value as string, 10) || 0;
    }
    return result;
  } catch (error) {
    console.error("Redis getInterestCounts error:", error);
    return {};
  }
}

export async function toggleInterest(
  eventId: string,
  deviceId: string,
  action: "add" | "remove"
): Promise<{ count: number; hasInterest: boolean }> {
  if (!checkRedis()) {
    return { count: 0, hasInterest: action === "add" };
  }
  
  try {
    // Get current device set for this event
    const devicesJson = await redis!.hget(INTEREST_DEVICES_KEY, eventId);
    const devices: Set<string> = devicesJson 
      ? new Set(JSON.parse(devicesJson as string)) 
      : new Set();

    if (action === "add") {
      devices.add(deviceId);
    } else {
      devices.delete(deviceId);
    }

    const count = devices.size;

    // Update both hashes
    await redis!.hset(INTEREST_DEVICES_KEY, { [eventId]: JSON.stringify([...devices]) });
    await redis!.hset(INTERESTS_KEY, { [eventId]: count });

    return { count, hasInterest: devices.has(deviceId) };
  } catch (error) {
    console.error("Redis toggleInterest error:", error);
    return { count: 0, hasInterest: action === "add" };
  }
}

// ============ EMERGENT EVENTS ============

export interface EmergentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueArea?: string;
  googleMapsUrl?: string;
  hostName: string;
  createdAt: number;
  deviceId: string;
}

export async function getEmergentEvents(): Promise<EmergentEvent[]> {
  if (!checkRedis()) return [];
  
  try {
    const events = await redis!.lrange(EMERGENT_EVENTS_KEY, 0, -1);
    if (!events || events.length === 0) return [];
    
    // Parse events - they come back as objects from Redis
    const parsedEvents = events.map((e) => {
      if (typeof e === "string") {
        return JSON.parse(e) as EmergentEvent;
      }
      return e as EmergentEvent;
    });
    
    return parsedEvents.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  } catch (error) {
    console.error("Redis getEmergentEvents error:", error);
    return [];
  }
}

export async function addEmergentEvent(event: EmergentEvent): Promise<void> {
  if (!checkRedis()) return;
  
  try {
    await redis!.lpush(EMERGENT_EVENTS_KEY, event);
  } catch (error) {
    console.error("Redis addEmergentEvent error:", error);
  }
}

export async function deleteEmergentEvent(eventId: string, deviceId: string): Promise<boolean> {
  if (!checkRedis()) return false;
  
  try {
    const events = await getEmergentEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event || event.deviceId !== deviceId) {
      return false;
    }

    // Remove and re-add all except the deleted one
    const remaining = events.filter(e => e.id !== eventId);
    await redis!.del(EMERGENT_EVENTS_KEY);
    
    if (remaining.length > 0) {
      await redis!.rpush(EMERGENT_EVENTS_KEY, ...remaining);
    }
    
    return true;
  } catch (error) {
    console.error("Redis deleteEmergentEvent error:", error);
    return false;
  }
}

export async function countEventsInHourSlot(date: string, time: string): Promise<number> {
  if (!checkRedis()) return 0;
  
  try {
    const events = await getEmergentEvents();
    const hour = time.split(":")[0];
    const slot = `${date}-${hour}`;
    
    return events.filter(e => {
      const eventHour = e.startTime.split(":")[0];
      return `${e.date}-${eventHour}` === slot;
    }).length;
  } catch (error) {
    console.error("Redis countEventsInHourSlot error:", error);
    return 0;
  }
}

// ============ AVAILABILITY ============

export interface StoredAvailability {
  eventId: string;
  spotsAvailable: number | null;
  isSoldOut: boolean;
  lastChecked: number;
  error?: string;
}

export async function getAvailability(): Promise<Record<string, StoredAvailability>> {
  if (!checkRedis()) return {};
  
  try {
    const data = await redis!.hgetall(AVAILABILITY_KEY);
    if (!data) return {};
    
    const result: Record<string, StoredAvailability> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        result[key] = JSON.parse(value);
      } else {
        result[key] = value as StoredAvailability;
      }
    }
    return result;
  } catch (error) {
    console.error("Redis getAvailability error:", error);
    return {};
  }
}

export async function setAvailability(
  eventId: string,
  availability: StoredAvailability
): Promise<void> {
  if (!checkRedis()) return;
  
  try {
    await redis!.hset(AVAILABILITY_KEY, { [eventId]: JSON.stringify(availability) });
  } catch (error) {
    console.error("Redis setAvailability error:", error);
  }
}

export async function setMultipleAvailability(
  availabilities: StoredAvailability[]
): Promise<void> {
  if (!checkRedis()) return;
  
  try {
    const data: Record<string, string> = {};
    for (const a of availabilities) {
      data[a.eventId] = JSON.stringify(a);
    }
    await redis!.hset(AVAILABILITY_KEY, data);
  } catch (error) {
    console.error("Redis setMultipleAvailability error:", error);
  }
}

export async function getLastAvailabilityRun(): Promise<number | null> {
  if (!checkRedis()) return null;
  
  try {
    const timestamp = await redis!.get(AVAILABILITY_LAST_RUN_KEY);
    return timestamp ? Number(timestamp) : null;
  } catch (error) {
    console.error("Redis getLastAvailabilityRun error:", error);
    return null;
  }
}

export async function setLastAvailabilityRun(timestamp: number): Promise<void> {
  if (!checkRedis()) return;
  
  try {
    await redis!.set(AVAILABILITY_LAST_RUN_KEY, timestamp);
  } catch (error) {
    console.error("Redis setLastAvailabilityRun error:", error);
  }
}
