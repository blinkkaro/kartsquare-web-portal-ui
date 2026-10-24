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
