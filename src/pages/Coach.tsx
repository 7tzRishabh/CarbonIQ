import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Leaf, Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCoach } from "../hooks/useCoach";

export default function Coach() {
  const { ecoPoints } = useAuth();
  const { prompt, setPrompt, response, loading, askCoach } = useCoach();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-500" /> AI Sustainability Coach
        </h1>
        <p className="text-gray-500 mt-1">Ask for customized carbon reduction advice or plan your 30-day roadmap.</p>
      </header>

      <div id="coach-response-area" aria-live="polite" className="flex-1 overflow-y-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col mb-4">
        {!response && !loading && (
          <div className="m-auto text-center max-w-sm">
            <div aria-hidden="true" className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I help you be greener today?</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed">Ask me about low-carbon recipes, travel tips, or ways to save energy at home. I can also help you understand your {ecoPoints} Eco Points!</p>
          </div>
        )}

        {loading && (
          <div className="m-auto flex flex-col items-center justify-center text-emerald-700" role="status">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             <p className="font-bold animate-pulse">Analyzing sustainability patterns...</p>
          </div>
        )}

        {response && !loading && (
          <div className="prose prose-emerald max-w-none pb-4">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>

      <form onSubmit={askCoach} aria-label="Sustainability chat" className="relative mt-auto">
        <label htmlFor="coach-prompt" className="sr-only">Ask the sustainability coach</label>
        <input
          type="text"
          id="coach-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything about sustainability..."
          className="w-full bg-white border border-gray-300 rounded-2xl py-4 pl-6 pr-16 text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          disabled={loading}
          aria-controls="coach-response-area"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          aria-label="Send message"
          className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white rounded-xl px-4 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-emerald-200"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
