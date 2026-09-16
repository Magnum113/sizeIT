import { describe, it, expect } from "vitest";
import { objects, pairs } from "../src/data";
import { MIN_RATIO, MAX_RATIO } from "../src/game";
import { resultLayout } from "../src/resultLayout";

describe("result comparison", () => {
  it("keeps every pair and both dimension guides inside desktop and mobile scenes", () => {
    for (const width of [420, 840])
      for (const pair of pairs) {
        const ref = objects[pair.reference],
          target = objects[pair.target];
        const actualRatio = target.size / ref.size;
        for (const ratio of [
          MIN_RATIO,
          MAX_RATIO,
          actualRatio,
          actualRatio * 0.99,
        ]) {
          const layout = resultLayout(ref, target, ratio, width);
          const referenceLeft =
            layout.referenceCenter - (ref.width * layout.scale) / 2;
          const referenceRight =
            layout.referenceCenter + (ref.width * layout.scale) / 2;
          expect(referenceLeft).toBeGreaterThanOrEqual(20);
          expect(referenceRight + 12).toBeLessThan(layout.targetX - 12);
          // The score card ends at y=153; the reference must stay below it.
          expect(320 - ref.height * layout.scale).toBeGreaterThanOrEqual(
            165 - 1e-8,
          );
          for (const scale of [layout.guessScale, layout.answerScale]) {
            expect(
              layout.guessX + target.width * scale + 12,
            ).toBeLessThanOrEqual(width - 20);
            expect(320 - target.height * scale - 12).toBeGreaterThanOrEqual(
              48 - 1e-8,
            );
          }
        }
      }
  });
  it("preserves the true ratio for the very large rocket guess in the reported bug", () => {
    const layout = resultLayout(
      objects.eiffel,
      objects.rocket,
      522.2 / 330,
      840,
    );
    expect(layout.guessScale / layout.answerScale).toBeCloseTo(522.2 / 70);
    expect(70 * layout.answerScale).toBeGreaterThan(30);
    expect(
      layout.guessX -
        (layout.targetX + objects.rocket.width * layout.answerScale),
    ).toBeGreaterThanOrEqual(20 - 1e-8);
  });
  it("uses equal sizes for an exact answer", () => {
    for (const pair of pairs) {
      const ref = objects[pair.reference],
        target = objects[pair.target];
      const layout = resultLayout(ref, target, target.size / ref.size, 420);
      expect(layout.guessScale).toBeCloseTo(layout.answerScale);
    }
  });
});
