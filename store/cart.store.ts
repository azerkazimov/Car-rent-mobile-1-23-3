import { CarType } from "@/types/car-types";
import { create } from "zustand";

type CartLastSelected = {
  car: CarType;
  quantity: number;
};

type CartStore = {
  count: number;
  totalQuantity: number;
  lastSelected?: CartLastSelected | null;
  addOne: (car: CarType, quantity?: number) => void;
  removeOne: () => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  count: 0,
  totalQuantity: 0,
  lastSelected: null,
  addOne: (car: CarType, quantity = 1) =>
    set((state) => ({
      count: state.count + 1,
      totalQuantity: state.totalQuantity + quantity,
      lastSelected: { car, quantity },
    })),
  removeOne: () =>
    set((state) => {
      const newTotalQuantity = Math.max(0, state.totalQuantity - 1);
      const next = Math.max(0, state.count - 1);
      return {
        count: next,
        totalQuantity: newTotalQuantity,
        lastSelected: next === 0 ? null : state.lastSelected,
      };
    }),
  clear: () => set({ count: 0, totalQuantity: 0, lastSelected: null }),
}));
