import { stripMarkdown } from "@/utils/plainText";

describe("stripMarkdown", () => {
  it("removes bold markers and keeps the words", () => {
    expect(stripMarkdown("We specialize in **laptop and computer repair**")).toBe("We specialize in laptop and computer repair");
    expect(stripMarkdown("**Aijaz Electrical Services – Jaipur**")).toBe("Aijaz Electrical Services – Jaipur");
  });
  it("handles italics, headings, code and list markers", () => {
    expect(stripMarkdown("*fast* service")).toBe("fast service");
    expect(stripMarkdown("## Services\n- AC repair\n- Geyser")).toBe("Services\n• AC repair\n• Geyser");
    expect(stripMarkdown("call `now`")).toBe("call now");
  });
  it("leaves a lone asterisk and plain text alone", () => {
    expect(stripMarkdown("5 * 3 = 15")).toBe("5 * 3 = 15");
    expect(stripMarkdown("Plain text")).toBe("Plain text");
  });
  it("is safe on empty input", () => {
    expect(stripMarkdown(null)).toBe("");
    expect(stripMarkdown(undefined)).toBe("");
  });
});
