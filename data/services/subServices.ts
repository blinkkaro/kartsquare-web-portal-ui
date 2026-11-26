import type { SubServiceContent } from "@/lib/services/types";

/**
 * Service guides inside a category, /services/c/{category}/{slug}. Same rules as categories.ts:
 * write only what Kartsquare can stand behind (no prices, ratings, timings or claims about
 * providers), and leave `reviewed` false until a person has read the copy in a pull request.
 * Until then each page is public but noindex, has no FAQ structured data and is not in the sitemap.
 */
export const SUB_SERVICE_CONTENT: SubServiceContent[] = [
  {
    categorySlug: "mobile-electronics-repair",
    slug: "mobile-phone-repair",
    name: "Mobile phone repair",
    icon: "ph:device-mobile-duotone",
    tagline: "Charging faults, dead speakers, water damage, software trouble and more, on Android phones and iPhones.",
    seoTitle: "Mobile Phone Repair: Faults, Costs, What to Ask",
    metaDescription:
      "Phone not charging, no sound or wet? Learn what common phone faults usually mean, what changes the repair cost and what to tell a repairer on Kartsquare.",
    h1: "Mobile Phone Repair",
    intro: [
      "A phone is the one device most of us cannot do without for even a day. It holds the UPI apps, the office WhatsApp group, the family photos and the OTPs for everything else. So when it stops charging or the screen goes black, the question is rarely whether to fix it. It is where, how soon and for how much.",
      "Phone repair covers far more than screens. Charging ports wear out and collect lint, speakers and microphones get clogged, buttons stop clicking, cameras lose focus, and a short fall can loosen a connector inside that you will never see from the outside. Then there are software faults: a phone stuck on the logo, an update that went wrong, or storage so full that nothing opens.",
      "Repairers who list mobile phone repair on Kartsquare say which brands and faults they handle. Read a profile, then send a request with your model and what is going wrong. The repairer replies to you directly, and the check, the part and the price are settled between the two of you.",
    ],
    symptoms: [
      { sign: "Charges only at an angle, or not at all", meaning: "Often a dirty or worn charging port, a damaged cable or, less often, a charging chip on the board." },
      { sign: "Callers cannot hear you, or you cannot hear them", meaning: "Usually a blocked or failed microphone or earpiece speaker. A case covering the mic is worth ruling out first." },
      { sign: "Phone restarts on its own or gets hot", meaning: "Can be a weak battery, a full storage drive or a software problem. A repairer will usually check the battery health first." },
      { sign: "Stuck on the brand logo after an update", meaning: "Typically a software fault that a reflash can clear, though this may erase data that is not backed up." },
      { sign: "Fell in water and now acts strangely", meaning: "Moisture may be corroding the board. Switch it off and do not charge it; the sooner it is opened and cleaned, the better the odds." },
      { sign: "Camera is blurry or shows a black screen", meaning: "Could be a cracked lens cover, a loose camera connector or a failed camera module." },
    ],
    guide: [
      {
        heading: "What happens at the counter",
        paragraphs: [
          "A good repairer starts by asking what happened rather than opening the phone straight away. When did it start? Was it dropped, wet or recently updated? Then comes a basic check: does it power on, does it charge with a known cable, does it show up on a computer. Only after that should you hear a diagnosis and a figure.",
          "If a repairer needs to open the phone to find the fault, ask whether that inspection is free or charged, and what you pay if you decide not to go ahead.",
        ],
      },
      {
        heading: "Android phones and iPhones",
        paragraphs: [
          "The work is similar, but parts and tools differ. iPhones use parts paired to the phone in some models, so a replaced screen, battery or camera can show a notice in settings even when it works fine. Android brands vary widely, and parts for budget models from a few years ago can be harder to find than you might expect.",
          "Tell the repairer the exact model, not just the brand. On most phones you will find it under Settings, then About phone.",
        ],
      },
      {
        heading: "Software problems are repairs too",
        paragraphs: [
          "Not every fault needs a part. A phone that keeps freezing, drains its battery overnight or will not finish an update may only need a reset or a fresh install of its software. That is cheaper than a hardware repair, but it can wipe the phone, so a backup matters even more here.",
        ],
      },
    ],
    mayHelp: [
      "Find out why a phone will not charge, power on, ring or connect",
      "Clean or replace charging ports, speakers, microphones and buttons",
      "Replace a back glass, camera lens cover or camera module",
      "Dry and clean a phone after water damage, where the board can still be saved",
      "Reinstall or update software on a phone stuck on the logo or in a restart loop",
    ],
    mayNotDo: [
      "Unlock a phone that is locked to someone else's account, or remove an account lock without proof that you own the phone.",
      "Recover every file from a phone that is badly damaged. Some data may be gone for good.",
      "Find parts for every model. Older and less common phones may wait for a part or may not be repairable.",
    ],
    costFactors: [
      "The brand and exact model, since part prices vary a lot between them",
      "Whether the fault is in a replaceable part or on the main board",
      "The part type you choose: original, compatible or refurbished",
      "Water damage, which often means extra cleaning and a less certain outcome",
      "Whether you bring the phone in or ask for pickup or a visit",
    ],
    beforeRepair: [
      "Back up photos, contacts and chats to the cloud or a computer, if the phone still turns on.",
      "Note your passcode privately. Decide whether you will share it or stay while the repairer tests the phone.",
      "Remove the SIM card, memory card and case, and keep them with you.",
      "Take a photo of the phone from all sides so its condition is on record.",
      "Ask for a written note of the fault, the agreed price and the part type before you leave the phone.",
    ],
    howToChoose: [
      "Check that the profile mentions phone repair and, ideally, your brand.",
      "Ask whether the first check is free, and what happens if you decline the repair.",
      "Ask which part type is quoted and what the repairer offers if that part fails soon after.",
      "For water damage, ask how they assess it and what you pay if the phone cannot be saved.",
    ],
    requestInfo: [
      "Brand and exact model, for example the name shown under Settings, About phone",
      "What the phone does or does not do, in plain words",
      "Whether it was dropped, got wet or was recently updated",
      "Whether you prefer to visit a shop or need pickup",
    ],
    faq: [
      {
        q: "My phone will not charge. Is it the battery or the port?",
        a: "Try a different cable and adapter first, and look into the port with a torch for lint. If it still will not charge, a repairer can test the port and the battery separately and tell you which one has failed.",
      },
      {
        q: "Should I put a wet phone in rice?",
        a: "Rice does very little and can leave dust in the ports. Switch the phone off, do not charge it, and take it to a repairer so it can be opened and cleaned as soon as possible.",
      },
      {
        q: "Will I lose my data during a phone repair?",
        a: "Most hardware repairs leave your data where it is, but software repairs and board work can erase it. Back up first if the phone still works, and ask the repairer before they start.",
      },
      {
        q: "Do I need to share my passcode?",
        a: "Some repairers ask for it so they can test the phone after the repair. You can ask to be present for the test instead, or change the passcode to a temporary one and reset it afterwards.",
      },
      {
        q: "Is it worth repairing an old phone?",
        a: "Compare the repair estimate with the price of a replacement you would be happy with. If the phone otherwise works well and the part is easy to find, a repair is often the sensible choice.",
      },
    ],
    matchTerms: ["mobile", "phone", "iphone", "smartphone", "android"],
    reviewed: true,
  },
  {
    categorySlug: "mobile-electronics-repair",
    slug: "laptop-repair",
    name: "Laptop repair",
    icon: "ph:laptop-duotone",
    tagline: "Laptops that will not start, charge or stay cool, plus keyboards, hinges, storage and upgrades.",
    seoTitle: "Laptop Repair: Common Faults and What to Ask",
    metaDescription:
      "Laptop overheating, slow or not turning on? Understand common laptop faults, what affects repair cost and how to describe the problem to a repairer.",
    h1: "Laptop Repair",
    intro: [
      "A laptop tends to fail at the worst possible time: during exams, the week of a client presentation, or halfway through filing returns. And unlike a phone, it is not always clear whether the problem is a cheap fix or a serious one. A laptop that will not switch on might need a new charger, or it might need a new motherboard.",
      "Laptop repair covers power and charging faults, cracked or flickering displays, keyboards with dead keys, broken hinges, noisy fans and overheating, slow performance, failing storage and software that will not boot. Many repairers also handle upgrades, such as adding memory or moving to a solid-state drive, which can give an older machine a few more useful years.",
      "Providers who list laptop repair on Kartsquare describe the brands and work they take on. Open a profile, then send a request with your model and what you are seeing. The repairer will reply to you, and the diagnosis, parts and cost are agreed between you and them.",
    ],
    symptoms: [
      { sign: "No lights, no sound, nothing when you press power", meaning: "Start with the charger and the socket. If those are fine, it may be the charging port, the battery or a board fault." },
      { sign: "Fan runs loud and the base gets very hot", meaning: "Usually dust inside the cooling system or dried thermal paste. A clean-out often helps a lot." },
      { sign: "Screen flickers or goes dark when you move the lid", meaning: "Often a worn display cable at the hinge rather than a failed screen." },
      { sign: "Some keys do nothing, or type the wrong letter", meaning: "Liquid spills and wear are common causes. Some laptops need the whole keyboard and top case replaced." },
      { sign: "Takes minutes to start and freezes often", meaning: "Can be a failing hard drive, too little memory or software clutter. Moving to a solid-state drive is a common fix." },
      { sign: "Clicking noise and files that will not open", meaning: "A sign that a hard drive may be failing. Stop using it and back up whatever you can." },
    ],
    guide: [
      {
        heading: "Repair, upgrade or replace",
        paragraphs: [
          "Laptops are worth repairing more often than people think. A new battery, a solid-state drive and extra memory can turn a sluggish four-year-old machine into a perfectly good one for study or office work. The picture changes when the motherboard fails on an older model, because the board alone can cost close to a replacement laptop.",
          "Ask the repairer to separate the must-fix from the nice-to-have in the estimate. Then you can decide what to do now and what can wait.",
        ],
      },
      {
        heading: "Spills: act in the first few minutes",
        paragraphs: [
          "If you spill tea or water on a laptop, switch it off by holding the power button, unplug it and turn it upside down with the lid open in a tent shape. Do not try to start it again to check. Liquid conducts power across the board, and a laptop that is switched off and dried out properly has a much better chance.",
        ],
      },
      {
        heading: "Is it the charger or the laptop?",
        paragraphs: [
          "Charging faults are one of the most common reasons people bring a laptop in, and the charger is to blame more often than you would think. Look for a light on the adapter, check the cable for kinks near the plug, and try another socket. If you can borrow a charger of the same wattage for your model, try that too.",
          "If a known good charger does not help, the fault is likely the laptop's charging port or the circuit behind it. Bring both the laptop and the charger to the repairer, so they can test each one.",
        ],
      },
      {
        heading: "Work laptops and company data",
        paragraphs: [
          "If the laptop belongs to your employer, check with your IT team before taking it to an outside repairer. Many companies have their own arrangements, and a storage drive may hold data that should not leave the office.",
        ],
      },
    ],
    mayHelp: [
      "Find the cause of a laptop that will not power on, charge or start Windows or macOS",
      "Replace screens, keyboards, batteries, hinges, charging ports and fans",
      "Clean the cooling system and refresh thermal paste on an overheating laptop",
      "Upgrade memory and fit a solid-state drive, and move your files across",
      "Reinstall an operating system and set up drivers",
    ],
    mayNotDo: [
      "Recover data from a drive that has failed badly. That needs specialist recovery work and may not succeed.",
      "Remove a firmware or account password without proof that you own the laptop.",
      "Find parts for every model. Some older or imported laptops have parts that are hard to source.",
    ],
    costFactors: [
      "The brand, model and age of the laptop",
      "Whether the fault is in a part that can be swapped or on the motherboard",
      "The cost of the part, especially screens and keyboards that come fitted to a top case",
      "Whether data needs to be moved, backed up or recovered",
      "Any upgrades you add at the same time",
    ],
    beforeRepair: [
      "Copy important files to an external drive or cloud storage, if the laptop still works.",
      "Write down the model number from the sticker under the laptop or from the system settings.",
      "Keep your charger with you unless the repairer asks for it to test a charging fault.",
      "Remove pen drives and dongles, and sign out of accounts you do not want left open.",
      "Ask for the estimate in writing, with the part names and the total.",
    ],
    howToChoose: [
      "Check that the profile mentions laptops, not only phones.",
      "Ask whether they repair boards themselves or only replace parts.",
      "Ask what happens to your files and whether the drive will be touched.",
      "For an upgrade, ask the repairer to tell you the exact memory and drive they will fit.",
    ],
    requestInfo: [
      "Laptop brand and model number",
      "What happens when you press power, and what you see on screen",
      "Any drop, spill or recent update before the problem began",
      "Whether your files are backed up, and whether you can bring the laptop in",
    ],
    faq: [
      {
        q: "My laptop is slow. Do I need a new one?",
        a: "Not always. A solid-state drive and more memory make a large difference on many older laptops. Ask a repairer whether your model can take them and what the upgrade would involve.",
      },
      {
        q: "Can a laptop screen be replaced?",
        a: "Yes, on almost every model. The cost depends on the panel type, size and whether the screen comes as a single unit with the lid. Read the screen replacement guide for more.",
      },
      {
        q: "How often should a laptop be cleaned inside?",
        a: "There is no fixed rule, but if the fan is loud and the base gets hot during normal use, a clean-out is worth asking about. Laptops used in dusty rooms need it more often.",
      },
      {
        q: "Will repairing my laptop wipe my files?",
        a: "Part swaps usually do not touch your files. Reinstalling the operating system or replacing the drive will. Back up first, and ask the repairer which kind of work they are planning.",
      },
      {
        q: "Can a laptop with liquid damage be saved?",
        a: "Often, if it was switched off quickly and not powered on again. The repairer needs to open it, clean the board and check for corrosion before they can say what is needed.",
      },
    ],
    matchTerms: ["laptop", "notebook", "macbook", "computer"],
    reviewed: true,
  },
  {
    categorySlug: "mobile-electronics-repair",
    slug: "tv-repair",
    name: "TV repair",
    icon: "ph:television-duotone",
    tagline: "LED, LCD and smart TVs with no picture, no sound, lines on the screen or power faults.",
    seoTitle: "TV Repair: LED, LCD and Smart TV Faults",
    metaDescription:
      "TV with sound but no picture, lines on screen or won't power on? Read what common TV faults usually mean and what to tell a TV repair provider.",
    h1: "TV Repair",
    intro: [
      "The television is often the one big screen in the house, and when it goes wrong the whole family notices. The good news is that many TV faults are fixable without touching the panel itself. Power boards, backlights and the small boards behind the screen are the usual suspects, and they cost far less than a new set.",
      "TV repair covers LED, LCD and smart TVs, whether they sit on a stand or are mounted on the wall. Typical jobs include a set that will not switch on, sound with no picture, a dim or patchy image, vertical or horizontal lines, apps and Wi-Fi that no longer work, and remotes or ports that have stopped responding. Older plasma and CRT sets are rarer now, and parts for them can be hard to find.",
      "Providers who list TV repair on Kartsquare say what kind of sets and faults they handle and whether they visit homes. Read a profile, then send a request with the brand, size and what you see on screen. The repairer replies to you, and the visit, parts and price are agreed with them.",
    ],
    symptoms: [
      { sign: "Sound works but the screen stays black", meaning: "Commonly a failed backlight. Shine a torch at the screen: if you can faintly see the picture, the panel is likely fine." },
      { sign: "Standby light blinks but the TV will not turn on", meaning: "Often a power board fault. Some brands use the blink pattern as an error code." },
      { sign: "Lines across the picture, or half the screen missing", meaning: "Can be a loose panel cable or a fault in the panel itself. A panel fault is usually the most expensive repair." },
      { sign: "Picture is dim or has dark patches", meaning: "Usually some of the backlight strips have failed." },
      { sign: "Apps freeze and the TV restarts by itself", meaning: "On smart TVs this can be software. A reset or update may help before any hardware work." },
      { sign: "No signal on one HDMI port", meaning: "Try another cable and port first. A damaged port can sometimes be replaced on the board." },
    ],
    guide: [
      {
        heading: "Why the panel decides everything",
        paragraphs: [
          "The panel is the screen itself, and on most modern TVs it is the single most expensive part, often close to the cost of a new set. That is why the first question a repairer asks is whether the panel is damaged. A cracked or bleeding panel usually means replacing the TV; a backlight or board fault usually means a repair is worth it.",
          "If the screen has a visible crack or ink-like spots spreading from a corner, the panel is probably damaged.",
        ],
      },
      {
        heading: "Home visit or workshop",
        paragraphs: [
          "Many TV repairers will do the first check at your home, because carrying a large TV is risky. Backlight and board repairs can sometimes be done on site; others need the set taken to a workshop. Ask how the TV will be moved and packed if it has to go.",
          "For wall-mounted TVs, mention it in your request, since the repairer may need a second person to take it down safely.",
        ],
      },
      {
        heading: "Check the simple things first",
        paragraphs: [
          "Before booking a visit, unplug the TV for a minute, check the remote batteries, try a different input and, on a smart TV, look for a software update in the settings. It sounds obvious, but these steps clear a surprising number of problems.",
        ],
      },
    ],
    mayHelp: [
      "Diagnose a TV that will not power on, show a picture or play sound",
      "Replace backlight strips, power boards and main boards",
      "Fix loose panel cables, HDMI ports and speakers",
      "Reset and update smart TV software and fix Wi-Fi or app problems",
      "Take down and remount a wall-mounted TV for the repair, where they offer it",
    ],
    mayNotDo: [
      "Repair a cracked panel. That normally means replacing the panel, which may cost close to a new TV.",
      "Find parts for every model, especially older or imported sets.",
      "Move a large TV without the right packing. Ask how it will be carried before agreeing to a workshop repair.",
    ],
    costFactors: [
      "Screen size, brand and model",
      "Which part has failed: backlight, power board, main board or panel",
      "Whether the work is done at home or the TV goes to a workshop",
      "Wall mounting, which may need extra hands or fittings",
      "How easily the part can be sourced for your model",
    ],
    beforeRepair: [
      "Note the model number from the sticker on the back of the TV.",
      "Take a photo or short video of the fault on screen, if there is anything to see.",
      "Clear space around the TV and the wall socket for the visit.",
      "Keep the remote and any set-top box handy so the repairer can test inputs.",
      "If the TV goes to a workshop, ask for a written note of what is being taken and when it will return.",
    ],
    howToChoose: [
      "Check that the profile mentions TV repair and, if possible, your type of TV.",
      "Ask whether they do home visits and what the visit costs.",
      "Ask them to confirm whether the panel is damaged before you agree to a repair.",
      "Ask how they will move and pack the TV if it needs a workshop.",
    ],
    requestInfo: [
      "TV brand, model number and screen size",
      "What you see and hear when you switch it on",
      "Whether the TV is wall-mounted or on a stand",
      "Your locality and a convenient day for a visit",
    ],
    faq: [
      {
        q: "My TV has sound but no picture. Can it be repaired?",
        a: "Often, yes. This is a common sign of a failed backlight, which is usually much cheaper to fix than the panel. A repairer can confirm with a quick check.",
      },
      {
        q: "Is it worth repairing a TV with lines on the screen?",
        a: "It depends on the cause. A loose cable is a small job, but a panel fault may cost close to a new set. Ask the repairer to find the cause before you decide.",
      },
      {
        q: "Can a TV be repaired at home?",
        a: "Some repairs can, and many repairers do the first check at home. Larger board or panel work may need the TV to go to a workshop.",
      },
      {
        q: "My smart TV is slow and apps crash. Is it broken?",
        a: "Try a restart and a software update first. If that does not help, a factory reset may, though it will sign you out of your apps. A repairer can check for hardware faults if the problem stays.",
      },
    ],
    matchTerms: ["tv", "television", "led", "lcd"],
    reviewed: true,
  },
  {
    categorySlug: "mobile-electronics-repair",
    slug: "cctv-repair",
    name: "CCTV repair",
    icon: "ph:security-camera-duotone",
    tagline: "Cameras that show no video, recorders that stop saving, remote viewing and wiring faults.",
    seoTitle: "CCTV Repair and Camera Troubleshooting Guide",
    metaDescription:
      "CCTV camera offline, blurry at night or not recording? See what usually causes CCTV faults and what to share with a CCTV repair provider on Kartsquare.",
    h1: "CCTV Repair",
    intro: [
      "A CCTV system tends to be forgotten until the day you actually need the footage, and that is when you discover one camera stopped working months ago. For shops, offices and housing societies, a dead camera or a recorder that quietly stopped saving is a real gap, not a small annoyance.",
      "CCTV repair covers the cameras, the cables and connectors that run between them, the recorder (DVR or NVR) and its hard disk, the power supply, and the phone app used for remote viewing. Common jobs include cameras showing no video, blurry or dark night images, a recorder that will not save or play back, a full or failed hard disk, and an app that can no longer connect after a router change.",
      "Providers who list CCTV repair on Kartsquare describe the systems they work on and the areas they visit. Send a request with how many cameras you have, what the recorder shows and where the problem is. The repairer replies to you directly, and the visit and price are agreed with them.",
    ],
    symptoms: [
      { sign: "One camera shows 'No video' on the recorder", meaning: "Often a loose connector, a damaged cable or a failed power adapter for that camera, rather than the camera itself." },
      { sign: "Several cameras went dark at once", meaning: "Points to a shared power supply or the recorder, not the individual cameras." },
      { sign: "Night picture is white, foggy or full of glare", meaning: "Dust or spider webs on the lens, a misted dome, or infrared light bouncing off a nearby wall or glass." },
      { sign: "Recorder does not save or play back footage", meaning: "Commonly a full, failing or unformatted hard disk, or recording settings that were reset." },
      { sign: "Phone app says the device is offline", meaning: "Usually a network change, such as a new router or Wi-Fi password, or an app account issue." },
      { sign: "Picture rolls or shows lines", meaning: "Can be a poor cable joint or interference from power wiring running alongside the camera cable." },
    ],
    guide: [
      {
        heading: "Find out which part has failed",
        paragraphs: [
          "A CCTV system is a chain: camera, cable, power, recorder, disk, network and app. When something stops working, the trick is to find the broken link. If one camera is out, look at that camera's cable and adapter. If all are out, look at the recorder and the power supply. If the recorder works but the phone app does not, the fault is likely in the network.",
          "Sharing what you have already noticed helps the repairer bring the right parts on the first visit.",
        ],
      },
      {
        heading: "The hard disk is the system's memory",
        paragraphs: [
          "Recorders save footage to a hard disk and overwrite the oldest recordings when it fills up. Disks wear out with constant writing, and a failing one can stop saving without any obvious warning. It is worth checking playback from your recorder every few weeks so you know footage is actually being kept.",
        ],
      },
      {
        heading: "Outdoor cameras and the weather",
        paragraphs: [
          "Cameras on terraces, gates and boundary walls take the full force of summer heat, dust storms and monsoon rain. Loose seals let moisture in, and connectors corrode. If an outdoor camera fails after rain, mention it in your request, because the repairer may need to replace the connector or the camera housing.",
        ],
      },
    ],
    mayHelp: [
      "Trace a camera that shows no video and fix the cable, connector or power adapter",
      "Clean, refocus or reposition cameras for a clearer picture",
      "Check, replace or format the recorder's hard disk and reset recording settings",
      "Set up or restore remote viewing on your phone after a network change",
      "Add or replace cameras on an existing system, where the recorder supports it",
    ],
    mayNotDo: [
      "Recover footage that has already been overwritten or lost on a failed hard disk.",
      "Make every camera work with every recorder. Some older systems cannot take newer cameras.",
      "Give access to a recorder without proof that it is yours, or point cameras at a neighbour's private space.",
    ],
    costFactors: [
      "The number of cameras that need attention",
      "Whether the fault is a cable, a camera, the recorder or its disk",
      "Cable runs that are long, high up or hidden in walls",
      "Whether new cameras or a new disk are needed",
      "The type of system: older analogue or newer IP cameras",
    ],
    beforeRepair: [
      "Note the recorder's brand and model, and how many cameras are connected.",
      "Take photos of the recorder screen showing which cameras are out.",
      "Find the recorder's admin password, or the app account it is linked to.",
      "Check playback for the last few days so you can tell the repairer what is and is not being saved.",
      "Arrange a ladder or access to the roof or terrace, if the faulty camera is mounted high.",
    ],
    howToChoose: [
      "Check that the profile mentions CCTV repair or installation, and the area they cover.",
      "Ask whether the visit and inspection are charged separately from the repair.",
      "Ask whether they work on your type of system, analogue (DVR) or IP (NVR).",
      "Ask them to show you playback and remote viewing working before they leave.",
    ],
    requestInfo: [
      "Number of cameras and the recorder's brand and model",
      "Which cameras are affected and what the screen shows",
      "Whether the problem is live view, recording, playback or the phone app",
      "Your locality, and whether the site is a home, shop or office",
    ],
    faq: [
      {
        q: "Why does my CCTV camera show 'No video'?",
        a: "The usual causes are a loose connector, a damaged cable or a failed power adapter for that camera. If several cameras are out together, the power supply or recorder is more likely.",
      },
      {
        q: "Why is my CCTV picture blurry at night?",
        a: "Dust, spider webs or moisture on the lens often scatter the infrared light at night. Glare from a nearby wall or glass can also wash out the image. Cleaning and repositioning usually helps.",
      },
      {
        q: "Can I watch my CCTV on my phone again after changing my router?",
        a: "Usually, yes. The recorder needs to be reconnected to the new network and the app linked again. A repairer can do this on a visit if you cannot.",
      },
      {
        q: "Can old CCTV footage be recovered?",
        a: "Only if it was saved and the disk still works. Recorders overwrite the oldest footage when the disk is full, and a failed disk may not be readable.",
      },
    ],
    matchTerms: ["cctv", "camera", "surveillance", "dvr", "nvr"],
    reviewed: true,
  },
  {
    categorySlug: "mobile-electronics-repair",
    slug: "screen-replacement",
    name: "Screen replacement",
    icon: "ph:device-mobile-speaker-duotone",
    tagline: "Cracked, black, lined or unresponsive screens on phones, tablets and laptops.",
    seoTitle: "Phone and Laptop Screen Replacement Guide",
    metaDescription:
      "Cracked or black screen? Learn the difference between glass and display damage, original and compatible screens, and what to ask before a replacement.",
    h1: "Screen Replacement",
    intro: [
      "A cracked screen is the most common repair there is. One slip on a marble floor or a phone left on the car seat is all it takes. Sometimes the crack is only cosmetic and the phone works perfectly; sometimes the touch goes haywire, black ink spreads across the display, or nothing lights up at all.",
      "Screen replacement covers phones, tablets and laptops. On most modern phones, the glass and the display underneath are bonded together, so a crack usually means replacing the whole screen unit rather than just the glass. Laptops are often simpler, because the display panel sits in the lid and can be swapped on its own, though some thin models use a sealed lid where the screen and cover come as one piece.",
      "Repairers who list screen replacement on Kartsquare say which devices they work on. Send a request with your model and a photo of the damage. The repairer replies to you, and you agree the screen type and price with them before any work starts.",
    ],
    symptoms: [
      { sign: "Cracked glass but the picture and touch work", meaning: "Only the top glass may be damaged. Many people keep using the phone, but cracks tend to spread and let in dust and moisture." },
      { sign: "Black spots or ink spreading from a crack", meaning: "The display layer underneath is damaged. This needs a full screen replacement." },
      { sign: "Touch works in some places and not others", meaning: "The touch layer is damaged, which on most phones is part of the screen unit." },
      { sign: "Green or white lines across the screen", meaning: "Can be a display fault or a loose connector after a drop. A repairer can tell which." },
      { sign: "Screen is black but the phone rings and vibrates", meaning: "The display or its connector may have failed, while the rest of the phone is fine." },
      { sign: "Laptop screen flickers when you tilt the lid", meaning: "More often the display cable than the panel itself." },
    ],
    guide: [
      {
        heading: "Original, compatible and OLED or LCD",
        paragraphs: [
          "This is where most of the price difference comes from. An original screen is the one the brand makes for your model. Compatible screens are made by other companies and range from very close to noticeably different. On phones that came with an OLED screen, a cheaper compatible screen may be an LCD instead, which looks less vivid, uses more battery and can be thicker.",
          "Ask the repairer to name the exact screen type in the quote, and ask to see the phone switched on before you pay, so you can check colour, brightness and touch.",
        ],
      },
      {
        heading: "Do not wait too long after a crack",
        paragraphs: [
          "A cracked screen that still works is tempting to ignore. But glass splinters can cut fingers, and cracks let in dust and moisture that can damage the display or the board underneath. If you are going to replace it, sooner is usually cheaper than later.",
        ],
      },
      {
        heading: "After the replacement",
        paragraphs: [
          "Check everything before you leave: touch in every corner, brightness, the front camera, the fingerprint or face unlock, and the earpiece. Some phones lose features such as auto-brightness or fingerprint unlock with certain replacement screens, so it is better to find out at the counter.",
        ],
      },
    ],
    mayHelp: [
      "Replace a cracked or dead phone or tablet screen with the screen type you choose",
      "Replace a laptop display panel or a full lid assembly",
      "Fix loose screen connectors after a drop",
      "Fit a screen guard after the replacement, if you want one",
    ],
    mayNotDo: [
      "Replace only the top glass on most modern phones. The glass and display are usually one unit.",
      "Keep every feature working with every replacement screen. Some screens affect fingerprint or brightness sensors.",
      "Find screens for every model, especially older or less common ones.",
    ],
    costFactors: [
      "The device model and the screen size",
      "The screen technology: OLED or LCD",
      "Whether you choose an original, compatible or refurbished screen",
      "For laptops, whether the panel can be swapped alone or comes with the lid",
      "Any other damage from the same drop, such as a bent frame",
    ],
    beforeRepair: [
      "Back up the device if the screen still lets you use it.",
      "Take clear photos of the damage and the rest of the device.",
      "Remove the case, screen guard, SIM and memory card.",
      "Decide which screen type you want, so you can compare quotes on the same basis.",
      "Ask whether you can test the new screen before you pay.",
    ],
    howToChoose: [
      "Check the profile lists screen replacement for your type of device.",
      "Ask for the price of each screen option, not just one figure.",
      "Ask what the repairer offers if the new screen develops lines or touch problems soon after.",
      "Ask how long the phone will need to stay with them.",
    ],
    requestInfo: [
      "Device brand and exact model",
      "A photo of the damaged screen",
      "Whether the display and touch still work",
      "Which screen type you are interested in, if you already know",
    ],
    faq: [
      {
        q: "Can only the glass on my phone screen be replaced?",
        a: "On most modern phones the glass and display are bonded, so the whole screen unit is replaced. Some shops do glass-only work with special equipment; ask the repairer whether they offer it for your model.",
      },
      {
        q: "Why is an original screen so much more expensive?",
        a: "It is the part the brand makes for your phone, with the same display technology and quality. Compatible screens cost less but can differ in colour, brightness and battery use.",
      },
      {
        q: "Will a screen replacement delete my data?",
        a: "Usually not. A screen swap does not touch the storage. It is still wise to back up first in case other faults turn up during the repair.",
      },
      {
        q: "My laptop screen has lines. Does the whole screen need changing?",
        a: "Not always. Lines can come from a loose or worn display cable. A repairer can test with an external monitor and tell you whether the panel itself has failed.",
      },
    ],
    matchTerms: ["screen", "display", "glass", "touch"],
    reviewed: true,
  },
  {
    categorySlug: "mobile-electronics-repair",
    slug: "battery-replacement",
    name: "Battery replacement",
    icon: "ph:battery-charging-duotone",
    tagline: "Phones and laptops that drain quickly, shut down early, swell or will not hold a charge.",
    seoTitle: "Phone and Laptop Battery Replacement Guide",
    metaDescription:
      "Battery draining or swelling? Find out when a phone or laptop battery needs replacing, how to check battery health and what to ask a repairer.",
    h1: "Battery Replacement",
    intro: [
      "Batteries wear out. It is not a defect, it is chemistry. After a couple of years of daily charging, most phone and laptop batteries hold noticeably less than they did when new. The phone that used to last a full day now needs a top-up by lunch, and the laptop that once ran a whole class now dies as soon as you unplug it.",
      "Battery replacement is one of the most cost-effective repairs you can make. A new battery can give a phone or laptop that otherwise works well another year or two of comfortable use. It covers phones, tablets and laptops, and also includes checking whether the problem really is the battery, because a faulty charging port, adapter or app can look like a weak battery.",
      "Repairers who list battery replacement on Kartsquare describe the devices they work on. Send a request with your model and what you have noticed. The repairer replies to you directly, and the battery type and price are agreed with them.",
    ],
    symptoms: [
      { sign: "Phone dies at 20 or 30 percent", meaning: "A classic sign of a worn battery that can no longer deliver power when it is partly drained." },
      { sign: "Battery drains much faster than before", meaning: "Usually age. An app running in the background can do the same, so check battery usage in settings first." },
      { sign: "Back cover lifting or screen pushed up", meaning: "The battery may be swelling. Stop charging it and get it looked at soon." },
      { sign: "Device gets hot while charging", meaning: "Can be the battery, the charger or the port. A repairer can test each." },
      { sign: "Laptop only works when plugged in", meaning: "The battery has probably reached the end of its life, or the laptop no longer detects it." },
      { sign: "Charging stops at a certain percentage", meaning: "Check for a battery-saving setting first. Some phones and laptops cap charging on purpose." },
    ],
    guide: [
      {
        heading: "How to check battery health",
        paragraphs: [
          "On an iPhone, go to Settings, then Battery, then Battery Health. Many Android phones show battery information under Settings, Battery or Device care, though not every brand shows a health figure. On Windows laptops, a battery report can be created from the command prompt, and on a Mac, battery condition appears in System Settings under Battery.",
          "If your device shows a health figure well below what it was when new, and you notice the drop in daily use, replacement is worth considering.",
        ],
      },
      {
        heading: "A swollen battery is a safety issue",
        paragraphs: [
          "If the screen is lifting, the back cover is bulging or the laptop no longer sits flat, the battery is probably swelling. Stop charging it, keep it away from heat and do not press on it or try to remove it yourself. Get it to a repairer soon. Heat makes swelling worse, so do not leave the device in a parked car in summer.",
        ],
      },
      {
        heading: "Make the new battery last",
        paragraphs: [
          "Heat is the biggest enemy of a battery. Avoid charging under a pillow or in direct sun, and take off a thick case if the phone gets hot while charging. Many phones and laptops now offer an optimised charging setting that slows the last stretch to full, which helps battery life over time.",
        ],
      },
    ],
    mayHelp: [
      "Test whether the battery, the charger or the port is causing a power problem",
      "Replace phone, tablet and laptop batteries where a battery for your model is available",
      "Safely remove a swollen battery",
      "Advise on charging habits and settings that help the new battery last",
    ],
    mayNotDo: [
      "Replace a battery that is built into a sealed device without opening it, which can affect water resistance.",
      "Make every replacement battery show the same health reading in settings. Some phones mark non-original batteries.",
      "Find batteries for every model, especially older laptops.",
    ],
    costFactors: [
      "The device model and its battery capacity",
      "Whether the battery is glued in or easy to reach",
      "Original, compatible or high-capacity battery options",
      "Extra work for a swollen battery, which needs careful removal",
      "Resealing the device afterwards, for phones with water resistance",
    ],
    beforeRepair: [
      "Back up your data if the device still works.",
      "Check battery health in settings and note the figure.",
      "Note how long the device lasts on a charge now, so you can compare afterwards.",
      "If the battery is swelling, stop charging it and keep it somewhere cool until the repair.",
      "Ask which battery type is quoted and whether you can see the old battery after it is removed.",
    ],
    howToChoose: [
      "Check the profile mentions battery replacement for your type of device.",
      "Ask whether they test the charger and port as well, before replacing the battery.",
      "Ask which battery type they will fit and what cover they give if it fails early.",
      "For water-resistant phones, ask whether they reseal the phone after the repair.",
    ],
    requestInfo: [
      "Device brand and exact model",
      "What you have noticed: fast drain, sudden shutdowns, swelling or heat",
      "The battery health figure, if your device shows one",
      "Whether the device is safe to carry, or needs to be collected",
    ],
    faq: [
      {
        q: "How do I know my phone battery needs replacing?",
        a: "Watch for a phone that dies with charge left, drains much faster than it used to or shows low battery health in settings. If the back or screen is lifting, have it looked at soon.",
      },
      {
        q: "Is a swollen battery dangerous?",
        a: "It should be treated with care. Stop charging it, keep it away from heat and do not press on it or try to remove it yourself. A repairer can remove and replace it safely.",
      },
      {
        q: "Will a new battery make my phone faster?",
        a: "Sometimes. Some phones slow down to protect a worn battery, so a new one can restore normal speed. It will not fix slowness caused by full storage or old software.",
      },
      {
        q: "Can a laptop battery be replaced?",
        a: "On most laptops, yes. Some are held by screws and are simple to change; others are glued in and take more work. Ask the repairer whether a battery for your model is available.",
      },
    ],
    matchTerms: ["battery", "batteries"],
    reviewed: true,
  },
];

export const SUB_SERVICES_BY_CATEGORY: Record<string, SubServiceContent[]> = SUB_SERVICE_CONTENT.reduce<Record<string, SubServiceContent[]>>((acc, s) => {
  (acc[s.categorySlug] ??= []).push(s);
  return acc;
}, {});
