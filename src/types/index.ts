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

export interface AIRecommendationData {
  recommended_vendor_id: string;
  recommended_vendor_name: string;
  reasoning: string;
  confidence_score: number;
  key_trade_offs: string[];
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
  recommendation?: AIRecommendationData | Record<string, any> | null;
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

export interface Quote {
  id: string;
  rfq_vendor_id: string;
  unit_price: number;
  quantity_available: number;
  lead_time_days: number;
  payment_terms: string;
  valid_until: string;
  notes?: string | null;
  created_at: string;
  total_cost?: number;
}

export interface RFQVendorWithDetails {
  id: string;
  rfq_id: string;
  vendor_id: string;
  token: string;
  status: "pending" | "submitted" | "sent" | string;
  email_sent_at: string | null;
  created_at?: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    category?: string;
  };
  quote?: Quote | null;
}

export interface RFQComparisonData {
  rfq: {
    id: string;
    company_id: string;
    title: string;
    status: RFQStatus;
    item_name: string;
    quantity: number | string;
    unit?: string;
    deadline?: string | null;
    raw_text?: string | null;
    parsed_data?: RFQParsedData | Record<string, any> | null;
    recommendation?: AIRecommendationData | Record<string, any> | null;
    attachment_url?: string | null;
    attachment_name?: string | null;
    vendors_contacted: number;
    quotes_received: number;
    created_at: string;
  };
  vendors: RFQVendorWithDetails[];
  lowestUnitPrice: number | null;
}
