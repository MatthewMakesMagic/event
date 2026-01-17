import { NextResponse } from "next/server";
import { getInterestCounts, toggleInterest } from "@/lib/db";

export async function GET() {
  try {
    const counts = await getInterestCounts();
    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Failed to get interests:", error);
    return NextResponse.json({ counts: {} });
  }
}

export async function POST(request: Request) {
  try {
    const { eventId, deviceId, action } = await request.json();
    
    if (!eventId || !deviceId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const result = await toggleInterest(eventId, deviceId, action);
    
    return NextResponse.json({ 
      eventId, 
      count: result.count,
      hasInterest: result.hasInterest,
    });
  } catch (error) {
    console.error("Failed to toggle interest:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
