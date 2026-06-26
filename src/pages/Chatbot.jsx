import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomDock from "../components/BottomDock";
// Dimensions tracked in the background — per the roadmap, these mirror the
// EPDS-style axes the daily survey scores against (see questionBank.js),
// using the exact same dimension keys so both features feed one unified
// risk profile without needing a name-mapping step later.
//
// physical_general / physical_flag are included so the chatbot can also
// catch physical recovery signals mentioned in free text (e.g. "I can barely
// get up today") even though these aren't EPDS-style mental health items —
// a survey slider may never get tapped on the day it matters most, but a
// conversation can surface it in the moment.
//
// bonding tracks connection-to-baby specifically, distinct from general
// mood — postpartum bonding difficulty is its own recognized concern and
// is exactly the kind of thing someone might only say out loud in a
// conversation ("I don't feel connected to her yet") rather than tap on a
// slider.
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

const ACUTE_THRESHOLD = 3; // 0-3 scale per message; 3 = acute, triggers immediate escalation

const MENTAL_HEALTH_RESOURCES = [
  { label: "iCall Psychosocial Helpline", value: "9152987821" },
  { label: "AASRA 24x7 Crisis Line", value: "9820466726" },
  { label: "Emergency services", value: "112" },
];

const PHYSICAL_EMERGENCY_RESOURCES = [
  { label: "Emergency services / ambulance", value: "112" },
  { label: "Your registered hospital or clinic", value: "" },
];

// Two distinct escalation profiles — a mental health crisis and a physical
// emergency need different language, different resources, and arguably a
// different urgency tone (physical: act now / go in person; mental health:
// you're not alone, here's someone to talk to).
const ESCALATION_CONFIG = {
  mental_health: {
    heading: "Some of what you've shared sounds really heavy, and I want to make sure you're not carrying it alone right now.",
    subtext: "Please consider reaching out to one of these right now — you don't have to handle this alone.",
    resources: MENTAL_HEALTH_RESOURCES,
    ctaLabel: "Connect me to a professional",
    dismissLabel: "Keep talking for now",
  },
  physical: {
    heading: "What you've described sounds like it needs medical attention now, not just a chat.",
    subtext: "Please contact emergency services or go to your nearest hospital right away.",
    resources: PHYSICAL_EMERGENCY_RESOURCES,
    ctaLabel: "Find emergency care near me",
    dismissLabel: "I'll seek care, let me continue for now",
  },
};

function Chatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I'm here to check in with you — no right or wrong answers, just talk to me like you would a friend. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(true);
  const [escalation, setEscalation] = useState(null); // null | { type: "mental_health" | "physical" }
  const [sessionScores, setSessionScores] = useState(
    () => Object.fromEntries(DIMENSIONS.map((d) => [d, []]))
  );
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, escalation]);

  // Calls the backend, NOT the Anthropic API directly — API key must stay server-side.
  // Expected response shape from your backend:
  // {
  //   reply: "string shown to the user",
  //   scores: { mood: 0-3, anhedonia: 0-3, ..., self_harm: 0-3 },
  //   acute: boolean   // backend's own judgment call, in addition to the threshold check below
  // }
  async function sendToBackend(conversationHistory) {
    const res = await fetch("/api/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!res.ok) throw new Error("Chatbot request failed");
    return res.json();
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage = { role: "user", text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsSending(true);

    try {
      const data = await sendToBackend(updatedMessages);

      // Record this message's scores into the running session log
      setSessionScores((prev) => {
        const next = { ...prev };
        DIMENSIONS.forEach((dim) => {
          const value = data.scores?.[dim];
          if (typeof value === "number") {
            next[dim] = [...next[dim], value];
          }
        });
        return next;
      });

      const isPhysicalAcute = (data.scores?.physical_flag ?? 0) >= ACUTE_THRESHOLD;
      const isSelfHarmAcute = (data.scores?.self_harm ?? 0) >= ACUTE_THRESHOLD;
      const isAcute = data.acute === true || isPhysicalAcute || isSelfHarmAcute;

      if (isAcute) {
        // If both fired in the same message, default to physical — acting on
        // a possible medical emergency is the safer call when uncertain.
        const escalationType = isPhysicalAcute ? "physical" : "mental_health";
        setEscalation({ type: escalationType });
        setIsSending(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I'm having trouble connecting right now. Please try again in a moment — and if you need support urgently, you don't have to wait on me for that.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function dismissEscalationAndContinue() {
    const followUp =
      escalation?.type === "physical"
        ? "Okay — please don't wait too long if things change. I'm still here if you want to keep talking."
        : "Okay — I'm still here with you. We can keep talking, and the option to reach someone is right above whenever you're ready.";

    setMessages((prev) => [...prev, { role: "assistant", text: followUp }]);
    setEscalation(null);
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)] mb-2">Check-in</h2>
        <p className="italic text-sm text-yellow-700 mb-5">A safe space to talk through how you're doing</p>
      </div>

      {showDisclosure && (
        <div className="rounded-xl border-2 border-[rgb(255,214,166)] bg-yellow-50 py-6 px-10 mb-4 text-md text-[rgb(40,20,9)]">
          <p className="mb-4">
            This chat is a gentle way for us to understand how you're really doing — physically and
            emotionally — during pregnancy or after birth. There's nothing to prepare for and no
            score you'll be shown. If something you share suggests you might need extra support,
            we'll let you know and help connect you to a professional.
          </p>
            <button
                onClick={() => setShowDisclosure(false)}
                className="cursor-pointer bg-[rgb(40,20,9)] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[rgb(60,35,20)]"
            >
                Got it, let's talk
            </button>
          
        </div>
      )}

      {escalation && (
        <div className="rounded-xl border-2 border-[rgb(193,102,107)] bg-[rgb(255,241,238)] p-4 mb-4">
          <p className="font-semibold text-[rgb(140,60,65)] mb-2">
            {ESCALATION_CONFIG[escalation.type].heading}
          </p>
          <p className="text-sm text-[rgb(140,60,65)] mb-3">
            {ESCALATION_CONFIG[escalation.type].subtext}
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {ESCALATION_CONFIG[escalation.type].resources.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between bg-white rounded-lg border border-[rgb(193,102,107)] px-3 py-2"
              >
                <span className="text-sm text-[rgb(40,20,9)]">{r.label}</span>
                {r.value && (
                  <a
                    href={`tel:${r.value}`}
                    className="text-sm font-semibold text-[rgb(193,102,107)] hover:underline"
                  >
                    {r.value}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(
                  escalation.type === "physical" ? "/specialists" : "/consultation",
                  { state: { urgent: true } }
                )
              }
              className="cursor-pointer flex-1 bg-[rgb(40,20,9)] text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-[rgb(60,35,20)]"
            >
              {ESCALATION_CONFIG[escalation.type].ctaLabel}
            </button>
            <button
              onClick={dismissEscalationAndContinue}
              className="cursor-pointer flex-1 border border-[rgb(193,102,107)] text-[rgb(140,60,65)] rounded-lg px-3 py-2 text-sm font-medium hover:bg-[rgb(255,241,238)]"
            >
              {ESCALATION_CONFIG[escalation.type].dismissLabel}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
              m.role === "user"
                ? "self-end bg-[rgb(40,20,9)] text-white"
                : "self-start bg-[rgb(253,246,237)] border border-yellow-700 text-[rgb(40,20,9)]"
            }`}
          >
            {m.text}
          </div>
        ))}
        {isSending && (
          <div className="self-start bg-[rgb(253,246,237)] border border-yellow-700 text-[rgb(40,20,9)] px-4 py-2.5 rounded-2xl text-sm">
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-700 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-700 animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-700 animate-bounce [animation-delay:0.3s]"></span>
            </span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mb-12 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type how you're feeling..."
          rows={1}
          disabled={isSending}
          className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-700"
        />
        <button
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          className="cursor-pointer bg-[rgb(40,20,9)] text-white rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-[rgb(60,35,20)]"
        >
          Send
        </button>
      </div>
      <BottomDock />
    </div>
  );
}

export default Chatbot;