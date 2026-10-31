import {
  resolveMainArea,
  POPULAR_JAIPUR_AREAS,
  PINCODE_MAP,
} from "@/utils/mainAreaResolver";

describe("Main Area Resolver (Justdial-style Main Area Filtering)", () => {
  it("resolves major areas accurately from address strings", () => {
    const loc1 = resolveMainArea({
      address: "Plot 42, Queen's Road, Vaishali Nagar",
      landmark: "Near Rosado",
      pincode: "302021",
      city: "Jaipur",
    });
    expect(loc1.mainArea).toBe("Vaishali Nagar");
    expect(loc1.landmark).toBe("Near Rosado");
    expect(loc1.displayLocation).toBe("Vaishali Nagar, Jaipur");

    const loc2 = resolveMainArea({
      address: "Shop 12, Tara Nagar, Jhotwara",
      landmark: "Satya Nagar",
      pincode: "302012",
      city: "Jaipur",
    });
    expect(loc2.mainArea).toBe("Jhotwara");
    expect(loc2.landmark).toBe("Satya Nagar");

    const loc3 = resolveMainArea({
      address: "Sector 3, Madhyam Marg, Mansarovar",
      landmark: "Near Metro Pillar 24",
      pincode: "302020",
      city: "Jaipur",
    });
    expect(loc3.mainArea).toBe("Mansarovar");
    expect(loc3.landmark).toBe("Near Metro Pillar 24");
  });

  it("resolves main area even when landmark contains micro-location", () => {
    // Provider whose landmark is 'Jaidurga College' but pincode is 302012 (Jhotwara)
    const loc = resolveMainArea({
      address: "Tara Nagar",
      landmark: "Jaidurga College",
      pincode: "302012",
      city: "Jaipur",
    });
    expect(loc.mainArea).toBe("Jhotwara");
    expect(loc.landmark).toBe("Jaidurga College");
  });

  it("resolves main area from pincode mapping when address is ambiguous", () => {
    const locMalviya = resolveMainArea({
      address: "Shop 5, Block B",
      pincode: "302017",
      city: "Jaipur",
    });
    expect(locMalviya.mainArea).toBe("Malviya Nagar");

    const locSanganer = resolveMainArea({
      address: "Near Main Market",
      pincode: "302029",
      city: "Jaipur",
    });
    expect(locSanganer.mainArea).toBe("Sanganer");

    const locSodala = resolveMainArea({
      address: "Shop 10, Near Overbridge",
      pincode: "302006",
      city: "Jaipur",
    });
    expect(locSodala.mainArea).toBe("Sodala");
  });

  it("handles redundant landmark without duplicating area name", () => {
    const loc = resolveMainArea({
      address: "Vaishali Nagar, Jaipur",
      landmark: "Vaishali Nagar",
      pincode: "302021",
      city: "Jaipur",
    });
    expect(loc.mainArea).toBe("Vaishali Nagar");
    expect(loc.landmark).toBeUndefined();
  });

  it("includes popular Jaipur zones in POPULAR_JAIPUR_AREAS", () => {
    expect(POPULAR_JAIPUR_AREAS).toContain("Vaishali Nagar");
    expect(POPULAR_JAIPUR_AREAS).toContain("Jhotwara");
    expect(POPULAR_JAIPUR_AREAS).toContain("Mansarovar");
    expect(POPULAR_JAIPUR_AREAS).toContain("Malviya Nagar");
    expect(POPULAR_JAIPUR_AREAS).toContain("Sanganer");
    expect(POPULAR_JAIPUR_AREAS).toContain("Raja Park");
    expect(POPULAR_JAIPUR_AREAS).toContain("C-Scheme");
    expect(POPULAR_JAIPUR_AREAS).toContain("Civil Lines");
  });
});
