describe("CHAT_ENABLED", () => {
  const load = (value?: string) => {
    jest.resetModules();
    if (value === undefined) delete process.env.NEXT_PUBLIC_CHAT_ENABLED;
    else process.env.NEXT_PUBLIC_CHAT_ENABLED = value;
    return require("@/lib/featureFlags").CHAT_ENABLED as boolean;
  };

  it("is off by default (chat and the socket stay disabled)", () => {
    expect(load()).toBe(false);
    expect(load("")).toBe(false);
    expect(load("false")).toBe(false);
  });

  it("turns on only with the exact string 'true'", () => {
    expect(load("true")).toBe(true);
    expect(load("1")).toBe(false);
  });
});
