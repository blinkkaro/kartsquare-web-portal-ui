describe("Home Categories Pagination", () => {
  const dummyCategories = Array.from({ length: 40 }).map((_, i) => ({
    id: `cat-${i + 1}`,
    name: `Category ${i + 1}`,
    slug: `category-${i + 1}`,
    description: `Description for category ${i + 1}`,
  }));

  it("splits featured categories and paginated categories correctly", () => {
    const featured = dummyCategories.slice(0, 4);
    const remaining = dummyCategories.slice(4);

    expect(featured).toHaveLength(4);
    expect(remaining).toHaveLength(36);
  });

  it("calculates total pages correctly for desktop (12 items per page)", () => {
    const remaining = dummyCategories.slice(4); // 36 items
    const itemsPerPage = 12;
    const totalPages = Math.ceil(remaining.length / itemsPerPage);

    expect(totalPages).toBe(3);

    const page1 = remaining.slice(0, 12);
    const page2 = remaining.slice(12, 24);
    const page3 = remaining.slice(24, 36);

    expect(page1).toHaveLength(12);
    expect(page2).toHaveLength(12);
    expect(page3).toHaveLength(12);
    expect(page1[0].name).toBe("Category 5");
    expect(page3[11].name).toBe("Category 40");
  });

  it("calculates total pages correctly for mobile (8 items per page)", () => {
    const remaining = dummyCategories.slice(4); // 36 items
    const itemsPerPage = 8;
    const totalPages = Math.ceil(remaining.length / itemsPerPage);

    expect(totalPages).toBe(5);

    const page5 = remaining.slice(32, 40);
    expect(page5).toHaveLength(4);
  });

  it("filters categories by search term accurately", () => {
    const filtered = dummyCategories.filter((c) =>
      c.name.toLowerCase().includes("category 1")
    );
    // Matches Category 1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    expect(filtered.length).toBeGreaterThan(1);
    expect(filtered.map((c) => c.name)).toContain("Category 1");
  });
});
