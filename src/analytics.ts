export const METRIKA_COUNTER_ID = 112711950;

export const METRIKA_GOALS = {
  rulesOpen: "naglaz_rules_open",
  gameStart: "naglaz_game_start",
  roundComplete: "naglaz_round_complete",
  perfectRound: "naglaz_perfect_round",
  gameComplete: "naglaz_game_complete",
  gameRestart: "naglaz_game_restart",
} as const;

export type MetrikaGoal = (typeof METRIKA_GOALS)[keyof typeof METRIKA_GOALS];
export type MetrikaParams = Record<string, string | number | boolean>;

type MetrikaFunction = {
  (...args: unknown[]): void;
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: MetrikaFunction;
  }
}

const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_COUNTER_ID}`;

export function initMetrika() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (!window.ym) {
    const queued: MetrikaFunction = (...args: unknown[]) => {
      (queued.a ??= []).push(args);
    };
    queued.l = Date.now();
    window.ym = queued;
  }

  if (![...document.scripts].some((script) => script.src === TAG_URL)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = TAG_URL;
    document.scripts[0]?.parentNode?.insertBefore(script, document.scripts[0]);
  }

  window.ym(METRIKA_COUNTER_ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

export function reachGoal(goal: MetrikaGoal, params?: MetrikaParams) {
  window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, params);
}
