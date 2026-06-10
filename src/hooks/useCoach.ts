import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { aiService } from "../services/aiService";

export function useCoach() {
  const { ecoPoints } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askCoach = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    setLoading(true);
    setPrompt(""); // Clear early for better UX
    setResponse(""); // Clear previous response

    try {
      const text = await aiService.askCoach(currentPrompt, ecoPoints);
      setResponse(text);
    } catch (error: any) {
      console.error("Coach interaction failed:", error);
      setResponse(`⚠️ **System Notice:** ${error.message || "Sorry, I am having trouble connecting right now."}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, ecoPoints]);

  return {
    prompt,
    setPrompt,
    response,
    loading,
    askCoach
  };
}
