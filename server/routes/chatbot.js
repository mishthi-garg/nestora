// server/routes/chatbot.js
//
// POST /api/chatbot/message
//
// Receives the running conversation history from Chatbot.jsx, calls the
// Groq API once, and returns:
//   {
//     reply: string,                 // shown to the user in the chat
//     scores: { <dimension>: 0-3 },  // same 10 keys as Chatbot.jsx's DIMENSIONS
//     acute: boolean                 // true if THIS message should hard-escalate
//   }
//
// Mount this in your main server file, e.g.:
//   import chatbotRouter from "./routes/chatbot.js";
//   app.use("/api/chatbot", chatbotRouter);
//
// Requires: GROQ_API_KEY set as a server-side environment variable
// (in your .env file). NEVER send this key to the frontend — that's the
// whole reason this route exists instead of calling the API directly from
// Chatbot.jsx. Get a free key at https://console.groq.com

import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

const DIMENSIONS = [
  "mood",
  "anhedonia",
  "anxiety",
  "guilt",
  "sleep_disruption",
  "coping",
  "self_harm",
  "physical_general",
  "physical_flag",
  "bonding",
];

// ───────────────────────────── Keyword backstop ─────────────────────────────
//
// The LLM's JSON judgment is the primary signal, but for the single highest-
// stakes case (self-harm / harm-to-baby ideation, or an unambiguous physical
// emergency) we don't want a single point of failure if the model under-calls
// it or the JSON parse fails. This is intentionally narrow — broad keyword
// matching would false-positive constantly ("I could just die of embarrassment").
// Keep this list short, specific, and reviewed by a human before the demo.
const SELF_HARM_BACKSTOP_PATTERNS = [
  /\b(kill myself|end my life|hurt myself|harm myself|hurt the baby|harm the baby|don'?t want to (live|be here)|better off without me)\b/i,
];

const PHYSICAL_EMERGENCY_BACKSTOP_PATTERNS = [
  /\b(heavy bleeding|can'?t stop bleeding|severe pain|can'?t breathe|chest pain|fainted|passed out|baby (isn'?t|stopped) moving)\b/i,
];

function matchesBackstop(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

// ───────────────────────────── System prompt ─────────────────────────────
//
// Asks the model to do two jobs in one response: hold a warm, natural
// conversation AND silently score the message across the same dimensions
// the daily survey uses. The user only ever sees `reply` — `scores` and
// `acute` are parsed out server-side and never forwarded as visible text.

const SYSTEM_PROMPT = `You are a warm, empathetic check-in companion for mothers who are pregnant or in the postpartum period. Your job has two parts:

1. CONVERSATION: Respond like a caring, attentive friend — not a clinician, not a quiz. Ask gentle, open follow-up questions. Normalize hard feelings ("a lot of new moms feel that way") without minimizing them. Never mention scores, assessments, or that you are evaluating her.

2. BACKGROUND SCORING (never shown to the user): silently rate the USER'S LATEST MESSAGE on each of these dimensions, 0-3 (0 = no signal, 1 = mild, 2 = moderate, 3 = severe/acute):
   - mood, anhedonia, anxiety, guilt, sleep_disruption, coping, self_harm, physical_general, physical_flag, bonding

   self_harm: score 3 ONLY for explicit or strongly implied thoughts of self-harm or harming the baby. Do not score 3 for ordinary venting, exhaustion, or hyperbole.
   physical_flag: score 3 for anything suggesting a physical emergency (heavy bleeding, severe pain, baby not moving, can't breathe, fainting).

   Set "acute": true if and only if self_harm or physical_flag scored 3.

Respond with ONLY a single JSON object, no markdown fences, no preamble:
{
  "reply": "your warm conversational response here",
  "scores": { "mood": 0, "anhedonia": 0, "anxiety": 0, "guilt": 0, "sleep_disruption": 0, "coping": 0, "self_harm": 0, "physical_general": 0, "physical_flag": 0, "bonding": 0 },
  "acute": false
}`;

router.post("/message", async (req, res) => {
  console.log("=== CHATBOT ROUTE HIT ===");
  try {
    const { messages, userId } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const latestText = latestUserMessage?.text || "";

    // Groq uses the OpenAI-compatible chat format: { role, content }, with
    // the system prompt as its own message in the array (not a separate
    // top-level field like Anthropic's API).
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
    ];

    const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        response_format: { type: "json_object" }, // Groq's native JSON mode
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error("Groq API error:", errText);
      return res.status(502).json({ error: "Upstream model request failed" });
    }

    const data = await apiResponse.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse model JSON output:", rawText);
      // Fail safe: if we can't parse scores at all, still return a reply so
      // the chat doesn't break, but flag acute=false cautiously and rely
      // entirely on the keyword backstop below for safety in this turn.
      parsed = { reply: rawText || "I'm here with you — could you tell me a bit more?", scores: {}, acute: false };
    }

    // Normalize scores to always have all 10 keys, defaulting missing ones to 0
    const normalizedScores = Object.fromEntries(
      DIMENSIONS.map((dim) => [dim, typeof parsed.scores?.[dim] === "number" ? parsed.scores[dim] : 0])
    );

    // After normalizedScores is computed, in your route handler:
const today = new Date().toISOString().slice(0, 10);

const rows = Object.entries(normalizedScores)
  .filter(([_, severity]) => severity > 0) // don't pollute with 0-signal rows
  .map(([dimension, severity]) => ({
    user_id: userId, // from your auth middleware
    date: today,
    source: "chatbot",
    dimension,
    severity,
  }));
console.log("Rows to insert:", rows);
// if (rows.length > 0) {
//   await supabase.from("wellbeing_scores").insert(rows);
// }
console.log("Normalized scores:", normalizedScores);
console.log(process.env.SUPABASE_URL);
if (rows.length > 0) {
  const { data, error } = await supabase
    .from("wellbeing_scores")
    .insert(rows);

  console.log("Insert result:", data);

  if (error) {
    console.error("Insert error:", error);
  }
}

    // Keyword backstop — runs independently of the model's own judgment.
    // If either fires, force the corresponding score to 3 and acute to true,
    // regardless of what the model returned.
    const selfHarmBackstopHit = matchesBackstop(latestText, SELF_HARM_BACKSTOP_PATTERNS);
    const physicalBackstopHit = matchesBackstop(latestText, PHYSICAL_EMERGENCY_BACKSTOP_PATTERNS);

    if (selfHarmBackstopHit) normalizedScores.self_harm = 3;
    if (physicalBackstopHit) normalizedScores.physical_flag = 3;

    const acute = parsed.acute === true || selfHarmBackstopHit || physicalBackstopHit;

    return res.json({
      reply: parsed.reply || "I'm here with you.",
      scores: normalizedScores,
      acute,
    });
  } catch (err) {
    console.error("Chatbot route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;