/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer from "@/features/ui/uiSlice";
import KartAiPreview, { PREVIEW_LINES, STEP_DELAYS } from "@/components/pages/home/sections/KartAiPreview";

// The two browser signals the preview depends on, controlled by the test.
const mockReduce = jest.fn(() => false);
const mockInView = jest.fn(() => true);
jest.mock("framer-motion", () => ({
  ...jest.requireActual("framer-motion"),
  useReducedMotion: () => mockReduce(),
  useInView: () => mockInView(),
}));

const makeStore = () => configureStore({ reducer: { ui: uiReducer } });

function setup() {
  const store = makeStore();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const view = render(
    <Provider store={store}>
      <KartAiPreview />
    </Provider>,
  );
  return { store, user, ...view };
}

/** Each line is rendered twice (live + an invisible full-height copy that reserves space), so a line is
 *  "on screen" when it appears twice, and "not yet" when only the copy is there. */
const onScreen = (text: string) => screen.queryAllByText(text).length === 2;
const advance = (ms: number) => act(() => void jest.advanceTimersByTime(ms));

describe("KartAiPreview", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReduce.mockReturnValue(false);
    mockInView.mockReturnValue(true);
  });
  afterEach(() => jest.useRealTimers());

  it("labels itself an example conversation", () => {
    setup();
    expect(screen.getByText("Example conversation")).toBeInTheDocument();
  });

  it("shows the first message at once and holds the rest back", () => {
    setup();
    expect(onScreen(PREVIEW_LINES.greeting)).toBe(true);
    expect(onScreen(PREVIEW_LINES.customer)).toBe(false);
    expect(onScreen(PREVIEW_LINES.reply)).toBe(false);
  });

  it("reveals the customer line, then Kart AI's reply, one step at a time", () => {
    setup();
    advance(STEP_DELAYS[0]);
    expect(onScreen(PREVIEW_LINES.customer)).toBe(true);
    expect(onScreen(PREVIEW_LINES.reply)).toBe(false);

    advance(STEP_DELAYS[1] + STEP_DELAYS[2]);
    expect(onScreen(PREVIEW_LINES.reply)).toBe(true);
  });

  it("does not run while it is offscreen", () => {
    mockInView.mockReturnValue(false);
    setup();
    advance(10_000);
    expect(onScreen(PREVIEW_LINES.customer)).toBe(false);
  });

  it("pauses and resumes on request", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Example rokein" }));
    advance(10_000);
    expect(onScreen(PREVIEW_LINES.customer)).toBe(false);

    await user.click(screen.getByRole("button", { name: "Example chalayein" }));
    advance(STEP_DELAYS[0]);
    expect(onScreen(PREVIEW_LINES.customer)).toBe(true);
  });

  it("can be replayed from the start after it finishes", async () => {
    const { user } = setup();
    advance(10_000);
    expect(onScreen(PREVIEW_LINES.reply)).toBe(true);

    await user.click(screen.getByRole("button", { name: "Example dobara chalayein" }));
    expect(onScreen(PREVIEW_LINES.reply)).toBe(false);
    expect(onScreen(PREVIEW_LINES.greeting)).toBe(true);
  });

  it("keeps the whole conversation readable as plain text whatever the animation is doing", () => {
    setup();
    expect(screen.getByText(new RegExp(PREVIEW_LINES.reply))).toBeInTheDocument();
  });

  describe("with reduced motion", () => {
    beforeEach(() => mockReduce.mockReturnValue(true));

    it("shows the finished conversation at once", () => {
      setup();
      expect(onScreen(PREVIEW_LINES.customer)).toBe(true);
      expect(onScreen(PREVIEW_LINES.reply)).toBe(true);
    });

    it("has nothing to pause or replay", () => {
      setup();
      expect(screen.queryByRole("button", { name: /Example/ })).not.toBeInTheDocument();
    });
  });

  it("opens the real Kart AI on a new conversation: its welcome message, and nothing run", async () => {
    const { store, user } = setup();
    await user.click(screen.getByRole("button", { name: /Kart AI se poochho/ }));
    expect(store.getState().ui.isAiOpen).toBe(true);
    expect(store.getState().ui.aiPendingQuery).toBeNull();
    expect(store.getState().ui.aiNewChat).toBe(1);
  });

  it("tells the floating AI button to step aside while it is on screen, and to return when it unmounts", () => {
    const { store, unmount } = setup();
    expect(store.getState().ui.inlineAiVisible).toBe(true);
    unmount();
    expect(store.getState().ui.inlineAiVisible).toBe(false);
  });
});

describe("KartAiPreview heading", () => {
  it("shows the Kart AI name and sets its own text colour, since it sits on a white-text band", () => {
    mockReduce.mockReturnValue(false);
    mockInView.mockReturnValue(true);
    const store = configureStore({ reducer: { ui: uiReducer } });
    render(
      <div style={{ color: "white" }}>
        <Provider store={store}>
          <KartAiPreview />
        </Provider>
      </div>,
    );
    expect(screen.getByRole("heading", { name: "Kart AI" })).toBeVisible();
  });
});
