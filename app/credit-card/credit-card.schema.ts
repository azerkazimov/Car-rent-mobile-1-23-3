import { z } from "zod";

const currentYear = new Date().getFullYear().toString().slice(-2);
const currentMonth = new Date().getMonth() + 1;

export const creditCardSchema = z.object({
    cardNumber: z
        .string()
        .transform((val) => val.replace(/\s+/g, "")) // убираем пробелы
        .refine((val) => /^\d{16}$/.test(val), {
            message: "Card number must be 16 digits",
        }),

    expirationDate: z.object({
        month: z.string().min(1, "Month is required"),
        year: z.string().min(1, "Year is required"),
    }).refine((val) => {
        const monthNum = parseInt(val.month, 10);
        const yearNum = parseInt(val.year, 10);
        
        // Check if month and year are valid numbers
        if (isNaN(monthNum) || isNaN(yearNum)) return false;
        
        // Check month range
        if (monthNum < 1 || monthNum > 12) return false;
        
        // Check if year is not in the past
        if (yearNum < parseInt(currentYear, 10)) return false;
        
        // If current year, check if month is not in the past
        if (yearNum === parseInt(currentYear, 10) && monthNum < currentMonth) return false;
        
        return true;
    }, {
        message: "Invalid expiration date. Please check month (MM) and year (YY)",
    }),

    ccv: z
        .string()
        .refine((val) => /^\d{3}$/.test(val), {
            message: "CCV must be 3 digits",
        }),
});


export type CreditCardSchema = z.infer<typeof creditCardSchema>;