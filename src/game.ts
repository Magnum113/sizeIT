export const MIN_RATIO = 0.15;
export const MAX_RATIO = 1.65;
export const ROUND_COUNT = 5;
export function clamp(value: number, min = MIN_RATIO, max = MAX_RATIO) {
  return Math.max(min, Math.min(max, value));
}
export function score(guess: number, actual: number) {
  if (
    !Number.isFinite(guess) ||
    !Number.isFinite(actual) ||
    guess <= 0 ||
    actual <= 0
  )
    return 0;
  const factor = Math.max(guess / actual, actual / guess);
  return factor <= 1.02 ? 100 : Math.round(100 / factor ** 2);
}
export function errorLabel(guess: number, actual: number) {
  if (score(guess, actual) === 100) return "Размер совпал";
  const error = (guess / actual - 1) * 100;
  return `На ${Math.abs(error).toLocaleString("ru-RU", { maximumFractionDigits: 1 })}% ${error > 0 ? "больше" : "меньше"}`;
}
export function meters(n: number) {
  return `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} м`;
}
export function shuffle<T>(items: readonly T[], random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export type Result = { pairId: string; guess: number; points: number };
export function readBest(): number {
  try {
    const value = JSON.parse(localStorage.getItem("na-glaz:v1") || "null");
    return Number.isInteger(value?.best) && value.best >= 0 && value.best <= 500
      ? value.best
      : 0;
  } catch {
    return 0;
  }
}
export function saveBest(best: number) {
  try {
    localStorage.setItem("na-glaz:v1", JSON.stringify({ best }));
    return true;
  } catch {
    return false;
  }
}
