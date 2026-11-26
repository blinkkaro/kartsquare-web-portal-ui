import type { FaqItem, GuideSection } from "@/lib/services/types";

/**
 * Copy for /explore-services and the home page's local guide. Written with the content-research-writer
 * workflow (outline, research, hook, section review). Rules: brand voice and practical advice only. No
 * counts, ratings, prices or claims about supply; weather and season facts carry a public source below.
 * A test runs every string here through lib/services/claims.ts.
 */

/** A problem in the customer's own words, and the page that helps with it. Every href is a page in data/services. */
export interface Situation {
  label: string;
  hint: string;
  href: string;
  icon: string;
}

export const SITUATIONS: Situation[] = [
  { label: "AC is not cooling", hint: "Gas, filters, the outdoor unit or the board", href: "/services/c/home-services", icon: "ph:snowflake-duotone" },
  { label: "Switch sparks or the MCB keeps tripping", hint: "Wiring, sockets, fans and lights", href: "/services/c/home-services", icon: "ph:lightning-duotone" },
  { label: "Tap leaking or a blocked drain", hint: "Plumbing, fittings and tanks", href: "/services/c/home-services", icon: "ph:drop-duotone" },
  { label: "Phone screen cracked", hint: "Glass, display and touch", href: "/services/c/mobile-electronics-repair/screen-replacement", icon: "ph:device-mobile-speaker-duotone" },
  { label: "Phone will not charge", hint: "Port, cable, battery or board", href: "/services/c/mobile-electronics-repair/mobile-phone-repair", icon: "ph:device-mobile-duotone" },
  { label: "Battery dies by lunchtime", hint: "Phones and laptops", href: "/services/c/mobile-electronics-repair/battery-replacement", icon: "ph:battery-charging-duotone" },
  { label: "Laptop is slow or overheating", hint: "Fans, storage, upgrades", href: "/services/c/mobile-electronics-repair/laptop-repair", icon: "ph:laptop-duotone" },
  { label: "TV has sound but no picture", hint: "Backlight, boards and panels", href: "/services/c/mobile-electronics-repair/tv-repair", icon: "ph:television-duotone" },
  { label: "CCTV camera shows no video", hint: "Cables, recorder, disk, app", href: "/services/c/mobile-electronics-repair/cctv-repair", icon: "ph:security-camera-duotone" },
  { label: "Car or bike due for a service", hint: "Servicing, repairs, washing", href: "/services/c/automotive", icon: "ph:car-duotone" },
  { label: "Photographer for a function", hint: "Weddings, events, studio shoots", href: "/services/c/photography-videography", icon: "ph:camera-duotone" },
  { label: "Food for a family function", hint: "Caterers, tiffin, cloud kitchens", href: "/services/c/restaurants-food", icon: "ph:cooking-pot-duotone" },
  { label: "A pandit for a puja", hint: "Ceremonies, havan, griha pravesh", href: "/services/c/religious-spiritual", icon: "ph:flower-lotus-duotone" },
  { label: "Rooftop solar or an inverter", hint: "Panels, batteries, RO purifiers", href: "/services/c/energy-environment", icon: "ph:solar-panel-duotone" },
  { label: "A website for my shop", hint: "Sites, apps, social media", href: "/services/c/it-digital-services", icon: "ph:globe-duotone" },
  { label: "A trainer or a yoga class", hint: "Gyms, yoga, sports coaching", href: "/services/c/fitness-sports", icon: "ph:barbell-duotone" },
];

/** Jaipur through the year. Facts about weather and seasons only, with sources in SEASON_SOURCES. */
export interface Season {
  months: string;
  title: string;
  text: string;
  links: { label: string; href: string }[];
}

export const SEASONS: Season[] = [
  {
    months: "February to March",
    title: "Before the heat arrives",
    text: "This is the calm window. AC makers suggest a service before summer, not during it, and February is when you can still get a slot without a queue. It is also a good time to have solar panels cleaned of winter dust and the inverter battery checked.",
    links: [
      { label: "Home services", href: "/services/c/home-services" },
      { label: "Solar and inverters", href: "/services/c/energy-environment" },
    ],
  },
  {
    months: "April to June",
    title: "Peak summer",
    text: "Jaipur's hottest stretch. The weather office records May highs in the 40s Celsius, which is hard on everything that runs warm: ACs, fridges, inverters, and the batteries inside phones and laptops. A phone left on a car dashboard in May is a phone that may need a new battery by August.",
    links: [
      { label: "AC and appliance repair", href: "/services/c/home-services" },
      { label: "Battery replacement", href: "/services/c/mobile-electronics-repair/battery-replacement" },
    ],
  },
  {
    months: "July to September",
    title: "The monsoon",
    text: "Most of the city's rain falls in these three months. Hairline cracks on the terrace that seemed harmless in May start letting water in, damp patches appear on walls, and outdoor CCTV cameras and wiring take a beating. Waterproofing belongs before the rain, but a seepage check after the first heavy shower tells you where to look.",
    links: [
      { label: "Seepage and repairs", href: "/services/c/home-services" },
      { label: "CCTV repair", href: "/services/c/mobile-electronics-repair/cctv-repair" },
    ],
  },
  {
    months: "October to November",
    title: "Festive season",
    text: "Diwali means painting, deep cleaning, new light fittings and a long list of small jobs everyone wants done the same week. Book early. The wedding season traditionally opens around Devuthni Gyaras, so photographers and caterers start filling their calendars now too.",
    links: [
      { label: "Painters and cleaners", href: "/services/c/home-services" },
      { label: "Photographers", href: "/services/c/photography-videography" },
    ],
  },
  {
    months: "December to February",
    title: "Wedding and function season",
    text: "Cool, dry weather and a packed calendar of weddings, griha pravesh ceremonies and family functions. Photographers, caterers and pandits are in demand, and good ones are booked weeks ahead. At home, winter is when geysers and room heaters get their first real workout.",
    links: [
      { label: "Caterers", href: "/services/c/restaurants-food" },
      { label: "Pandits and ceremonies", href: "/services/c/religious-spiritual" },
    ],
  },
];

export const SEASON_SOURCES: { label: string; href: string }[] = [
  { label: "IMD, Climate of Jaipur", href: "https://mausam.imd.gov.in/jaipur/docs/climate.pdf" },
  { label: "Haier India, AC servicing before summer", href: "https://www.haier.com/in/blogs/is-your-ac-ready-for-peak-summer-signs-it-needs-servicing-now.shtml" },
  { label: "Housing.com, monsoon-proofing a house", href: "https://housing.com/news/monsoon-proofing-house" },
];

/** The practical playbook: hiring local help, start to finish. */
export const PLAYBOOK: GuideSection[] = [
  {
    heading: "1. Before you call anyone",
    paragraphs: [
      "Spend two minutes on the problem before you spend money on it. Take a photo or a short video. Note the brand and model of anything involved, which is usually on a sticker at the back or under the device. If it is electrical, gas or water and it looks unsafe, switch off the supply first.",
      "Then decide what you actually want: a repair, a replacement, or just someone to look and tell you. People often get very different answers because they asked very different questions.",
    ],
  },
  {
    heading: "2. Your first message",
    paragraphs: [
      "A good request answers four things: what is wrong, where you are, when suits you, and what it looks like. “Bedroom AC, 1.5 ton split, blowing air but not cold since yesterday, Malviya Nagar, any evening this week, photo attached” gets you a useful reply. “AC problem, call me” gets you a phone call full of questions.",
      "Ask up front whether there is a visiting or inspection charge, and whether it is adjusted against the repair if you go ahead.",
    ],
  },
  {
    heading: "3. Getting a quote you can compare",
    paragraphs: [
      "For anything beyond a small fix, ask for the estimate in writing, even if it is a WhatsApp message. It should name the parts, the labour and the total. If a provider will not put a figure in writing, treat that as information.",
      "For larger jobs, two quotes are worth the extra day. Compare them line by line, not just the bottom number: one may include materials the other does not. For electrical work, ask which brand of wire and fittings will be used and look for the ISI mark.",
    ],
  },
  {
    heading: "4. On the day",
    paragraphs: [
      "Be there, or have someone there who knows what was agreed. Ask to see the old part when it comes out. Before you pay, test the thing that was fixed: run the AC for ten minutes, open the tap, charge the phone. It is much easier to sort out a problem while the provider is still at your door.",
    ],
  },
  {
    heading: "5. After the job",
    paragraphs: [
      "Keep the bill or the message with the price and what was done. If the provider offers any cover on the work or the part, get it written on that bill. And if the job went well, or did not, a few honest lines in a review help the next person in your colony decide.",
    ],
  },
];

/** What Kartsquare commits to. Each line describes how the product works today. */
export const COMMITMENTS: { title: string; text: string }[] = [
  { title: "Real businesses only", text: "Every provider on Kartsquare is a registered account run by a real person or business. We do not create listings, and we never fill a page with sample data to make it look busy." },
  { title: "Ratings from real customers", text: "A rating appears only when a service has real reviews. When it has none, you see “No reviews yet”, not a made-up score." },
  { title: "You talk to the provider", text: "Your request goes to the provider you chose, and they reply to you. Nobody in between reassigns your job to someone you have never seen." },
  { title: "No spam", text: "We do not add you to WhatsApp, SMS or email campaigns you did not ask for." },
];

export const HUB_FAQ: FaqItem[] = [
  { q: "What is Kartsquare?", a: "A local services marketplace, starting in Jaipur. You can read a guide for each kind of service, look through provider profiles and send a request to the provider you choose. They reply to you directly." },
  { q: "How do I find a service provider in Jaipur?", a: "Pick a category or a problem on this page, read the short guide, then open the list of providers in Jaipur. Check what each provider lists and the areas they cover, and send a request with the details." },
  { q: "How do I know a provider is real?", a: "Every provider is a registered account. Open their profile to see the services they list, their work and, where customers have left them, reviews. Ask anything the profile does not answer before you agree to a visit." },
  { q: "Does Kartsquare set the price?", a: "No. Each provider quotes for your job. Ask for the quote in writing, with parts and labour named, and confirm any visiting charge before the visit." },
  { q: "What should I include in my first message?", a: "What is wrong, where you are, when suits you and a photo if you can take one. Add the brand and model for any appliance or device. It saves a round of questions." },
  { q: "What is Kart AI?", a: "An assistant in the app and on the website. Describe the problem in Hindi, Hinglish or English, by typing or speaking, and it suggests the service that fits." },
  { q: "What if nobody offers the service in my area yet?", a: "The page will say so plainly instead of showing you unrelated results. The guide is still there to read, and the list fills in as providers in Jaipur join." },
  { q: "I run a local business. Can I list it?", a: "Yes. Choose “List your business”, create a profile and add your services. Customers searching in your city can then find you and send you requests." },
];

/** Home page: a short local guide. Distinct wording from the hub so the two pages do not repeat each other. */
export const HOME_GUIDE_INTRO = [
  "Jaipur runs on local help. The electrician who knows the wiring in your colony, the repair shop near the market that has seen every phone model, the caterer your family calls for every function. Finding them used to mean asking around and hoping someone had a number saved.",
  "Kartsquare puts that word-of-mouth on one page. Search the way you would ask a neighbour, read what a provider actually offers, and message them directly. Our guides fill in the rest: what a job usually involves, what changes the price and what to ask before anyone arrives.",
];

export const HOME_SEASON_LINES: { months: string; text: string }[] = [
  { months: "Feb–Mar", text: "Get the AC serviced and solar panels cleaned before the heat." },
  { months: "Apr–Jun", text: "Peak summer. ACs, inverters and phone batteries work hardest." },
  { months: "Jul–Sep", text: "Monsoon. Watch for seepage, damp walls and outdoor wiring." },
  { months: "Oct–Nov", text: "Diwali painting and cleaning. Book early, everyone else will." },
  { months: "Dec–Feb", text: "Weddings and functions. Photographers and caterers fill up fast." },
];
