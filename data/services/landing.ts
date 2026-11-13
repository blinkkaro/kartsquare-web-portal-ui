import type { LandingContent } from "@/lib/services/types";

/**
 * Copy for existing /{city}/{category}/{sub-category} pages. These URLs already exist; this
 * only adds the explanatory content. Jaipur-specific notes appear only where they are
 * simply true. reviewed stays false until a person approves each entry in a pull request.
 * The listing's own indexing threshold still applies on top of the flag.
 */
export const LANDING_CONTENT: LandingContent[] = [
  {
    citySlug: "jaipur",
    categorySlug: "home-services",
    subCategorySlug: "electrician",
    name: "Electrician",
    seoTitle: "Electricians in Jaipur: Providers on Kartsquare",
    metaDescription:
      "Browse electricians in Jaipur listed on Kartsquare. Read each profile, see what they offer and send a request describing your electrical problem.",
    h1: "Electricians in Jaipur",
    intro: [
      "An electrician deals with the wiring and fittings in a home or shop: switches, sockets, fans, lights, MCBs and distribution boards. Typical jobs include fixing a tripping circuit, replacing a faulty switch, fitting a ceiling fan or adding a point for a new appliance.",
      "On this page you can see electricians in Jaipur who have listed their services on Kartsquare. Open a profile to read what they say they do and where they work, then send a request describing the fault. The visit, the work and the price are agreed between you and the electrician.",
    ],
    mayHelp: [
      "Find the cause of a tripping MCB, a dead socket or flickering lights",
      "Replace switches, sockets, fans, lights and fittings",
      "Add new points or extend wiring for an appliance",
      "Check a board or wiring and explain what needs attention",
    ],
    mayNotDo: [
      "Kartsquare does not do electrical work and does not confirm a provider's skills or approvals.",
      "A listing does not promise a visit time, a price or a finished repair.",
      "Work on the main supply or the meter is usually for the electricity utility, not a private electrician.",
    ],
    requestInfo: [
      "What happens and where: for example, a socket in the kitchen that has stopped working",
      "A photo of the board or fitting, if you can take one safely",
      "Your locality in Jaipur and a convenient day",
      "Any appliance involved, with brand and rating",
    ],
    localNotes: [
      "Check the service area on each profile, because providers list the localities they cover and not every provider reaches every part of Jaipur.",
    ],
    faq: [
      {
        q: "How do I request an electrician in Jaipur on Kartsquare?",
        a: "Open an electrician's profile from the list, check that they cover your locality and send a request describing the fault.",
      },
      {
        q: "Is it safe to try an electrical fix myself first?",
        a: "Switch off the supply at the board before touching any fitting, and leave anything involving the main supply or wiring faults to an electrician.",
      },
      {
        q: "Will the electrician give me a price before visiting?",
        a: "Ask in your request. Many faults need an inspection first, so some electricians will only give a figure after seeing the problem.",
      },
    ],
    reviewed: false,
  },
  {
    citySlug: "jaipur",
    categorySlug: "home-services",
    subCategorySlug: "plumber",
    name: "Plumber",
    seoTitle: "Plumbers in Jaipur: Providers on Kartsquare",
    metaDescription:
      "Browse plumbers in Jaipur listed on Kartsquare. Read each profile and send a request describing a leak, a blocked drain or a fitting you need.",
    h1: "Plumbers in Jaipur",
    intro: [
      "A plumber handles water supply and drainage in a building: taps, pipes, flush tanks, water tanks, geyser connections and blocked drains. Common calls are a dripping tap, a leaking pipe, a slow drain or a new basin or tap that needs fitting.",
      "This page lists plumbers in Jaipur who have added their services to Kartsquare. Read a profile for what they offer and the areas they cover, then send a request describing the problem. The visit, the repair and the cost are agreed with the plumber you choose.",
    ],
    mayHelp: [
      "Locate and repair a leak in a tap, pipe or fitting",
      "Clear a slow or blocked drain",
      "Fit or replace taps, basins, flush tanks and connections",
      "Check water-tank and supply-line problems and explain the options",
    ],
    mayNotDo: [
      "Kartsquare does not do plumbing work and does not confirm a provider's skills.",
      "A leak behind a wall or under flooring may need opening up, which a provider can only judge on site.",
      "A listing does not promise a visit time, a price or that a repair will hold.",
    ],
    requestInfo: [
      "Where the problem is: kitchen sink, bathroom, terrace tank, outside drain",
      "How long it has been going on and how bad it is",
      "A photo or short video of the leak or the fitting",
      "Your locality in Jaipur and a convenient time",
    ],
    localNotes: [
      "Check each profile for the localities covered, because a plumber may serve some parts of Jaipur and not others.",
    ],
    faq: [
      {
        q: "What should I do when a pipe is leaking badly?",
        a: "Close the main valve or the tap that feeds that line to stop the flow, then send a request with a photo of the leak.",
      },
      {
        q: "Can a plumber fit a geyser?",
        a: "Some plumbers list it, and others do not. Check the profile or ask in your request, and mention the geyser type and where it will be fitted.",
      },
      {
        q: "How is the cost of a plumbing job decided?",
        a: "Each plumber sets their own charges. Ask what the visit costs and how a final price is worked out before work begins.",
      },
    ],
    reviewed: false,
  },
  {
    citySlug: "jaipur",
    categorySlug: "mobile-electronics-repair",
    subCategorySlug: "laptop-repair",
    name: "Laptop Repair",
    seoTitle: "Laptop Repair Providers in Jaipur on Kartsquare",
    metaDescription:
      "Browse laptop repair providers in Jaipur listed on Kartsquare. Read their profiles and send a request with your laptop model and the problem.",
    h1: "Laptop Repair in Jaipur",
    intro: [
      "Laptop repair covers faults such as a laptop that will not start, a broken screen, a keyboard that has stopped working, a battery that no longer holds charge, or a machine that overheats and slows down. The right fix depends on the model and on whether parts are available.",
      "This page lists laptop repair providers in Jaipur who have added themselves to Kartsquare. Read a profile to see what they handle, then send a request with the brand, model and symptoms. Diagnosis, parts and cost are agreed with the provider you choose.",
    ],
    mayHelp: [
      "Diagnose why a laptop will not start, charge, connect or display",
      "Replace screens, keyboards, batteries and charging ports where parts exist",
      "Clean and service a laptop that is overheating or noisy",
      "Advise whether a repair or a replacement makes more sense",
    ],
    mayNotDo: [
      "A repairer cannot promise that data on the laptop will be kept. Back up first if the laptop still works.",
      "Parts for older or less common models may not be available.",
      "Kartsquare does not hold your laptop and takes no part in the repair.",
    ],
    requestInfo: [
      "Brand, model and approximate age of the laptop",
      "What happens, and whether it was dropped or had liquid spilled on it",
      "Whether you want a visit at your place or will bring it in",
      "Your locality in Jaipur",
    ],
    localNotes: [
      "Some repairers work from a shop and others visit. The profile and your request are the place to settle which applies to you.",
    ],
    faq: [
      {
        q: "Should I back up my laptop before a repair?",
        a: "Yes, if it still starts. Some repairs can affect stored data, and a repairer cannot assure that nothing is lost.",
      },
      {
        q: "Will the repairer tell me the cost before fixing it?",
        a: "Ask for the diagnosis cost and the repair estimate before agreeing. Some faults only show up after the laptop is opened.",
      },
      {
        q: "Can a laptop with water damage be repaired?",
        a: "Sometimes, but it depends on how much liquid reached the board. Switch the laptop off, do not charge it, and describe what happened in your request.",
      },
    ],
    reviewed: false,
  },
];

export function getLandingContent(
  citySlug: string,
  categorySlug: string,
  subCategorySlug: string,
): LandingContent | undefined {
  return LANDING_CONTENT.find(
    (l) => l.citySlug === citySlug && l.categorySlug === categorySlug && l.subCategorySlug === subCategorySlug,
  );
}
