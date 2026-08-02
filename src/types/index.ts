// All shared types live here

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category:
    | "Raw Material"
    | "Components"
    | "Packaging"
    | "Electrical"
    | "Chemicals"
    | "Machinery"
    | "Other";
  company_id: string;
  is_active: boolean;
  created_at: string;
}

export type RFQStatus = "draft" | "sent" | "comparing" | "closed" | "deleted";

export interface RFQParsedData {
  product_name?: string;
  quantity?: string | number;
  unit?: string;
  specifications?: string[];
  delivery_location?: string;
  special_requirements?: string;
  deleted_at?: string;
  [key: string]: unknown;
}

export interface RFQ {
  id: string;
  company_id: string;
  title: string;
  raw_text?: string | null;
  parsed_data?: RFQParsedData | Record<string, any> | null;
  status: RFQStatus;
  deadline?: string | null;
  vendors_contacted: number;
  quotes_received: number;
  created_at: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
  deleted_at?: string | null;
}

export interface GeminiResponse {
  productName: string;
  quantity: string;
  unit: string;
  specifications: string[];
  deliveryDeadline: string;
  deliveryLocation: string;
  specialRequirements: string;
}

