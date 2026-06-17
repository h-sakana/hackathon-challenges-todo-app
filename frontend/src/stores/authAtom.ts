import { atom } from "jotai";

export type LoginUser = {
  id: number;
  name: string;
};

export const loginUserAtom = atom<LoginUser | null>(null);
export const isAuthCheckingAtom = atom(true);
