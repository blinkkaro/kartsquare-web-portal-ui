import type { FaqItem, GuideSection } from "@/lib/services/types";

/**
 * Long-form copy added to the category pages (/services/c/{slug}), merged in data/services/categories.ts.
 * Written with the content-research-writer and content-creation skills. Practical advice only: no prices,
 * counts, ratings or claims about providers. Anything about a law or scheme names the official place to
 * check it and is listed in `sources`. lib/services/claims.ts runs over every string in the tests.
 */
export interface CategoryGuide {
  guide: GuideSection[];
  faq: FaqItem[];
  sources?: { label: string; href: string }[];
}

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  "photography-videography": {
    guide: [
      {
        heading: "Choosing a wedding photographer in Jaipur",
        paragraphs: [
          "A wedding in Jaipur is rarely one event. There is the sagai, the haldi in a sunny courtyard, a mehendi that runs all afternoon, and pheras that may start close to midnight. Each has different light, a different pace and different people you will want to see in the album. When you brief a photographer, list every function with its date, venue and approximate hours, not just the wedding day.",
          "Then ask to see one full wedding, start to finish. A highlight reel shows only a photographer's strongest few seconds. A complete gallery shows how they handle a dim mandap, a crowded stage and the group photo with thirty relatives who will not stand still.",
        ],
      },
      {
        heading: "Candid, traditional or cinematic: what the words mean",
        paragraphs: [
          "Traditional coverage records the rituals and the posed family photos. Candid photography follows moments as they happen: a grandmother wiping her eyes, children stealing sweets. Cinematic video is edited like a short film with music, and a documentary edit keeps the ceremony in order with natural sound.",
          "Most families want a mix. Say which matters most to you, because it changes how many people the photographer brings and where they stand during the ceremony.",
        ],
      },
      {
        heading: "Pre-wedding shoots and drone footage",
        paragraphs: [
          "Jaipur's forts, havelis and old city streets are popular backdrops, but many monuments and private properties need permission or a fee for a professional shoot. Ask your photographer which locations they have cleared before, and confirm the current rules with the site itself.",
          "Drone shots need the same care. India's drone rules divide airspace into green, yellow and red zones, and some areas need permission before anyone flies. Ask the videographer to check your exact venue on the official Digital Sky airspace map, and do not assume a drone is allowed just because another wedding had one.",
        ],
      },
      {
        heading: "Deliverables, timelines and the written agreement",
        paragraphs: [
          "Write down what you will receive: the number of edited photos or whether all usable shots are included, the length of the teaser and the full film, the printed album with its size and page count, and whether raw files are part of the package. Add an approximate delivery date for each.",
          "Also settle who selects the album photos, how many rounds of changes are included, how long the studio keeps your files, and what happens if the main photographer is unwell on the day. A short written note now saves months of follow-up calls later.",
        ],
      },
      {
        heading: "Product, passport and portfolio shoots",
        paragraphs: [
          "Not every shoot is a wedding. For product and catalogue work, share how many items you have, where the photos will be used and whether you need a plain white background or a styled setting. Sellers listing online should check the marketplace's image rules before the shoot, so nothing needs to be redone.",
          "For passport, visa and ID photos, mention which document the photo is for, since size and background rules differ. For portfolios, send a few reference images of the look you have in mind.",
        ],
      },
    ],
    faq: [
      { q: "How much does a wedding photographer cost in Jaipur?", a: "It depends on the number of functions, hours, team size, drone use, album and film. Send every photographer the same list so their quotes can be compared, and ask what is extra." },
      { q: "Can a photographer use a drone at my wedding?", a: "Only where the rules allow it. Airspace is divided into zones and some need permission. Ask the videographer to check the venue on the Digital Sky airspace map before you count on aerial shots." },
      { q: "Should I ask for raw photos and videos?", a: "Ask early. Some studios include raw files, some charge for them and some do not share them. Whatever you agree, put it in writing with the delivery date." },
      { q: "What should I send a photographer in my first message?", a: "The type of shoot, dates, venues, approximate hours, the style you like with two or three reference images, and the deliverables you expect." },
    ],
    sources: [{ label: "DGCA Digital Sky, drone airspace map", href: "https://digitalsky.dgca.gov.in/" }],
  },

  "home-services": {
    guide: [
      {
        heading: "Describe the fault, not the fix",
        paragraphs: [
          "It is tempting to message an electrician with 'switch change karna hai'. But the switch may be fine and the wiring behind it may not. Say what you see and when it happens: the socket sparks when the iron is plugged in, or the MCB trips only when the geyser and AC run together. A good description helps the person bring the right tools and parts.",
          "Photos help more than words. One picture of a leak, a damp patch or a distribution board often saves a second visit.",
        ],
      },
      {
        heading: "What changes the price of a home repair",
        paragraphs: [
          "Four things usually move the figure: how long the job takes, the parts used, how hard the spot is to reach and whether there is a visiting charge. A tap washer is a small job; a leak hidden inside a tiled wall is not.",
          "Ask whether the quote includes materials, and which brand. For electrical parts, look for the ISI mark. For paint, ask how many coats are included and whether wall repair and putty are part of the price.",
        ],
      },
      {
        heading: "Homes in Jaipur: heat, dust, hard water and monsoon",
        paragraphs: [
          "The city's dry heat and dust are hard on coolers, AC filters and exterior paint. Hard water leaves scale in geysers, taps and RO units. When the monsoon arrives, terraces and parapet walls that looked fine in summer can start to seep.",
          "A little timing helps. Service the AC before summer, check the terrace before the rains and book painting well ahead of Diwali, when many households want the same work done at once.",
        ],
      },
      {
        heading: "Safety and good habits",
        paragraphs: [
          "Switch off the supply before anyone touches wiring, and shut the main water valve for plumbing work. For pest control, ask which product will be used, how long children and pets should stay out of the room and how kitchen items should be covered.",
          "Be at home for the first visit, ask to see old parts that are removed, and test the work before you pay.",
        ],
      },
    ],
    faq: [
      { q: "Is there a visiting charge for home repairs?", a: "Many providers charge one, and some adjust it against the final bill. Ask before the visit so there is no surprise." },
      { q: "How should I prepare for a painter's visit?", a: "Know which rooms need work, note damp or cracked patches and ask whether the quote covers scraping, putty, primer, the number of coats and cleaning afterwards." },
      { q: "What should I ask before pest control?", a: "Ask which product is used, whether it is suitable for homes with children or pets, how long to stay out and whether a repeat visit is part of the price." },
    ],
  },

  automotive: {
    guide: [
      {
        heading: "Routine service or a specific repair",
        paragraphs: [
          "A routine service follows your vehicle's schedule: engine oil, filters, brakes, tyres, battery and fluids. A repair starts with a symptom: a noise while braking, a warning light, a bike that will not start on cold mornings. Say which one you need, because the time and the estimate are very different.",
          "Share the make, model, year, fuel type and the last service reading on the odometer. Your owner's manual lists what is due.",
        ],
      },
      {
        heading: "Reading a garage estimate",
        paragraphs: [
          "Ask for parts and labour on separate lines. Find out whether each part is original, compatible or reconditioned, and ask the workshop to call you before doing anything not on the list. Request the old parts back; it is a normal thing to ask.",
          "If your vehicle is still under the maker's warranty, read its terms before using an outside workshop, since work done elsewhere can affect what is covered.",
        ],
      },
      {
        heading: "Summer, monsoon and Jaipur roads",
        paragraphs: [
          "Peak summer is tough on batteries, coolant and tyres. Check tyre pressure when the tyres are cold, keep an eye on coolant and do not ignore a rising temperature gauge. Before the monsoon, look at wiper blades, tyre tread, brakes and lights.",
          "Keep your papers current too. Petrol, diesel and gas vehicles on the road need a valid Pollution Under Control certificate; the Parivahan portal shows what is on record for your registration number.",
        ],
      },
      {
        heading: "Washing, detailing and driving lessons",
        paragraphs: [
          "Car washes range from a quick exterior rinse to interior cleaning and paint treatment. Ask what each package includes and how long it takes. Remove valuables before you hand over the keys.",
          "For driving lessons, ask about the vehicle used, session length, timings, whether pickup is offered and what help is given with the learner's licence process.",
        ],
      },
      {
        heading: "When your vehicle will not move",
        paragraphs: [
          "If a car or bike stops on the road, first get yourself and the vehicle to a safe spot and switch on the hazard lights. Then note what happened just before: a warning light, steam, a clicking sound at start or a sudden loss of power. Share that, along with your exact location, so the mechanic knows whether to bring a battery, tools or arrange towing. Ask about towing charges before the vehicle is moved.",
        ],
      },
    ],
    faq: [
      { q: "How often should a car or bike be serviced?", a: "Follow the schedule in the owner's manual, which goes by time and distance. Heavy city use, dust and heat can make earlier checks worthwhile." },
      { q: "What should I check before handing over my vehicle?", a: "Note the fuel level and odometer reading, photograph any existing scratches, remove valuables and agree that extra work needs your approval." },
      { q: "How can I check my vehicle's PUC status?", a: "Search your registration number on the Parivahan portal or the mParivahan app. A new test has to be done at an emission testing centre." },
    ],
    sources: [{ label: "Parivahan Sewa, Government of India", href: "https://parivahan.gov.in/" }],
  },

  "security-services": {
    guide: [
      {
        heading: "Start with the risk, not the gadget",
        paragraphs: [
          "Walk around your premises before you ask for a quote. Where can someone enter? What is dark at night? Who has keys? A flat, a jewellery showroom and a warehouse need very different answers, and a longer equipment list is not automatically a safer one.",
          "Write down what you actually want: to see who came to the door, to record a shop counter, to stop unauthorised entry after hours or to get a warning when there is smoke.",
        ],
      },
      {
        heading: "Cameras, recorders and storage",
        paragraphs: [
          "For CCTV, the quote should name the number of cameras, where each one goes, indoor or outdoor type, night vision, the recorder, hard disk size and roughly how many days of footage it will keep. Ask how you will view it on your phone and who will hold the admin password.",
          "Point cameras at your own property. Avoid views into neighbours' homes, bathrooms or other private spaces, and tell staff where recording happens.",
        ],
      },
      {
        heading: "Hiring security guards",
        paragraphs: [
          "Private security agencies in India are regulated under the Private Security Agencies (Regulation) Act, 2005, which requires an agency to hold a state licence. Ask any agency for its licence details and check them with the state authority. Kartsquare does not check this for you.",
          "Agree shift hours, weekly offs, replacement when a guard is absent, duties, supervision and who is responsible for the guard's wages and statutory dues. Put it in the contract.",
        ],
      },
      {
        heading: "Fire safety and alarms",
        paragraphs: [
          "Extinguishers come in different types for different fires, so ask which suits a kitchen, an electrical panel or a storeroom. Ask when each needs servicing or refilling and who will remind you.",
          "Alarms and extinguishers only help if people know what to do. Ask the provider to show your family or staff how to use what is installed. Buildings may also have local fire-safety requirements, which the municipal fire department can explain.",
        ],
      },
      {
        heading: "After installation: test, train and maintain",
        paragraphs: [
          "Before the final payment, check every camera in daylight and after dark, play back a recording and confirm the date and time on the recorder are right. Change default passwords and note who has access. Then agree how maintenance works: what is covered, what is charged and how a fault is reported. A system nobody checks can stop recording without anyone noticing.",
        ],
      },
    ],
    faq: [
      { q: "How many CCTV cameras do I need for a shop?", a: "It depends on entrances, the billing counter, stock areas and blind spots. A site visit and a simple floor sketch will tell you more than a standard package." },
      { q: "How long is CCTV footage stored?", a: "Until the disk fills and the oldest footage is overwritten. The period depends on the number of cameras, quality, recording mode and disk size, so ask for an estimate for your setup." },
      { q: "How do I check a security agency's licence?", a: "Ask for the licence number and issuing authority, then confirm it with the state's controlling authority under the private security agencies law." },
    ],
    sources: [{ label: "India Code, Private Security Agencies (Regulation) Act, 2005", href: "https://www.indiacode.nic.in/bitstream/123456789/2024/1/A2005-29.pdf" }],
  },

  "energy-environment": {
    guide: [
      {
        heading: "Rooftop solar: begin with your electricity bills",
        paragraphs: [
          "Collect a year of electricity bills before you talk to an installer. Summer and winter use in Jaipur can look very different, and a system sized on one month's bill can easily be wrong. Also note your sanctioned load, roof area and anything that throws shade: water tanks, parapets, trees or the building next door.",
          "Ask each installer to state the system size, panel and inverter brands, the mounting structure, expected generation with their assumptions, product warranties and who will clean and maintain the panels.",
        ],
      },
      {
        heading: "PM Surya Ghar and net metering",
        paragraphs: [
          "PM Surya Ghar: Muft Bijli Yojana is the central rooftop solar scheme for homes. The usual route is to register on the official national portal with your electricity distribution company and consumer number, apply, get feasibility approval, install through a vendor registered for your distribution company, then apply for a net meter.",
          "Subsidy amounts, eligibility and state net-metering terms can change, so read the current rules on the portal and with your Rajasthan electricity company before you sign or pay anything. An installer's brochure is not the rule book.",
        ],
      },
      {
        heading: "Inverters, batteries and RO purifiers",
        paragraphs: [
          "For an inverter, list what must run during a power cut and for how long. Fans and lights need far less than a fridge or a computer setup. Ask about battery type, maintenance and what happens to the old battery.",
          "For an RO purifier, get your water tested first. The right technology depends on what is in the water, and a household on treated municipal supply may not need the same unit as one on borewell water. Ask about filter replacement intervals and the yearly running cost.",
        ],
      },
      {
        heading: "Borewells and waste",
        paragraphs: [
          "Groundwater work can need permission, and the rules differ by area. Check with the local authority and the state groundwater department before drilling, and ask the contractor about depth, casing, pump size and what you pay if water is not found.",
          "For waste management, say what you produce, whether kitchen waste, garden waste, e-waste or business waste, and ask where it goes after collection.",
        ],
      },
    ],
    faq: [
      { q: "How do I apply for the PM Surya Ghar scheme?", a: "Register on pmsuryaghar.gov.in with your state, electricity distribution company and consumer number, then follow the steps shown there. Confirm current terms on the portal before paying a vendor." },
      { q: "What is net metering?", a: "A two-way meter records power you take from the grid and solar power you send back. How the exported units are adjusted on your bill depends on your state's rules." },
      { q: "Do solar panels need cleaning?", a: "Yes. Dust reduces output, and Jaipur has plenty of it, especially in dry months. Ask your installer how and how often to clean them safely." },
    ],
    sources: [
      { label: "PM Surya Ghar national portal", href: "https://pmsuryaghar.gov.in/" },
      { label: "myScheme: PM Surya Ghar: Muft Bijli Yojana", href: "https://myscheme.gov.in/schemes/pmsgmb" },
    ],
  },

  "fitness-sports": {
    guide: [
      {
        heading: "Pick what you will actually keep doing",
        paragraphs: [
          "The most impressive gym in the city is no use if it is a forty-minute ride in evening traffic. Start with your goal, then be honest about your day: when you are free, how far you will travel and whether you enjoy working out alone, in a group or with a coach watching your form.",
          "Gym, yoga, swimming, badminton, cricket nets and martial arts ask for different things. If you are unsure, try one session before you commit to months of fees.",
        ],
      },
      {
        heading: "What to check on a first visit",
        paragraphs: [
          "Go at the hour you plan to attend, because a quiet afternoon tells you nothing about a packed 7 p.m. batch. Look at the equipment's condition, space per person, ventilation, changing rooms, drinking water and parking.",
          "Watch how the trainer treats a beginner. Good coaching means someone corrects your posture and adjusts the plan, not just counts your repetitions.",
        ],
      },
      {
        heading: "Fees, freezes and refunds",
        paragraphs: [
          "Ask what the fee covers: registration, classes, personal training, lockers or equipment. Find out whether a membership can be paused for illness or travel, whether it can be transferred and what is returned if you stop. Get these in writing before you pay for a long plan.",
        ],
      },
      {
        heading: "Training safely, and in the heat",
        paragraphs: [
          "Tell your coach about injuries, surgery, pregnancy or conditions such as diabetes, blood pressure or heart trouble, and speak to a doctor before starting if any of these apply. In peak summer, choose early or late hours for outdoor training and drink water through the session.",
          "For children's coaching, ask about batch age groups, the coach-to-child ratio, who is present at the ground and how pickup is handled.",
        ],
      },
      {
        heading: "Make the first month count",
        paragraphs: [
          "Most people start with too much enthusiasm and too heavy a plan. Ask your coach for a simple first month you can finish: fixed days, a realistic session length and exercises you can learn properly. Note how you feel and what you could lift, hold or run at the start. Four weeks later you will have something honest to compare, and a better idea of whether this class, gym or sport suits you.",
          "Pain is different from ordinary tiredness. Stop and tell your coach if something hurts sharply, or if you feel dizzy or unusually breathless.",
        ],
      },
    ],
    faq: [
      { q: "How do I choose a gym near me?", a: "Visit at your usual time, check travel, crowding, equipment, trainer attention and the written membership terms. A trial session helps." },
      { q: "Is yoga or the gym better for a beginner?", a: "It depends on your goal and what you enjoy. Try one session of each, and tell the instructor about any health condition first." },
      { q: "What should I ask about children's sports coaching?", a: "Ask about age groups, batch size, coaching experience, safety arrangements, equipment needed and what happens in extreme heat or rain." },
    ],
  },

  "it-digital-services": {
    guide: [
      {
        heading: "Write a one-page brief first",
        paragraphs: [
          "Say what your business does, who your customers are, what the website or app must let them do and two or three sites you like. Add your budget range and the date you need it. This single page gets you better quotes than any phone call, and it lets you compare providers on the same footing.",
          "A shop in Johari Bazaar that wants enquiries on WhatsApp needs something quite different from a manufacturer that wants an online catalogue for bulk buyers. Say which one you are.",
        ],
      },
      {
        heading: "Own your domain, hosting and accounts",
        paragraphs: [
          "Register the domain name in your own name and email. Ask for owner access to hosting, the website admin, Google Business Profile, analytics, ad accounts and social pages. The provider can work with their own logins; the accounts should remain yours.",
          "Before final payment, agree who owns the design, content and source code, what is built on paid themes or plugins, and which renewals you will pay each year.",
        ],
      },
      {
        heading: "SEO and social media without false hope",
        paragraphs: [
          "No one controls search rankings, so be careful of any promise of a first-position result. A sensible SEO plan explains what will be fixed, what content will be written, how progress is reported and what is realistic over months rather than days.",
          "For social media, agree the number of posts, who creates photos and videos, who replies to messages and whether ad spend is separate from the service fee.",
        ],
      },
      {
        heading: "Milestones, handover and support",
        paragraphs: [
          "Split larger projects into stages: design, build, testing and launch, with payment tied to each. Test on a phone, not only a laptop. Ask what happens after launch: bug fixes, updates, backups, security patches and how quickly changes are normally picked up.",
          "At handover, collect passwords, source files and a short note on how to update the site.",
        ],
      },
      {
        heading: "Questions that show how a provider works",
        paragraphs: [
          "Ask who will actually do the work, whether any of it is passed to someone else and how you will see progress. Ask to see two earlier projects that resemble yours, and what their part in each was. Find out how they handle a change in scope, because almost every project has one.",
          "A provider who asks about your customers and how you take orders today is trying to understand the job. One who quotes without a single question may be pricing a template.",
        ],
      },
    ],
    faq: [
      { q: "How much does a website cost?", a: "It depends on pages, features, design, content, payments and integrations. Send the same brief to each provider and compare what is included and what renews yearly." },
      { q: "What should a website agreement include?", a: "Scope, stages, payments, timeline, number of revisions, ownership of domain, code and content, support after launch and renewal costs." },
      { q: "Do I need an app, or is a website enough?", a: "Many small businesses start with a mobile-friendly website. An app makes sense when customers will return often and need features a website handles poorly." },
    ],
  },

  "religious-spiritual": {
    guide: [
      {
        heading: "Share your tradition and the occasion",
        paragraphs: [
          "Rituals differ between regions, communities and families. Mention the occasion, whether griha pravesh, Satyanarayan katha, havan, namkaran or a wedding ceremony, along with your family's tradition and preferred language. If your elders follow a particular vidhi, say so at the start.",
          "Fix the muhurat with the person who will perform the ceremony before you book a hall or call the caterer, since timings can differ between panchangs.",
        ],
      },
      {
        heading: "Samagri, space and timing",
        paragraphs: [
          "Ask whether the pandit brings the samagri or gives you a list. If it is a list, get it a few days early, particularly in festival and wedding months. Ask how much space is needed, whether a havan will be done indoors and what ventilation and fire precautions to arrange.",
          "Ask how long the ceremony takes and who from the family needs to be present, so guests and food can be planned around it.",
        ],
      },
      {
        heading: "Talking about dakshina",
        paragraphs: [
          "Families sometimes feel awkward asking, but agreeing in advance is considerate to both sides. Ask what the dakshina covers, whether travel and samagri are separate and how many people will be coming.",
        ],
      },
      {
        heading: "Astrology and vastu consultations",
        paragraphs: [
          "Treat these as guidance rooted in belief, not as proof of what will happen. Ask what the consultation includes, how long it lasts and what it costs before you start. Be careful if anyone creates fear to sell costly remedies, and do not let a reading replace medical, legal or financial advice.",
        ],
      },
      {
        heading: "Planning the day around the ceremony",
        paragraphs: [
          "Work backwards from the muhurat. Decide when the samagri must be in place, when the family should be ready and when food or prasad will be served. Keep a clean, quiet space for the puja, seating for elders and a plan for children and guests. If photographs are welcome, tell the photographer which moments matter and where they may stand, and check with the pandit first.",
          "For a ceremony in a flat or housing society, check any rules about open flame, noise and visitor parking a few days ahead, so nothing interrupts the rituals.",
        ],
      },
    ],
    faq: [
      { q: "How early should I book a pandit in Jaipur?", a: "As soon as you know the occasion. Popular muhurat dates in wedding and festival months fill early, so confirm the date and time before other bookings." },
      { q: "What should I tell a pandit when I send a request?", a: "The ceremony, preferred date, locality, your family's tradition and language, and whether you need help with samagri." },
      { q: "Do vastu suggestions need structural changes?", a: "Ask for options and think carefully before spending. Never remove or alter walls, beams or columns without advice from a qualified engineer or architect." },
    ],
  },

  "restaurants-food": {
    guide: [
      {
        heading: "Planning catering for a function",
        paragraphs: [
          "Start with a realistic guest count, the meal time and the kind of food: pure vegetarian, Jain, no onion and garlic, or a mix. Then decide between buffet, plated thali service and live counters. A griha pravesh lunch for forty and a wedding dinner for five hundred are different jobs, even with the same menu.",
          "Ask what the per-plate price includes: staff, crockery, counters, water, tea and coffee, transport and cleaning. Ask how extra plates are charged and how leftover food is handled.",
        ],
      },
      {
        heading: "Choosing a tiffin service",
        paragraphs: [
          "For daily meals, try a few days before paying for a month. Check delivery timing, packaging, portion size, how the menu rotates, weekly offs and how to skip a day. Students and office-goers in Jaipur should confirm the exact delivery point, since a hostel gate and an office reception work differently.",
        ],
      },
      {
        heading: "Hygiene and FSSAI details",
        paragraphs: [
          "Food businesses in India, including caterers, tiffin services and cloud kitchens, generally need FSSAI registration or a licence, depending on their size and type. Ask for the number and look it up on the official FoSCoS portal, checking that the name and address match. Kartsquare does not check this for you.",
          "Notice the basics too: clean storage and containers, safe drinking water, how hot food stays hot on the way and how long it will sit before serving. This matters even more in summer.",
        ],
      },
      {
        heading: "Allergies, tastings and the written order",
        paragraphs: [
          "Tell the provider about allergies and ask how those dishes are prepared; a shared kitchen may not be able to rule out contact. For bigger events, ask for a tasting of the main dishes. Confirm the final menu, count, timing, venue access, price, advance and cancellation terms in one written message.",
        ],
      },
      {
        heading: "Ordering from restaurants and cafes",
        paragraphs: [
          "For a family dinner or a small get-together at a restaurant, call ahead about seating, parking and whether they can hold a table or a separate section. Mention children, elders and any food restrictions. If you are ordering a cake, a set menu or a large takeaway, confirm the pickup time and what happens if you are running late.",
          "Ask whether taxes, service charges and packing are included in the figure you are told, so the final bill matches what you expected.",
        ],
      },
    ],
    faq: [
      { q: "How early should I book a caterer?", a: "As soon as the date and venue are fixed, especially in wedding and festival months. Smaller gatherings usually have more room to book later." },
      { q: "How can I check a caterer's FSSAI number?", a: "Ask for the number and search it on the FoSCoS portal run for FSSAI. Check that the business name, address and category match." },
      { q: "What should a catering quote include?", a: "Menu, guest count, per-plate price, what is included, extra plate charges, timing, advance and cancellation terms." },
    ],
    sources: [{ label: "FoSCoS, FSSAI's food safety compliance portal", href: "https://foscos.fssai.gov.in/" }],
  },
};
