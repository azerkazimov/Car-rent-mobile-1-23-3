export enum CarCategoryEnum {
    LUXURY = "luxury",
    FAMILY = "family",
    CHEAP = "cheap",
}

export type CarCategory = CarType & {
    categories: string[];
}

export type CarType = {
    id: string;
    brand: string;
    brandSlug: string;
    model: string;
    year: number;
    type: string;
    seats: number;
    transmission: string;
    fuelType: string;
    pricePerDay: number;
    image: string;
    features: string[];
    categories: string[];
}

export type CarCategoryStore ={
    carCategory: CarCategory[];
    setCarCategory: (carCategory: CarCategory[]) => void;
}