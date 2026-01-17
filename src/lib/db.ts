import { Redis } from "@upstash/redis";

// Initialize Redis client
// Will use environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Keys
const INTERESTS_KEY = "pangia:interests"; // Hash: eventId -> count
const INTEREST_DEVICES_KEY = "pangia:interest_devices"; // Hash: eventId -> Set of deviceIds (as JSON)
const EMERGENT_EVENTS_KEY = "pangia:emergent_events"; // List of emergent events

// ============ INTERESTS ============

export async function getInterestCounts(): Promise<Record<string, number>> {
  const counts = await redis.hgetall(INTERESTS_KEY);
  if (!counts) return {};
  
  // Convert string values to numbers
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(counts)) {
    result[key] = typeof value === "number" ? value : parseInt(value as string, 10) || 0;
  }
  return result;
}

export async function toggleInterest(
  eventId: string,
  deviceId: string,
  action: "add" | "remove"
): Promise<{ count: number; hasInterest: boolean }> {
  // Get current device set for this event
  const devicesJson = await redis.hget(INTEREST_DEVICES_KEY, eventId);
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
  await redis.hset(INTEREST_DEVICES_KEY, { [eventId]: JSON.stringify([...devices]) });
  await redis.hset(INTERESTS_KEY, { [eventId]: count });

  return { count, hasInterest: devices.has(deviceId) };
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
  const events = await redis.lrange(EMERGENT_EVENTS_KEY, 0, -1);
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
}

export async function addEmergentEvent(event: EmergentEvent): Promise<void> {
  await redis.lpush(EMERGENT_EVENTS_KEY, event);
}

export async function deleteEmergentEvent(eventId: string, deviceId: string): Promise<boolean> {
  const events = await getEmergentEvents();
  const event = events.find(e => e.id === eventId);
  
  if (!event || event.deviceId !== deviceId) {
    return false;
  }

  // Remove and re-add all except the deleted one
  const remaining = events.filter(e => e.id !== eventId);
  await redis.del(EMERGENT_EVENTS_KEY);
  
  if (remaining.length > 0) {
    await redis.rpush(EMERGENT_EVENTS_KEY, ...remaining);
  }
  
  return true;
}

export async function countEventsInHourSlot(date: string, time: string): Promise<number> {
  const events = await getEmergentEvents();
  const hour = time.split(":")[0];
  const slot = `${date}-${hour}`;
  
  return events.filter(e => {
    const eventHour = e.startTime.split(":")[0];
    return `${e.date}-${eventHour}` === slot;
  }).length;
}

