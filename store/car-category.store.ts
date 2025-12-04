import { CarCategoryEnum } from "@/types/car-types";
import { create } from "zustand";

interface CarCategoryStore {
    selectedCategory: CarCategoryEnum;
    setSelectedCategory: (category: CarCategoryEnum) => void;
}

export const useCarCategoryStore = create<CarCategoryStore>((set) => ({
    selectedCategory: CarCategoryEnum.ALL,
    setSelectedCategory: (category: CarCategoryEnum) => set({ selectedCategory: category }),
}));