import { create } from "zustand";

type Store = {
  userFullPath: string;
  setUserFullPath: (path: string) => void;
};

export const useStoreFullPath = create<Store>()((set) => ({
  userFullPath: "",
  setUserFullPath: (path: string) => set(() => ({ userFullPath: path })),
}));
