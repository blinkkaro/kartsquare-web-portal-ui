import reducer, {
  broadcastingChanged,
  consentGranted,
  consentPromptClosed,
  consentPromptOpened,
  consentRevoked,
  errorCleared,
  fetchLiveLocationStatus,
  setLiveLocationMode,
} from "@/features/ui/liveLocationSlice";
import type { LiveLocationStatus } from "@/services/liveLocation/liveLocationInterface";

const initial = reducer(undefined, { type: "@@INIT" });

const status = (over: Partial<LiveLocationStatus> = {}): LiveLocationStatus => ({
  mode: "LIVE",
  is_broadcasting: true,
  latitude: 19.076,
  longitude: 72.8777,
  accuracy_m: 10,
  area_label: "Dadar",
  recorded_at: "2026-08-17T10:00:00.000Z",
  expires_at: "2026-08-17T10:10:00.000Z",
  expires_in_seconds: 600,
  live_radius_km: 10,
  ...over,
});

describe("initial state", () => {
  it("defaults to STATIC and not broadcasting", () => {
    expect(initial.mode).toBe("STATIC");
    expect(initial.isBroadcasting).toBe(false);
    expect(initial.hasConsented).toBe(false);
  });
});

describe("broadcastingChanged", () => {
  it("sets broadcasting on", () => {
    const s = reducer(initial, broadcastingChanged(true));
    expect(s.isBroadcasting).toBe(true);
  });

  it("clears the expiry when broadcasting stops", () => {
    const live = { ...initial, isBroadcasting: true, expiresAt: "2026-01-01" };
    const s = reducer(live, broadcastingChanged(false));
    expect(s.isBroadcasting).toBe(false);
    // A stale countdown after going offline would misreport the state.
    expect(s.expiresAt).toBeNull();
  });
});

describe("consent", () => {
  it("granting consent closes the prompt", () => {
    const opened = reducer(initial, consentPromptOpened());
    expect(opened.consentPromptOpen).toBe(true);

    const s = reducer(opened, consentGranted());
    expect(s.hasConsented).toBe(true);
    expect(s.consentPromptOpen).toBe(false);
  });

  it("declining closes the prompt without granting", () => {
    const opened = reducer(initial, consentPromptOpened());
    const s = reducer(opened, consentPromptClosed());
    expect(s.consentPromptOpen).toBe(false);
    expect(s.hasConsented).toBe(false);
  });

  it("revoking consent also stops broadcasting and reverts to STATIC", () => {
    const live = {
      ...initial,
      hasConsented: true,
      isBroadcasting: true,
      mode: "LIVE" as const,
      expiresAt: "2026-01-01",
    };
    const s = reducer(live, consentRevoked());
    // Revoking must actually stop the broadcast, not merely hide the UI.
    expect(s.hasConsented).toBe(false);
    expect(s.isBroadcasting).toBe(false);
    expect(s.mode).toBe("STATIC");
    expect(s.expiresAt).toBeNull();
  });
});

describe("fetchLiveLocationStatus", () => {
  it("applies a fulfilled status", () => {
    const s = reducer(initial, {
      type: fetchLiveLocationStatus.fulfilled.type,
      payload: status(),
    });
    expect(s.mode).toBe("LIVE");
    expect(s.isBroadcasting).toBe(true);
    expect(s.areaLabel).toBe("Dadar");
    expect(s.liveRadiusKm).toBe(10);
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it("sets loading while pending", () => {
    const s = reducer(initial, { type: fetchLiveLocationStatus.pending.type });
    expect(s.loading).toBe(true);
  });

  it("records the error and clears loading on rejection", () => {
    const s = reducer(initial, {
      type: fetchLiveLocationStatus.rejected.type,
      payload: "network down",
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe("network down");
  });

  it("does not leave a stale broadcast flag when the server says STATIC", () => {
    const live = { ...initial, isBroadcasting: true, mode: "LIVE" as const };
    const s = reducer(live, {
      type: fetchLiveLocationStatus.fulfilled.type,
      payload: status({ mode: "STATIC", is_broadcasting: false, expires_at: null }),
    });
    // The server is authoritative: a lease that lapsed while the tab slept
    // must clear the local flag.
    expect(s.isBroadcasting).toBe(false);
    expect(s.mode).toBe("STATIC");
  });
});

describe("setLiveLocationMode", () => {
  it("applies the returned status", () => {
    const s = reducer(initial, {
      type: setLiveLocationMode.fulfilled.type,
      payload: status(),
    });
    expect(s.mode).toBe("LIVE");
    expect(s.isBroadcasting).toBe(true);
  });

  it("surfaces a rejection", () => {
    const s = reducer(initial, {
      type: setLiveLocationMode.rejected.type,
      payload: "forbidden",
    });
    expect(s.error).toBe("forbidden");
    expect(s.loading).toBe(false);
  });
});

describe("errorCleared", () => {
  it("clears a previous error", () => {
    const withError = { ...initial, error: "boom" };
    expect(reducer(withError, errorCleared()).error).toBeNull();
  });
});
