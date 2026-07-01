// src/lib/fetchHistory.js
import { supabase } from "../supabaseClient";

export async function fetchHistory(userId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("wellbeing_scores")
    .select("date, dimension, severity")
    .eq("user_id", userId)
    .gte("date", sinceStr)
    .order("date", { ascending: true });

  if (error || !data) return [];

  // Reshape flat rows into the shape detectTrend() expects:
  // [{ date, scores: { mood: [2,3], anxiety: [1], ... } }, ...]
  const byDate = {};
  data.forEach(({ date, dimension, severity }) => {
    if (!byDate[date]) byDate[date] = { date, scores: {} };
    if (!byDate[date].scores[dimension]) byDate[date].scores[dimension] = [];
    byDate[date].scores[dimension].push(severity);
  });

  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
}