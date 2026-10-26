export interface HomePhoto {
  src: string;
  alt: string;
  /** Intrinsic size, only used by next/image to reserve the aspect ratio. */
  width: number;
  height: number;
}

const photo = (file: string, alt: string, width = 900, height = 600): HomePhoto => ({
  src: `/images/home/${file}.jpg`,
  alt,
  width,
  height,
});

export const HOME_PHOTOS = {
  electricianHero: photo("electrician-hero", "Electrician in a hard hat working on a wall panel", 900, 601),
  bridalMakeup: photo("bridal-makeup", "Bride with traditional makeup and jewellery", 900, 1353),
  homeCleaning: photo("home-cleaning", "Person mopping a bright living room", 900, 506),
  acRepair: photo("ac-repair", "Air-conditioner outdoor units"),
  electricianBox: photo("electrician-box", "Electrician working on a distribution box"),
  beautySalon: photo("beauty-salon", "Stylist blow-drying a client's hair"),
  plumberSink: photo("plumber-sink", "Plumber fixing pipes under a sink"),
  barber: photo("barber", "A barber at work in his shop"),
  hawaMahal: photo("hawa-mahal", "Hawa Mahal facade in Jaipur"),
  weddingPortrait: photo("wedding-portrait", "Wedding portraits under the golden lights", 900, 600),
  salonHairSpa: photo("salon-hair-spa", "Hair spa, start to finish in salon", 900, 600),
  barbershopLamp: photo("barbershop-lamp", "Forty years behind the chair barber shop", 900, 600),
  bridalRed: photo("bridal-red", "Classic red bridal look", 900, 600),
  cleanerSofa: photo("cleaner-sofa", "Deep sofa and upholstery cleaning", 900, 600),
  coupleDusk: photo("couple-dusk", "Couple photography at dusk", 900, 600),
  electricianPanel: photo("electrician-panel", "Panel rewiring done safely", 900, 600),
  plumberBathroom: photo("plumber-bathroom", "Bathroom fitting and plumbing repair", 900, 600),
  salonStudio: photo("salon-studio", "A calm new salon studio in town", 900, 600),
} as const;

/** Real category names -> a matching photo. No match means the card keeps its icon + gradient. */
const CATEGORY_PHOTO_RULES: ReadonlyArray<readonly [RegExp, HomePhoto]> = [
  [/\b(ac|appliance|cool)/i, HOME_PHOTOS.acRepair],
  [/clean|pest|maid/i, HOME_PHOTOS.homeCleaning],
  [/beauty|salon|parlou?r|spa|groom|makeup/i, HOME_PHOTOS.beautySalon],
  [/electric/i, HOME_PHOTOS.electricianBox],
  [/plumb/i, HOME_PHOTOS.plumberSink],
  [/photo|video|wedding|event/i, HOME_PHOTOS.bridalMakeup],
];

export const photoForCategory = (name: string): HomePhoto | undefined =>
  CATEGORY_PHOTO_RULES.find(([re]) => re.test(name))?.[1];
