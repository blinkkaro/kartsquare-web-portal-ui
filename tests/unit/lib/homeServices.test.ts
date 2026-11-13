import {
  countServicesByCategory,
  homeServiceNames,
  MIN_SERVICES_FOR_HOME,
  popularHomeCategories,
  winterServiceNames,
} from "@/lib/homeServices";

// Shaped like prod's GET /services: ids and names come as arrays. 19 services, as in prod.
const HOME = "cat-home";
const ENERGY = "cat-energy";
const AUTO = "cat-auto";
const SECURITY = "cat-security";
const FOOD = "cat-food";
const IT = "cat-it";
const AGRI = "cat-agri";
const RELIGIOUS = "cat-religious";
const PHOTO = "cat-photo";

const svc = (category: string, ...subs: string[]) => ({ category_id: [category], sub_category_name: subs });

const PROD_LIKE = [
  svc(HOME, "Electrician", "Home Automation"),
  svc(HOME, "Carpenter", "House Painter", "Plumber"),
  svc(HOME, "AC Repair & Service"),
  svc(HOME, "Electrician", "Geyser & Water Heater Repair"),
  svc(ENERGY, "Inverter & Battery Shop", "Solar Panel Installation"),
  svc(ENERGY, "Inverter & Battery Shop", "Solar Panel Installation"),
  svc(AUTO, "Car Repair & Service"),
  svc(AUTO, "Car Repair & Service", "Auto Spare Parts"),
  svc(FOOD, "Cafe & Coffee Shop"),
  svc(FOOD, "Cafe & Coffee Shop", "Fast Food & Snacks"),
  svc(SECURITY, "CCTV & Surveillance"),
  svc(SECURITY, "CCTV & Surveillance", "Alarm & Access Control"),
  svc(IT, "IT Support & Networking"),
  svc(RELIGIOUS, "Astrologer & Jyotish"),
  svc(PHOTO, "Wedding Photography", "Portrait Studio"),
];

const category = (id: string, name: string) => ({ id, name, is_deleted: false });
const CATEGORIES = [
  category(AGRI, "Agriculture & Farming"),
  category(AUTO, "Automotive"),
  category(FOOD, "Restaurants & Food"),
  category(HOME, "Home Services"),
  category(IT, "IT & Digital Services"),
  category(ENERGY, "Energy & Environment"),
  category(SECURITY, "Security Services"),
  category(RELIGIOUS, "Religious & Spiritual"),
  category(PHOTO, "Photography & Videography"),
];

describe("countServicesByCategory", () => {
  it("counts live services per category", () => {
    const counts = countServicesByCategory(PROD_LIKE);
    expect(counts.get(HOME)).toBe(4);
    expect(counts.get(AGRI)).toBeUndefined();
  });

  it("accepts a single id as well as an array", () => {
    expect(countServicesByCategory([{ category_id: "a" }, { category_id: ["a", "b"] }]).get("a")).toBe(2);
  });

  it("counts a service once per category even if the id is repeated", () => {
    expect(countServicesByCategory([{ category_id: ["a", "a"] }]).get("a")).toBe(1);
  });
});

describe("popularHomeCategories", () => {
  const names = (services = PROD_LIKE, max?: number) => popularHomeCategories(CATEGORIES, services, max).map((c) => c.name);

  it("shows the curated popular categories, in order", () => {
    expect(names()).toEqual([
      "Home Services", // electrician, geyser repair, plumber, painter
      "Security Services", // CCTV
      "Religious & Spiritual", // astrologer
      "Photography & Videography",
      "Energy & Environment", // inverter & battery
    ]);
  });

  it("keeps a popular category even when it has a single provider", () => {
    expect(names()).toContain("Religious & Spiritual");
    expect(names()).toContain("Photography & Videography");
  });

  it("leaves out everything that is not curated, such as agriculture, automotive and food", () => {
    const shown = names();
    expect(shown).not.toContain("Agriculture & Farming");
    expect(shown).not.toContain("Automotive");
    expect(shown).not.toContain("Restaurants & Food");
  });

  it("drops a popular category that has no live providers", () => {
    const withoutPhoto = PROD_LIKE.filter((s) => s.category_id?.[0] !== PHOTO);
    expect(names(withoutPhoto)).not.toContain("Photography & Videography");
  });

  it("caps the list", () => {
    expect(names(PROD_LIKE, 4)).toHaveLength(4);
  });

  it("ignores deleted categories", () => {
    const cats = [{ ...category(HOME, "Home Services"), is_deleted: true }];
    expect(popularHomeCategories(cats, PROD_LIKE)).toEqual([]);
  });

  it("returns nothing, not a fallback list, when no services have loaded", () => {
    expect(popularHomeCategories(CATEGORIES, [])).toEqual([]);
    expect(popularHomeCategories(CATEGORIES, undefined)).toEqual([]);
    expect(popularHomeCategories(undefined, PROD_LIKE)).toEqual([]);
  });
});

describe("winterServiceNames", () => {
  it("lists the winter services we have, most providers first", () => {
    expect(winterServiceNames(PROD_LIKE, 3)).toEqual([
      "Electrician",
      "Inverter & Battery Shop",
      "Geyser & Water Heater Repair",
    ]);
  });

  it("never lists a service type that does not exist", () => {
    expect(winterServiceNames([svc(AUTO, "Car Repair & Service")])).toEqual([]);
    expect(winterServiceNames(undefined)).toEqual([]);
  });

  it("respects the maximum", () => {
    expect(winterServiceNames(PROD_LIKE, 1)).toEqual(["Electrician"]);
  });
});

describe("homeServiceNames", () => {
  it("lists winter services first, then the popular ones, then other types with enough providers", () => {
    expect(homeServiceNames(PROD_LIKE, 20)).toEqual([
      "Electrician",
      "Inverter & Battery Shop",
      "Geyser & Water Heater Repair",
      "Plumber",
      "CCTV & Surveillance",
      "Astrologer & Jyotish",
      "House Painter",
      "Portrait Studio",
      "Wedding Photography",
      "Cafe & Coffee Shop",
      "Car Repair & Service",
      "Solar Panel Installation",
    ]);
  });

  it("leaves out non-winter types with a single provider", () => {
    const names = homeServiceNames(PROD_LIKE, 20);
    expect(names).not.toContain("IT Support & Networking");
    expect(names).not.toContain("Carpenter");
  });

  it("keeps popular services even with one provider", () => {
    expect(homeServiceNames(PROD_LIKE, 20)).toEqual(expect.arrayContaining(["Astrologer & Jyotish", "House Painter"]));
  });

  it("caps the list", () => {
    expect(homeServiceNames(PROD_LIKE, 3)).toHaveLength(3);
  });

  it("returns an empty list when there are no services", () => {
    expect(homeServiceNames([])).toEqual([]);
  });
});

describe("popularHomeCategoriesFromAvailability", () => {
  const { popularHomeCategoriesFromAvailability } = jest.requireActual("@/lib/homeServices");

  it("keeps curated categories that the backend says have services at the place", () => {
    const out = popularHomeCategoriesFromAvailability(CATEGORIES, [
      { id: HOME, service_count: 4 },
      { id: PHOTO, service_count: 1 },
    ]);
    expect(out.map((c: { name: string }) => c.name)).toEqual(["Home Services", "Photography & Videography"]);
  });

  it("drops zero-count and unlisted categories, and never invents any when nothing is available", () => {
    expect(popularHomeCategoriesFromAvailability(CATEGORIES, [{ id: HOME, service_count: 0 }])).toEqual([]);
    expect(popularHomeCategoriesFromAvailability(CATEGORIES, [])).toEqual([]);
    expect(popularHomeCategoriesFromAvailability(CATEGORIES, undefined)).toEqual([]);
  });

  it("ignores availability for categories that are not in the category list", () => {
    expect(popularHomeCategoriesFromAvailability(CATEGORIES, [{ id: "unknown-id", service_count: 9 }])).toEqual([]);
  });
});
