import { NextResponse } from "next/server";
import { fetchAllAvailability } from "@/lib/availability";
import { setMultipleAvailability, setLastAvailabilityRun, StoredAvailability } from "@/lib/db";

// Vercel Cron job configuration
// This runs every 15 minutes
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for all fetches

/**
 * Cron job to check availability of all bookable events
 * Called by Vercel Cron every 15 minutes
 */
export async function GET(request: Request) {
  // Verify this is a legitimate cron request (from Vercel or manual trigger with secret)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // In production, verify the cron secret
  // Vercel Cron sends this automatically
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow request if it's from Vercel's cron (they set a special header)
    const isVercelCron = request.headers.get("x-vercel-cron") === "true";
    if (!isVercelCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log("[Cron] Starting availability check...");
  const startTime = Date.now();

  try {
    // Fetch availability for all events
    const results = await fetchAllAvailability();
    
    // Convert to StoredAvailability format
    const availabilities: StoredAvailability[] = results.map((r) => ({
      eventId: r.eventId,
      spotsAvailable: r.spotsAvailable,
      isSoldOut: r.isSoldOut,
      lastChecked: r.lastChecked,
      error: r.error,
    }));

    // Store in Redis
    await setMultipleAvailability(availabilities);
    await setLastAvailabilityRun(Date.now());

    const duration = Date.now() - startTime;
    const successCount = results.filter((r) => !r.error).length;
    const errorCount = results.filter((r) => r.error).length;
    const soldOutCount = results.filter((r) => r.isSoldOut).length;

    console.log(`[Cron] Completed in ${duration}ms: ${successCount} success, ${errorCount} errors, ${soldOutCount} sold out`);

    return NextResponse.json({
      success: true,
      duration,
      results: {
        total: results.length,
        success: successCount,
        errors: errorCount,
        soldOut: soldOutCount,
      },
      // Include details for debugging
      details: results.map((r) => ({
        eventId: r.eventId,
        isSoldOut: r.isSoldOut,
        spotsAvailable: r.spotsAvailable,
        error: r.error,
      })),
    });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}



