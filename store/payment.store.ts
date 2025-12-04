import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const PAYMENT_STORAGE_KEY = "payment_method";

// Helper function to save payment method to AsyncStorage
const savePaymentToStorage = async (method: string | null) => {
    try {
        if (method) {
            await AsyncStorage.setItem(PAYMENT_STORAGE_KEY, method);
        } else {
            await AsyncStorage.removeItem(PAYMENT_STORAGE_KEY);
        }
    } catch (error) {
        console.error("Error saving payment method to storage:", error);
    }
};

// Helper function to load payment method from AsyncStorage
const loadPaymentFromStorage = async (): Promise<string | null> => {
    try {
        const stored = await AsyncStorage.getItem(PAYMENT_STORAGE_KEY);
        return stored;
    } catch (error) {
        console.error("Error loading payment method from storage:", error);
        return null;
    }
};

export interface PaymentStore {
    selectedPayment: string | null;
    setSelectedPayment: (method: string) => void;
}

export const usePaymentStore = create<PaymentStore>((set)=>({
    selectedPayment: null,
    setSelectedPayment: (method: string)=>{
        set({selectedPayment: method});
        savePaymentToStorage(method);
    }
}));

// Initialize the store with data from AsyncStorage
loadPaymentFromStorage().then((method) => {
    if (method) {
        usePaymentStore.setState({ selectedPayment: method });
    }
});