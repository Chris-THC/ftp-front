import { create } from "zustand";

type Store = {
  numControlByUser: string;
  setNumControlByUser: (num: string) => void;
  // perfilNumControl: string; 
  // setPerfilNumControl: (num: string) => void; 
};

export const useStoreNumControlByUser = create<Store>()((set) => ({
  numControlByUser: "",
  setNumControlByUser: (num: string) => set(() => ({ numControlByUser: num })),

  // perfilNumControl: "",
  // setPerfilNumControl: (num: string) => set(() => ({ perfilNumControl: num })),
}));
