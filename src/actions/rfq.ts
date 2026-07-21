"use server";

import { RFQSchema } from "@/app/lib/schemas";
import { createClient, createAdminClient } from "@/app/lib/supabase/server";
import { ActionResult, RFQ } from "@/types";
import { revalidatePath } from "next/cache";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase: null, user: null };
  return { supabase, user };
}

export async function getRFQs(): Promise<ActionResult<{ active: RFQ[]; deleted: RFQ[] }>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
    const { data: allRfqs, error } = await supabase
      .from("rfqs")
      .select("*")
      .eq("company_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getRFQs] DB error:", error.message);
      return { success: false, error: "Failed to fetch RFQs." };
    }

    const now = Date.now();
    const active: RFQ[] = [];
    const deleted: RFQ[] = [];
    const expiredIdsToHardDelete: string[] = [];

    (allRfqs || []).forEach((rfq: any) => {
      // Ignore permanently deleted records
      if (
        rfq.status === "permanently_deleted" ||
        rfq.parsed_data?.permanently_deleted === true ||
        rfq.parsed_data?.is_permanently_deleted === true
      ) {
        return;
      }

      const isDeleted =
        rfq.status === "deleted" ||
        rfq.parsed_data?.is_deleted === true ||
        Boolean(rfq.parsed_data?.deleted_at);

      if (isDeleted) {
        const deletedAtStr =
          rfq.deleted_at ||
          rfq.parsed_data?.deleted_at ||
          rfq.updated_at ||
          rfq.created_at;
        const deletedTime = new Date(deletedAtStr).getTime();

        if (now - deletedTime >= SEVEN_DAYS_MS) {
          expiredIdsToHardDelete.push(rfq.id);
        } else {
          deleted.push({
            ...rfq,
            status: "deleted",
            deleted_at: deletedAtStr,
          });
        }
      } else {
        active.push(rfq);
      }
    });

    // Auto hard-delete RFQs older than 7 days
    if (expiredIdsToHardDelete.length > 0) {
      for (const id of expiredIdsToHardDelete) {
        await hardDeleteRFQ(id);
      }
    }

    return { success: true, data: { active, deleted } };
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
  const { user } = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const adminSupabase = createAdminClient();
    const nowIso = new Date().toISOString();

    const { data: existing } = await adminSupabase
      .from("rfqs")
      .select("parsed_data")
      .eq("id", id)
      .single();

    const existingParsed =
      existing?.parsed_data && typeof existing.parsed_data === "object"
        ? existing.parsed_data
        : {};
    const updatedParsed = {
      ...existingParsed,
      deleted_at: nowIso,
      is_deleted: true,
    };

    const { error } = await adminSupabase
      .from("rfqs")
      .update({
        status: "deleted",
        parsed_data: updatedParsed,
      })
      .eq("id", id);

    if (error) {
      console.error("[deleteRFQ] Admin DB error:", error.message);
      return { success: false, error: "Failed to delete RFQ: " + error.message };
    }

    revalidatePath("/rfqs");
    return { success: true, data: null };
  } catch (err: any) {
    console.error("[deleteRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while deleting RFQ." };
  }
}

export async function restoreRFQ(id: string): Promise<ActionResult> {
  const { user } = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const adminSupabase = createAdminClient();

    const { data: existing } = await adminSupabase
      .from("rfqs")
      .select("parsed_data")
      .eq("id", id)
      .single();

    const existingParsed =
      existing?.parsed_data && typeof existing.parsed_data === "object"
        ? { ...existing.parsed_data }
        : {};
    delete existingParsed.deleted_at;
    delete existingParsed.is_deleted;
    delete existingParsed.permanently_deleted;

    const { error } = await adminSupabase
      .from("rfqs")
      .update({
        status: "draft",
        parsed_data: existingParsed,
      })
      .eq("id", id);

    if (error) {
      console.error("[restoreRFQ] Admin DB error:", error.message);
      return { success: false, error: "Failed to restore RFQ: " + error.message };
    }

    revalidatePath("/rfqs");
    return { success: true, data: null };
  } catch (err: any) {
    console.error("[restoreRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while restoring RFQ." };
  }
}

export async function hardDeleteRFQ(id: string): Promise<ActionResult> {
  const { user } = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const adminSupabase = createAdminClient();

    // 1. Delete child records first to satisfy foreign key constraints
    try {
      await adminSupabase.from("quotes").delete().eq("rfq_id", id);
    } catch (_) {}
    try {
      await adminSupabase.from("rfq_vendors").delete().eq("rfq_id", id);
    } catch (_) {}

    // 2. HARD DELETE the RFQ row directly from the Postgres database table!
    const { error } = await adminSupabase
      .from("rfqs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[hardDeleteRFQ] Admin DB Hard Delete error:", error.message);
      return { success: false, error: "Failed to permanently delete RFQ: " + error.message };
    }

    revalidatePath("/rfqs");
    return { success: true, data: null };
  } catch (err: any) {
    console.error("[hardDeleteRFQ] Unexpected error:", err?.message || err);
    return { success: false, error: "Something went wrong while deleting RFQ permanently." };
  }
}

export async function duplicateRFQ(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user || !supabase) return { success: false, error: "Unauthorized" };

  try {
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
