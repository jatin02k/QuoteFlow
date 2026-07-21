"use server";

import { RFQSchema } from "@/app/lib/schemas";
import { createClient } from "@/app/lib/supabase/server";
import { ActionResult, RFQ } from "@/types";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase: null, user: null };
  return { supabase, user };
}

export async function getRFQs(): Promise<ActionResult<RFQ[]>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
    const { data, error } = await supabase
      .from("rfqs")
      .select("*")
      .eq("company_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getRFQs] DB error:", error.message);
      return { success: false, error: "Failed to fetch RFQs." };
    }

    return { success: true, data: (data || []) as RFQ[] };
  } catch (err: any) {
    console.error("[getRFQs] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while fetching RFQs." };
  }
}

export async function createRFQ(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  const result = RFQSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const { data, error } = await supabase
      .from("rfqs")
      .insert({
        company_id: user.id,
        title: result.data.title.trim(),
        raw_text: result.data.raw_text?.trim() || null,
        deadline: result.data.deadline || null,
        parsed_data: result.data.parsed_data || {},
        status: "draft",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[createRFQ] DB error:", error.message);
      return { success: false, error: "Failed to create RFQ." };
    }

    revalidatePath("/rfqs");
    return { success: true, data: { id: data.id } };
  } catch (err: any) {
    console.error("[createRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while creating RFQ." };
  }
}

export async function updateRFQDraft(
  id: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  const result = RFQSchema.partial().safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const cleanData = Object.fromEntries(
    Object.entries(result.data).filter(([_, v]) => v !== undefined)
  );

  try {
    const { data, error } = await supabase
      .from("rfqs")
      .update(cleanData)
      .eq("id", id)
      .eq("company_id", user.id)
      .select("id")
      .single();

    if (error) {
      console.error("[updateRFQDraft] DB error:", error.message);
      return { success: false, error: "Failed to update RFQ draft." };
    }

    revalidatePath("/rfqs");
    return { success: true, data: { id: data.id } };
  } catch (err: any) {
    console.error("[updateRFQDraft] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while updating RFQ draft." };
  }
}

export async function getRFQ(id: string): Promise<ActionResult<RFQ>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
    const { data, error } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", id)
      .eq("company_id", user.id)
      .single();

    if (error) {
      console.error("[getRFQ] DB error:", error.message);
      return { success: false, error: "RFQ not found or access denied." };
    }

    return { success: true, data: data as RFQ };
  } catch (err: any) {
    console.error("[getRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while fetching RFQ details." };
  }
}

export async function deleteRFQ(id: string): Promise<ActionResult> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
    const { error } = await supabase
      .from("rfqs")
      .update({ status: "deleted" })
      .eq("id", id)
      .eq("company_id", user.id);

    if (error) {
      console.error("[deleteRFQ] DB error:", error.message);
      return { success: false, error: "Failed to delete RFQ." };
    }

    revalidatePath("/rfqs");
    return { success: true, data: null };
  } catch (err: any) {
    console.error("[deleteRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while deleting RFQ." };
  }
}

export async function duplicateRFQ(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
    // 1. Fetch original RFQ and verify ownership
    const { data: original, error: fetchError } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", id)
      .eq("company_id", user.id)
      .single();

    if (fetchError || !original) {
      console.error("[duplicateRFQ] Fetch original error:", fetchError?.message);
      return { success: false, error: "RFQ not found or access denied." };
    }

    // 2. Insert new duplicated RFQ
    const newTitle = original.title.endsWith("(Copy)")
      ? original.title
      : `${original.title} (Copy)`;

    const { data: newRfq, error: insertError } = await supabase
      .from("rfqs")
      .insert({
        company_id: user.id,
        title: newTitle,
        raw_text: original.raw_text,
        parsed_data: original.parsed_data || {},
        deadline: original.deadline,
        status: "draft",
        vendors_contacted: 0,
        quotes_received: 0,
      })
      .select("id")
      .single();

    if (insertError || !newRfq) {
      console.error("[duplicateRFQ] Insert error:", insertError?.message);
      return { success: false, error: "Failed to duplicate RFQ." };
    }

    revalidatePath("/rfqs");
    return { success: true, data: { id: newRfq.id } };
  } catch (err: any) {
    console.error("[duplicateRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while duplicating RFQ." };
  }
}
