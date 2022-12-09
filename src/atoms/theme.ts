import { atom } from "jotai";

export const themeAtom = atom<string>(
  localStorage ? localStorage.getItem("theme") : ""
);
