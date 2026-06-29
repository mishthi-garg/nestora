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
  // ═══════════════════════════ PHYSICAL RECOVERY (15) ═══════════════════════════
  { id: "preg003", text: "Nausea affected my day.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: true, critical: false, stage: "first_trimester" },
  { id: "preg011", text: "My appetite felt normal today.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false, stage: "first_trimester" },
  { id: "preg001", text: "I noticed my baby's movements today.", section: "Physical Recovery", dimension: "physical_flag", positive: true, required: false, critical: false, stage: "second_trimester" },
  { id: "preg004", text: "I felt physically comfortable during pregnancy today.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: true, critical: false, stage: "second_trimester" },
  { id: "preg022", text: "I felt physically capable of doing my daily tasks.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: false, critical: false, stage: "second_trimester" },
  { id: "preg002", text: "Swelling or cramping affected my day.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: true, critical: false, stage: "third_trimester" },
  { id: "preg005", text: "Back or joint pain affected my day.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "preg014", text: "Heartburn or indigestion affected my day.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "preg025", text: "Swelling in my hands or feet felt concerning today.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "pp001", text: "Recovery felt harder than usual.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp002", text: "Bleeding or pain felt heavier than expected.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp003", text: "Breastfeeding or feeding the baby felt painful today.", section: "Physical Recovery", dimension: "physical_flag", positive: false, required: true, critical: false, stage: "postpartum" },
  { id: "pp004", text: "I felt physically healed from delivery.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: true, critical: false, stage: "postpartum" },
  { id: "pp016", text: "I felt physically exhausted from caring for my baby.", section: "Physical Recovery", dimension: "physical_general", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp021", text: "I felt physically able to keep up with the baby's needs.", section: "Physical Recovery", dimension: "physical_general", positive: true, required: true, critical: false, stage: "postpartum" },

  // ═══════════════════════════ MOOD & EMOTIONS (15) ═══════════════════════════
  { id: "preg024", text: "I felt hopeful about the months ahead.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false, stage: "first_trimester" },
  { id: "preg006", text: "I felt confident about my pregnancy today.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false, stage: "second_trimester" },
  { id: "preg013", text: "I felt connected to my baby today.", section: "Mood & Emotions", dimension: "bonding", positive: true, required: false, critical: false, stage: "second_trimester" },
  { id: "preg020", text: "I felt at peace with my pregnancy today.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false, stage: "second_trimester" },
  { id: "preg008", text: "I felt excited about meeting my baby.", section: "Mood & Emotions", dimension: "bonding", positive: true, required: false, critical: false, stage: "third_trimester" },
  { id: "pp006", text: "I felt emotionally connected to my baby today.", section: "Mood & Emotions", dimension: "bonding", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "pp007", text: "I felt distant from my baby today.", section: "Mood & Emotions", dimension: "bonding", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp012", text: "I felt like myself again today.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "pp013", text: "I felt unrecognisable to myself since giving birth.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp015", text: "I cried more than I expected to today.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp023", text: "I felt happy watching my baby today.", section: "Mood & Emotions", dimension: "bonding", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "both001", text: "I was able to enjoy moments today.", section: "Mood & Emotions", dimension: "anhedonia", positive: true, required: false, critical: false, stage: "both" },
  { id: "both002", text: "I felt emotionally low.", section: "Mood & Emotions", dimension: "mood", positive: false, required: false, critical: false, stage: "both" },
  { id: "both011", text: "I felt emotionally exhausted.", section: "Mood & Emotions", dimension: "mood", positive: false, required: true, critical: false, stage: "both" },
  { id: "both012", text: "I felt hopeful today.", section: "Mood & Emotions", dimension: "mood", positive: true, required: false, critical: false, stage: "both" },

  // ═══════════════════════════ WORRY & MENTAL LOAD (8) ═══════════════════════════
  { id: "preg007", text: "I worried about the baby's health today.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "first_trimester" },
  { id: "preg009", text: "Thoughts about labour and delivery felt overwhelming.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "preg012", text: "I felt anxious about becoming a mother.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "preg019", text: "I felt scared about giving birth.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "preg023", text: "I worried about my ability to be a good mother.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "pp018", text: "I worried something was wrong with my baby today.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "both004", text: "I felt tense or uneasy.", section: "Worry & Mental Load", dimension: "anxiety", positive: false, required: false, critical: false, stage: "both" },
  { id: "both010", text: "I felt mentally settled.", section: "Worry & Mental Load", dimension: "anxiety", positive: true, required: false, critical: false, stage: "both" },

  // ═══════════════════════════ COPING & THOUGHTS (16) ═══════════════════════════
  { id: "preg015", text: "I felt comfortable with how my body is changing.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: true, critical: false, stage: "second_trimester" },
  { id: "preg016", text: "I felt insecure about my changing body.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false, stage: "second_trimester" },
  { id: "preg010", text: "I felt prepared for the baby's arrival.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false, stage: "third_trimester" },
  { id: "preg021", text: "I felt overwhelmed by all the decisions to make before the baby arrives.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false, stage: "third_trimester" },
  { id: "pp008", text: "I felt confident caring for my baby.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "pp009", text: "I felt guilty about not doing enough for my baby.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp017", text: "I felt proud of how I handled today.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: true, critical: false, stage: "postpartum" },
  { id: "pp020", text: "I felt resentment about how much has changed since the baby arrived.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp022", text: "I felt overwhelmed by the responsibility of caring for my baby.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp024", text: "My body felt foreign or unfamiliar to me today.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp025", text: "I felt like I was coping well with this new chapter.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "both005", text: "I felt in control of my day.", section: "Coping & Thoughts", dimension: "coping", positive: true, required: false, critical: false, stage: "both" },
  { id: "both006", text: "I found it difficult to cope.", section: "Coping & Thoughts", dimension: "coping", positive: false, required: false, critical: false, stage: "both" },
  { id: "both007", text: "I blamed myself when things went wrong.", section: "Coping & Thoughts", dimension: "guilt", positive: false, required: false, critical: false, stage: "both" },
  { id: "c011", text: "Things have felt so heavy that I've wished I could just disappear for a while.", section: "Coping & Thoughts", dimension: "self_harm", positive: false, required: false, critical: false, stage: "both" },
  { id: "c012", text: "Thoughts of hurting myself or my baby have crossed my mind.", section: "Coping & Thoughts", dimension: "self_harm", positive: false, required: false, critical: true, stage: "postpartum" },

  // ═══════════════════════════ ENERGY & REST (4) ═══════════════════════════
  { id: "preg017", text: "I had trouble sleeping due to physical discomfort.", section: "Energy & Rest", dimension: "sleep_disruption", positive: false, required: true, critical: false, stage: "third_trimester" },
  { id: "pp005", text: "Sleep deprivation affected my mood today.", section: "Energy & Rest", dimension: "sleep_disruption", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp014", text: "I felt rested despite the baby's schedule.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "both003", text: "I felt rested when I woke up.", section: "Energy & Rest", dimension: "sleep_disruption", positive: true, required: true, critical: false, stage: "both" },

  // ═══════════════════════════ SUPPORT & CONNECTION (7) ═══════════════════════════
  { id: "preg018", text: "I felt supported by people around me during this pregnancy.", section: "Support & Connection", dimension: "coping", positive: true, required: true, critical: false, stage: "first_trimester" },
  { id: "pp010", text: "I had support from family or friends today.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "pp011", text: "I felt completely alone in caring for my baby today.", section: "Support & Connection", dimension: "coping", positive: false, required: false, critical: false, stage: "postpartum" },
  { id: "pp019", text: "I felt comfortable asking for help with the baby.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false, stage: "postpartum" },
  { id: "both008", text: "I felt alone today.", section: "Support & Connection", dimension: "coping", positive: false, required: false, critical: false, stage: "both" },
  { id: "both009", text: "I felt supported today.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false, stage: "both" },
  { id: "both013", text: "I felt comfortable expressing how I felt today.", section: "Support & Connection", dimension: "coping", positive: true, required: false, critical: false, stage: "both" },
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

export function getTodaysQuestions({ stage, seenRecently = [], targetCount = 8 }) {
  console.log("target ",targetCount);
  const eligible = QUESTION_BANK.filter((q) => q.stage === "both" || q.stage === stage);
  console.log("eligible ",eligible.length)
  const required = eligible.filter((q) => q.required);
  console.log("required ",required.length)
  console.log(required);
  const optionalPool = eligible.filter((q) => !q.required);
  console.log("optional ",optionalPool.length)
  const fresh = optionalPool.filter((q) => !seenRecently.includes(q.id));
  const pool = fresh.length >= targetCount - required.length ? fresh : optionalPool;
  console.log("pool ",pool.length)
  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  console.log("required ",required.length)
  console.log("target ",targetCount);
  const slotsLeft = Math.max(targetCount - required.length, 0);
  const optional = shuffled.slice(0, slotsLeft);
  console.log("slots ",slotsLeft)
  // Shuffle final order too, so required questions (esp. the risk pair)
  // don't always land in the same visual position in the flow.
  const combined = [...required, ...optional];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  console.log(combined.length);
  return combined;
}

// ───────────────────────────── DIMENSION AGGREGATION ─────────────────────────────
//
// Per the roadmap: the survey should output a per-dimension severity object,
// the same shape Chatbot.jsx accumulates in its sessionScores state, so the
// two features can merge into one unified profile. This takes the answers
// map produced by DailySurvey ({ [questionId]: severityValue }) and groups
// them by dimension.
//
// Returns: { mood: [2, 3], anxiety: [1], self_harm: [4], ... } — arrays
// because a single day can include more than one question per dimension;
// averaging/trend logic can decide how to collapse this later.

export function aggregateAnswersByDimension(answers, questionsAsked) {
  const result = {};
  questionsAsked.forEach((q) => {
    const severity = answers[q.id];
    if (typeof severity !== "number") return;
    if (!result[q.dimension]) result[q.dimension] = [];
    result[q.dimension].push(severity);
  });
  return result;
}