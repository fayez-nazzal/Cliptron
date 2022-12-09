import { atom } from "jotai";

export const themeAtom = atom<string>(
  typeof localStorage !== "undefined" ? localStorage.getItem("theme") : ""
);
