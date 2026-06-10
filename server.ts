import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/coach", async (req, res) => {
    try {
      const { prompt, userData } = req.body;
      const context = `You are a strict, helpful, sustainability coach for CarbonIQ. 
      The user has the following data: ${JSON.stringify(userData)}.
      Review their data and explicitly mention their recently earned Eco Points to praise their green actions.
      Provide structured, encouraging, and very actionable insights on how to reduce their carbon footprint.
      Format your response in beautiful markdown, using bullet points and clear headers. Do not output raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: context,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error?.status === "RESOURCE_EXHAUSTED" || error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        res.status(429).json({ error: "The AI Coach has temporarily reached its rate limits. Please try again in a few moments." });
      } else if (error?.status === "UNAVAILABLE" || error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand") || error?.message?.includes("overloaded")) {
        res.status(500).json({ error: "The AI Coach is currently experiencing high demand. Please try again later." });
      } else {
        res.status(500).json({ error: error.message || "An internal error occurred." });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
