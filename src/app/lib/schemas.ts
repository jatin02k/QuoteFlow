import z from "zod";

export const VendorSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  category: z.enum(
    [
      "Raw Material",
      "Components",
      "Packaging",
      "Electrical",
      "Chemicals",
      "Machinery",
      "Other",
    ],
    { message: "Select a valid category" },
  ),
});

export type VendorInput = z.infer<typeof VendorSchema>
