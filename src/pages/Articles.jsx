import { useState } from "react";
import { ARTICLES, CATEGORY_LABELS } from "../articleData";
import BottomDock from "../components/BottomDock";
// Set from real profile data once available — filters which stage-specific
// articles show by default (user can still browse "both" + opposite stage
// manually via the stage toggle below).
const CURRENT_STAGE = "postpartum";

const CATEGORY_ORDER = [
  "all",
  "mental-health",
  "physical-health",
  "nutrition",
  "medical-tests",
  "labor-birth",
  "high-risk",
  "body-image",
  "relationships",
  "newborn-bonding",
  "preparation",
];

function Articles() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [stageFilter, setStageFilter] = useState(CURRENT_STAGE); // "pregnancy" | "postpartum" | "all"

  const filtered = ARTICLES.filter((a) => {
    const matchesCategory = activeCategory === "all" || a.category === activeCategory;
    const matchesStage =
      stageFilter === "all" || a.stage === stageFilter || a.stage === "both";
    return matchesCategory && matchesStage;
  });

  // Only show category tabs that actually have at least one article for the
  // current stage filter, so the row doesn't list empty categories.
  const visibleCategories = CATEGORY_ORDER.filter((cat) => {
    if (cat === "all") return true;
    return ARTICLES.some(
      (a) =>
        a.category === cat &&
        (stageFilter === "all" || a.stage === stageFilter || a.stage === "both")
    );
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)] mb-1">For you</h2>
      <p className="italic text-sm text-yellow-700 mb-5">
        Articles picked for where you are right now
      </p>

      {/* Stage toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "pregnancy", label: "Pregnancy" },
          { key: "postpartum", label: "Postpartum" },
          { key: "all", label: "All" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStageFilter(opt.key)}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs sm:text-sm border ${
              stageFilter === opt.key
                ? "bg-[rgb(40,20,9)] border-[rgb(40,20,9)] text-white font-medium"
                : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full text-sm border transition
              ${
                activeCategory === cat
                  ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                  : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
              }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div className="flex flex-col gap-3">
        {filtered.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-[rgb(255,214,166)] bg-[rgb(253,246,237)] py-4 px-6 flex items-center justify-between gap-4 hover:border-yellow-700 transition"
          >
            <div>
              <p className="font-medium text-[rgb(40,20,9)] text-sm sm:text-base">
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                  {CATEGORY_LABELS[article.category]}
                </span>
                {article.trimester && (
                  <span className="text-xs text-gray-400">Trimester {article.trimester}</span>
                )}
                <span className="text-xs text-gray-400">{article.source}</span>
              </div>
            </div>
            <span className="text-[rgb(233,131,80)] text-lg shrink-0">→</span>
          </a>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No articles in this category yet.
          </p>
        )}
      </div>
      <BottomDock />
    </div>
  );
}

export default Articles;