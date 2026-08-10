import { GoogleGenAI, Type } from "@google/genai";

export interface ParsedRFQDetails {
  productName: string;
  quantity: string;
  unit: string;
  specifications: string[];
  deliveryDeadline: string;
  deliveryLocation: string;
  specialRequirements: string;
}

function capitalizeProductName(name: string): string {
  if (!name) return "Custom Product";
  const acronyms = new Set(["ms", "ss304", "ss316", "crca", "skf", "ansi", "iso", "gi", "hr"]);

  return name
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (acronyms.has(lower) || /^[a-z]{1,3}\d+/i.test(word) || /^\d+[a-z]+/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function parseRelativeDeadline(text: string, referenceDate: Date = new Date()): string {
  const textLower = text.toLowerCase();

  const formatDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 1. Check "tomorrow" / "by tomorrow"
  if (/\b(?:by\s+)?tomorrow\b/i.test(textLower)) {
    const target = new Date(referenceDate);
    target.setDate(target.getDate() + 1);
    return formatDate(target);
  }

  // 2. Check "end of (this|the) month" / "month end" / "by end of month"
  if (/\b(?:by\s+)?(?:end\s+of\s+(?:this|the)\s+month|month\s+end)\b/i.test(textLower)) {
    const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
    return formatDate(target);
  }

  // 3. Check "end of next month"
  if (/\b(?:by\s+)?end\s+of\s+next\s+month\b/i.test(textLower)) {
    const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 2, 0);
    return formatDate(target);
  }

  // 4. Check "within X days" / "in X days"
  const inDaysMatch = textLower.match(/\b(?:within|in|by|after)\s+(\d+)\s*days?\b/i);
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1], 10);
    if (!isNaN(days)) {
      const target = new Date(referenceDate);
      target.setDate(target.getDate() + days);
      return formatDate(target);
    }
  }

  // 5. Check "within X weeks" / "in X weeks"
  const inWeeksMatch = textLower.match(/\b(?:within|in|by|after)\s+(\d+)\s*weeks?\b/i);
  if (inWeeksMatch) {
    const weeks = parseInt(inWeeksMatch[1], 10);
    if (!isNaN(weeks)) {
      const target = new Date(referenceDate);
      target.setDate(target.getDate() + weeks * 7);
      return formatDate(target);
    }
  }

  // 6. Check "next week" / "by next week" / "in a week"
  if (/\b(?:by\s+)?(?:next\s+week|in\s+a\s+week)\b/i.test(textLower)) {
    const target = new Date(referenceDate);
    target.setDate(target.getDate() + 7);
    return formatDate(target);
  }

  // 7. Day of week expressions e.g. "next Friday", "this Friday", "by Friday"
  const daysOfWeekMap: Record<string, number> = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2, tues: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4, thur: 4, thurs: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
  };

  const dayNamesRegex =
    "(?:sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)";

  const nextDayMatch = textLower.match(new RegExp(`\\bnext\\s+(${dayNamesRegex})\\b`, "i"));
  if (nextDayMatch) {
    const targetDayName = nextDayMatch[1].toLowerCase();
    const targetDay = daysOfWeekMap[targetDayName];
    if (targetDay !== undefined) {
      const currentDay = referenceDate.getDay();
      let daysToAdd = (targetDay - currentDay + 7) % 7;
      if (daysToAdd === 0) {
        daysToAdd = 7;
      } else {
        daysToAdd += 7;
      }
      const target = new Date(referenceDate);
      target.setDate(target.getDate() + daysToAdd);
      return formatDate(target);
    }
  }

  const thisDayMatch = textLower.match(
    new RegExp(`\\b(?:this|by|on)?\\s*(${dayNamesRegex})\\b`, "i")
  );
  if (thisDayMatch) {
    const targetDayName = thisDayMatch[1].toLowerCase();
    const targetDay = daysOfWeekMap[targetDayName];
    if (targetDay !== undefined) {
      const currentDay = referenceDate.getDay();
      let daysToAdd = (targetDay - currentDay + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7;
      const target = new Date(referenceDate);
      target.setDate(target.getDate() + daysToAdd);
      return formatDate(target);
    }
  }

  return "";
}

export function smartParseRFQ(rawText: string, referenceDate: Date = new Date()): ParsedRFQDetails {
  const textTrimmed = rawText.trim();
  const textLower = textTrimmed.toLowerCase();
  const lines = textTrimmed.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Quantity and Unit
  let quantity = "";
  let unit = "PCS";

  const qtyUnitMatch = textTrimmed.match(
    /\b(\d[\d,]*)\s*(kgs?|kg|pcs|pieces|units|meters|m|sets|boxes|tons?|nos\.?|nos)\b/i
  );

  if (qtyUnitMatch) {
    quantity = qtyUnitMatch[1].replace(/,/g, "");
    const rawUnit = qtyUnitMatch[2].toLowerCase();
    if (rawUnit.startsWith("kg")) unit = "KGS";
    else if (rawUnit.startsWith("meter") || rawUnit === "m") unit = "METERS";
    else if (rawUnit.startsWith("ton")) unit = "TONS";
    else if (rawUnit.startsWith("set")) unit = "SETS";
    else if (rawUnit.startsWith("box")) unit = "BOXES";
    else unit = "PCS";
  } else {
    const standaloneNum = textTrimmed.match(/\b(\d[\d,]*)\b/);
    if (standaloneNum) {
      quantity = standaloneNum[1].replace(/,/g, "");
    }
  }

  // 2. Product Name Extraction
  let rawProductName = "";

  const qtyProdMatch = textTrimmed.match(
    /\b(?:\d[\d,]*)\s*(?:kgs?|kg|pcs|pieces|units|meters|m|sets|boxes|tons?|nos\.?)?\s+(?:of\s+)?([A-Za-z0-9\s\-\/\&]+?)(?=\s*\(|\s*,|\s+\d+(?:\.\d+)?\s*(?:mm|cm|inch)|\s+chahiye|\s+grade|\s+size|\s+thickness|\s+is\s+\d|\s+din|\s+m\d|\s+by|\s+for|\s+at|\s+delivered|\s+destination|\.|\n|$)/i
  );

  if (qtyProdMatch && qtyProdMatch[1].trim().length >= 2) {
    rawProductName = qtyProdMatch[1].trim();
  }

  if (!rawProductName) {
    const needMatch = textTrimmed.match(
      /\b(?:need|requires?|looking\s+for|order\s+for|purchase\s+of|chahiye)\s+(?:(?:\d[\d,]*)\s*(?:[a-zA-Z]+)?\s+)?([A-Za-z0-9\s\-\/\&]+?)(?=\s*\(|\s*,|\s+chahiye|\s+by|\s+delivered|\s+at|\s+with|\.|\n|$)/i
    );
    if (needMatch && needMatch[1].trim().length >= 2) {
      rawProductName = needMatch[1].trim();
    }
  }

  let cleanProduct = (rawProductName || lines[0] || "Custom Product")
    .replace(/^(?:bhai|hey|hi|hello|[a-z]+\,)\s+/i, "")
    .replace(/^(?:please|arrange|get|quotes?|for|of|a|an|the|we|need|require|buying|purchasing)\s+/i, "")
    .replace(/\b(?:chahiye|urgent|delivery|by|delivered|at|with|in|our|factory|plant|site|for)\b.*$/i, "")
    .replace(/[(),.]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const productName = capitalizeProductName(cleanProduct);

  // 3. Specifications Extraction
  const specifications: string[] = [];

  // A. Check Parentheses
  const parenMatch = textTrimmed.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const insideParen = parenMatch[1];
    const parts = insideParen.split(",").map((p) => p.trim()).filter(Boolean);
    parts.forEach((p) => {
      if (!specifications.some((s) => s.toLowerCase() === p.toLowerCase())) {
        specifications.push(p);
      }
    });
  }

  // B. Sizes, Dimensions, Gauges, Threads
  const dimRegexes = [
    /\b(hexagonal\s+\d+(?:\.\d+)?\s*mm\s*a\/f)\b/gi,
    /\b(\d+(?:\.\d+)?\s*(?:inch|in|mm|cm|m)\s*(?:size|thickness|dia|diameter|gauge|a\/f)?)\b/gi,
    /\b(m\d+\s*x\s*\d+(?:\.\d+)?\s*(?:mm)?)\b/gi,
  ];

  dimRegexes.forEach((rgx) => {
    const matches = textTrimmed.match(rgx);
    if (matches) {
      matches.forEach((m) => {
        const clean = m.trim();
        if (!specifications.some((s) => s.toLowerCase() === clean.toLowerCase())) {
          specifications.push(clean);
        }
      });
    }
  });

  // C. Standards & Grades
  const stdRegexes = [
    /\b(grade\s+[A-Za-z0-9\-\/]+)\b/gi,
    /\b(din\s*\d+)\b/gi,
    /\b(is\s*\d+(?:\s+[A-Z0-9]+)?(?:\s+grade)?)\b/gi,
    /\b(class\s*\d+)\b/gi,
    /\b(ansi\s*[A-Z0-9\.]+)\b/gi,
  ];

  stdRegexes.forEach((rgx) => {
    const matches = textTrimmed.match(rgx);
    if (matches) {
      matches.forEach((m) => {
        const clean = m.trim();
        if (!specifications.some((s) => s.toLowerCase() === clean.toLowerCase())) {
          specifications.push(clean);
        }
      });
    }
  });

  // Filter out duplicates and items already in productName
  let filteredSpecs = specifications.filter((spec) => {
    const specLower = spec.toLowerCase();
    const prodLower = productName.toLowerCase();
    if (specLower === "ms" && prodLower.includes("ms")) return false;
    if (specLower === "ss316" && prodLower.includes("ss316")) return false;
    if (specLower === "ss304" && prodLower.includes("ss304")) return false;
    if (specLower === "hr" && prodLower.includes("hr")) return false;
    return true;
  });

  // Deduplicate substrings e.g. "19mm A/F" vs "Hexagonal 19mm A/F" -> keep longer
  filteredSpecs = filteredSpecs.filter((spec, idx, arr) => {
    return !arr.some(
      (other, otherIdx) =>
        otherIdx !== idx && other.toLowerCase().includes(spec.toLowerCase()) && other.length > spec.length
    );
  });

  // 4. Delivery Location Extraction
  let deliveryLocation = "";

  const destMatch = textTrimmed.match(/\bdestination:\s*([^.\n]+)/i);
  if (destMatch) {
    deliveryLocation = destMatch[1].trim().replace(/^[,\s]+|[,\s.]+$|\.$/g, "");
  }

  if (!deliveryLocation) {
    const locationMatch = textTrimmed.match(
      /\b(?:delivery\s+to|delivering\s+to|ship\s+to|location:?|delivered\s+at)\s+(?:our\s+)?([A-Za-z0-9\s,\/\-]+?)(?=\s+factory|\s+plant|\s+by|\s+before|\s+with|\s+required|\.|\n|$)/i
    );
    if (locationMatch) {
      let loc = locationMatch[1].trim().replace(/^[,\s]+|[,\s.]+$|\.$/g, "");
      loc = loc.replace(/^(?:our|my|the|a|an|at|to|in|for|site)\s+/i, "");
      deliveryLocation = loc;
    }
  }

  if (!deliveryLocation) {
    const locInText = textTrimmed.match(
      /\b(noida\s+sector\s+\d+|plant\s+\d+\s+pune|chakan\s+industrial\s+area|midc\s+bhosari,\s+pune|noida|pune|mumbai|bengaluru)\b/i
    );
    if (locInText) {
      deliveryLocation = locInText[1].trim();
    }
  }

  if (deliveryLocation) {
    deliveryLocation = deliveryLocation
      .split(" ")
      .map((w) => (w.length <= 4 && w.toUpperCase() === "MIDC" ? "MIDC" : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  }

  // 5. Delivery Deadline Extraction
  let deliveryDeadline = "";

  const monthRegex =
    /\b(?:by|before|due|deadline:?|on)?\s*(?:([0-9]{1,2})(?:st|nd|rd|th)?\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+([0-9]{1,2})(?:st|nd|rd|th)?)?(?:\s*,?\s*([0-9]{4}))?\b/i;

  const dateMatch = textTrimmed.match(monthRegex);
  if (dateMatch) {
    const dayStr = dateMatch[1] || dateMatch[3];
    const monthStr = dateMatch[2].toLowerCase();
    const yearStr = dateMatch[4];

    const monthsMap: Record<string, string> = {
      jan: "01", january: "01", feb: "02", february: "02", mar: "03", march: "03", apr: "04", april: "04", may: "05",
      jun: "06", june: "06", jul: "07", july: "07", aug: "08", august: "08", sept: "09", sep: "09", september: "09",
      oct: "10", october: "10", nov: "11", november: "11", dec: "12", december: "12",
    };

    const monthNum = monthsMap[monthStr] || monthsMap[monthStr.substring(0, 3)];
    let dayNum = dayStr ? parseInt(dayStr, 10) : 1;
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) dayNum = 1;
    const formattedDay = dayNum.toString().padStart(2, "0");

    const currentYear = referenceDate.getFullYear();
    let year = yearStr ? parseInt(yearStr, 10) : currentYear;

    if (monthNum) {
      deliveryDeadline = `${year}-${monthNum}-${formattedDay}`;
    }
  }

  if (!deliveryDeadline) {
    deliveryDeadline = parseRelativeDeadline(textTrimmed, referenceDate);
  }

  // 6. Special Requirements Extraction
  const specReqs = [];
  if (textLower.includes("urgent")) {
    specReqs.push("Urgent delivery");
  }
  if (textLower.includes("mtr test certificate") || textLower.includes("mtr certificate")) {
    specReqs.push("MTR test certificate required");
  } else if (textLower.includes("mill test certificate") || textLower.includes("mill test certificates")) {
    specReqs.push("Mill test certificates");
  } else if (textLower.includes("test certificate")) {
    specReqs.push("Test certificate required");
  }

  if (textLower.includes("wooden spool packaging")) {
    specReqs.push("wooden spool packaging");
  } else if (textLower.includes("wooden crate")) {
    specReqs.push("wooden crate packaging");
  }

  const specialRequirements = specReqs.join(", ");

  return {
    productName,
    quantity,
    unit,
    specifications: filteredSpecs,
    deliveryDeadline,
    deliveryLocation,
    specialRequirements,
  };
}

export async function parseRFQ(rawText: string): Promise<ParsedRFQDetails> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const currentDate = new Date().toISOString().split("T")[0];
      const currentYear = new Date().getFullYear();
      const currentDayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

      const prompt = `You are an expert procurement data extractor for manufacturing companies.

STRICT RULES:
1. Extract ONLY information explicitly present in the input text.
2. Do NOT infer, assume, or add default specifications, standard certifications, or packaging requirements if not mentioned.
3. If a field is not present in the input text, return an empty string "" or empty array [].
4. "productName": Extract ONLY the concise product/material name (2-4 words max, e.g. "MS Flanges", "SS316 Fasteners", "Galvanized Iron Wire", "HR Sheets", "Brass Extruded Rods"). Never include conversational words ("chahiye", "bhai", "hey"), verbs ("please get quotes for"), specifications, or delivery sentences.
5. "quantity": Numeric quantity only (e.g. "50", "100", "1200", "10", "5000"). Do NOT include unit.
6. "unit": Unit of measurement in UPPERCASE (e.g. "PCS", "SETS", "METERS", "TONS", "KGS").
7. "specifications": Array of technical specs explicitly mentioned (e.g. ["4 inch size"], ["M12x50mm", "Grade A2-70", "DIN 933"], ["3mm thickness"], ["2.5mm thickness", "IS 2062 E250 grade"], ["Hexagonal 19mm A/F", "Grade CW614N"]). Do NOT duplicate material names already present in productName.
8. "deliveryDeadline": Date in YYYY-MM-DD format. Calculate relative time phrases relative to today's date ${currentDate} (${currentDayName}):
   - "next Friday" -> calculate exact date for next week's Friday.
   - "this Friday" or "by Friday" -> calculate exact date for upcoming Friday.
   - "tomorrow" -> ${currentDate} + 1 day.
   - "end of this month" -> last day of the current month.
   - "within X days" -> ${currentDate} + X days.
   If no date/deadline mentioned, return "".
9. "deliveryLocation": ONLY the city/facility location mentioned (e.g. "Noida Sector 62", "Plant 3 Pune", "Chakan Industrial Area", "MIDC Bhosari, Pune"). Strip possessive pronouns like "our". If no location mentioned, return "".
10. "specialRequirements": Any special requirement explicitly mentioned (e.g. "Urgent delivery", "MTR test certificate required", "Mill test certificates, wooden spool packaging"). If none mentioned, return "".

Today's date is ${currentDate} (${currentDayName}).

Requirement text:
${rawText}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              quantity: { type: Type.STRING },
              unit: { type: Type.STRING },
              specifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              deliveryDeadline: { type: Type.STRING },
              deliveryLocation: { type: Type.STRING },
              specialRequirements: { type: Type.STRING },
            },
            required: [
              "productName",
              "quantity",
              "unit",
              "specifications",
              "deliveryDeadline",
              "deliveryLocation",
              "specialRequirements",
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as ParsedRFQDetails;
        let deadline = (parsed.deliveryDeadline || "").trim();
        if (!deadline) {
          deadline = parseRelativeDeadline(rawText);
        }
        return {
          productName: capitalizeProductName((parsed.productName || "").trim()),
          quantity: (parsed.quantity || "").trim(),
          unit: (parsed.unit || "PCS").trim().toUpperCase(),
          specifications: Array.isArray(parsed.specifications)
            ? parsed.specifications.map((s) => s.trim()).filter(Boolean)
            : [],
          deliveryDeadline: deadline,
          deliveryLocation: (parsed.deliveryLocation || "").trim(),
          specialRequirements: (parsed.specialRequirements || "").trim(),
        };
      }
    } catch (err) {
      console.warn("[parseRFQ] Gemini API error, falling back to smart parse:", err);
    }
  }

  return smartParseRFQ(rawText);
}

export interface GenerateRecommendationInput {
  rfqTitle: string;
  specifications?: string[];
  quotes: Array<{
    vendorId?: string;
    vendorName: string;
    unitPrice: number;
    totalCost: number;
    leadTimeDays: number;
    paymentTerms: string;
    notes?: string | null;
  }>;
}

export interface AIRecommendationData {
  recommended_vendor_id: string;
  recommended_vendor_name: string;
  reasoning: string;
  confidence_score: number;
  key_trade_offs: string[];
}

function heuristicGenerateRecommendation(
  input: GenerateRecommendationInput
): AIRecommendationData {
  const { quotes } = input;
  if (!quotes || quotes.length === 0) {
    return {
      recommended_vendor_id: "",
      recommended_vendor_name: "No Vendors Submitted",
      reasoning: "No quotes have been submitted for analysis yet.",
      confidence_score: 0,
      key_trade_offs: ["Awaiting supplier responses"],
    };
  }

  if (quotes.length === 1) {
    const q = quotes[0];
    return {
      recommended_vendor_id: q.vendorId || q.vendorName,
      recommended_vendor_name: q.vendorName,
      reasoning: `${q.vendorName} is currently the sole bidder for this RFQ, offering a unit price of ₹${q.unitPrice.toLocaleString("en-IN")} with a lead time of ${q.leadTimeDays} day(s) under ${q.paymentTerms} terms.`,
      confidence_score: 85,
      key_trade_offs: [
        `Single response submitted (Total: ₹${q.totalCost.toLocaleString("en-IN")})`,
        `Lead time: ${q.leadTimeDays} days with payment terms: ${q.paymentTerms}`,
      ],
    };
  }

  // Multi-quote comparative scoring
  const minCost = Math.min(...quotes.map((q) => q.totalCost || q.unitPrice));
  const maxCost = Math.max(...quotes.map((q) => q.totalCost || q.unitPrice));

  const minLeadTime = Math.min(...quotes.map((q) => q.leadTimeDays));
  const maxLeadTime = Math.max(...quotes.map((q) => q.leadTimeDays));

  function getTermsScore(terms: string): number {
    const t = terms.toLowerCase();
    if (t.includes("net 60")) return 100;
    if (t.includes("net 45")) return 85;
    if (t.includes("net 30")) return 70;
    if (t.includes("net 15")) return 55;
    if (t.includes("delivery") || t.includes("cod")) return 40;
    if (t.includes("advance")) return 20;
    return 50;
  }

  let bestVendor = quotes[0];
  let bestScore = -1;

  quotes.forEach((q) => {
    const costRatio = maxCost === minCost ? 1 : 1 - (q.totalCost - minCost) / (maxCost || 1);
    const leadRatio = maxLeadTime === minLeadTime ? 1 : 1 - (q.leadTimeDays - minLeadTime) / (maxLeadTime || 1);
    const termsScore = getTermsScore(q.paymentTerms) / 100;

    // Weighting: 50% cost, 30% lead time, 20% payment terms
    const score = costRatio * 50 + leadRatio * 30 + termsScore * 20;

    if (score > bestScore) {
      bestScore = score;
      bestVendor = q;
    }
  });

  const isLowestCost = bestVendor.totalCost === minCost;
  const isFastestLead = bestVendor.leadTimeDays === minLeadTime;

  const reasoningParts: string[] = [];
  reasoningParts.push(
    `${bestVendor.vendorName} provides the most balanced quote for ${input.rfqTitle || "this requirement"} at ₹${bestVendor.unitPrice.toLocaleString("en-IN")} per unit (Total: ₹${bestVendor.totalCost.toLocaleString("en-IN")}).`
  );

  if (isLowestCost && isFastestLead) {
    reasoningParts.push(
      `They offer both the lowest pricing and the fastest turnaround time of ${bestVendor.leadTimeDays} days.`
    );
  } else if (isLowestCost) {
    reasoningParts.push(
      `They offer the lowest total cost while maintaining a reasonable ${bestVendor.leadTimeDays}-day lead time under ${bestVendor.paymentTerms} terms.`
    );
  } else if (isFastestLead) {
    reasoningParts.push(
      `They deliver significantly faster than competitors (${bestVendor.leadTimeDays} days) with favorable ${bestVendor.paymentTerms} terms.`
    );
  } else {
    reasoningParts.push(
      `Their combination of ${bestVendor.leadTimeDays}-day delivery and ${bestVendor.paymentTerms} payment terms presents the optimal overall commercial value.`
    );
  }

  const tradeOffs: string[] = [];
  if (isLowestCost) {
    tradeOffs.push(`Lowest total commercial cost: ₹${bestVendor.totalCost.toLocaleString("en-IN")}`);
  } else {
    tradeOffs.push(`Premium over lowest quote offset by superior lead time & payment conditions`);
  }

  if (isFastestLead) {
    tradeOffs.push(`Fastest delivery lead time (${bestVendor.leadTimeDays} days)`);
  } else {
    tradeOffs.push(`Lead time: ${bestVendor.leadTimeDays} days (vs fastest competitor: ${minLeadTime} days)`);
  }

  tradeOffs.push(`Payment conditions: ${bestVendor.paymentTerms}`);

  const confidenceScore = Math.min(98, Math.max(75, Math.round(75 + (bestScore / 100) * 20)));

  return {
    recommended_vendor_id: bestVendor.vendorId || bestVendor.vendorName,
    recommended_vendor_name: bestVendor.vendorName,
    reasoning: reasoningParts.join(" "),
    confidence_score: confidenceScore,
    key_trade_offs: tradeOffs,
  };
}

export async function generateRecommendation(
  input: GenerateRecommendationInput
): Promise<AIRecommendationData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && input.quotes && input.quotes.length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const quotesFormatted = input.quotes
        .map(
          (q, idx) =>
            `${idx + 1}. Vendor ID: "${q.vendorId || q.vendorName}", Name: "${q.vendorName}", Unit Price: ₹${q.unitPrice}, Total Cost: ₹${q.totalCost}, Lead Time: ${q.leadTimeDays} days, Payment Terms: "${q.paymentTerms}"${q.notes ? `, Notes: "${q.notes}"` : ""}`
        )
        .join("\n");

      const prompt = `You are an expert procurement and supply chain analyst evaluating supplier quotes for a manufacturing company.

RFQ Title: ${input.rfqTitle}
Specifications: ${input.specifications && input.specifications.length > 0 ? input.specifications.join(", ") : "Standard specifications"}

Submitted Quotes:
${quotesFormatted}

Instructions:
Analyze supplier quotes for the given RFQ. Balance unit price, total cost, lead time, and payment terms. Select the best overall vendor and provide concise reasoning (2-3 sentences explaining why this vendor offers the best value balance). Provide a confidence score (0-100) and 2-3 key trade-off points.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommended_vendor_id: { type: Type.STRING },
              recommended_vendor_name: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              confidence_score: { type: Type.NUMBER },
              key_trade_offs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "recommended_vendor_id",
              "recommended_vendor_name",
              "reasoning",
              "confidence_score",
              "key_trade_offs",
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as AIRecommendationData;
        if (parsed.recommended_vendor_name && parsed.reasoning) {
          return {
            recommended_vendor_id: parsed.recommended_vendor_id || "",
            recommended_vendor_name: parsed.recommended_vendor_name,
            reasoning: parsed.reasoning,
            confidence_score: Number(parsed.confidence_score) || 85,
            key_trade_offs: Array.isArray(parsed.key_trade_offs) ? parsed.key_trade_offs : [],
          };
        }
      }
    } catch (err) {
      console.warn("[generateRecommendation] Gemini API error, falling back to heuristic:", err);
    }
  }

  return heuristicGenerateRecommendation(input);
}

