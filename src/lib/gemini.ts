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

export async function parseRFQ(rawText: string): Promise<ParsedRFQDetails> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("Requirements text cannot be empty.");
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const prompt = `
    You are an expert industrial procurement engineer.
    Extract structured RFQ details from the raw requirements text provided below.

    CRITICAL INSTRUCTIONS:
    1. productName: Extract ONLY the concise item or part name (e.g. "Grade 304 Stainless Steel seamless piping"). Do NOT include quantities or conversational phrases like "i need".
    2. quantity: Extract ONLY the numeric quantity (e.g. "500").
    3. unit: Extract or infer standard unit (e.g. "METERS", "PCS", "KG").
    4. deliveryDeadline: Today is ${currentDate}. Calculate explicit dates or relative timeframes (e.g. "August 15th") into YYYY-MM-DD format.
    5. deliveryLocation: Extract exact delivery location or plant address mentioned (e.g. "Noida Sector 62").
    6. specifications: Array of technical specs mentioned (e.g. ["2-inch outer diameter"]).
    7. specialRequirements: Special certs or packaging (e.g. "MTC 3.1 certification").
    8. Do NOT invent data. If a field is not in the text, return "" or [].

    Raw Input Text:
    \"\"\"
    ${rawText}
    \"\"\"
  `;

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
          specifications: { type: Type.ARRAY, items: { type: Type.STRING } },
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

  if (!response.text) {
    throw new Error("No response text received from Gemini.");
  }

  return JSON.parse(response.text) as ParsedRFQDetails;
}