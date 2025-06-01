import { create } from "zustand";

type Store = {
  numControlByUser: string;
  setNumControlByUser: (num: string) => void;
};

export const useStoreNumControlByUser = create<Store>()((set) => ({
  numControlByUser: "",
  setNumControlByUser: (num: string) => set(() => ({ numControlByUser: num })),
}));
