import type { CategoryContent } from "@/lib/services/types";

/**
 * Static category content for /services/c/{slug}. Every entry ships with reviewed: false.
 * A person reads the copy and flips the flag in a pull request; until then the page is
 * noindex and stays out of the sitemap. Write only what Kartsquare can stand behind: no
 * ratings, prices, availability, response times or claims about providers.
 */
export const CATEGORY_CONTENT: CategoryContent[] = [
  {
    slug: "home-services",
    name: "Home Services",
    tagline: "Plumbers, electricians, carpenters, painters, cleaners, and all home repair and maintenance professionals.",
    seoTitle: "Home Services: Plumbers, Electricians, Cleaners",
    metaDescription:
      "Find plumbers, electricians, carpenters, painters and cleaners on Kartsquare. Read provider profiles and send a service request for your home.",
    h1: "Home Services",
    intro: [
      "Home services cover the repair and upkeep jobs that keep a house or flat running: a leaking tap, a tripping switchboard, a loose cupboard hinge, a wall that needs repainting. These are usually small jobs, but they are hard to plan, because the right person depends on the exact fault.",
      "On Kartsquare you can look through providers who list home services, read what each one says it does, and send a request describing your problem. Kartsquare helps you find and contact providers. The work itself, the visit and the price are agreed between you and the provider.",
    ],
    commonServices: ["Plumber", "Electrician", "Carpenter", "Painter", "Home cleaner", "Pest control", "AC and appliance repair"],
    mayHelp: [
      "Inspect a fault such as a leak, a dead socket or a jammed door and explain what is needed",
      "Repair or replace fittings, fixtures, switches and hardware",
      "Carry out painting, polishing and basic carpentry jobs",
      "Clean a home, kitchen or bathroom on request",
    ],
    mayNotDo: [
      "Kartsquare does not do the work itself. The provider you choose does, under your agreement with them.",
      "A listing does not promise a visit time, a price or a result. Confirm these with the provider.",
      "Structural changes or major rebuilds may need an architect or contractor, not a home-services provider.",
    ],
    howToChoose: [
      "Open the provider profile and check that the service you need is actually listed.",
      "Look at the service area so you know the provider covers your locality.",
      "Ask what the visit or inspection costs before work starts, and how a final price is decided.",
      "For gas, wiring or water-supply work, ask who will do the job and what they will check afterwards.",
    ],
    requestInfo: [
      "What is wrong, in a sentence, and where in the house it is",
      "A photo or short video of the problem, if you can take one",
      "Your locality and a convenient day and time window",
      "Brand and model for any appliance or fitting involved",
    ],
    faq: [
      {
        q: "How do I get a plumber or electrician through Kartsquare?",
        a: "Browse providers under Home Services, open a profile to see what they list, and send a service request. The provider replies to you directly, and you agree the visit between you.",
      },
      {
        q: "Does Kartsquare set the price for home repairs?",
        a: "No. Prices are set by each provider. Where a provider shows a price on a listing, treat it as a starting point and confirm what is included before work begins.",
      },
      {
        q: "What should I do if a fault is urgent, such as a gas smell or exposed wiring?",
        a: "Switch off the supply if it is safe to do so and contact your gas or electricity utility or emergency services first. A request on Kartsquare is not an emergency service.",
      },
      {
        q: "Can I ask for a quote before anyone visits?",
        a: "You can ask in your request. Many repairs need an inspection before a provider can say what the job costs, so some will only give a range after seeing the fault.",
      },
    ],
    related: ["mobile-electronics-repair", "security-services", "energy-environment"],
    reviewed: false,
  },
  {
    slug: "mobile-electronics-repair",
    name: "Mobile & Electronics Repair",
    tagline: "Mobile phone repair, laptop repair, TV repair, CCTV repair, and all electronic device servicing.",
    seoTitle: "Mobile, Laptop and TV Repair Providers",
    metaDescription:
      "Look up mobile, laptop, TV and CCTV repair providers on Kartsquare. Check what each repairer lists and send a request describing the fault.",
    h1: "Mobile & Electronics Repair",
    intro: [
      "Phones, laptops, televisions and CCTV cameras all fail in different ways, and the cost of a repair depends on the fault, the model and whether parts can be sourced. A cracked screen is a different job from a phone that will not charge or a laptop that overheats.",
      "Providers in this category list the devices and faults they work on. You can read their profiles, compare what they offer and send a request with the details of your device. Kartsquare connects you with the repairer; the diagnosis, parts and price are between you and them.",
    ],
    commonServices: ["Mobile phone repair", "Laptop repair", "TV repair", "CCTV repair", "Screen replacement", "Battery replacement"],
    mayHelp: [
      "Diagnose why a device will not start, charge, connect or display",
      "Replace screens, batteries, charging ports and keyboards where parts are available",
      "Repair or set up CCTV cameras and recorders",
      "Advise whether a repair is worth it compared with replacing the device",
    ],
    mayNotDo: [
      "Some faults cannot be repaired, and some parts may not be available for older or rarer models.",
      "A repairer cannot promise that data on a device will be kept. Back up first if you can.",
      "Kartsquare does not hold your device or take part in the repair.",
    ],
    howToChoose: [
      "Check the profile lists your device type, for example a laptop and not only phones.",
      "Ask whether the diagnosis is free and what happens to the cost if you decline the repair.",
      "Ask what parts will be used and what the repairer says about the repaired part.",
      "Prefer a clear written estimate over a verbal figure for larger repairs.",
    ],
    requestInfo: [
      "Device type, brand and model",
      "What happens: a dead screen, no charging, water damage, slow performance",
      "When the problem started and whether the device was dropped or wet",
      "Whether you need the repair at your location or can bring the device in",
    ],
    faq: [
      {
        q: "Should I back up my phone or laptop before a repair?",
        a: "Yes, if the device still works. Repairs such as screen or storage replacement can affect stored data, and a repairer cannot assure that nothing is lost.",
      },
      {
        q: "How do I know if a repair is worth the cost?",
        a: "Ask the repairer for the cost of the repair and compare it with the price of a replacement of similar age. They can also tell you if parts are hard to find.",
      },
      {
        q: "Can a TV or CCTV camera be repaired at my home?",
        a: "Some providers visit; others work from a shop. Check the listing for the service area and mention your preference in the request.",
      },
      {
        q: "Can I ask for a quote before handing over my device?",
        a: "You can ask in your request. Many faults need a look at the device before a repairer can say what the repair costs, so some will give a range only after checking it.",
      },
    ],
    related: ["home-services", "security-services", "it-digital-services"],
    reviewed: false,
  },
  {
    slug: "automotive",
    name: "Automotive",
    tagline: "Car and bike repair, car wash, spare parts, driving schools, rentals, and all vehicle services.",
    seoTitle: "Car and Bike Repair and Services",
    metaDescription:
      "Browse car and bike repair, car wash and vehicle service providers on Kartsquare, read their profiles and send a request with your vehicle details.",
    h1: "Automotive Services",
    intro: [
      "Automotive services cover keeping a car or two-wheeler on the road: routine servicing, repairs, washing and detailing, and finding spare parts. The right provider depends on the vehicle, the fault and whether you need someone to come to you or are happy to drop it off.",
      "Providers here describe what they work on. Read a profile to see the vehicle types and services listed, then send a request with your make, model and the issue. Kartsquare helps you reach providers; the inspection, parts and cost are settled directly with the one you choose.",
    ],
    commonServices: ["Car repair", "Bike and scooter repair", "Car wash and detailing", "Spare parts", "Tyre and battery work", "Driving lessons"],
    mayHelp: [
      "Service a vehicle and check items such as oil, brakes, battery and tyres",
      "Diagnose a noise, warning light or starting problem",
      "Wash, clean and detail a car or bike",
      "Source and fit common spare parts",
    ],
    mayNotDo: [
      "A provider may not work on every make or model. Check the profile before you send a request.",
      "Kartsquare does not guarantee a diagnosis or the outcome of a repair.",
      "Vehicle paperwork, registration and insurance claims are outside what a repair provider handles.",
    ],
    howToChoose: [
      "Confirm the provider works on your vehicle type: car, scooter, motorcycle or commercial vehicle.",
      "Ask for an inspection estimate and approval before extra work is added.",
      "Ask whether replaced parts are new, used or refurbished, and request the old parts back if you want them.",
      "Keep the job card or bill for any service history you need later.",
    ],
    requestInfo: [
      "Make, model, fuel type and year of the vehicle",
      "The symptom: sound, warning light, hard starting, vibration",
      "Kilometres driven and the date of your last service, if known",
      "Whether the vehicle can be driven to the workshop",
    ],
    faq: [
      {
        q: "Do providers on Kartsquare repair every vehicle make?",
        a: "Not necessarily. Each provider lists the vehicles they work on. If it is not on the profile, ask in your request before arranging anything.",
      },
      {
        q: "Will I get an estimate before work starts?",
        a: "That is for you to agree with the provider. We suggest asking for an estimate and for approval before any extra work is added to the job.",
      },
      {
        q: "Can I book a driving school through Kartsquare?",
        a: "Where a driving school has listed itself, you can read its profile and send a request. Lesson details and fees are agreed with the school.",
      },
      {
        q: "Can I ask for an estimate before the work starts?",
        a: "Yes, ask in your request. A mechanic often needs to see the vehicle before giving a figure, so ask what the estimate covers and whether it can change once the fault is found.",
      },
    ],
    related: ["mobile-electronics-repair", "security-services", "energy-environment"],
    reviewed: false,
  },
  {
    slug: "security-services",
    name: "Security Services",
    tagline: "Security guards, CCTV, fire safety, alarm systems, and all safety and surveillance services.",
    seoTitle: "Security Guards, CCTV and Fire Safety",
    metaDescription:
      "Find security guard, CCTV, fire safety and alarm system providers on Kartsquare. Review their profiles and send a request for your premises.",
    h1: "Security Services",
    intro: [
      "Security services help protect homes, shops, offices and warehouses. That can mean people, such as guards, or equipment, such as cameras, alarms and fire-safety installations. What you need depends on the size of the premises, who uses it and the risks you are trying to reduce.",
      "Providers in this category describe the services they offer. You can compare profiles and send a request explaining your premises and what you want covered. Kartsquare connects you with providers; the assessment, installation terms and cost are agreed with them directly.",
    ],
    commonServices: ["Security guards", "CCTV installation", "Fire safety equipment", "Alarm systems", "Access control", "Site surveillance"],
    mayHelp: [
      "Assess a premises and suggest where cameras, alarms or guards would help",
      "Install and set up CCTV cameras, recorders and alarm systems",
      "Supply and service fire extinguishers and related equipment",
      "Provide security personnel for a site or an event, on terms agreed with you",
    ],
    mayNotDo: [
      "No security setup removes risk. A provider can reduce it, not eliminate it.",
      "Kartsquare does not check the background of any guard or installer. Ask the provider what checks it carries out.",
      "A listing is not a statement that a provider holds any permit or approval. Ask to see what applies to your premises.",
    ],
    howToChoose: [
      "Ask what is included: equipment, installation, maintenance visits and support afterwards.",
      "For guards, ask how they are screened, trained, supervised and replaced when absent.",
      "For fire safety, ask what standard the equipment follows and when it needs servicing.",
      "Get the scope and cost in writing before work begins.",
    ],
    requestInfo: [
      "Type of premises and its approximate size",
      "What you want covered: entrances, cash counter, parking, stock room",
      "Whether you need equipment, people or both, and for how long",
      "Any existing cameras or alarms that must be kept",
    ],
    faq: [
      {
        q: "Can Kartsquare tell me which security system I need?",
        a: "No. Providers can inspect your premises and recommend a setup. We suggest comparing recommendations from more than one provider.",
      },
      {
        q: "Does a listing mean the provider holds a security permit?",
        a: "No. A listing is a profile on Kartsquare, not a statement about permits. Ask the provider what applies to the work you need.",
      },
      {
        q: "What should a CCTV quote include?",
        a: "Ask for the number and type of cameras, the recorder and storage, cabling and installation, and what support is available afterwards.",
      },
      {
        q: "Can I ask what equipment an installation will use?",
        a: "Yes. Ask which cameras, recorders or alarm units the provider plans to use, and what happens if a part stops working. Get the answer in writing before work starts.",
      },
    ],
    related: ["home-services", "mobile-electronics-repair", "energy-environment"],
    reviewed: false,
  },
  {
    slug: "energy-environment",
    name: "Energy & Environment",
    tagline: "Solar panels, inverters, RO water purifiers, borewells, waste management, and green energy services.",
    seoTitle: "Solar, Inverter and RO Purifier Providers",
    metaDescription:
      "Browse solar panel, inverter, RO water purifier, borewell and waste management providers on Kartsquare and send a request with your needs.",
    h1: "Energy & Environment Services",
    intro: [
      "Energy and environment services cover how a home or business gets power and water and how it handles waste: solar panels, inverters and batteries, RO water purifiers, borewells and waste management. These are bigger purchases than a one-off repair, so it helps to understand your need before you ask for a quote.",
      "Providers on Kartsquare describe the products and work they handle. Read their profiles, then send a request with your usage and site details. Kartsquare helps you reach the provider; the survey, equipment, installation and price are agreed with them directly.",
    ],
    commonServices: ["Solar panels", "Inverters and batteries", "RO water purifiers", "Borewell work", "Waste management", "Green energy consulting"],
    mayHelp: [
      "Survey a site and suggest a solar, inverter or water-treatment setup",
      "Supply and install equipment such as panels, inverters and purifiers",
      "Service or repair an RO purifier or inverter",
      "Advise on borewell and waste-handling options",
    ],
    mayNotDo: [
      "A provider cannot promise a specific saving on your electricity bill. It depends on your usage and site.",
      "Kartsquare does not arrange subsidies, loans or government approvals. Ask the provider what paperwork applies.",
      "Water quality results should be confirmed with a test, not assumed from the purifier type.",
    ],
    howToChoose: [
      "Ask for a site survey and a written proposal listing capacity, brand, components and installation.",
      "Ask who handles servicing after installation and how a fault is reported.",
      "For water treatment, ask what the purifier removes and what filters need replacing, and how often.",
      "Compare proposals on what they include, not only on the total.",
    ],
    requestInfo: [
      "Type of building and the area available, such as a rooftop",
      "Monthly electricity use, or the appliances you need to run during a power cut",
      "For water: the source, such as borewell, tanker or municipal supply, and the problem you see",
      "Your locality and a convenient time for a site visit",
    ],
    faq: [
      {
        q: "How do I know what size solar system I need?",
        a: "It depends on your electricity use and the space available. A provider can survey the site and propose a size; comparing proposals from more than one is sensible.",
      },
      {
        q: "Does Kartsquare handle solar subsidies?",
        a: "No. If a subsidy applies, ask the provider what is required and who completes the process.",
      },
      {
        q: "Which RO purifier is right for my water?",
        a: "It depends on the water source and what is in it. Ask the provider to explain what a given model treats, and consider having the water tested.",
      },
      {
        q: "Can I ask for a site visit before agreeing a price?",
        a: "You can ask. Jobs such as solar panels or a borewell depend on the roof, the land and your usage, so providers often need to see the site before they can quote.",
      },
    ],
    related: ["home-services", "security-services", "automotive"],
    reviewed: false,
  },
  {
    slug: "fitness-sports",
    name: "Fitness & Sports",
    tagline: "Gyms, yoga, swimming, cricket, badminton, martial arts, personal training, and all fitness services.",
    seoTitle: "Gyms, Yoga and Sports Coaching Providers",
    metaDescription:
      "Find gyms, yoga teachers, personal trainers and sports coaches on Kartsquare. Read their profiles and send a request to ask about your goals.",
    h1: "Fitness & Sports",
    intro: [
      "Fitness and sports services range from a gym membership to one-to-one training, yoga classes, swimming lessons and coaching in games such as cricket and badminton. Choosing well depends on your goal, your current fitness and what suits your daily routine.",
      "Providers in this category describe what they teach and where. You can read their profiles and send a request with your goals and any health considerations. Kartsquare helps you contact them; the sessions, fees and terms are agreed with the provider.",
    ],
    commonServices: ["Gyms", "Yoga classes", "Personal training", "Swimming", "Cricket coaching", "Badminton coaching", "Martial arts"],
    mayHelp: [
      "Train you towards a goal such as strength, flexibility or learning a sport",
      "Run group classes or one-to-one sessions at a facility or your place",
      "Teach technique and build a routine suited to your level",
      "Explain what a membership or course includes",
    ],
    mayNotDo: [
      "A trainer is not a doctor. Speak to a medical professional first if you have a health condition.",
      "No provider can promise a specific result such as weight loss in a set time.",
      "Kartsquare does not check qualifications. Ask the provider about their training and experience.",
    ],
    howToChoose: [
      "Match the provider to your goal: general fitness, a sport, rehabilitation or a hobby.",
      "Ask whether you can visit or try a session before committing to a longer plan.",
      "Ask about batch sizes, timings and what happens if you miss a session.",
      "Check the fee structure and what it covers, including any joining charge.",
    ],
    requestInfo: [
      "Your goal and how much experience you have",
      "Any injury or health condition the trainer should know about",
      "Preferred days, times and whether you want group or one-to-one sessions",
      "Your locality or the distance you are willing to travel",
    ],
    faq: [
      {
        q: "Can I try a class before paying for a plan?",
        a: "That depends on the provider. Ask in your request whether a trial session is possible and what it costs.",
      },
      {
        q: "Does Kartsquare confirm that trainers are qualified?",
        a: "No. Ask the provider directly about their training, experience and any qualifications relevant to what you want to do.",
      },
      {
        q: "I have a health condition. Can I still sign up?",
        a: "Speak to your doctor first, and tell the provider about it in your request so they can plan around it.",
      },
      {
        q: "Can I ask about batch timings and class sizes?",
        a: "Yes. Ask in your request how many people are in a batch, what the timings are and what happens if you miss a session.",
      },
    ],
    related: ["religious-spiritual", "restaurants-food", "home-services"],
    reviewed: false,
  },
  {
    slug: "it-digital-services",
    name: "IT & Digital Services",
    tagline: "Website development, app development, SEO, social media, software, cloud, and all digital services.",
    seoTitle: "Website, App and Digital Marketing Providers",
    metaDescription:
      "Browse website, app, SEO, social media and software providers on Kartsquare. Review their profiles and send a request with your project brief.",
    h1: "IT & Digital Services",
    intro: [
      "IT and digital services help a business or individual build and run things online: a website, a mobile app, search visibility, social media presence, software or cloud systems. These projects vary widely, so a clear brief matters more than it does for a simple repair.",
      "Providers here describe their work and focus. You can read profiles, compare what each handles and send a request with your brief. Kartsquare helps you reach the provider; scope, timeline, deliverables and cost are agreed between you and them.",
    ],
    commonServices: ["Website development", "App development", "SEO", "Social media management", "Custom software", "Cloud and hosting setup"],
    mayHelp: [
      "Design and build a website or app to a brief you agree",
      "Improve how a site appears in search results over time",
      "Manage social media accounts and content on a schedule",
      "Set up software, hosting and cloud systems",
    ],
    mayNotDo: [
      "No provider can promise a specific search ranking or follower count.",
      "Kartsquare does not hold your project files, source code or payments. Agree ownership and handover in writing.",
      "A listing is not a review of the provider's past work. Ask for examples relevant to your project.",
    ],
    howToChoose: [
      "Ask to see earlier work similar to what you need, and who did what on it.",
      "Agree the scope, milestones and what counts as finished before work starts.",
      "Confirm who owns the code, designs and accounts when the project ends.",
      "Ask what ongoing support or maintenance is included and what is charged separately.",
    ],
    requestInfo: [
      "What you want built or improved, and the goal behind it",
      "Examples of sites, apps or styles you like",
      "Your timeline and an approximate budget range, if you have one",
      "Any systems it must connect with, such as payments or an existing website",
    ],
    faq: [
      {
        q: "Can an SEO provider promise a first-page ranking?",
        a: "No provider can control search engines. Be cautious of any promise of a specific ranking, and ask what work will be done and how progress is reported.",
      },
      {
        q: "Who owns the website or app after it is built?",
        a: "That is part of your agreement with the provider. Settle ownership of code, designs and hosting accounts in writing before the work begins.",
      },
      {
        q: "How should I describe a project in my request?",
        a: "Say what you want to achieve, who the users are, the features you expect and your timeline. A short, clear brief gets more useful replies.",
      },
      {
        q: "Can I ask to see earlier work before I decide?",
        a: "Yes. Check the provider's profile for examples and ask for more in your request. Also ask who will own the final files, code or accounts when the project ends.",
      },
    ],
    related: ["mobile-electronics-repair", "photography-videography", "security-services"],
    reviewed: false,
  },
  {
    slug: "photography-videography",
    name: "Photography & Videography",
    tagline: "Wedding photography, product shoots, passport photos, studio, and all photography services.",
    seoTitle: "Photographers and Videographers",
    metaDescription:
      "Find wedding, product and studio photographers and videographers on Kartsquare. Read their profiles and send a request with your event details.",
    h1: "Photography & Videography",
    intro: [
      "Photography and videography services cover weddings and events, product and catalogue shoots, passport and studio photos, and video production. The style, the equipment and the editing you need differ for each, so it helps to be clear about the occasion and the final deliverables.",
      "Providers here describe the shoots they do. You can read profiles, compare what each offers and send a request with the date, place and what you need delivered. Kartsquare helps you contact them; coverage, deliverables and fees are agreed directly.",
    ],
    commonServices: ["Wedding photography", "Event videography", "Product shoots", "Passport and studio photos", "Video editing", "Portfolio shoots"],
    mayHelp: [
      "Cover an event, ceremony or celebration on the date you agree",
      "Shoot product images for a shop or online listing",
      "Take studio portraits and passport-size photos",
      "Edit footage and deliver photos or videos in the formats you ask for",
    ],
    mayNotDo: [
      "A photographer cannot reshoot a moment that has passed. Discuss the shot list and key moments beforehand.",
      "Kartsquare does not hold deposits or bookings. Confirm dates and terms directly with the provider.",
      "A listing is not a promise about style. Ask to see sample work before deciding.",
    ],
    howToChoose: [
      "Look at samples of the same kind of shoot, not only a few highlights.",
      "Ask what is included: hours of coverage, number of edited images, album, raw files and videos.",
      "Ask how long editing takes and how files are delivered and stored.",
      "Agree a written plan for dates, deposits and what happens if the date changes.",
    ],
    requestInfo: [
      "Type of shoot, date and location",
      "Expected duration and number of people or products",
      "Photos, video or both, and the format you need them in",
      "Any must-have shots and where the images will be used",
    ],
    faq: [
      {
        q: "How far ahead should I contact a photographer?",
        a: "For weddings and large events, contact providers as early as you can, because dates fill up. For a product or studio shoot, a shorter notice may work.",
      },
      {
        q: "Who owns the photos after the shoot?",
        a: "That depends on your agreement. Ask what rights you have to use and share the images, and whether raw files are included.",
      },
      {
        q: "Can I see a photographer's earlier work?",
        a: "Ask the provider for samples similar to your shoot. Many profiles include images, and you can request more before deciding.",
      },
      {
        q: "Can I ask who owns the photos and videos?",
        a: "Ask before you agree. Providers differ on how many edited photos you receive, how long they keep the files and whether you can use them for your own business.",
      },
    ],
    related: ["it-digital-services", "restaurants-food", "religious-spiritual"],
    reviewed: false,
  },
  {
    slug: "religious-spiritual",
    name: "Religious & Spiritual",
    tagline: "Pandits, temples, mosques, churches, astrologers, vastu consultants, and all spiritual services.",
    seoTitle: "Pandits, Astrologers and Vastu Consultants",
    metaDescription:
      "Find pandits, astrologers and vastu consultants on Kartsquare. Read their profiles and send a request about the ceremony or consultation you need.",
    h1: "Religious & Spiritual Services",
    intro: [
      "Religious and spiritual services include conducting pujas and ceremonies, astrology consultations and vastu advice for homes and workplaces. These are personal services, and the tradition, language and approach matter as much as availability. Ask what the occasion needs, who will conduct it and how long it will take before you decide.",
      "Providers here describe what they offer. You can read their profiles, check the traditions and languages they work in, and send a request with the occasion and date. Kartsquare helps you contact them; the arrangements and any dakshina or fee are settled with the provider.",
    ],
    commonServices: ["Pandits for puja and ceremonies", "Astrology consultation", "Vastu consultation", "Havan and path", "Spiritual guidance"],
    mayHelp: [
      "Conduct a puja or ceremony for an occasion at your home or a venue",
      "Hold a consultation and explain their approach to your questions",
      "Advise on vastu for a home or a workplace",
      "Tell you which items and arrangements an occasion needs",
    ],
    mayNotDo: [
      "A consultation is guidance, not a medical, legal or financial opinion. Take professional advice for those matters.",
      "Kartsquare does not assess the practices or beliefs of any provider.",
      "No provider can promise an outcome from a ritual or a reading.",
    ],
    howToChoose: [
      "Check that the provider works in your tradition and language.",
      "Ask what the ceremony involves, how long it takes and what you need to arrange.",
      "Ask about charges and any materials before the day, so nothing is unclear.",
      "Speak to the provider first, and choose one you are comfortable with.",
    ],
    requestInfo: [
      "The occasion, such as a griha pravesh, a puja or a consultation",
      "Date, time window and the place",
      "Your tradition, community and preferred language",
      "Whether you need the provider to bring materials",
    ],
    faq: [
      {
        q: "How do I find a pandit who follows my tradition?",
        a: "Read the profiles and say your tradition and language in the request. Ask the provider to confirm before you arrange anything.",
      },
      {
        q: "Does Kartsquare set fees for ceremonies?",
        a: "No. Fees and materials are agreed between you and the provider, so ask what is included before the day.",
      },
      {
        q: "Are astrology readings predictions I can rely on?",
        a: "Treat them as the provider's guidance. They should not replace medical, legal or financial advice.",
      },
      {
        q: "Can I ask what a ceremony involves before I agree?",
        a: "Yes. Ask the provider what the ritual includes, how long it takes and which materials you need to arrange, so there are no surprises on the day.",
      },
    ],
    related: ["restaurants-food", "photography-videography", "fitness-sports"],
    reviewed: false,
  },
  {
    slug: "restaurants-food",
    name: "Restaurants & Food",
    tagline: "Restaurants, dhabas, cafes, caterers, tiffin services, cloud kitchens, and all food businesses.",
    seoTitle: "Caterers, Tiffin Services and Restaurants",
    metaDescription:
      "Browse restaurants, cafes, caterers and tiffin services on Kartsquare. Read their profiles and send a request about menus, events or regular meals.",
    h1: "Restaurants & Food",
    intro: [
      "Food businesses range from restaurants and cafes to caterers, tiffin services and cloud kitchens. What you need changes with the occasion: a family dinner, a birthday party, a wedding, or a daily meal at home or the office.",
      "Providers here describe what they serve and how. You can read profiles, check the kind of food and service offered and send a request with your numbers and date. Kartsquare helps you contact them; the menu, quantities, delivery and price are settled with the provider.",
    ],
    commonServices: ["Restaurants and dhabas", "Cafes", "Caterers", "Tiffin services", "Cloud kitchens", "Party and event catering"],
    mayHelp: [
      "Cater an event for a number of guests on a menu you agree",
      "Provide regular home-style meals through a tiffin plan",
      "Prepare food for pickup or delivery, where the provider offers it",
      "Suggest menus for an occasion and a budget",
    ],
    mayNotDo: [
      "A listing does not confirm a menu, a price or that an item is available on a given day.",
      "Kartsquare does not check hygiene or food safety. Ask the provider about their kitchen and preparation.",
      "Allergy needs must be raised with the provider directly, and no provider can promise an allergen-free kitchen.",
    ],
    howToChoose: [
      "Check the cuisine and the type of service: dine-in, delivery, tiffin or event catering.",
      "For events, ask for a tasting where possible and a written menu with quantities per head.",
      "Ask how food is transported and kept, and who serves it, for larger orders.",
      "Say any dietary or allergy needs in the first message and ask how they are handled.",
    ],
    requestInfo: [
      "The occasion, date, time and venue",
      "Number of guests and the food type, such as vegetarian only",
      "Dietary needs or allergies",
      "For tiffin: the locality, number of meals per day and the plan length",
    ],
    faq: [
      {
        q: "Can I order a daily tiffin through Kartsquare?",
        a: "You can find tiffin providers, read what they offer and send a request. Plans, timings, delivery and fees are agreed with the provider.",
      },
      {
        q: "How do I arrange catering for a party?",
        a: "Send a request with the date, venue, guest count and food preferences, then agree the menu and what is included in writing.",
      },
      {
        q: "What if someone in my family has a food allergy?",
        a: "Tell the provider before ordering and ask how they handle it. Be cautious, because no kitchen can promise to be allergen-free.",
      },
      {
        q: "Can I ask about the menu and quantities before I order?",
        a: "Yes. Ask in your request for the menu, the portion sizes for your number of guests and how the food is packed or served, and confirm them in writing.",
      },
    ],
    related: ["photography-videography", "religious-spiritual", "fitness-sports"],
    reviewed: false,
  },
];

export const CATEGORY_BY_SLUG: Record<string, CategoryContent> = Object.fromEntries(
  CATEGORY_CONTENT.map((c) => [c.slug, c]),
);
