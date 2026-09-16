import { describe, it, expect, vi, afterEach } from "vitest";
import {
  score,
  meters,
  errorLabel,
  clamp,
  shuffle,
  MIN_RATIO,
  MAX_RATIO,
  readBest,
  saveBest,
} from "../src/game";
import { objects, pairs, chooseRounds } from "../src/data";
describe("scoring", () => {
  it("preserves meaningful centimetres for small objects", () => {
    expect(meters(3.05)).toBe("3,05 м");
    expect(meters(8.38)).toBe("8,38 м");
    expect(meters(146.6)).toBe("146,6 м");
  });
  it("gives exact and tolerant hits full marks", () => {
    expect(score(100, 100)).toBe(100);
    expect(score(101.9, 100)).toBe(100);
  });
  it("treats reciprocal errors equally", () => {
    for (const factor of [1.03, 1.1, 1.5, 2, 5])
      expect(score(100 * factor, 100)).toBe(score(100 / factor, 100));
  });
  it("rejects invalid measurements", () => {
    for (const n of [0, -1, NaN, Infinity]) expect(score(n, 100)).toBe(0);
  });
  it("gets smaller as the error grows", () => {
    let previous = 100;
    for (let ratio = 1.02; ratio <= 5; ratio += 0.01) {
      const n = score(100 * ratio, 100);
      expect(n).toBeLessThanOrEqual(previous);
      expect(n).toBeGreaterThanOrEqual(0);
      previous = n;
    }
  });
  it("shows correct direction and russian decimal", () => {
    expect(errorLabel(150, 100)).toBe("На 50% больше");
    expect(errorLabel(50, 100)).toBe("На 50% меньше");
    expect(errorLabel(100, 100)).toBe("Размер совпал");
  });
});
describe("catalogue", () => {
  it("has fourteen objects and twenty-two reachable pairs", () => {
    expect(Object.keys(objects)).toHaveLength(14);
    expect(pairs).toHaveLength(22);
    expect(new Set(pairs.map((p) => p.id)).size).toBe(pairs.length);
    for (const p of pairs) {
      const r = objects[p.reference],
        t = objects[p.target];
      expect(r.axis).toBe(t.axis);
      expect(t.size / r.size).toBeGreaterThan(MIN_RATIO);
      expect(t.size / r.size).toBeLessThan(MAX_RATIO);
      expect(t.source.startsWith("https://")).toBe(true);
    }
  });
  it("shuffles without mutating or repeating", () => {
    const before = pairs.map((p) => p.id);
    const out = shuffle(pairs);
    expect(pairs.map((p) => p.id)).toEqual(before);
    expect(new Set(out.map((p) => p.id)).size).toBe(pairs.length);
  });
  it("creates varied sessions without repeated targets", () => {
    for (let i = 0; i < 100; i++) {
      const rounds = chooseRounds();
      expect(rounds).toHaveLength(5);
      expect(new Set(rounds.map((p) => p.target)).size).toBe(5);
      expect(
        rounds.filter((p) => objects[p.reference].axis === "x"),
      ).toHaveLength(2);
    }
  });
  it("clamps gesture values", () => {
    expect(clamp(-1)).toBe(MIN_RATIO);
    expect(clamp(3)).toBe(MAX_RATIO);
  });
});
afterEach(() => vi.unstubAllGlobals());
describe("local record", () => {
  it("ignores corrupt storage and out of range scores", () => {
    for (const value of ["bad", '{"best":900}', '{"best":"30"}', "null"]) {
      vi.stubGlobal("localStorage", { getItem: () => value });
      expect(readBest()).toBe(0);
    }
  });
  it("works when storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw Error();
      },
      setItem: () => {
        throw Error();
      },
    });
    expect(readBest()).toBe(0);
    expect(saveBest(200)).toBe(false);
  });
  it("reads a valid saved record", () => {
    vi.stubGlobal("localStorage", { getItem: () => '{"best":387}' });
    expect(readBest()).toBe(387);
  });
});
