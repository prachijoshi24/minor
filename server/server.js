// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const REQUIRED_ENV = ["GROQ_API_KEY"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing ${key} in environment. AI responses will be disabled.`);
  }
});

const groqEnabled = Boolean(process.env.GROQ_API_KEY);
const client = groqEnabled ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    aiReady: groqEnabled,
  });
});

app.post("/api/ai", async (req, res) => {
  if (!groqEnabled) {
    return res.status(503).json({ error: "AI is temporarily unavailable." });
  }

  const { message = "", transcript = [] } = req.body || {};
  const trimmed = String(message).trim();
  if (!trimmed) {
    return res.status(400).json({ error: "Please provide a prompt." });
  }

  const sanitizedHistory = Array.isArray(transcript)
    ? transcript
        .filter((entry) => entry && entry.role && entry.content)
        .slice(-6)
    : [];

  try {
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "You are SereniBloom, a gentle CBT companion. You ask thoughtful questions, validate feelings, and help users identify thoughts, emotions, and behaviors. Keep responses short, warm, and guided.",
        },
        ...sanitizedHistory,
        { role: "user", content: trimmed },
      ],
    });

    const reply = response.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Empty response from model");
    }

    res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI unavailable right now." });
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unexpected server error", err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(5002, () => {
  console.log("✨ AI Therapist backend running on http://localhost:5002");
});