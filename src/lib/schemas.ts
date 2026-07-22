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

export type VendorInput = z.infer<typeof VendorSchema>;

export const RFQSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title cannot exceed 200 characters"),
  raw_text: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  parsed_data: z.record(z.string(), z.any()).optional().nullable(),
});

export type RFQInput = z.infer<typeof RFQSchema>;
