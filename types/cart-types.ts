import { CarType } from "./car-types";

export type CartItem = {
  id: string;
  car: CarType;
  quantity: number;
  isSelected: boolean;
};

export type CartStore = {
  items: CartItem[];
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  addItem: (car: CarType) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelect: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
};

