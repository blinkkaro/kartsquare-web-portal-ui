/**
 * Per-city personality for the homepage. Jaipur is the launch market; any city
 * without an entry falls back to neutral copy, so nothing here is hard-wired to one city.
 * Captions are brand voice only - no statistics or claims about supply.
 */
export interface CityTheme {
  /** e.g. "The Pink City" */
  nickname: string;
  /** Local-script nickname */
  nicknameLocal?: string;
  /** Hinglish one-liner shown as the hero caption */
  caption: string;
  /** Two-stop accent used for hero glow and highlights */
  accent: [string, string];
}

const THEMES: Record<string, CityTheme> = {
  Jaipur: {
    nickname: "The Pink City",
    nicknameLocal: "गुलाबी नगरी",
    caption: "Jaipur ki har zarurat, ek jagah.",
    accent: ["#ff8fb1", "#c084fc"],
  },
};

const NEUTRAL: CityTheme = {
  nickname: "",
  caption: "",
  accent: ["#c084fc", "#8b5cf6"],
};

export const getCityTheme = (city: string): CityTheme => THEMES[city] ?? NEUTRAL;
