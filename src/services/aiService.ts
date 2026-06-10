import { CoachResponse } from "../types";

class AIService {
  async askCoach(prompt: string, ecoPoints: number): Promise<string> {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt,
        userData: { ecoPoints }
      }),
    });
    
    const contentType = res.headers.get("content-type");
    let data: CoachResponse = { text: "" };
    
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }
    
    if (!res.ok) {
      throw new Error(data.error || "The AI Coach is currently unavailable.");
    }
    
    return data.text;
  }
}

export const aiService = new AIService();
