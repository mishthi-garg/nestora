// questionBank.js
//
// Phase 0 — postpartum daily check-in question bank.
//
// Format: every question uses the SAME 4-point response scale, shown to the
// user as plain text buttons:
//   4 = Most of the time   3 = Sometimes   2 = Rarely   1 = Not at all
//
// Internally, "positive" questions (e.g. "I felt rested") are reverse-scored
// so that, across the whole bank, a HIGHER stored severity always means
// MORE distress/symptom — regardless of how the question was worded. This
// keeps trend/escalation math simple and consistent:
//
//   positive: true   → storedSeverity = 5 - rawResponse   (4="most of time" → 1, low distress)
//   positive: false  → storedSeverity = rawResponse        (4="most of time" → 4, high distress)
//
// Section names ("Section 1 — Physical Recovery" etc.) are INTERNAL ONLY —
// never shown in the survey UI. The user just sees a flowing set of
// statements with the same response scale each time.
//
// dimension = the internal axis this question feeds (used for trend
// detection / dimension scoring later, never shown to the user).
// critical = true means a high-distress answer here fires immediate
// escalation, bypassing trend logic — same hard rule as before.

export const QUESTION_BANK = [
  // ───────────────────────────── Section 1 — Physical Recovery ─────────────────────────────
  { id: "p001", text: "My body felt comfortable today.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },
  { id: "p002", text: "Physical discomfort affected my day.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: true, critical: false },
  { id: "p003", text: "I had enough physical energy today.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },
  { id: "p004", text: "Moving around felt manageable.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },
  { id: "p005", text: "I felt physically exhausted.", section: "Physical Recovery", dimension: "physical_general", positive: false, required: false, critical: false },
  { id: "p006", text: "Recovery felt harder than usual.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: true, critical: false },
  { id: "p007", text: "I felt comfortable during daily activities.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },
  { id: "p008", text: "My body felt rested.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },
  { id: "p009", text: "Physical discomfort made things difficult.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false },
  { id: "p010", text: "I felt physically well overall.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false },

  // ───────────────────────────── Section 2 — Energy & Rest ─────────────────────────────
  { id: "e001", text: "I felt rested when I woke up.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false },
  { id: "e002", text: "Sleep interruptions affected my day.", section: "Energy & Rest", dimension: "sleep_disruption", positive: false, required: true, critical: false },
  { id: "e003", text: "I had enough energy to do what I needed.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false },
  { id: "e004", text: "I felt drained today.", section: "Energy & Rest", dimension: "sleep_disruption", positive: false, required: false, critical: false },
  { id: "e005", text: "Rest helped me recover.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false },
  { id: "e006", text: "I felt mentally refreshed.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false },
  { id: "e007", text: "Small tasks felt exhausting.", section: "Energy & Rest", dimension: "coping", positive: false, required: false, critical: false },
  { id: "e008", text: "I had moments to rest.", section: "Energy & Rest", dimension: "coping", positive: true, required: false, critical: false },
  { id: "e009", text: "I felt more tired than expected.", section: "Energy & Rest", dimension: "sleep_disruption", positive: false, required: false, critical: false },
  { id: "e010", text: "My energy stayed stable today.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false },

  // ───────────────────────────── Section 3 — Mood & Emotions ─────────────────────────────
  { id: "m001", text: "I was able to enjoy moments today.", section: "Mood & Emotions", dimension: "anhedonia", positive: true, required: true, critical: false },
  { id: "m002", text: "I felt emotionally low.", section: "Mood & Emotions", dimension: "mood", positive: false, required: true, critical: false },
  { id: "m003", text: "I looked forward to parts of my day.", section: "Mood & Emotions", dimension: "anhedonia", positive: true, required: false, critical: false },
  { id: "m004", text: "I felt calm and emotionally balanced.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false },
  { id: "m005", text: "I felt overwhelmed emotionally.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false },
  { id: "m006", text: "I felt hopeful today.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false },
  { id: "m007", text: "I found myself becoming emotional unexpectedly.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false },
  { id: "m008", text: "I felt emotionally connected to my day.", section: "Mood & Emotions", dimension: "bonding", positive: true, required: false, critical: false },
  { id: "m009", text: "I felt emotionally exhausted.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false },
  { id: "m010", text: "I felt satisfied with how today went.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false },

  // ───────────────────────────── Section 4 — Worry & Mental Load ─────────────────────────────
  { id: "w001", text: "Worries stayed in my mind today.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false },
  { id: "w002", text: "I felt relaxed most of the day.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false },
  { id: "w003", text: "Small concerns felt difficult to let go of.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false },
  { id: "w004", text: "I felt tense or uneasy.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: true, critical: false },
  { id: "w005", text: "My thoughts felt manageable.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false },
  { id: "w006", text: "I worried more than usual.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false },
  { id: "w007", text: "I felt mentally peaceful.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false },
  { id: "w008", text: "I found it easy to calm my mind.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false },
  { id: "w009", text: "Concerns affected my day.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false },
  { id: "w010", text: "I felt mentally settled.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false },

  // ───────────────────────────── Section 5 — Coping & Thoughts ─────────────────────────────
  { id: "c001", text: "Today felt manageable.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false },
  { id: "c002", text: "I handled challenges well.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false },
  { id: "c003", text: "I felt pressure building up.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false },
  { id: "c004", text: "I felt in control of my day.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false },
  { id: "c005", text: "I found it difficult to cope.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: true, critical: false },
  { id: "c006", text: "I blamed myself when things went wrong.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false },
  { id: "c007", text: "My thoughts felt repetitive.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false },
  { id: "c008", text: "I felt capable today.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false },
  { id: "c009", text: "Things felt harder than usual.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false },
  { id: "c010", text: "I felt confident handling today.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false },

  // Added pair, not in the original list — small, carefully worded, internal-only
  // "risk" dimension. Without something like this, no question in the bank can
  // ever trigger the immediate-escalation rule the rest of the app depends on.
  // Worded gently and placed in the same section/tone as the surrounding guilt
  // and overwhelm questions, so it doesn't stand out as a "test" item.
  { id: "c011", text: "Things have felt so heavy that I've wished I could just disappear for a while.", section: "Coping & Thoughts", dimension: "self_harm", positive: false, required: true, critical: true },
  { id: "c012", text: "Thoughts of hurting myself or my baby have crossed my mind.", section: "Coping & Thoughts", dimension: "self_harm", positive: false, required: true, critical: true },

  // ───────────────────────────── Section 6 — Support & Connection ─────────────────────────────
  { id: "s001", text: "I felt supported today.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s002", text: "I had someone I could talk to.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s003", text: "I felt understood.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s004", text: "I felt alone today.", section: "Support & Connection", dimension: "coping", positive: false, required: true, critical: false },
  { id: "s005", text: "Asking for help felt comfortable.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s006", text: "I felt connected to people around me.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s007", text: "I had time to care for myself.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s008", text: "I felt appreciated.", section: "Support & Connection", dimension: "guilt", positive: true, required: false, critical: false },
  { id: "s009", text: "I felt emotionally supported.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
  { id: "s010", text: "I felt comfortable expressing how I felt.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false },
];

// ───────────────────────────── SCORING HELPER ─────────────────────────────
//
// rawResponse is what the user actually taps: 4, 3, 2, or 1
// ("Most of the time" → "Not at all").
// Returns a severity value on a 1-4 scale where 4 always means
// "most distress/symptom present", regardless of question wording.

export function toSeverity(question, rawResponse) {
  return question.positive ? 5 - rawResponse : rawResponse;
}

// ───────────────────────────── SELECTION ALGORITHM ─────────────────────────────
//
// Same hard guarantee as before: every `required` question is always
// included (this is what keeps physical flags, mood/anxiety core items, and
// the two risk-screening questions from ever being skipped by rotation).
// Remaining slots fill from a shuffled, non-repeating-where-possible pool
// pulled across all 6 sections for variety.

export function getTodaysQuestions({ seenRecently = [], targetCount = 8 }) {
  const required = QUESTION_BANK.filter((q) => q.required);
  const optionalPool = QUESTION_BANK.filter((q) => !q.required);

  const fresh = optionalPool.filter((q) => !seenRecently.includes(q.id));
  const pool = fresh.length >= targetCount - required.length ? fresh : optionalPool;

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const slotsLeft = Math.max(targetCount - required.length, 0);
  const optional = shuffled.slice(0, slotsLeft);

  // Shuffle final order too, so required questions (esp. the risk pair)
  // don't always land in the same visual position in the flow.
  const combined = [...required, ...optional];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}