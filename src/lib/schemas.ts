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

export const QuoteSchema = z.object({
  unit_price: z.number().min(0.01, "Unit price must be at least ₹0.01"),
  quantity_available: z.number().min(1, "Quantity available must be at least 1"),
  lead_time_days: z.number().min(1, "Lead time must be at least 1 day"),
  payment_terms: z.enum(["Advance", "Net 30", "Net 45", "Net 60"], {
    message: "Select valid payment terms",
  }),
  valid_until: z.string().min(1, "Valid until date is required"),
  notes: z.string().optional().nullable(),
});

export type QuoteInput = z.infer<typeof QuoteSchema>;

