import { CarType } from "@/types/car-types";
import { create } from "zustand";

export type CartItem = {
  car: CarType;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addOne: (car: CarType, quantity?: number) => void;
  removeOne: (carId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addOne: (car: CarType, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.car.id === car.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.car.id === car.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { car, quantity }],
      };
    }),
  removeOne: (carId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.car.id !== carId),
    })),
  clear: () => set({ items: [] }),
}));
