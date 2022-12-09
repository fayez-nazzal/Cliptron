import { atom } from "jotai";

export const autostartAtom = atom<boolean>(
  localStorage ? localStorage.getItem("auto_start") === "true" : true
);
