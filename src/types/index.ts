// All shared types live here

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: "Raw Material" | "Components" | "Packaging" | "Electrical" | "Chemicals" | "Machinery" | "Other";
  company_id: string;
  is_active: boolean;
  created_at: string;
}