import reducer, { openAiNewChat, openAiWithQuery, setAiOpen, setInlineAiVisible } from "@/features/ui/uiSlice";

const initial = reducer(undefined, { type: "init" });

describe("uiSlice: assistant entry points", () => {
  it("starts with no inline assistant on screen", () => {
    expect(initial.inlineAiVisible).toBe(false);
  });

  it("tracks whether an inline Kart AI entry is visible, so the floating button can step aside", () => {
    const shown = reducer(initial, setInlineAiVisible(true));
    expect(shown.inlineAiVisible).toBe(true);
    expect(reducer(shown, setInlineAiVisible(false)).inlineAiVisible).toBe(false);
  });

  it("opens the real assistant with a query to run", () => {
    const next = reducer(initial, openAiWithQuery("Geyser nahi chal raha hai"));
    expect(next.isAiOpen).toBe(true);
    expect(next.aiPendingQuery).toBe("Geyser nahi chal raha hai");
  });

  it("leaves the inline flag alone when the assistant opens or closes", () => {
    const next = reducer(reducer(initial, setInlineAiVisible(true)), setAiOpen(true));
    expect(next.inlineAiVisible).toBe(true);
  });
});

describe("uiSlice: a new Kart AI conversation", () => {
  it("opens the assistant, clears any query waiting to run, and signals a fresh chat", () => {
    const waiting = reducer(initial, openAiWithQuery("AC repair"));
    const next = reducer(waiting, openAiNewChat());
    expect(next.isAiOpen).toBe(true);
    expect(next.aiPendingQuery).toBeNull();
    expect(next.aiNewChat).toBe(1);
  });

  it("gives every request its own value, so each one starts the chat over", () => {
    const twice = reducer(reducer(initial, openAiNewChat()), openAiNewChat());
    expect(twice.aiNewChat).toBe(2);
  });

  it("leaves the chat alone when the assistant is simply opened", () => {
    expect(reducer(initial, setAiOpen(true)).aiNewChat).toBe(0);
  });
});
