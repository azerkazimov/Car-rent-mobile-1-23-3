import { CarType } from "@/types/car-types";
import { CartItem, CartStore } from "@/types/cart-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { create } from "zustand";

const CART_STORAGE_KEY = "cart_items";

// Helper function to save items to AsyncStorage
const saveToStorage = async (items: CartItem[]) => {
    try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error("Error saving cart to storage:", error);
    }
};

// Helper function to load items from AsyncStorage
const loadFromStorage = async (): Promise<CartItem[]> => {
    try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        return [];
    }
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isSelected: false,
    
    setIsSelected: (isSelected: boolean) => {
        set({ isSelected: isSelected });
    },

    addItem: (car: CarType) => {
        const items = get().items;
        const existingItem = items.find((item) => item.car.id === car.id);

        if (existingItem) {
            const updatedItems = items.map((item) =>
                item.car.id === car.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            set({ items: updatedItems });
            saveToStorage(updatedItems);
        } else {
            const newItem: CartItem = {
                id: uuid.v4() as string,
                car,
                quantity: 1,
                isSelected: get().isSelected,
            };
            const updatedItems = [...items, newItem];
            set({ items: updatedItems });
            saveToStorage(updatedItems);
        }
    },

    removeItem: (id: string) => {
        const updatedItems = get().items.filter((item) => item.id !== id);
        set({ items: updatedItems });
        saveToStorage(updatedItems);
    },

    updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        const updatedItems = get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        saveToStorage(updatedItems);
    },

    toggleSelect: (id: string) => {
        const updatedItems = get().items.map((item) =>
            item.id === id ? { ...item, isSelected: !item.isSelected } : item
        );
        set({ items: updatedItems });
        saveToStorage(updatedItems);
    },

    clearCart: () => {
        set({ items: [] });
        saveToStorage([]);
    },

    getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.car.pricePerDay * item.quantity, 0);
    },

    getTotalItems: () => {
        return get().items.length;
    },
}));

// Initialize the store with data from AsyncStorage
loadFromStorage().then((items) => {
    useCartStore.setState({ items });
});

