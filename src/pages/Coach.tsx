import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Leaf, Send, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";

export default function Coach() {
  const { user, ecoPoints } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          userData: { ecoPoints: ecoPoints }
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }
      
      setResponse(data.text);
    } catch (error: any) {
      console.error(error);
      setResponse(`⚠️ **System Notice:** ${error.message || "Sorry, I am having trouble connecting to my systems right now."}`);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-500" /> AI Sustainability Coach
        </h1>
        <p className="text-gray-500 mt-1">Ask for customized carbon reduction advice or plan your 30-day roadmap.</p>
      </header>

      <div className="flex-1 overflow-y-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col mb-4">
        {!response && !loading && (
          <div className="m-auto text-center max-w-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I help you be greener today?</h3>
            <p className="text-gray-500 text-sm">Ask me to analyze your latest logs, suggest vegan recipes, or create a commute reduction plan.</p>
          </div>
        )}

        {loading && (
          <div className="m-auto flex flex-col items-center justify-center text-emerald-600">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             <p className="font-medium animate-pulse">Analyzing sustainability patterns...</p>
          </div>
        )}

        {response && !loading && (
          <div className="prose prose-emerald max-w-none pb-4">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>

      <form onSubmit={handleAskCoach} className="relative mt-auto">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything about sustainability..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white rounded-xl px-4 hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
