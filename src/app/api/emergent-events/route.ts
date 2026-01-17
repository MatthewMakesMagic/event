import { NextResponse } from "next/server";
import { 
  getEmergentEvents, 
  addEmergentEvent, 
  deleteEmergentEvent,
  countEventsInHourSlot,
  EmergentEvent,
} from "@/lib/db";

const MAX_EVENTS_PER_HOUR = 3;

export async function GET() {
  try {
    const events = await getEmergentEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to get emergent events:", error);
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { title, description, date, startTime, endTime, venueName, venueArea, googleMapsUrl, hostName, deviceId } = data;
    
    // Validation
    if (!title || !date || !startTime || !venueName || !hostName || !deviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check max events per hour
    const countInSlot = await countEventsInHourSlot(date, startTime);
    if (countInSlot >= MAX_EVENTS_PER_HOUR) {
      return NextResponse.json({ 
        error: `Maximum ${MAX_EVENTS_PER_HOUR} community events per hour slot. Try a different time.` 
      }, { status: 400 });
    }
    
    // Validate date is within conference range
    const validDates = ["2026-01-17", "2026-01-18", "2026-01-19", "2026-01-20", "2026-01-21", "2026-01-22", "2026-01-23", "2026-01-24"];
    if (!validDates.includes(date)) {
      return NextResponse.json({ error: "Date must be during Nomad Week (Jan 17-24)" }, { status: 400 });
    }
    
    const newEvent: EmergentEvent = {
      id: `emergent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.slice(0, 100),
      description: (description || "").slice(0, 500),
      date,
      startTime,
      endTime: endTime || startTime,
      venueName: venueName.slice(0, 100),
      venueArea: venueArea?.slice(0, 50),
      googleMapsUrl: googleMapsUrl?.slice(0, 500),
      hostName: hostName.slice(0, 50),
      createdAt: Date.now(),
      deviceId,
    };
    
    await addEmergentEvent(newEvent);
    
    return NextResponse.json({ event: newEvent, success: true });
  } catch (error) {
    console.error("Failed to add emergent event:", error);
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { eventId, deviceId } = await request.json();
    
    const success = await deleteEmergentEvent(eventId, deviceId);
    
    if (!success) {
      return NextResponse.json({ error: "Event not found or not authorized" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete emergent event:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
