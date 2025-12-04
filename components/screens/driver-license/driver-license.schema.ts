import { z } from "zod";

export const driverLicenseSchema = z.object({
    driverLicenseNumber: z.string().min(1).max(10).regex(/^[0-9]+$/, { message: "Driver License Number must be a number" }),
    driverLicenseExpirationDate: z.string().min(1).regex(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, { message: "Driver License Expiration Date must be in the format MM/DD/YYYY" }),
    driverLicenseImage: z.string().min(1).url({ message: "Driver License Image must be a valid URL" }),
});

export type DriverLicenseSchema = z.infer<typeof driverLicenseSchema>;