import { sendFollowUpEmail } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function GET(request:NextRequest){
    const  authHeader = request.headers.get("Authorization");
    const expectedHeader = `Bearer ${process.env.CRON_SECRET}`;
    if (authHeader !== expectedHeader) {
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 });
    }

    const supabase = await createClient();

    let processed = 0
    let failed = 0

    try {
        
        const cutOffTime = new Date(
            Date.now() - 48 * 60 * 60 * 1000 // 48 hours in milliseconds
        ).toISOString();

        const { data:pendingVendors, error:queryError } = await supabase
            .from('rfq_vendors')
            .select(`
                id,
                token,
                rfq_id,
                vendor_id,
                rfqs(
                    id, 
                    title, 
                    deadline, 
                    parsed_data, 
                    companies( 
                        email, 
                        name
                        )
                ),
                vendors(
                    name,
                    email
                )
            `)
            .eq("status", "pending")
            .is("followUp_sent", null)
            .lt("email_sent_at", cutOffTime);

            if(queryError){
                console.error("[cron/follow-up] Query Error", queryError);
                return NextResponse.json(
                    { error: "Failed to query pending vendors" },
                    { status: 500 }
                )
            }

            if(!pendingVendors || pendingVendors.length === 0) {
                return NextResponse.json({
                    success: true,
                    processed: 0,
                    message: "No pending vendors found for follow-up."
                })
            }

            const now = new Date()
            const activeVendors = pendingVendors.filter((rv: any) => {
                if(!rv.rfqs?.deadline) return true
                return new Date(rv.rfqs.dealine) > now
            })

            for (const rfqVendor of activeVendors) {
                try {
                    const vendor = rfqVendor.vendors as any
                    const rfq = rfqVendor.rfqs as any
                    const company = rfq?.companies as any

                    const responseLink = `${process.env.NEXT_PUBLIC_APP_URL}/respond/${rfqVendor.token}`

                    await sendFollowUpEmail({
                        vendorEmail: vendor.email,
                        vendorName: vendor.name,
                        companyName: company.name,
                        rfqTitle: rfq.title,
                        deadline: rfq.deadline,
                        responseLink
                    })

                    await supabase.from('rfq_vendors').update({followup_sent_at: new Date().toISOString()}).eq('id', rfqVendor.id)
                    processed++;
                }
                catch (err:any) {
                    console.error(`[cron/follow-up] Failed for vendor ID ${rfqVendor.id}:`, err.message);
                    failed++;
                }
            }

            return NextResponse.json({
                success:true,
                processed,
                failed,
                timestamp: new Date().toISOString(),
            })

    } catch (err:any) {
        console.error("[cron/follow-up] Unexpected Error:", err.message);
        return NextResponse.json(
            { error: "Something went wrong" }, 
            { status: 500 });
    }
}