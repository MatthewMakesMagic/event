export interface Speaker {
  name: string;
  role: string;
  company?: string;
}

export interface Venue {
  name: string;
  address: string;
  area?: string;
  googleMapsUrl: string;
}

export interface EventPricing {
  premiumAttendee: number;
  standardAttendee: number;
  nonAttendee: number;
}

export interface Event {
  id: string;
  title: string;
  type: "main_conference" | "side_event";
  track?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h format, ICT timezone)
  endTime?: string;
  venue: Venue;
  speakers?: Speaker[];
  organizer?: string; // For side events - who's hosting
  description: string;
  shortDescription?: string;
  pricing: EventPricing;
  spotsAvailable?: number;
  tags: string[];
  isFeatured?: boolean;
  isSoldOut?: boolean;
  emoji?: string;
  isBreak?: boolean; // For lunch/breaks
  bookingUrl?: string; // Link to Nomad Summit booking page
}

// Venues with Google Maps links
const VENUES: Record<string, Venue> = {
  MAIN_STAGE: {
    name: "Main Conference Hall",
    address: "Shangri-La Hotel, 89/8 Chang Klan Road, Chiang Mai",
    area: "Night Bazaar",
    googleMapsUrl: "https://maps.google.com/maps?q=Shangri-La+Hotel+Chiang+Mai",
  },
  SHANGRI_LA: {
    name: "Shangri-La Hotel",
    address: "89/8 Chang Klan Road, Chiang Mai",
    area: "Night Bazaar",
    googleMapsUrl: "https://maps.google.com/maps?q=Shangri-La+Hotel+Chiang+Mai",
  },
  ALT_CM: {
    name: "Alt_ChiangMai",
    address: "5 Sirimangkalajarn Road Lane 7, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=Alt_ChiangMai+Nimman",
  },
  ALT_PING: {
    name: "Alt_PingRiver",
    address: "59 Charoen Rat Rd, Chiang Mai",
    area: "Riverside",
    googleMapsUrl: "https://maps.google.com/maps?q=Alt_Ping+River+Chiang+Mai",
  },
  PUNSPACE: {
    name: "Punspace Wiang Kaew",
    address: "10 Wiang Kaew Rd, Si Phum, Chiang Mai",
    area: "Old City",
    googleMapsUrl: "https://maps.google.com/maps?q=Punspace+Wiang+Kaew+Chiang+Mai",
  },
  FOUR_SEAS: {
    name: "4seas",
    address: "Nimman, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=4seas+Nimman+Chiang+Mai",
  },
  YELLOW: {
    name: "Yellow Coworking",
    address: "16 Nimmana Haeminda Rd Lane 5, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=Yellow+Coworking+Nimman+Chiang+Mai",
  },
  MELIA: {
    name: "Melia Hotel",
    address: "46-48 Charoen Prathet Rd, Chiang Mai",
    area: "Night Bazaar",
    googleMapsUrl: "https://maps.google.com/maps?q=Melia+Chiang+Mai",
  },
  BRICK: {
    name: "The Brick Startup",
    address: "Nimman, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=The+Brick+Startup+Chiang+Mai",
  },
  GEMOI: {
    name: "Gemoi Lifestyle Cafe",
    address: "Santitham, Chiang Mai",
    area: "Santitham",
    googleMapsUrl: "https://maps.google.com/maps?q=Gemoi+Lifestyle+Cafe+Chiang+Mai",
  },
  AQUARIA: {
    name: "Aquaria Restaurant & Bar",
    address: "17 Moonmuang Rd Lane 5, Si Phum, Chiang Mai",
    area: "Old City",
    googleMapsUrl: "https://maps.google.com/maps?q=Aquaria+Restaurant+Bar+Chiang+Mai",
  },
  CIGARS_ROOM: {
    name: "The Cigars Room",
    address: "Nimman, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=The+Cigars+Room+Chiang+Mai",
  },
  PADEL55: {
    name: "Padel55",
    address: "Chiang Mai",
    area: "Outskirts",
    googleMapsUrl: "https://maps.google.com/maps?q=Padel55+Chiang+Mai",
  },
  PADEL_CLUB: {
    name: "Padel Club Chiang Mai",
    address: "Chiang Mai",
    area: "Outskirts",
    googleMapsUrl: "https://maps.google.com/maps?q=Padel+Club+Chiang+Mai",
  },
  FELLOWSHIP: {
    name: "Fellowship Cafe & Co-Working",
    address: "Nimmanhaemin Rd, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=Fellowship+Cafe+Coworking+Chiang+Mai",
  },
  DUKES: {
    name: "The Duke's Ping River",
    address: "Ping River, Chiang Mai",
    area: "Riverside",
    googleMapsUrl: "https://maps.google.com/maps?q=The+Dukes+Ping+River+Chiang+Mai",
  },
  DEEJAI: {
    name: "Deep Green @ Deejai Garden",
    address: "Chiang Mai",
    area: "City",
    googleMapsUrl: "https://maps.google.com/maps?q=Deejai+Garden+Chiang+Mai",
  },
  LOVE_FIRST_BITE: {
    name: "Love at First Bite",
    address: "Nimmanhaemin Rd, Chiang Mai",
    area: "Nimman",
    googleMapsUrl: "https://maps.google.com/maps?q=Love+First+Bite+Nimman+Chiang+Mai",
  },
  DECK_ONE: {
    name: "Deck One All Day Eatery",
    address: "Chiang Mai",
    area: "City",
    googleMapsUrl: "https://maps.google.com/maps?q=Deck+One+Chiang+Mai",
  },
  SUK_JAI: {
    name: "Suk Jai Restaurant",
    address: "Chiang Mai",
    area: "City",
    googleMapsUrl: "https://maps.google.com/maps?q=Suk+Jai+Restaurant+Chiang+Mai",
  },
};

// Main Conference Events - CORRECTED based on official Program & Agenda
// Source: https://www.nomadsummit.com/program-agenda-26/
// Day 0: Friday Jan 16, 2026
// Day 1: Saturday Jan 17, 2026
// Day 2: Sunday Jan 18, 2026
const MAIN_CONFERENCE_EVENTS: Event[] = [
  // ========== FRIDAY JAN 16 - DAY 0 ==========
  {
    id: "mc-day0-mixer",
    title: "Registration and Opening Mixer",
    type: "main_conference",
    date: "2026-01-16",
    startTime: "19:00",
    endTime: "21:00",
    venue: VENUES.SHANGRI_LA,
    description: "Pick up your conference badge and meet fellow attendees at the Opening Mixer. A great chance to start networking before the main conference begins!",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["networking", "registration"],
    emoji: "🍸",
    isFeatured: true,
  },
  // ========== SATURDAY JAN 17 - DAY 1 ==========
  {
    id: "mc-coffee-1",
    title: "Coffee and Registration",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "09:30",
    endTime: "10:15",
    venue: VENUES.MAIN_STAGE,
    description: "Coffee and morning snack available for all attendees.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["registration"],
    emoji: "☕",
    isBreak: true,
  },
  {
    id: "mc-opening",
    title: "Conference opening words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "10:05",
    endTime: "10:30",
    venue: VENUES.MAIN_STAGE,
    description: "Welcome to Nomad Summit 2026! Opening remarks and introduction to the conference.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["opening"],
    emoji: "🎉",
  },
  {
    id: "mc-block-1a",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "10:30",
    endTime: "10:35",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Benjarong Khonthong", role: "Block Host" }],
    description: "Introduction to the STEP IN block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-1",
    title: "Landing remote jobs in a competitive market",
    type: "main_conference",
    track: "STEP IN",
    date: "2026-01-17",
    startTime: "10:35",
    endTime: "11:00",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Juliana Rabbi", role: "Career Coach for Remote Jobs" }],
    description: "Remote work is more than working from anywhere – it's building a career with real freedom, flexibility, and fulfillment. Drawing on 15+ years as an international recruiter and remote career coach, Juliana shows you how to align your skills, story, and strategy so you stand out in a crowded market and land meaningful remote roles.",
    shortDescription: "Land meaningful remote roles with 15+ years of recruiter insights",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["career", "remote-work", "beginner"],
    emoji: "💼",
  },
  {
    id: "mc-2",
    title: "How to own your business journey: Lessons from 5 business models",
    type: "main_conference",
    track: "STEP IN",
    date: "2026-01-17",
    startTime: "11:05",
    endTime: "11:30",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Stella Schneider", role: "Founder & CEO", company: "Businesswege" }],
    description: "Stella breaks down 5 different business models and what they actually mean for your day-to-day life as an entrepreneur. She helps you choose, design, and commit to the path that genuinely fits your strengths, values, and vision instead of defaulting to whatever looks exciting online.",
    shortDescription: "Choose the business model that fits your life",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["business", "strategy", "beginner"],
    emoji: "🎯",
  },
  {
    id: "mc-scholarship",
    title: "Nomad Summit scholarship winners announcement",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "11:30",
    endTime: "11:45",
    venue: VENUES.MAIN_STAGE,
    description: "Announcement of this year's Nomad Summit scholarship winners.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["announcement"],
    emoji: "🎓",
  },
  {
    id: "mc-lunch-1",
    title: "Lunch buffet + Networking",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "11:45",
    endTime: "13:00",
    venue: VENUES.MAIN_STAGE,
    description: "Enjoy the 5-star lunch buffet and connect with fellow attendees.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["networking", "lunch"],
    emoji: "🍽️",
    isBreak: true,
  },
  {
    id: "mc-block-1b",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "13:00",
    endTime: "13:05",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Marie Braud", role: "Block Host" }],
    description: "Introduction to the GET SET block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-3",
    title: "The Brand Identity Blueprint",
    type: "main_conference",
    track: "GET SET",
    date: "2026-01-17",
    startTime: "13:05",
    endTime: "13:30",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Nivit Kochhar", role: "Founder", company: "Supercharged Studio & Nomad Wildheart" }],
    description: "In a world where most of your business happens through a screen, your brand often makes the first (and only) impression. This talk shows remote entrepreneurs how to build a clear, consistent brand identity — across positioning, visuals, and voice — so every touchpoint online works harder for you and turns your presence into a real business asset.",
    shortDescription: "Build a brand that works while you sleep",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["branding", "marketing", "design"],
    emoji: "🎨",
  },
  {
    id: "mc-4",
    title: "What two exits and too many failures taught me about growing successful companies",
    type: "main_conference",
    track: "GET SET",
    date: "2026-01-17",
    startTime: "13:35",
    endTime: "14:00",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Daniel Johnson", role: "Founding Partner", company: "We Scale Startups" }],
    description: "Growth isn't a hack or a channel – it's a system. This keynote breaks growth down to first principles: defining your ideal customer, understanding the real problem you solve, speaking in their language, and mapping the full journey from first awareness to loyal repeat customer.",
    shortDescription: "First-principles growth from someone who's done it twice",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["growth", "startups", "exits"],
    emoji: "📈",
  },
  {
    id: "mc-break-1",
    title: "Break",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "14:00",
    endTime: "14:15",
    venue: VENUES.MAIN_STAGE,
    description: "Short break.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["break"],
    emoji: "☕",
    isBreak: true,
  },
  {
    id: "mc-block-1c",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "14:15",
    endTime: "14:20",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Danny Visnakovs", role: "Block Host" }],
    description: "Introduction to the SCALE UP block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-5",
    title: "Create a SaaS from the niche you know",
    type: "main_conference",
    track: "SCALE UP",
    date: "2026-01-17",
    startTime: "14:20",
    endTime: "14:45",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Vivianne Arnold", role: "Founder & CEO", company: "WiredMinds.AI" }],
    description: "Most people think SaaS is only for big tech — Vivianne shows how to turn a niche you already know into a simple, freedom-first product you can build from anywhere. She'll walk through the real steps, lessons, and mindset shifts behind taking one specific pain point, turning it into an AI SaaS, and using it to escape pure client work.",
    shortDescription: "Turn your expertise into a SaaS product",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["saas", "ai", "product"],
    emoji: "🚀",
  },
  {
    id: "mc-6",
    title: "From Hotjar to Hostaway: Scaling a fully remote culture of 300+ global teammates",
    type: "main_conference",
    track: "SCALE UP",
    date: "2026-01-17",
    startTime: "14:45",
    endTime: "15:10",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Ken Weary", role: "COO", company: "Hostaway (ex-Hotjar)" }],
    description: "Scaling a fully remote team isn't just about hiring more people – it's about building a culture, structure, and cadence that keep 300+ people rowing in the same direction. Ken shares hard-earned lessons from scaling global SaaS teams at Hotjar and Hostaway.",
    shortDescription: "Lessons from scaling 300+ remote teammates",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["remote-work", "leadership", "scale"],
    emoji: "👥",
  },
  {
    id: "mc-7",
    title: "Inside the exit: A Conversation on Building, Scaling, and Selling Digital Businesses",
    type: "main_conference",
    track: "SCALE UP",
    date: "2026-01-17",
    startTime: "15:15",
    endTime: "15:40",
    venue: VENUES.MAIN_STAGE,
    speakers: [
      { name: "Fiona Laidlaw", role: "Regional Director, APAC", company: "Flippa" },
      { name: "Sheena Low", role: "Founder", company: "Super Fly Honey" },
    ],
    description: "This session is a conversation on what really makes a digital business attractive to buyers and how to prepare for a successful exit. You'll hear real stories, key decisions, mistakes, and buyer priorities — plus what life looks like after the sale.",
    shortDescription: "Real talk about selling your digital business",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["exits", "flippa", "founders"],
    emoji: "💰",
  },
  {
    id: "mc-break-1b",
    title: "Coffee break",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "15:40",
    endTime: "16:00",
    venue: VENUES.MAIN_STAGE,
    description: "Afternoon coffee break.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["break"],
    emoji: "☕",
    isBreak: true,
  },
  {
    id: "mc-block-1d",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "16:00",
    endTime: "16:05",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Dr. Quinn Button", role: "Block Host" }],
    description: "Introduction to the GIVE BACK block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-8",
    title: "Giving back without burning out",
    type: "main_conference",
    track: "GIVE BACK",
    date: "2026-01-17",
    startTime: "16:05",
    endTime: "16:30",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Adam Rajguru", role: "Cleantech Founder & Innovation Consultant" }],
    description: "This keynote explores a practical and sustainable approach to giving back. Drawing from personal experience across startups, engineering, and life abroad, Adam examines how purpose can inspire us and also push us past our limits.",
    shortDescription: "Sustainable impact without the burnout",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["impact", "wellness", "purpose"],
    emoji: "💚",
  },
  {
    id: "mc-9",
    title: "From guests to contributors: How countries expect nomads to give back",
    type: "main_conference",
    track: "GIVE BACK",
    date: "2026-01-17",
    startTime: "16:30",
    endTime: "16:55",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Dr. Kaisu Koskela", role: "Independent Scholar & Policy Advocate" }],
    description: "This keynote unpacks why more and more countries are creating digital nomad visas, what they quietly expect in return, and how 'giving back' is becoming part of a new mobility contract between nomads and states.",
    shortDescription: "The new nomad-state social contract",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["visas", "policy", "nomad-life"],
    emoji: "🌐",
  },
  {
    id: "mc-closing-1",
    title: "Day 1 closing words",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "16:55",
    endTime: "17:00",
    venue: VENUES.MAIN_STAGE,
    description: "Closing remarks for Day 1 of the conference.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["closing"],
    emoji: "👋",
  },
  {
    id: "mc-afterparty",
    title: "Dinner and Afterparty at Ta Tamnak Privilege",
    type: "main_conference",
    date: "2026-01-17",
    startTime: "18:00",
    endTime: "23:00",
    venue: {
      name: "Ta Tamnak Privilege",
      address: "Chiang Mai",
      area: "City",
      googleMapsUrl: "https://maps.google.com/maps?q=Ta+Tamnak+Privilege+Chiang+Mai",
    },
    description: "The official Nomad Summit afterparty! Free shuttle available from Shangri-La every 30 min between 17:30 and 19:00. Shuttle back to Shangri-La every 30 min between 22:00 and 23:30.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["party", "networking", "dinner"],
    emoji: "🎉",
    isFeatured: true,
  },
  // ========== SUNDAY JAN 18 - DAY 2 ==========
  {
    id: "mc-coffee-2",
    title: "Coffee & Networking",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "10:00",
    endTime: "10:30",
    venue: VENUES.MAIN_STAGE,
    description: "Coffee and morning snack available for all attendees.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["networking"],
    emoji: "☕",
    isBreak: true,
  },
  {
    id: "mc-block-2a",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "10:30",
    endTime: "10:35",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "AP Ingkawara", role: "Block Host" }],
    description: "Introduction to the SEED WEALTH block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-10",
    title: "Modern investing for a borderless life",
    type: "main_conference",
    track: "SEED WEALTH",
    date: "2026-01-18",
    startTime: "10:35",
    endTime: "11:00",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Dr. Jonathon Button", role: "Co-Founder", company: "Life Out of the Box" }],
    description: "This keynote shows digital nomads how to approach investing at different levels, wherever they live and whatever stage they're at. Using real examples from emerging hubs, Jonathon breaks down how on-the-ground insight plus AI-driven analysis can help you read markets and build a practical global investing framework.",
    shortDescription: "Investing strategies for location-independent life",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["investing", "finance", "nomad-life"],
    emoji: "📊",
  },
  {
    id: "mc-11",
    title: "From zero to financial freedom: building wealth through business, real estate, and stock market investing",
    type: "main_conference",
    track: "SEED WEALTH",
    date: "2026-01-18",
    startTime: "11:00",
    endTime: "11:25",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Fabio Faccin", role: "Founder & Investor", company: "PerformancePP" }],
    description: "Fabio shares how he went from zero savings to building a diversified net worth through his online business, real estate, and stock market investing. He breaks down the numbers, mistakes, and mindset shifts behind his journey.",
    shortDescription: "Zero to financial freedom: the real numbers",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["investing", "real-estate", "wealth"],
    emoji: "🏦",
  },
  {
    id: "mc-12",
    title: "The money panel: Your globalized strategy to retire early",
    type: "main_conference",
    track: "SEED WEALTH",
    date: "2026-01-18",
    startTime: "11:30",
    endTime: "12:05",
    venue: VENUES.MAIN_STAGE,
    speakers: [
      { name: "Aleksa Burmazović", role: "International Advisor", company: "Settee" },
      { name: "Fabio Faccin", role: "Founder & Investor", company: "PerformancePP" },
      { name: "Christoph Huebner", role: "Co-CEO", company: "Nomad Summit" },
    ],
    description: "Plant your flags around the world: Taxation, Business, Playgrounds - and your investment plan. Optimizing not only for asset classes and allocations but also for friendly and supportive business setup and tax regimes.",
    shortDescription: "Panel: Global tax & wealth optimization strategies",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["taxes", "investing", "panel"],
    emoji: "🌍",
  },
  {
    id: "mc-lucky-draw",
    title: "China Airlines lucky draw",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "12:05",
    endTime: "12:15",
    venue: VENUES.MAIN_STAGE,
    description: "Lucky draw sponsored by China Airlines.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["giveaway"],
    emoji: "🎁",
  },
  {
    id: "mc-lunch-2",
    title: "Lunch buffet + Networking",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "12:15",
    endTime: "13:35",
    venue: VENUES.MAIN_STAGE,
    description: "Enjoy the 5-star lunch buffet and connect with fellow attendees.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["networking", "lunch"],
    emoji: "🍽️",
    isBreak: true,
  },
  {
    id: "mc-block-2b",
    title: "Block opening words",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "13:40",
    endTime: "13:45",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Meliisa Palipea", role: "Block Host" }],
    description: "Introduction to the LEAD ON block.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["intro"],
    emoji: "🎙️",
  },
  {
    id: "mc-13",
    title: "Before it's a trend: How to spot opportunities early and build what's next",
    type: "main_conference",
    track: "LEAD ON",
    date: "2026-01-18",
    startTime: "13:45",
    endTime: "14:10",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Dr. Quinn Button", role: "Co-Founder", company: "Life Out of the Box" }],
    description: "Quinn shares a practical framework for spotting early behavioral and cultural shifts before they turn into mainstream trends. Drawing on her PhD in consumer behavior and years of working with emerging tech, she shows how digital nomads can use travel, community, and observation to turn subtle signals into real opportunities.",
    shortDescription: "Spot trends before they're trends",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["trends", "innovation", "research"],
    emoji: "🔮",
  },
  {
    id: "mc-14",
    title: "10x your online visibility in AI search: The LLM optimization playbook",
    type: "main_conference",
    track: "LEAD ON",
    date: "2026-01-18",
    startTime: "14:10",
    endTime: "14:35",
    venue: VENUES.MAIN_STAGE,
    speakers: [{ name: "Konstantin Sadekov", role: "CEO", company: "Ethical SEO" }],
    description: "Konstantin gives a hands-on breakdown of how AI search (ChatGPT, Perplexity, etc.) actually finds and cites businesses — and what makes it pick one brand over another. You'll learn concrete steps to audit your current AI visibility and adjust your content so LLMs are far more likely to surface, reference, and recommend you.",
    shortDescription: "Get discovered by AI search engines",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["ai", "seo", "marketing"],
    emoji: "🤖",
  },
  {
    id: "mc-buildathon-pitches",
    title: "Buildathon idea pitches",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "14:35",
    endTime: "15:10",
    venue: VENUES.MAIN_STAGE,
    description: "Watch the Buildathon teams present their ideas and pitch their projects.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["buildathon", "pitches"],
    emoji: "💡",
  },
  {
    id: "mc-closing-2",
    title: "Conference closing words",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "15:10",
    endTime: "15:20",
    venue: VENUES.MAIN_STAGE,
    description: "Official closing remarks for Nomad Summit 2026. Thank you for joining us!",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["closing"],
    emoji: "🙏",
  },
  {
    id: "mc-buildathon-teams",
    title: "Buildathon team formation & registration",
    type: "main_conference",
    date: "2026-01-18",
    startTime: "15:30",
    endTime: "16:40",
    venue: VENUES.MAIN_STAGE,
    description: "Buildathon participants form teams and register. Those who do not participate in the buildathon can move to the pool area.",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    tags: ["buildathon"],
    emoji: "🔨",
  },
];

// Side Events (Nomad Week - Jan 18-24)
const SIDE_EVENTS: Event[] = [
  {
    id: "se-1",
    title: "Nomad Summit x CM DNXC Pool Party",
    type: "side_event",
    date: "2026-01-18",
    startTime: "16:00",
    endTime: "20:30",
    venue: VENUES.SHANGRI_LA,
    organizer: "Nomad Summit & CM DNXC",
    description: "The official closing of the Nomad Summit main event and kick-off into Nomad Week. Dive into Chiang Mai's largest pool, network with digital nomads and speakers, enjoy a cash bar and DJ. Bring your swimwear!",
    shortDescription: "Pool party at Shangri-La to kick off Nomad Week",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 630 },
    spotsAvailable: 24,
    tags: ["party", "pool", "networking"],
    emoji: "🏊",
    isFeatured: true,
    bookingUrl: "https://www.nomadsummit.com/event/nomad-summit-pool-party-26/",
  },
  {
    id: "se-2",
    title: "Mindful Journaling for Content Creators",
    type: "side_event",
    date: "2026-01-19",
    startTime: "09:30",
    endTime: "11:00",
    venue: VENUES.ALT_CM,
    organizer: "Leanne Lam",
    description: "A calm, guided journaling session for content creators to slow down, reconnect with purpose, and clear creative noise. Led by certified mindset coach Leanne Blu, who has facilitated 50+ journaling and meditation workshops.",
    shortDescription: "Journaling workshop for creators",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["wellness", "creativity", "workshop"],
    emoji: "✍️",
    isSoldOut: true,
    bookingUrl: "https://www.nomadsummit.com/event/mindful-journaling-for-content-creators/",
  },
  {
    id: "se-3",
    title: "House and Pet Sitting Meetup",
    type: "side_event",
    date: "2026-01-19",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.PUNSPACE,
    organizer: "Alison & Graham",
    description: "Join Alison and Graham for a relaxed coffee meet‑up all about the art of house sitting and pet sitting. As professional sitters who've lived in more than 97 homes over the past eight years, they've cared for countless pets while travelling the world.",
    shortDescription: "Learn house sitting from pros who've stayed in 97+ homes",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    spotsAvailable: 2,
    tags: ["housesitting", "pets", "meetup"],
    emoji: "🏠",
    bookingUrl: "https://www.nomadsummit.com/event/house-and-pet-sitting-meetup/",
  },
  {
    id: "se-4",
    title: "Nomad Destinations: Where next?",
    type: "side_event",
    date: "2026-01-19",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.PUNSPACE,
    organizer: "Nomad Summit Community",
    description: "Explore the best digital nomad destinations for 2026 and beyond. Share experiences and discover hidden gems.",
    shortDescription: "Discover your next nomad destination",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["travel", "destinations", "meetup"],
    emoji: "🌍",
    bookingUrl: "https://www.nomadsummit.com/event/nomad-destinations-where-next-2/",
  },
  {
    id: "se-5",
    title: "Nervous System Reset for the ASAP World",
    type: "side_event",
    date: "2026-01-19",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.SUK_JAI,
    organizer: "Wellness Workshop",
    description: "Learn techniques to regulate your nervous system in our always-on, always-urgent world.",
    shortDescription: "Regulate your nervous system",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["wellness", "health", "workshop"],
    emoji: "🧘",
    bookingUrl: "https://www.nomadsummit.com/event/nervous-system-reset/",
  },
  {
    id: "se-6",
    title: "Fukuoka ✖︎ Taiwan Ramen Night",
    type: "side_event",
    date: "2026-01-19",
    startTime: "18:00",
    endTime: "21:00",
    venue: VENUES.ALT_PING,
    organizer: "Colive Fukuoka & Taiwan DNA",
    description: "Join us for our Japan ✖️ Taiwan ramen night 🍜 a special evening organized by Colive Fukuoka and the Taiwan Digital Nomad Association.",
    shortDescription: "Ramen night with Fukuoka & Taiwan nomad communities",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["food", "networking", "social"],
    emoji: "🍜",
    bookingUrl: "https://www.nomadsummit.com/event/fukuoka-taiwan-ramen-night/",
  },
  {
    id: "se-7",
    title: "Brazil & South America as a Digital Nomad Base",
    type: "side_event",
    date: "2026-01-19",
    startTime: "20:00",
    endTime: "22:00",
    venue: VENUES.DUKES,
    organizer: "South America Nomads",
    description: "A practical look at Brazil and South America as alternatives to Asia for digital nomads.",
    shortDescription: "South America as a nomad base",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["travel", "south-america", "meetup"],
    emoji: "🌎",
    bookingUrl: "https://www.nomadsummit.com/event/brazil-south-america-nomad-base/",
  },
  {
    id: "se-8",
    title: "Buildathon: Teams at Work",
    type: "side_event",
    date: "2026-01-20",
    startTime: "09:30",
    endTime: "17:00",
    venue: VENUES.FOUR_SEAS,
    organizer: "Nomad Summit",
    description: "Full day of building with your hackathon team. Work on your projects and get mentorship.",
    shortDescription: "Hackathon building day",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["building", "hackathon", "coding"],
    emoji: "🔨",
    bookingUrl: "https://www.nomadsummit.com/event/buildathon-teams-at-work/",
  },
  {
    id: "se-9",
    title: "Mind Your Business – with Mindfulness",
    type: "side_event",
    date: "2026-01-20",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.PUNSPACE,
    organizer: "Mindful Business",
    description: "Combine mindfulness practices with business strategy for sustainable entrepreneurship.",
    shortDescription: "Mindfulness meets business strategy",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["wellness", "business", "workshop"],
    emoji: "🧠",
    bookingUrl: "https://www.nomadsummit.com/event/mind-your-business-mindfulness/",
  },
  {
    id: "se-10",
    title: "The Deal Room",
    type: "side_event",
    date: "2026-01-20",
    startTime: "14:00",
    endTime: "17:00",
    venue: VENUES.MELIA,
    organizer: "Flippa",
    description: "A curated, exclusive side event powered by Flippa. Focused on preparing founders to sell digital businesses properly. Small, closed-room setting for serious founders considering an exit in 6-24 months.",
    shortDescription: "Premium workshop on selling your digital business",
    pricing: { premiumAttendee: 849, standardAttendee: 849, nonAttendee: 1699 },
    spotsAvailable: 15,
    tags: ["exits", "flippa", "premium"],
    emoji: "💼",
    isFeatured: true,
    bookingUrl: "https://www.nomadsummit.com/event/the-deal-room/",
  },
  {
    id: "se-11",
    title: "Buildathon: Final Pitches",
    type: "side_event",
    date: "2026-01-20",
    startTime: "18:00",
    endTime: "20:00",
    venue: VENUES.FOUR_SEAS,
    organizer: "Nomad Summit",
    description: "Watch teams pitch their hackathon projects and celebrate the winners.",
    shortDescription: "Hackathon final presentations",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["building", "hackathon", "pitches"],
    emoji: "🎤",
    bookingUrl: "https://www.nomadsummit.com/event/buildathon-final-pitches/",
  },
  {
    id: "se-12",
    title: "Extreme Travel Meetup",
    type: "side_event",
    date: "2026-01-20",
    startTime: "19:00",
    endTime: "21:00",
    venue: VENUES.DEEJAI,
    organizer: "Extreme Travelers",
    description: "For adventurers who've been to unusual destinations. Share stories and plan your next extreme adventure.",
    shortDescription: "Meetup for adventurous travelers",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["travel", "adventure", "meetup"],
    emoji: "🗺️",
    bookingUrl: "https://www.nomadsummit.com/event/extreme-travel-meetup/",
  },
  {
    id: "se-13",
    title: "How I Replaced a $300k Agency with a Custom GPT",
    type: "side_event",
    date: "2026-01-21",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.YELLOW,
    organizer: "AI Workshop",
    description: "In 2025, I helped build a Custom GPT that replaced a $300,000 contract copywriting agency at The Economist Group. Walk away with a simple audit for AI tasks, the 3-part framework for building GPTs, and your own opportunity list.",
    shortDescription: "Build AI systems that replace expensive agencies",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    spotsAvailable: 0,
    tags: ["ai", "automation", "workshop"],
    emoji: "🤖",
    isSoldOut: true,
    isFeatured: true,
    bookingUrl: "https://www.nomadsummit.com/event/replaced-300k-agency-custom-gpt/",
  },
  {
    id: "se-14",
    title: "Padel Social",
    type: "side_event",
    date: "2026-01-21",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.PADEL55,
    organizer: "Padel55",
    description: "Casual padel games for all skill levels. Meet fellow nomads who love the sport.",
    shortDescription: "Social padel games for all levels",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["sports", "padel", "social"],
    emoji: "🎾",
    bookingUrl: "https://www.nomadsummit.com/event/padel-social/",
  },
  {
    id: "se-15",
    title: "LinkedIn profile makeover for business owners",
    type: "side_event",
    date: "2026-01-21",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.ALT_PING,
    organizer: "LinkedIn Pro",
    description: "Turn your LinkedIn profile into a client magnet with hands-on guidance from experts.",
    shortDescription: "Transform your LinkedIn into a client magnet",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["linkedin", "marketing", "workshop"],
    emoji: "💼",
    bookingUrl: "https://www.nomadsummit.com/event/linkedin-profile-makeover/",
  },
  {
    id: "se-16",
    title: "Marketing Strategy Design",
    type: "side_event",
    date: "2026-01-21",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.BRICK,
    organizer: "The Brick Startup",
    description: "Design a marketing strategy that actually works for your business.",
    shortDescription: "Build a marketing strategy that works",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["marketing", "strategy", "workshop"],
    emoji: "📈",
    bookingUrl: "https://www.nomadsummit.com/event/marketing-strategy-design/",
  },
  {
    id: "se-17",
    title: "Hunt your next million-dollar idea",
    type: "side_event",
    date: "2026-01-21",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.YELLOW,
    organizer: "Yellow Coworking",
    description: "A vibe building session to help you discover and validate your next big business idea.",
    shortDescription: "Discover your next big idea",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["ideas", "brainstorming", "workshop"],
    emoji: "💡",
    bookingUrl: "https://www.nomadsummit.com/event/hunt-million-dollar-idea/",
  },
  {
    id: "se-18",
    title: "Taxes & Offshore Meetup: Cigars & Whiskey",
    type: "side_event",
    date: "2026-01-21",
    startTime: "18:30",
    endTime: "21:00",
    venue: VENUES.CIGARS_ROOM,
    organizer: "Nomad Tax Network",
    description: "Low-risky conversations about international tax strategies over cigars and whiskey.",
    shortDescription: "Tax optimization over cigars & whiskey",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["taxes", "offshore", "networking"],
    emoji: "💰",
    bookingUrl: "https://www.nomadsummit.com/event/taxes-offshore-cigars-whiskey/",
  },
  {
    id: "se-19",
    title: "From Blog to Business: Monetizing Content with Pinterest",
    type: "side_event",
    date: "2026-01-22",
    startTime: "09:00",
    endTime: "11:00",
    venue: VENUES.BRICK,
    organizer: "Content Creators",
    description: "Learn how to turn your content into a business using Pinterest as your growth engine.",
    shortDescription: "Monetize your content with Pinterest",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["pinterest", "content", "monetization"],
    emoji: "📌",
    bookingUrl: "https://www.nomadsummit.com/event/blog-business-pinterest/",
  },
  {
    id: "se-20",
    title: "Practical Investing for Financial Freedom",
    type: "side_event",
    date: "2026-01-22",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.FELLOWSHIP,
    organizer: "Financial Freedom",
    description: "A practical workshop on building wealth through smart investing strategies.",
    shortDescription: "Build wealth through smart investing",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["investing", "finance", "workshop"],
    emoji: "📊",
    bookingUrl: "https://www.nomadsummit.com/event/practical-investing-financial-freedom/",
  },
  {
    id: "se-21",
    title: "Coworking Session with Aditi",
    type: "side_event",
    date: "2026-01-22",
    startTime: "13:00",
    endTime: "16:00",
    venue: VENUES.GEMOI,
    organizer: "Aditi",
    description: "Focused coworking session with body-doubling for productivity.",
    shortDescription: "Productive coworking session",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["coworking", "productivity", "social"],
    emoji: "💻",
    bookingUrl: "https://www.nomadsummit.com/event/coworking-session-aditi/",
  },
  {
    id: "se-22",
    title: "Your Business, But Automated: AI Systems That Actually Run",
    type: "side_event",
    date: "2026-01-22",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.YELLOW,
    organizer: "AI Automators",
    description: "Learn how founders are building AI systems that run their businesses on autopilot.",
    shortDescription: "Build AI systems that run your business",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["ai", "automation", "business"],
    emoji: "⚡",
    bookingUrl: "https://www.nomadsummit.com/event/business-automated-ai-systems/",
  },
  {
    id: "se-23",
    title: "Match Me If You Can",
    type: "side_event",
    date: "2026-01-22",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.PUNSPACE,
    organizer: "Nomad Summit",
    description: "Nomad Summit Chiang Mai – Coworking Match Reveal. Find your perfect coworking buddy.",
    shortDescription: "Find your perfect coworking match",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["networking", "coworking", "social"],
    emoji: "💞",
    bookingUrl: "https://www.nomadsummit.com/event/match-me-if-you-can/",
  },
  {
    id: "se-24",
    title: "Board Game Night",
    type: "side_event",
    date: "2026-01-22",
    startTime: "19:00",
    endTime: "22:00",
    venue: VENUES.GEMOI,
    organizer: "Gemoi Lifestyle",
    description: "Unwind with board games and meet fellow nomads in a relaxed setting.",
    shortDescription: "Chill board game night",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["games", "social", "evening"],
    emoji: "🎲",
    bookingUrl: "https://www.nomadsummit.com/event/board-game-night/",
  },
  {
    id: "se-25",
    title: "Ads for Breakfast?",
    type: "side_event",
    date: "2026-01-23",
    startTime: "09:30",
    endTime: "11:30",
    venue: VENUES.LOVE_FIRST_BITE,
    organizer: "Ads Expert",
    description: "Morning session on paid advertising strategies over breakfast.",
    shortDescription: "Learn paid ads over breakfast",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["ads", "marketing", "breakfast"],
    emoji: "📢",
    bookingUrl: "https://www.nomadsummit.com/event/ads-for-breakfast/",
  },
  {
    id: "se-26",
    title: "Slomading: The Nomad's Next Step",
    type: "side_event",
    date: "2026-01-23",
    startTime: "12:00",
    endTime: "14:00",
    venue: VENUES.GEMOI,
    organizer: "Slow Nomads",
    description: "Explore the slow nomad lifestyle – staying longer, building deeper connections.",
    shortDescription: "The slow nomad lifestyle",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["slomad", "lifestyle", "meetup"],
    emoji: "🐢",
    bookingUrl: "https://www.nomadsummit.com/event/slomading-nomads-next-step/",
  },
  {
    id: "se-27",
    title: "AI Masterclass: Practical AI Systems for Coaches & Consultants",
    type: "side_event",
    date: "2026-01-23",
    startTime: "15:00",
    endTime: "17:00",
    venue: VENUES.ALT_PING,
    organizer: "AI Coaches",
    description: "Hands-on AI workshop specifically for coaches and consultants.",
    shortDescription: "AI systems for coaches & consultants",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["ai", "coaching", "workshop"],
    emoji: "🤖",
    bookingUrl: "https://www.nomadsummit.com/event/ai-masterclass-coaches-consultants/",
  },
  {
    id: "se-28",
    title: "Americano Padel Tournament",
    type: "side_event",
    date: "2026-01-23",
    startTime: "15:00",
    endTime: "18:00",
    venue: VENUES.PADEL_CLUB,
    organizer: "Padel Club CM",
    description: "Competitive padel tournament in Americano format.",
    shortDescription: "Padel tournament",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["sports", "padel", "tournament"],
    emoji: "🏆",
    bookingUrl: "https://www.nomadsummit.com/event/americano-padel-tournament/",
  },
  {
    id: "se-29",
    title: "Let's make the Nomad Summit better",
    type: "side_event",
    date: "2026-01-23",
    startTime: "19:00",
    endTime: "21:00",
    venue: VENUES.DECK_ONE,
    organizer: "Nomad Summit",
    description: "Share your feedback and ideas for future Nomad Summit events.",
    shortDescription: "Help shape future Nomad Summits",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 300 },
    tags: ["feedback", "community", "meetup"],
    emoji: "💬",
    bookingUrl: "https://www.nomadsummit.com/event/make-nomad-summit-better/",
  },
  {
    id: "se-30",
    title: "Official Closing Finale + CM DNXC [The Afterglow]",
    type: "side_event",
    date: "2026-01-24",
    startTime: "18:30",
    endTime: "23:00",
    venue: VENUES.AQUARIA,
    organizer: "Nomad Summit & CM DNXC",
    description: "The official closing night bringing together summit attendees and CM DNXC. Multiple spaces for conversation and dancing, international DJs, glow elements, and hobby stickers for icebreaking. 150 THB door fee for all.",
    shortDescription: "The grand closing party",
    pricing: { premiumAttendee: 0, standardAttendee: 0, nonAttendee: 0 },
    spotsAvailable: 166,
    tags: ["party", "closing", "networking"],
    emoji: "🎉",
    isFeatured: true,
    bookingUrl: "https://www.nomadsummit.com/event/official-closing-finale-afterglow/",
  },
];

export const ALL_EVENTS: Event[] = [...MAIN_CONFERENCE_EVENTS, ...SIDE_EVENTS];

export const getEventsByDate = (date: string): Event[] => {
  return ALL_EVENTS.filter((event) => event.date === date);
};

export const getMainConferenceEvents = (): Event[] => {
  return ALL_EVENTS.filter((event) => event.type === "main_conference");
};

export const getSideEvents = (): Event[] => {
  return ALL_EVENTS.filter((event) => event.type === "side_event");
};

export const getEventById = (id: string): Event | undefined => {
  return ALL_EVENTS.find((event) => event.id === id);
};

// Date helpers
export const CONFERENCE_DATES = [
  { date: "2026-01-16", day: "Fri", dayNum: 16, label: "Day 0", isMainConference: true },
  { date: "2026-01-17", day: "Sat", dayNum: 17, label: "Day 1", isMainConference: true },
  { date: "2026-01-18", day: "Sun", dayNum: 18, label: "Day 2", isMainConference: true },
  { date: "2026-01-19", day: "Mon", dayNum: 19, label: "Nomad Week", isMainConference: false },
  { date: "2026-01-20", day: "Tue", dayNum: 20, label: "Nomad Week", isMainConference: false },
  { date: "2026-01-21", day: "Wed", dayNum: 21, label: "Nomad Week", isMainConference: false },
  { date: "2026-01-22", day: "Thu", dayNum: 22, label: "Nomad Week", isMainConference: false },
  { date: "2026-01-23", day: "Fri", dayNum: 23, label: "Nomad Week", isMainConference: false },
  { date: "2026-01-24", day: "Sat", dayNum: 24, label: "Finale", isMainConference: false },
];

// Get current time in Bangkok timezone (ICT = UTC+7)
export const getCurrentTimeICT = (): Date => {
  return new Date();
};

// Format time for display
export const formatTimeICT = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Bangkok",
  });
};

// Get current date string in Bangkok timezone
export const getCurrentDateICT = (): string => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
};

// Check if a date is today in Bangkok timezone
export const isTodayICT = (date: string): boolean => {
  return date === getCurrentDateICT();
};

// Parse event time and create Date object for today in ICT
export const getEventDateTime = (event: Event): { start: Date; end: Date } => {
  const [startHour, startMin] = event.startTime.split(":").map(Number);
  const [year, month, day] = event.date.split("-").map(Number);
  
  // Create date in ICT
  const start = new Date();
  start.setFullYear(year, month - 1, day);
  start.setHours(startHour, startMin, 0, 0);
  
  let end: Date;
  if (event.endTime) {
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    end = new Date(start);
    end.setHours(endHour, endMin, 0, 0);
  } else {
    end = new Date(start);
    end.setMinutes(end.getMinutes() + 45); // Default 45 min duration
  }
  
  return { start, end };
};

// Check if event is currently live
export const isEventLive = (event: Event, currentTime: Date): boolean => {
  const currentDateStr = currentTime.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  
  if (event.date !== currentDateStr) return false;
  
  const now = currentTime;
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowTotalMinutes = nowHours * 60 + nowMinutes;
  
  const [startHour, startMin] = event.startTime.split(":").map(Number);
  const startTotalMinutes = startHour * 60 + startMin;
  
  let endTotalMinutes: number;
  if (event.endTime) {
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    endTotalMinutes = endHour * 60 + endMin;
  } else {
    endTotalMinutes = startTotalMinutes + 45;
  }
  
  return nowTotalMinutes >= startTotalMinutes && nowTotalMinutes < endTotalMinutes;
};

// Get minutes until event starts (negative if in past)
export const getMinutesUntilEvent = (event: Event, currentTime: Date): number => {
  const nowHours = currentTime.getHours();
  const nowMinutes = currentTime.getMinutes();
  const nowTotalMinutes = nowHours * 60 + nowMinutes;
  
  const [startHour, startMin] = event.startTime.split(":").map(Number);
  const startTotalMinutes = startHour * 60 + startMin;
  
  // If different day, calculate properly
  const currentDateStr = currentTime.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  if (event.date !== currentDateStr) {
    const eventDate = new Date(event.date + "T00:00:00");
    const todayDate = new Date(currentDateStr + "T00:00:00");
    const daysDiff = Math.floor((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff * 24 * 60 + (startTotalMinutes - nowTotalMinutes);
  }
  
  return startTotalMinutes - nowTotalMinutes;
};

// Get minutes remaining in event
export const getMinutesRemaining = (event: Event, currentTime: Date): number => {
  const nowHours = currentTime.getHours();
  const nowMinutes = currentTime.getMinutes();
  const nowTotalMinutes = nowHours * 60 + nowMinutes;
  
  let endTotalMinutes: number;
  if (event.endTime) {
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    endTotalMinutes = endHour * 60 + endMin;
  } else {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    endTotalMinutes = startHour * 60 + startMin + 45;
  }
  
  return Math.max(0, endTotalMinutes - nowTotalMinutes);
};
