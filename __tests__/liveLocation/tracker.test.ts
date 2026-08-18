import {
  LocationTracker,
  describeGeolocationError,
  distanceMeters,
} from "@/lib/liveLocation/tracker";

const T0 = Date.parse("2026-08-17T10:00:00.000Z");
const MUMBAI = { latitude: 19.076, longitude: 72.8777 };

function reading(over: Partial<Parameters<LocationTracker["offer"]>[0]> = {}) {
  return {
    ...MUMBAI,
    accuracy: 10,
    heading: null,
    speed: null,
    timestamp: T0,
    ...over,
  };
}

/** Moves ~`m` metres north of Mumbai. 1 degree latitude ≈ 111,195 m. */
const north = (m: number) => ({
  latitude: MUMBAI.latitude + m / 111_195,
  longitude: MUMBAI.longitude,
});

describe("distanceMeters", () => {
  it("returns exactly zero for identical points", () => {
    expect(distanceMeters(MUMBAI, MUMBAI)).toBe(0);
  });

  it("approximates a known northward offset", () => {
    expect(distanceMeters(MUMBAI, north(100))).toBeGreaterThan(99);
    expect(distanceMeters(MUMBAI, north(100))).toBeLessThan(101);
  });
});

describe("LocationTracker — accepting readings", () => {
  it("accepts the first usable reading", () => {
    const t = new LocationTracker();
    expect(t.offer(reading())).toBe("accepted");
    expect(t.size).toBe(1);
  });

  it("stamps the sample with the position's own timestamp, not now()", () => {
    const t = new LocationTracker();
    t.offer(reading({ timestamp: T0 }));
    // A cached fix can be minutes old; overwriting that would hide staleness
    // from the server's validation.
    expect(t.last!.recorded_at).toBe(new Date(T0).toISOString());
  });

  it.each([
    ["NaN latitude", { latitude: NaN }],
    ["Infinite longitude", { longitude: Infinity }],
    ["latitude out of range", { latitude: 91 }],
    ["longitude out of range", { longitude: -181 }],
    ["Null Island", { latitude: 0, longitude: 0 }],
    ["non-finite timestamp", { timestamp: NaN }],
  ])("rejects %s as invalid", (_label, over) => {
    const t = new LocationTracker();
    expect(t.offer(reading(over as never))).toBe("invalid");
    expect(t.size).toBe(0);
  });

  it("accepts a genuine zero on one axis", () => {
    const t = new LocationTracker();
    expect(t.offer(reading({ latitude: 0, longitude: 72.8 }))).toBe("accepted");
  });

  it("drops a reading that is too inaccurate to be worth sending", () => {
    const t = new LocationTracker({ maxAccuracyM: 500 });
    expect(t.offer(reading({ accuracy: 501 }))).toBe("too-inaccurate");
    expect(t.size).toBe(0);
  });

  it("accepts accuracy exactly at the limit", () => {
    const t = new LocationTracker({ maxAccuracyM: 500 });
    expect(t.offer(reading({ accuracy: 500 }))).toBe("accepted");
  });

  it("accepts a reading with no accuracy reported", () => {
    const t = new LocationTracker();
    expect(t.offer(reading({ accuracy: null }))).toBe("accepted");
    expect(t.last!.accuracy_m).toBeNull();
  });

  it("normalises a negative speed to null rather than sending it", () => {
    const t = new LocationTracker();
    t.offer(reading({ speed: -1 }));
    expect(t.last!.speed_mps).toBeNull();
  });

  it("keeps a valid heading and speed", () => {
    const t = new LocationTracker();
    t.offer(reading({ heading: 90, speed: 5.5 }));
    expect(t.last!.heading_deg).toBe(90);
    expect(t.last!.speed_mps).toBe(5.5);
  });
});

describe("LocationTracker — throttling", () => {
  it("suppresses a stationary reading inside the interval", () => {
    const t = new LocationTracker({ minIntervalMs: 60_000, minDisplacementM: 50 });
    t.offer(reading());
    expect(t.offer(reading({ timestamp: T0 + 10_000 }))).toBe("not-moved");
    expect(t.size).toBe(1);
  });

  it("lets a reading through once the interval has elapsed", () => {
    const t = new LocationTracker({ minIntervalMs: 60_000, minDisplacementM: 50 });
    t.offer(reading());
    expect(t.offer(reading({ timestamp: T0 + 60_000 }))).toBe("accepted");
    expect(t.size).toBe(2);
  });

  it("lets movement force a sample through before the interval elapses", () => {
    // A provider driving must not be reported a minute behind where they are.
    const t = new LocationTracker({ minIntervalMs: 60_000, minDisplacementM: 50 });
    t.offer(reading());
    expect(
      t.offer(reading({ ...north(200), timestamp: T0 + 5_000 })),
    ).toBe("accepted");
  });

  it("still suppresses movement below the displacement threshold", () => {
    const t = new LocationTracker({ minIntervalMs: 60_000, minDisplacementM: 50 });
    t.offer(reading());
    expect(
      t.offer(reading({ ...north(10), timestamp: T0 + 5_000 })),
    ).toBe("not-moved");
  });

  it("discards an out-of-order reading", () => {
    const t = new LocationTracker();
    t.offer(reading({ timestamp: T0 }));
    expect(t.offer(reading({ timestamp: T0 - 5_000 }))).toBe("throttled");
    expect(t.size).toBe(1);
  });

  it("discards a duplicate timestamp", () => {
    const t = new LocationTracker();
    t.offer(reading({ timestamp: T0 }));
    expect(t.offer(reading({ timestamp: T0 }))).toBe("throttled");
  });
});

describe("LocationTracker — buffering", () => {
  it("drains everything and empties the buffer", () => {
    const t = new LocationTracker({ minIntervalMs: 0, minDisplacementM: 0 });
    t.offer(reading({ timestamp: T0 }));
    t.offer(reading({ timestamp: T0 + 1_000 }));

    const batch = t.drain();
    expect(batch).toHaveLength(2);
    expect(t.size).toBe(0);
    expect(t.hasPending()).toBe(false);
  });

  it("drops the oldest samples when the cap is exceeded", () => {
    const t = new LocationTracker({
      minIntervalMs: 0,
      minDisplacementM: 0,
      maxBufferSize: 3,
    });
    for (let i = 0; i < 6; i++) {
      t.offer(reading({ timestamp: T0 + i * 1_000 }));
    }
    const batch = t.drain();
    expect(batch).toHaveLength(3);
    expect(t.dropped).toBe(3);
    // Recency matters more than history — the newest must survive.
    expect(batch[batch.length - 1].recorded_at).toBe(
      new Date(T0 + 5_000).toISOString(),
    );
  });

  it("restores a failed batch so positions are not lost", () => {
    const t = new LocationTracker({ minIntervalMs: 0, minDisplacementM: 0 });
    t.offer(reading({ timestamp: T0 }));
    const batch = t.drain();
    expect(t.size).toBe(0);

    t.restore(batch);
    expect(t.size).toBe(1);
    expect(t.hasPending()).toBe(true);
  });

  it("keeps chronological order when a retry races new samples", () => {
    const t = new LocationTracker({ minIntervalMs: 0, minDisplacementM: 0 });
    t.offer(reading({ timestamp: T0 }));
    const failed = t.drain();

    // A new sample arrives while the failed request was in flight.
    t.offer(reading({ timestamp: T0 + 5_000 }));
    t.restore(failed);

    const batch = t.drain();
    expect(batch.map((s) => s.recorded_at)).toEqual([
      new Date(T0).toISOString(),
      new Date(T0 + 5_000).toISOString(),
    ]);
  });

  it("does not grow without bound across repeated failures", () => {
    const t = new LocationTracker({
      minIntervalMs: 0,
      minDisplacementM: 0,
      maxBufferSize: 5,
    });
    for (let round = 0; round < 10; round++) {
      for (let i = 0; i < 5; i++) {
        t.offer(reading({ timestamp: T0 + round * 10_000 + i * 100 }));
      }
      t.restore(t.drain()); // simulate a failed send every round
    }
    expect(t.size).toBeLessThanOrEqual(5);
  });

  it("restoring an empty batch is a no-op", () => {
    const t = new LocationTracker();
    t.restore([]);
    expect(t.size).toBe(0);
    expect(t.dropped).toBe(0);
  });

  it("reset clears the buffer and the throttle reference", () => {
    const t = new LocationTracker({ minIntervalMs: 60_000 });
    t.offer(reading());
    t.reset();

    expect(t.size).toBe(0);
    expect(t.last).toBeNull();
    // With the reference cleared, an immediately-following reading is accepted.
    expect(t.offer(reading({ timestamp: T0 + 1 }))).toBe("accepted");
  });
});

describe("describeGeolocationError", () => {
  it("marks permission denial as terminal — retrying cannot fix it", () => {
    const r = describeGeolocationError(1);
    expect(r.terminal).toBe(true);
    expect(r.message).toMatch(/permission/i);
  });

  it("marks position-unavailable and timeout as retryable", () => {
    expect(describeGeolocationError(2).terminal).toBe(false);
    expect(describeGeolocationError(3).terminal).toBe(false);
  });

  it("handles an unknown code without throwing", () => {
    const r = describeGeolocationError(99);
    expect(r.terminal).toBe(false);
    expect(typeof r.message).toBe("string");
  });
});
