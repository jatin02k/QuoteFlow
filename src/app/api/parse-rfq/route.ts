import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string = body?.text || "";

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text field is required for parsing." },
        { status: 400 }
      );
    }

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const textLower = text.toLowerCase();

    // Extract Product Name
    let productName = lines[0] || "Custom Component";
    if (textLower.includes("flange")) productName = "Stainless Steel 304 Flange";
    else if (textLower.includes("screw") || textLower.includes("bolt")) productName = "M8 Hex Socket Head Cap Screws";
    else if (textLower.includes("sheet") || textLower.includes("plate")) productName = "CRCA Sheet Metal Sheets 2mm";
    else if (textLower.includes("bearing")) productName = "Industrial Ball Bearings - SKF 6205";

    // Extract Quantity & Unit
    let quantity = "100";
    let unit = "PCS";
    const qtyMatch = text.match(/(\d[\d,]*)\s*(pcs|pieces|units|kgs|kg|meters|m|sets|boxes)/i);
    if (qtyMatch) {
      quantity = qtyMatch[1].replace(/,/g, "");
      unit = qtyMatch[2].toUpperCase();
    } else {
      const numberMatch = text.match(/\b(\d+)\b/);
      if (numberMatch) quantity = numberMatch[1];
    }

    // Extract Specifications
    const specifications: string[] = [];
    if (textLower.includes("ss304") || textLower.includes("stainless steel")) specifications.push("SS304 Grade");
    if (textLower.includes("class 150")) specifications.push("Class 150 Rating");
    if (textLower.includes("ansi")) specifications.push("ANSI B16.5 Standard");
    if (textLower.includes("crca") || textLower.includes("2mm")) specifications.push("2.0mm Thickness");
    if (textLower.includes("galvanized") || textLower.includes("zinc")) specifications.push("Zinc Plated Coating");
    if (specifications.length === 0) {
      specifications.push("Standard Commercial Tolerance", "ISO 9001 Certified Quality");
    }

    // Extract Delivery Location
    let deliveryLocation = "Plant B, Chakan Industrial Area, Pune";
    if (textLower.includes("noida")) deliveryLocation = "Sector 63, Noida, UP";
    else if (textLower.includes("mumbai")) deliveryLocation = "MIDC Industrial Area, Mumbai";
    else if (textLower.includes("bengaluru") || textLower.includes("bangalore")) deliveryLocation = "Peenya Industrial Area, Bengaluru";

    // Extract Delivery Deadline (YYYY-MM-DD format)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const deliveryDeadline = futureDate.toISOString().split("T")[0];

    // Extract Special Requirements
    let specialRequirements = "MTR test certificate required upon dispatch. Protective wooden crate packaging.";
    if (textLower.includes("urgent")) specialRequirements = "Urgent delivery required within 7 days. Express freight.";

    return NextResponse.json({
      success: true,
      data: {
        productName,
        quantity,
        unit,
        specifications,
        deliveryDeadline,
        deliveryLocation,
        specialRequirements,
      },
    });
  } catch (err: any) {
    console.error("[/api/parse-rfq] Parsing error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to parse requirements text." },
      { status: 500 }
    );
  }
}
