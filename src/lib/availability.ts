// Availability checking utilities
// Fetches booking page data from nomadsummit.com

export interface EventAvailability {
  eventId: string;
  bookingUrl: string;
  spotsAvailable: number | null; // null = unknown
  isSoldOut: boolean;
  lastChecked: number; // timestamp
  error?: string;
}

// Map our event IDs to their booking URLs (from events.ts)
export const BOOKABLE_EVENTS: { eventId: string; bookingUrl: string }[] = [
  { eventId: "se-1", bookingUrl: "https://www.nomadsummit.com/event/nomad-summit-pool-party-26/" },
  { eventId: "se-2", bookingUrl: "https://www.nomadsummit.com/event/mindful-journaling-for-content-creators/" },
  { eventId: "se-3", bookingUrl: "https://www.nomadsummit.com/event/house-and-pet-sitting-meetup/" },
  { eventId: "se-4", bookingUrl: "https://www.nomadsummit.com/event/nomad-destinations-where-next-2/" },
  { eventId: "se-5", bookingUrl: "https://www.nomadsummit.com/event/nervous-system-reset/" },
  { eventId: "se-6", bookingUrl: "https://www.nomadsummit.com/event/fukuoka-taiwan-ramen-night/" },
  { eventId: "se-7", bookingUrl: "https://www.nomadsummit.com/event/brazil-south-america-nomad-base/" },
  { eventId: "se-8", bookingUrl: "https://www.nomadsummit.com/event/buildathon-teams-at-work/" },
  { eventId: "se-9", bookingUrl: "https://www.nomadsummit.com/event/mind-your-business-mindfulness/" },
  { eventId: "se-10", bookingUrl: "https://www.nomadsummit.com/event/the-deal-room/" },
  { eventId: "se-11", bookingUrl: "https://www.nomadsummit.com/event/buildathon-final-pitches/" },
  { eventId: "se-12", bookingUrl: "https://www.nomadsummit.com/event/extreme-travel-meetup/" },
  { eventId: "se-13", bookingUrl: "https://www.nomadsummit.com/event/replaced-300k-agency-custom-gpt/" },
  { eventId: "se-14", bookingUrl: "https://www.nomadsummit.com/event/padel-social/" },
  { eventId: "se-15", bookingUrl: "https://www.nomadsummit.com/event/linkedin-profile-makeover/" },
  { eventId: "se-16", bookingUrl: "https://www.nomadsummit.com/event/marketing-strategy-design/" },
  { eventId: "se-17", bookingUrl: "https://www.nomadsummit.com/event/hunt-million-dollar-idea/" },
  { eventId: "se-18", bookingUrl: "https://www.nomadsummit.com/event/taxes-offshore-cigars-whiskey/" },
  { eventId: "se-19", bookingUrl: "https://www.nomadsummit.com/event/blog-business-pinterest/" },
  { eventId: "se-20", bookingUrl: "https://www.nomadsummit.com/event/practical-investing-financial-freedom/" },
  { eventId: "se-21", bookingUrl: "https://www.nomadsummit.com/event/coworking-session-aditi/" },
  { eventId: "se-22", bookingUrl: "https://www.nomadsummit.com/event/business-automated-ai-systems/" },
  { eventId: "se-23", bookingUrl: "https://www.nomadsummit.com/event/match-me-if-you-can/" },
  { eventId: "se-24", bookingUrl: "https://www.nomadsummit.com/event/board-game-night/" },
  { eventId: "se-25", bookingUrl: "https://www.nomadsummit.com/event/ads-for-breakfast/" },
  { eventId: "se-26", bookingUrl: "https://www.nomadsummit.com/event/slomading-nomads-next-step/" },
  { eventId: "se-27", bookingUrl: "https://www.nomadsummit.com/event/ai-masterclass-coaches-consultants/" },
  { eventId: "se-28", bookingUrl: "https://www.nomadsummit.com/event/americano-padel-tournament/" },
  { eventId: "se-29", bookingUrl: "https://www.nomadsummit.com/event/make-nomad-summit-better/" },
  { eventId: "se-30", bookingUrl: "https://www.nomadsummit.com/event/official-closing-finale-afterglow/" },
];

/**
 * Fetch and parse availability from a single booking page
 */
export async function fetchEventAvailability(
  eventId: string,
  bookingUrl: string
): Promise<EventAvailability> {
  const result: EventAvailability = {
    eventId,
    bookingUrl,
    spotsAvailable: null,
    isSoldOut: false,
    lastChecked: Date.now(),
  };

  try {
    // Fetch the booking page with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(bookingUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PangiaScheduleBot/1.0; +https://theschedule.vercel.app)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();

    // Parse availability from the HTML
    // Look for common patterns in the Nomad Summit booking pages

    // Check for "Sold Out" indicators
    const soldOutPatterns = [
      /sold\s*out/i,
      /no\s*spots?\s*available/i,
      /fully\s*booked/i,
      /tickets?\s*unavailable/i,
      /event\s*is\s*full/i,
    ];

    for (const pattern of soldOutPatterns) {
      if (pattern.test(html)) {
        result.isSoldOut = true;
        result.spotsAvailable = 0;
        return result;
      }
    }

    // Try to extract spots available
    // Pattern 1: "X spots left" or "X spots available"
    const spotsMatch = html.match(/(\d+)\s*(?:spots?|tickets?|places?)\s*(?:left|available|remaining)/i);
    if (spotsMatch) {
      result.spotsAvailable = parseInt(spotsMatch[1], 10);
      if (result.spotsAvailable === 0) {
        result.isSoldOut = true;
      }
      return result;
    }

    // Pattern 2: Look for availability in structured data or meta tags
    const availabilityMatch = html.match(/"availability"\s*:\s*"(\w+)"/i);
    if (availabilityMatch) {
      const availability = availabilityMatch[1].toLowerCase();
      if (availability === "soldout" || availability === "outofstock") {
        result.isSoldOut = true;
        result.spotsAvailable = 0;
      }
    }

    // Pattern 3: Look for ticket quantity in forms
    const quantityMatch = html.match(/data-max-quantity="(\d+)"/i) || 
                          html.match(/max="(\d+)"[^>]*name="quantity"/i);
    if (quantityMatch) {
      result.spotsAvailable = parseInt(quantityMatch[1], 10);
    }

    // Pattern 4: Check for "Add to Cart" or "Book Now" button absence
    const hasBookButton = /add\s*to\s*cart|book\s*now|get\s*ticket|register/i.test(html);
    if (!hasBookButton) {
      // If no booking button found, might be sold out or registration closed
      result.isSoldOut = true;
      result.spotsAvailable = 0;
    }

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";
    return result;
  }
}

/**
 * Fetch availability for all bookable events
 */
export async function fetchAllAvailability(): Promise<EventAvailability[]> {
  const results = await Promise.allSettled(
    BOOKABLE_EVENTS.map(({ eventId, bookingUrl }) =>
      fetchEventAvailability(eventId, bookingUrl)
    )
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      eventId: BOOKABLE_EVENTS[index].eventId,
      bookingUrl: BOOKABLE_EVENTS[index].bookingUrl,
      spotsAvailable: null,
      isSoldOut: false,
      lastChecked: Date.now(),
      error: result.reason?.message || "Failed to fetch",
    };
  });
}

