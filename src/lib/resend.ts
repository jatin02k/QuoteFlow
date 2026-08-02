interface SendRFQEmailParams {
  vendorEmail: string;
  vendorName: string;
  companyName: string;
  rfqTitle: string;
  parsedData: {
    product_name?: string;
    quantity?: string;
    unit?: string;
    specifications?: string[];
    delivery_deadline?: string;
    delivery_location?: string;
    special_requirements?: string;
  };
  rawText?: string;
  attachmentName?: string | null;
  attachmentUrl?: string | null;
  responseLink: string;
  deadline?: string | null;
}

interface SendQuoteNotificationParams {
  ownerEmail: string;
  vendorName: string;
  rfqTitle: string;
  unitPrice: number;
  totalCost?: number;
  rfqLink: string;
}

export async function sendRFQEmail(params: SendRFQEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[sendRFQEmail] RESEND_API_KEY is not configured.");
    return false;
  }

  const {
    vendorEmail,
    vendorName,
    companyName,
    rfqTitle,
    parsedData = {},
    rawText,
    attachmentName,
    attachmentUrl,
    responseLink,
    deadline,
  } = params;

  const displayDeadline = deadline || parsedData.delivery_deadline || "ASAP";
  const subject = `RFQ: ${rfqTitle}${displayDeadline ? ` — Quote Required by ${displayDeadline}` : ""}`;

  const specificationsList = Array.isArray(parsedData.specifications) && parsedData.specifications.length > 0
    ? parsedData.specifications.map(s => `<li style="margin-bottom: 4px; color: #1A1917;">${escapeHtml(s)}</li>`).join("")
    : null;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAFAF8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FAFAF8; border: 1px solid #D4D0C8; border-radius: 6px; overflow: hidden; text-align: left;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #F4F3F0; padding: 24px; border-bottom: 1px solid #D4D0C8;">
              <div style="font-size: 11px; font-weight: 700; color: #C17F24; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                Request for Quotation
              </div>
              <div style="font-size: 20px; font-weight: 700; color: #1A1917; margin-bottom: 2px;">
                ${escapeHtml(companyName)}
              </div>
              <div style="font-size: 13px; color: #8B8780;">
                Attention: ${escapeHtml(vendorName)}
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 14px; line-height: 1.5; color: #4A4845; margin-top: 0; margin-bottom: 20px;">
                Dear <strong>${escapeHtml(vendorName)}</strong>,<br>
                ${escapeHtml(companyName)} has requested a formal price and delivery quote for the requirement detailed below.
              </p>

              <!-- RFQ Title Box -->
              <div style="background-color: #ECEAE5; border: 1px solid #D4D0C8; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 600; color: #8B8780; text-transform: uppercase; letter-spacing: 0.05em;">RFQ Reference Title</div>
                <div style="font-size: 16px; font-weight: 700; color: #1A1917; margin-top: 4px;">${escapeHtml(rfqTitle)}</div>
              </div>

              <!-- RFQ Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px; border: 1px solid #E8E6E1;">
                <thead>
                  <tr style="background-color: #F4F3F0;">
                    <th colSpan="2" style="padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8B8780; letter-spacing: 0.05em; border-bottom: 1px solid #D4D0C8; text-align: left;">
                      Requirement Specifications
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${parsedData.product_name ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1; width: 35%; background-color: #FDF3E3;">Product / Item</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; font-weight: 700; border-bottom: 1px solid #E8E6E1;">${escapeHtml(parsedData.product_name)}</td>
                  </tr>` : ""}
                  
                  ${parsedData.quantity ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1;">Quantity Requested</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; font-family: monospace; border-bottom: 1px solid #E8E6E1;">${escapeHtml(String(parsedData.quantity))} ${escapeHtml(parsedData.unit || "")}</td>
                  </tr>` : ""}

                  ${displayDeadline ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1;">Required Deadline</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; border-bottom: 1px solid #E8E6E1;">${escapeHtml(displayDeadline)}</td>
                  </tr>` : ""}

                  ${parsedData.delivery_location ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1;">Delivery Location</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; border-bottom: 1px solid #E8E6E1;">${escapeHtml(parsedData.delivery_location)}</td>
                  </tr>` : ""}

                  ${specificationsList ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1; vertical-align: top;">Specifications</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; border-bottom: 1px solid #E8E6E1;">
                      <ul style="margin: 0; padding-left: 18px;">${specificationsList}</ul>
                    </td>
                  </tr>` : ""}

                  ${parsedData.special_requirements ? `
                  <tr>
                    <td style="padding: 10px 14px; font-size: 13px; color: #4A4845; font-weight: 600; border-bottom: 1px solid #E8E6E1; vertical-align: top;">Special Notes</td>
                    <td style="padding: 10px 14px; font-size: 13px; color: #1A1917; border-bottom: 1px solid #E8E6E1;">${escapeHtml(parsedData.special_requirements)}</td>
                  </tr>` : ""}
                </tbody>
              </table>

              ${rawText ? `
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #8B8780; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Raw Requirement Details</div>
                <div style="background-color: #FAFAF8; border: 1px solid #D4D0C8; padding: 12px; font-family: monospace; font-size: 12px; color: #4A4845; white-space: pre-wrap; border-radius: 4px;">${escapeHtml(rawText)}</div>
              </div>` : ""}

              ${attachmentUrl ? `
              <div style="margin-bottom: 24px; padding: 12px 16px; background-color: #F4F3F0; border: 1px solid #D4D0C8; border-radius: 4px;">
                <span style="font-size: 13px; color: #1A1917;">📎 <strong>Drawing / Attachment:</strong></span>
                <a href="${escapeHtml(attachmentUrl)}" target="_blank" style="margin-left: 8px; font-size: 13px; color: #C17F24; font-weight: 600; text-decoration: underline;">
                  ${escapeHtml(attachmentName || "Download Attachment PDF")} - Click to download
                </a>
              </div>` : ""}

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0 24px 0;">
                <a href="${escapeHtml(responseLink)}" target="_blank" style="display: inline-block; background-color: #C17F24; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 6px; border: 1px solid #A86E1C; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Submit Your Quote →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F4F3F0; padding: 16px 24px; border-top: 1px solid #D4D0C8; text-align: center;">
              <p style="font-size: 12px; color: #8B8780; margin: 0 0 6px 0;">
                This link is unique to ${escapeHtml(vendorName)}. Valid until <strong>${escapeHtml(displayDeadline)}</strong>.
              </p>
              <p style="font-size: 11px; color: #8B8780; margin: 0; font-weight: 600;">
                Powered by RFQPilot — Procurement made simple
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [vendorEmail],
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[sendRFQEmail] Resend API error:", response.status, errorText);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("[sendRFQEmail] Unexpected error dispatching email:", err?.message || err);
    return false;
  }
}

export async function sendQuoteSubmittedNotification(params: SendQuoteNotificationParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !params.ownerEmail) return false;

  const subject = `[Quote Submitted] ${params.vendorName} submitted a quote for ${params.rfqTitle}`;
  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #FAFAF8; padding: 24px; color: #1A1917;">
  <div style="max-width: 500px; margin: 0 auto; background: #FFF; border: 1px solid #D4D0C8; padding: 24px; border-radius: 6px;">
    <h2 style="color: #1A1917; margin-top: 0;">New Vendor Quote Received</h2>
    <p><strong>${escapeHtml(params.vendorName)}</strong> has submitted a response for <strong>${escapeHtml(params.rfqTitle)}</strong>.</p>
    <div style="background: #F4F3F0; padding: 12px; border-radius: 4px; margin: 16px 0;">
      <div>Unit Price: <strong>₹${params.unitPrice.toLocaleString("en-IN")}</strong></div>
      ${params.totalCost ? `<div>Total Cost: <strong>₹${params.totalCost.toLocaleString("en-IN")}</strong></div>` : ""}
    </div>
    <p><a href="${escapeHtml(params.rfqLink)}" style="display: inline-block; background: #C17F24; color: #FFF; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View RFQ Details & Comparison →</a></p>
  </div>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [params.ownerEmail],
        subject,
        html: htmlContent,
      }),
    });
    return response.ok;
  } catch (err: any) {
    console.error("[sendQuoteSubmittedNotification] Resend API error:", err?.message || err);
    return false;
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
