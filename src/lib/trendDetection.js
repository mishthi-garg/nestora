// src/lib/trendDetection.js
//
// Reads the last N days of stored dimension scores and returns a flag
// if a declining trend is detected across any key dimension, or if any
// single day contained an acute signal.
//
// Input shape (same as what DailySurvey produces via aggregateAnswersByDimension):
// history = [
//   { date: "2026-06-28", scores: { mood: [2,3], anxiety: [1], ... } },
//   { date: "2026-06-29", scores: { mood: [3],   anxiety: [2], ... } },
//   { date: "2026-06-30", scores: { mood: [4],   anxiety: [3], ... } },
// ]
// Sorted oldest → newest.
//
// Returns: { flagged: boolean, reason: string | null }

// Dimensions considered "key" for trend detection — physical dimensions
// are intentionally excluded here since their fluctuation is normal
// recovery variation; we only flag sustained mental/emotional decline.
const KEY_DIMENSIONS = ["mood", "anxiety", "coping", "sleep_disruption", "self_harm"];

// How many consecutive days of worsening to flag as a trend.
const TREND_WINDOW = 3;

// Average severity score above which a single day is "concerning"
// (on a 1-4 scale, 2.5+ across a key dimension means more distress than calm).
const SINGLE_DAY_THRESHOLD = 2.5;

// Average severity score that by itself is acute enough to flag
// even without a trend (self_harm above 1 in any day = flag immediately).
const ACUTE_DIMENSION_THRESHOLD = { self_harm: 1 };

function avgScore(scoresArray) {
  if (!scoresArray || scoresArray.length === 0) return 0;
  return scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length;
}

export function detectTrend(history) {
  if (!history || history.length === 0) return { flagged: false, reason: null };

  // Check for any acute self_harm signal in any day — flag immediately
  for (const day of history) {
    for (const [dim, threshold] of Object.entries(ACUTE_DIMENSION_THRESHOLD)) {
      if (avgScore(day.scores?.[dim]) > threshold) {
        return {
          flagged: true,
          reason: "We've noticed some heavy moments in your recent check-ins — want to talk?",
        };
      }
    }
  }

  // Need at least TREND_WINDOW days to detect a trend
  if (history.length < TREND_WINDOW) return { flagged: false, reason: null };

  const recent = history.slice(-TREND_WINDOW); // last N days

  // For each key dimension, check if average score is consistently worsening
  for (const dim of KEY_DIMENSIONS) {
    const dailyAvgs = recent.map((day) => avgScore(day.scores?.[dim]));

    // Skip if this dimension has no data in this window
    if (dailyAvgs.every((v) => v === 0)) continue;

    // Check if scores are strictly increasing (worsening) across the window
    const isWorsening = dailyAvgs.every(
      (val, i) => i === 0 || val >= dailyAvgs[i - 1]
    );

    // Also check if the most recent day's average crosses the concern threshold
    const latestAvg = dailyAvgs[dailyAvgs.length - 1];

    if (isWorsening && latestAvg >= SINGLE_DAY_THRESHOLD) {
      return {
        flagged: true,
        reason: "I've noticed things have felt a bit heavier lately — want to check in?",
      };
    }
  }

  return { flagged: false, reason: null };
}