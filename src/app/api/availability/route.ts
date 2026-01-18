import { NextResponse } from "next/server";
import { getAvailability, getLastAvailabilityRun } from "@/lib/db";

/**
 * GET /api/availability
 * Returns the current availability data for all events
 */
export async function GET() {
  try {
    const [availability, lastRun] = await Promise.all([
      getAvailability(),
      getLastAvailabilityRun(),
    ]);

    return NextResponse.json({
      availability,
      lastChecked: lastRun,
      // How stale is the data? (in minutes)
      staleness: lastRun ? Math.floor((Date.now() - lastRun) / 60000) : null,
    });
  } catch (error) {
    console.error("Failed to get availability:", error);
    return NextResponse.json(
      { availability: {}, lastChecked: null, staleness: null },
      { status: 200 } // Return empty data rather than error
    );
  }
}



