import { GoogleGenAI, Type } from "@google/genai";

// In Vite, use import.meta.env for VITE_ prefixed vars, or process.env for vars
// injected via vite.config define (which maps VITE_GEMINI_API_KEY -> process.env.GEMINI_API_KEY)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Correct model name: gemini-2.0-flash (gemini-3-flash-preview does not exist)
const MODEL = "gemini-2.0-flash";

export const ANALYZE_COMPLAINT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy and professional title for the complaint." },
    category: { type: Type.STRING, description: "One of: Ministry of Infrastructure, Ministry of Water, Ministry of Environment, Ministry of Power, Ministry of Urban Development, Other." },
    severity: { type: Type.STRING, description: "One of: low, medium, high, critical." },
    summary: { type: Type.STRING, description: "A detailed but concise summary of the issue." },
    fakeScore: { type: Type.NUMBER, description: "Confidence score that the complaint is fake (0.0 to 1.0). High score (e.g. > 0.7) means it's likely fake/spam/redundant." },
    fakeReason: { type: Type.STRING, description: "A detailed explanation of why this report was flagged as a potential anomaly or fake. If it's valid, put 'Verified report'." },
    assignmentSuggestion: { type: Type.STRING, description: "The department best suited to handle this." }
  },
  required: ["title", "category", "severity", "summary", "fakeScore", "fakeReason", "assignmentSuggestion"]
};

export async function analyzeComplaint(inputText: string, imageData?: string) {
  const parts: any[] = [{ text: `Analyze the following civic complaint. Detect the category, severity, and if it's likely fake. \n  Input Context: ${inputText}` }];

  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYZE_COMPLAINT_SCHEMA,
      systemInstruction: "You are Veritas Civic Intelligence, a system that transforms unstructured citizen feedback into actionable government tasks. Be precise, avoid bias, and detect spam/fake reports with 90% accuracy."
    }
  });

  return JSON.parse(response.text);
}

export async function generateSocialBusterPost(complaintTitle: string, delayDays: number) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Generate a powerful, accountability-focused social media post for X (formerly Twitter) highlighting the ${delayDays} day delay in resolving the complaint: "${complaintTitle}". Use #Veritas #CivicAccountability #PublicService. The tone should be firm and demand action from authorities. Keep it very short, punchy, and under 150 characters.`
  });
  return response.text;
}

export async function validateContent(text: string) {
  const prompt = `Analyze the following text for inappropriate content, including abusive language, nonsense, or irrelevant context for a civic complaint platform.
  Text: "${text}"
  
  Format the response as a JSON object:
  {
    "isInappropriate": boolean,
    "reason": "summary of why it is inappropriate, if applicable",
    "suggestion": "how to improve it"
  }`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
       responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
