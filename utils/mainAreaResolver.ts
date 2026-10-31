/**
 * Main Area Detection and Resolution System
 * 
 * Accurately maps provider addresses and pincodes to primary recognized
 * localities/zones (Justdial style: Jhotwara, Vaishali Nagar, Mansarovar,
 * Malviya Nagar, Sanganer, etc.) rather than micro-landmarks or street shops.
 */

export interface ResolvedLocation {
  mainArea: string;
  landmark?: string;
  city: string;
  displayLocation: string;
}

interface AreaDefinition {
  name: string;
  pattern: RegExp;
  pincodes?: string[];
  priority?: number;
}

/** Recognized primary areas in Jaipur with regex patterns and known pincodes */
export const JAIPUR_AREAS: AreaDefinition[] = [
  // Vaishali Nagar & adjacent sub-localities
  {
    name: "Vaishali Nagar",
    pattern: /\b(vaishali|gandhi\s*path|amrapali|chitrakoot|nemichand|arpit\s*nagar|hanuman\s*nagar)\b/i,
    pincodes: ["302021"],
    priority: 10,
  },
  // Jhotwara & Kalwar Road belt
  {
    name: "Jhotwara",
    pattern: /\b(jhotwara|kalwar|gokulpura|kardhani|tara\s*nagar|joshi\s*marg|lata\s*circle|panchwanti|vikas\s*nagar|roop\s*nagar|satya\s*nagar|chandra?\s*nagar|rukmani|thadi\s*market\s*kalwar)\b/i,
    pincodes: ["302012"],
    priority: 9,
  },
  // Mansarovar belt
  {
    name: "Mansarovar",
    pattern: /\b(man?sarovar|thadi\s*market|vt\s*road|madhyam\s*marg|patel\s*marg|varun\s*path|kiran\s*path|dhanwantri|swarn\s*path|kaveri\s*path)\b/i,
    pincodes: ["302020"],
    priority: 10,
  },
  // Malviya Nagar
  {
    name: "Malviya Nagar",
    pattern: /\b(malviya\s*nagar|malviyanagar|gt\s*bazaar|calgiri|pradhan\s*marg|apex\s*circle|satkar\s*shopping)\b/i,
    pincodes: ["302017"],
    priority: 10,
  },
  // Sanganer
  {
    name: "Sanganer",
    pattern: /\b(sanganer|shikarpura|sanganer\s*bazar|cheel\s*gadi|muhana\s*mandi)\b/i,
    pincodes: ["302029"],
    priority: 9,
  },
  // Sodala / Ram Nagar / Shyam Nagar
  {
    name: "Sodala",
    pattern: /\b(sodala|ram\s*nagar\s*(?:main)?|shyam\s*nagar|swej\s*farm|nandpuri|vivek\s*vihar)\b/i,
    pincodes: ["302019"],
    priority: 8,
  },
  // Civil Lines
  {
    name: "Civil Lines",
    pattern: /\b(civil\s*lines|hari\s*marg|jacob\s*road|raj\s*bhavan)\b/i,
    pincodes: ["302006"],
    priority: 8,
  },
  // C-Scheme / Ashok Nagar
  {
    name: "C-Scheme",
    pattern: /\b(c[-\s]*scheme|ashok\s*nagar|subhash\s*marg|ahinsa\s*circle|bhagwan\s*das|statue\s*circle|panch\s*batti)\b/i,
    pincodes: ["302001"],
    priority: 8,
  },
  // Raja Park / Adarsh Nagar
  {
    name: "Raja Park",
    pattern: /\b(raja\s*park|rajapark|tilak\s*nagar|adarsh\s*nagar|govind\s*marg)\b/i,
    pincodes: ["302004"],
    priority: 8,
  },
  // Jagatpura
  {
    name: "Jagatpura",
    pattern: /\b(jagatpura|mahal\s*road|ramnagariya|skit|indira\s*gandhi\s*nagar|cbp)\b/i,
    pincodes: ["302025"],
    priority: 8,
  },
  // Bani Park / Shastri Nagar
  {
    name: "Bani Park",
    pattern: /\b(bani\s*park|banipark|collectorate|dushyant\s*marg|kabir\s*marg|shastri\s*nagar)\b/i,
    pincodes: ["302016"],
    priority: 7,
  },
  // Vidyadhar Nagar
  {
    name: "Vidyadhar Nagar",
    pattern: /\b(vidyadhar\s*nagar|vidhyadhar|v\s*d\s*n|sector[-\s]*[1-9]\s*v(\.?)d(\.?)n)\b/i,
    pincodes: ["302023", "302039"],
    priority: 7,
  },
  // Tonk Road belt
  {
    name: "Tonk Road",
    pattern: /\b(tonk\s*road|tonk\s*phatak|bapu\s*nagar|barkat\s*nagar|gopalpura|kailash\s*tower)\b/i,
    pincodes: ["302015", "302018"],
    priority: 7,
  },
  // Khatipura
  {
    name: "Khatipura",
    pattern: /\b(khatipura|sirsi\s*road|jharkhand\s*mod)\b/i,
    priority: 8,
  },
  // Chandpole / Walled City
  {
    name: "Chandpole",
    pattern: /\b(chandpole|mishra\s*rajaji|tripolia|johari\s*bazar|badi\s*chaupar|chhoti\s*chaupar|walled\s*city)\b/i,
    pincodes: ["302002", "302003"],
    priority: 7,
  },
  // Pratap Nagar
  {
    name: "Pratap Nagar",
    pattern: /\b(pratap\s*nagar|haldi\s*ghati|kumbha\s*marg|sheopur|sanganer\s*pratap)\b/i,
    pincodes: ["302033"],
    priority: 8,
  },
  // Ajmer Road
  {
    name: "Ajmer Road",
    pattern: /\b(ajmer\s*road|dcm|heerapura|kamala\s*nehru\s*nagar|purani\s*chungi)\b/i,
    pincodes: ["302024", "302026"],
    priority: 7,
  },
  // 22 Godown
  {
    name: "22 Godown",
    pattern: /\b(22\s*godown|bais\s*godam|sahakar\s*marg|industrial\s*area\s*22)\b/i,
    priority: 6,
  },
];

/** Pincode to canonical Jaipur area fallback lookup */
export const PINCODE_MAP: Record<string, string> = {
  "302012": "Jhotwara",
  "302021": "Vaishali Nagar",
  "302020": "Mansarovar",
  "302017": "Malviya Nagar",
  "302029": "Sanganer",
  "302006": "Sodala",
  "302001": "C-Scheme",
  "302004": "Raja Park",
  "302025": "Jagatpura",
  "302016": "Bani Park",
  "302023": "Vidyadhar Nagar",
  "302039": "Vidyadhar Nagar",
  "302015": "Tonk Road",
  "302018": "Tonk Road",
  "302002": "Chandpole",
  "302003": "Chandpole",
  "302033": "Pratap Nagar",
  "302024": "Ajmer Road",
  "302026": "Ajmer Road",
};

/** Popular areas list for quick filters and search (Justdial standard) */
export const POPULAR_JAIPUR_AREAS = [
  "Vaishali Nagar",
  "Jhotwara",
  "Mansarovar",
  "Malviya Nagar",
  "Sanganer",
  "Sodala",
  "Civil Lines",
  "C-Scheme",
  "Raja Park",
  "Jagatpura",
  "Bani Park",
  "Vidyadhar Nagar",
  "Tonk Road",
  "Khatipura",
  "Chandpole",
  "Pratap Nagar",
  "Ajmer Road",
  "22 Godown",
];

/**
 * Resolves a service address into a recognizable Main Area (e.g. "Jhotwara", "Vaishali Nagar")
 * instead of a raw landmark or shop corner.
 */
export function resolveMainArea(addressObj?: any, defaultCity = "Jaipur"): ResolvedLocation {
  const city = (addressObj?.city_town || defaultCity || "Jaipur").trim();
  const address = (addressObj?.address || "").trim();
  const rawLandmark = (addressObj?.landmark || "").trim();
  const pincode = String(addressObj?.pincode || "").trim();

  // Combine address and landmark text for comprehensive area search
  const combinedText = `${address} ${rawLandmark}`.toLowerCase();

  let matchedArea: string | null = null;
  let highestPriority = -1;

  // 1. Text pattern matching against major areas
  for (const def of JAIPUR_AREAS) {
    if (def.pattern.test(combinedText)) {
      const priority = def.priority ?? 5;
      if (priority > highestPriority) {
        matchedArea = def.name;
        highestPriority = priority;
      }
    }
  }

  // 2. Pincode lookup fallback
  if (!matchedArea && pincode && PINCODE_MAP[pincode]) {
    matchedArea = PINCODE_MAP[pincode];
  }

  // 3. Fallback extraction from address string if outside Jaipur or unmapped
  if (!matchedArea) {
    if (address) {
      // Look for common street/colony words
      const parts = address.split(/[,–-]/).map((p: string) => p.trim()).filter(Boolean);
      // Pick first non-empty part that isn't building number or city
      const candidate = parts.find(
        (p: string) => !/^\d+/.test(p) && p.toLowerCase() !== city.toLowerCase()
      );
      matchedArea = candidate || parts[0] || city;
    } else if (rawLandmark && !/near|opp|behind|beside|metro|station/i.test(rawLandmark)) {
      matchedArea = rawLandmark;
    } else {
      matchedArea = city;
    }
  }

  const resolvedMainArea = matchedArea || city || "Jaipur";

  // Determine secondary landmark (only if distinct from the main area)
  let cleanLandmark: string | undefined = undefined;
  if (rawLandmark) {
    const isRedundant =
      rawLandmark.toLowerCase() === resolvedMainArea.toLowerCase() ||
      rawLandmark.toLowerCase().includes(resolvedMainArea.toLowerCase());
    if (!isRedundant) {
      cleanLandmark = rawLandmark;
    }
  }

  return {
    mainArea: resolvedMainArea,
    landmark: cleanLandmark,
    city,
    displayLocation: `${resolvedMainArea}, ${city}`,
  };
}
