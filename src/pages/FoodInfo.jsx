import { useState, useMemo } from "react";
import BottomDock from "../components/BottomDock";
import GooeySearch from "../components/GooeySearch";
import {
  IconCircleCheck,
  IconCircleX,
  IconAlertTriangle,
} from "@tabler/icons-react";

const styles = `
  .cieat-root, .cieat-root *, .cieat-root *::before, .cieat-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
  .gooey-reset,
  .gooey-reset * {
      all: revert;
      box-sizing: border-box;
  }

  .cieat-root {
    --warm-bg: rgb(253,246,237);
    --warm-border: rgb(255,214,166);
    --warm-dark: rgb(40,20,9);
    --orange-active: rgb(233,131,80);
    --text-muted: #6b7280;
    --surface: #ffffff;
    --surfac  e-alt: rgb(249,246,241);
    --border-soft: rgb(255,225,180);
    --green: #2D7D5A;
    --green-light: #EBF7F1;
    --green-border: #A8D9C2;
    --amber: #B45309;
    --amber-light: #FEF3C7;
    --amber-border: #FCD34D;
    --red: rgb(140,60,65);
    --red-light: rgb(255,241,238);
    --red-border: rgb(255,190,180);
    --font: 'Segoe UI', system-ui, -apple-system, sans-serif;
    --radius: 12px;
    font-family: var(--font);
    background: var(--surface-alt);
    color: var(--warm-dark);
    min-height: 100vh;
  }

  .cieat-header {
    background: var(--surface);
    border-bottom: 1.5px solid var(--warm-border);
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .cieat-logo {
    width: 36px; height: 36px;
    background: var(--warm-bg);
    border: 1.5px solid var(--warm-border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .cieat-header h1 { font-size: 17px; font-weight: 700; color: var(--warm-dark); letter-spacing: -0.01em; }
  .cieat-header p  { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

  .cieat-main {
    max-width: 800px;
    margin: 0 auto;
    padding: 0;
  }

  .cieat-search-wrap {
    background: var(--surface);
    border: 2px solid var(--warm-border);
    border-radius: var(--radius);
    padding: 1.125rem 1.125rem 0.875rem;
    margin-bottom: 1.25rem;
  }

  .cieat-search-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--warm-dark);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .cieat-search-input-wrap { position: relative; }
  .cieat-search-input-wrap svg {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%); color: var(--text-muted); pointer-events: none;
  }
  .cieat-search-input-wrap input {
    width: 100%; padding: 11px 14px 11px 38px;
    font-size: 15px; font-family: var(--font);
    color: var(--warm-dark);
    background: var(--warm-bg);
    border: 1.5px solid var(--warm-border);
    border-radius: 10px; outline: none;
    transition: border-color 0.15s;
  }
  .cieat-search-input-wrap input:focus { border-color: var(--orange-active); background: #fff; }
  .cieat-search-input-wrap input::placeholder { color: var(--text-muted); }

  .cieat-search-hint {
    font-size: 11.5px; color: var(--text-muted);
    margin-top: 8px; display: flex; align-items: center; gap: 5px;
  }

  .cieat-result-card {
    background: var(--surface);
    border: 2px solid var(--warm-border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .cieat-result-header {
    background: var(--warm-bg);
    padding: 0.875rem 1.125rem;
    border-bottom: 1.5px solid var(--warm-border);
    display: flex; align-items: center; gap: 10px;
  }

  .cieat-food-emoji { font-size: 22px; }
  .cieat-result-header h2 { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }

  .cieat-status-section {
    padding: 0.875rem 1.125rem;
    border-bottom: 1px solid var(--border-soft);
  }
  .cieat-status-section:last-child { border-bottom: none; }

  .cieat-section-eyebrow {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 8px;
  }

  .cieat-status-row { display: flex; align-items: flex-start; gap: 10px; }

  .cieat-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 700;
    white-space: nowrap; flex-shrink: 0; margin-top: 1px;
  }
  .cieat-badge-safe    { background: var(--green-light); color: var(--green); border: 1.5px solid var(--green-border); }
  .cieat-badge-avoid   { background: var(--red-light);   color: var(--red);   border: 1.5px solid var(--red-border);   }
  .cieat-badge-caution { background: var(--amber-light); color: var(--amber); border: 1.5px solid var(--amber-border); }

  .cieat-status-text { flex: 1; }
  .cieat-status-reason { font-size: 13px; color: #374151; line-height: 1.6; }
  .cieat-status-source { font-size: 11px; color: var(--text-muted); margin-top: 5px; }

  .cieat-no-result {
    background: var(--red-light);
    border: 2px solid var(--warm-border);
    border-radius: var(--radius);
    padding: 1.75rem 1.5rem;
    margin-bottom: 1.25rem;
    text-align: center;
  }
  .cieat-no-result-icon { font-size: 28px; margin-bottom: 10px; }
  .cieat-no-result h3 { font-size: 15px; font-weight: 700; color: var(--warm-dark); margin-bottom: 6px; }
  .cieat-no-result p  { font-size: 13px; color: #6b7280; line-height: 1.6; max-width: 320px; margin: 0 auto; }

  .cieat-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
  .cieat-tab {
    flex: 1; padding: 8px 10px;
    background: var(--surface); border: 1.5px solid var(--warm-border);
    border-radius: 10px; font-size: 12.5px; font-weight: 600;
    color: var(--text-muted); cursor: pointer; text-align: center;
    transition: all 0.12s; font-family: var(--font);
  }
  .cieat-tab:hover  { background: var(--warm-bg); }
  .cieat-tab.active { background: var(--warm-bg); border-color: var(--orange-active); color: var(--warm-dark); }

  .cieat-legend { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
  .cieat-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); }
  .cieat-dot         { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cieat-dot-safe    { background: var(--green); }
  .cieat-dot-avoid   { background: var(--red); }
  .cieat-dot-caution { background: var(--amber); }

  .cieat-category-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--orange-active); margin: 1.25rem 0 8px;
  }

  .cieat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    gap: 8px;
  }

  .cieat-chip {
    background: var(--surface);
    border: 1.5px solid var(--warm-border);
    border-radius: 10px; padding: 10px 12px;
    cursor: pointer; text-align: left;
    transition: border-color 0.12s, background 0.12s;
    width: 100%; font-family: var(--font);
  }
  .cieat-chip:hover { border-color: var(--orange-active); background: var(--warm-bg); }
  .cieat-chip-name  { font-size: 13px; font-weight: 600; color: var(--warm-dark); margin-bottom: 5px; display: block; }
  .cieat-chip-dots  { display: flex; gap: 5px; align-items: center; }

  .cieat-disclaimer {
    margin-top: 2rem; padding: 0.875rem 1.125rem;
    background: var(--surface); border: 1.5px solid var(--warm-border);
    border-radius: var(--radius); font-size: 12px;
    color: var(--text-muted); line-height: 1.6; text-align: center;
  }
`;

const FOODS = [
  { name: "Spinach", emoji: "🥬", category: "Vegetables", pregnancy: { status: "safe", reason: "Excellent source of folate and iron — both critical in pregnancy to support neural tube development and prevent anaemia.", source: "Hopkins Medicine, NHS" }, postpartum: { status: "safe", reason: "Iron-rich leafy green that helps replenish blood lost during delivery. Pairs well with vitamin C foods for better absorption.", source: "UNICEF, Cloudnine" } },
  { name: "Kale", emoji: "🥬", category: "Vegetables", pregnancy: { status: "safe", reason: "High in folate, iron, and fibre. Supports healthy fetal development and keeps digestion on track.", source: "Healthline, Mayo Clinic" }, postpartum: { status: "safe", reason: "Nutrient-dense green that supports postpartum recovery and helps replenish iron stores.", source: "Cloudnine" } },
  { name: "Sweet potato", emoji: "🍠", category: "Vegetables", pregnancy: { status: "safe", reason: "Rich in beta-carotene (vitamin A), potassium, and fibre. Supports fetal eye and skin development.", source: "Healthline, Apollo" }, postpartum: { status: "safe", reason: "Provides sustained energy and vitamin A to support healing and breast milk quality.", source: "Cloudnine" } },
  { name: "Broccoli", emoji: "🥦", category: "Vegetables", pregnancy: { status: "safe", reason: "Packed with vitamin C, folate, calcium, and fibre. One of the most nutrient-dense vegetables during pregnancy.", source: "Mayo Clinic, Healthline" }, postpartum: { status: "safe", reason: "Supports immunity and tissue repair. Good source of calcium for lactating mothers.", source: "Cloudnine" } },
  { name: "Carrots", emoji: "🥕", category: "Vegetables", pregnancy: { status: "safe", reason: "High in beta-carotene and vitamin A. Supports fetal eye development and immune function.", source: "Apollo, Healthline" }, postpartum: { status: "safe", reason: "Easy to digest and nutrient-rich. Supports postpartum immunity and skin healing.", source: "Cloudnine" } },
  { name: "Red bell pepper", emoji: "🫑", category: "Vegetables", pregnancy: { status: "safe", reason: "One of the best sources of vitamin C in vegetables. Supports iron absorption and tissue repair.", source: "Apollo, Mayo Clinic" }, postpartum: { status: "safe", reason: "Vitamin C content helps the body absorb iron from plant sources — important after delivery.", source: "UNICEF" } },
  { name: "Methi (fenugreek)", emoji: "🌿", category: "Vegetables", pregnancy: { status: "caution", reason: "Small culinary amounts are generally fine. Medicinal doses may stimulate uterine contractions — avoid supplements.", source: "ACOG" }, postpartum: { status: "safe", reason: "Traditional galactagogue (milk booster). Commonly used in Indian postpartum cooking to increase breast milk supply.", source: "Cloudnine, Max Healthcare" } },
  { name: "Banana", emoji: "🍌", category: "Fruits", pregnancy: { status: "safe", reason: "Rich in potassium, B6, and natural sugars. Helps combat nausea in early pregnancy and provides quick energy.", source: "Healthline, WebMD" }, postpartum: { status: "safe", reason: "Easy to eat one-handed (practically designed for new mothers). Good source of potassium and quick energy.", source: "Cloudnine" } },
  { name: "Orange", emoji: "🍊", category: "Fruits", pregnancy: { status: "safe", reason: "High in vitamin C, folate, and water content. Combats nausea and supports tissue repair.", source: "Hopkins Medicine, MedlinePlus" }, postpartum: { status: "safe", reason: "Vitamin C boosts iron absorption and immunity. Hydrating and easy to eat.", source: "UNICEF, Cloudnine" } },
  { name: "Mango", emoji: "🥭", category: "Fruits", pregnancy: { status: "safe", reason: "Rich in vitamins A and C, folate, and fibre. Enjoy in moderation — high natural sugar content.", source: "Apollo, Healthline" }, postpartum: { status: "safe", reason: "Provides vitamins A and C for healing and immunity. Safe during breastfeeding.", source: "Cloudnine" } },
  { name: "Strawberries", emoji: "🍓", category: "Fruits", pregnancy: { status: "safe", reason: "High in vitamin C, folate, and antioxidants. Supports immune function and iron absorption.", source: "Healthline, WebMD" }, postpartum: { status: "safe", reason: "Antioxidant-rich and hydrating. Supports postpartum recovery and is safe while breastfeeding.", source: "Cloudnine" } },
  { name: "Blueberries", emoji: "🫐", category: "Fruits", pregnancy: { status: "safe", reason: "Packed with antioxidants, vitamin C, and fibre. Supports healthy blood pressure and fetal brain development.", source: "Healthline" }, postpartum: { status: "safe", reason: "Rich in antioxidants that support postpartum healing and reduce inflammation.", source: "Cloudnine" } },
  { name: "Papaya (unripe)", emoji: "🍈", category: "Fruits", pregnancy: { status: "avoid", reason: "Unripe or semi-ripe papaya contains latex that may trigger uterine contractions. Avoid entirely during pregnancy.", source: "ACOG" }, postpartum: { status: "safe", reason: "Ripe papaya is safe and nutritious. Traditionally used in India to support breast milk production.", source: "NHS, Cloudnine" } },
  { name: "Pineapple", emoji: "🍍", category: "Fruits", pregnancy: { status: "caution", reason: "Safe in normal food amounts. Large quantities of bromelain theoretically may soften the cervix, though evidence is weak.", source: "ACOG" }, postpartum: { status: "safe", reason: "Safe and nutritious postpartum. Good source of vitamin C and manganese for tissue repair.", source: "NHS" } },
  { name: "Guava", emoji: "🍐", category: "Fruits", pregnancy: { status: "safe", reason: "Very high in vitamin C, folate, and fibre. One of the best fruits for pregnancy nutrition.", source: "Apollo" }, postpartum: { status: "safe", reason: "Rich in vitamin C which boosts iron absorption. An excellent postpartum fruit, especially amla and guava.", source: "Cloudnine, UNICEF" } },
  { name: "Pasteurised milk", emoji: "🥛", category: "Dairy", pregnancy: { status: "safe", reason: "Excellent source of calcium, casein, and whey protein. Essential for building the baby's bones and teeth.", source: "Hopkins Medicine, NHS" }, postpartum: { status: "safe", reason: "Calcium supports bone recovery and breast milk production. Aim for low-fat or full-fat pasteurised milk.", source: "Cloudnine, Apollo Cradle" } },
  { name: "Yogurt / curd", emoji: "🥣", category: "Dairy", pregnancy: { status: "safe", reason: "Rich in calcium, probiotics, and protein. Supports gut health and calcium intake during pregnancy.", source: "Hopkins Medicine, Healthline" }, postpartum: { status: "safe", reason: "Probiotics support gut health after delivery. Good source of calcium for lactating mothers.", source: "Cloudnine" } },
  { name: "Paneer", emoji: "🧀", category: "Dairy", pregnancy: { status: "safe", reason: "High-quality protein and calcium from pasteurised milk. A key protein source for vegetarian mothers.", source: "Apollo, Geims Hospital" }, postpartum: { status: "safe", reason: "Excellent protein and calcium source for postpartum recovery and lactation.", source: "Cloudnine, Apollo Cradle" } },
  { name: "Hard cheese", emoji: "🧀", category: "Dairy", pregnancy: { status: "safe", reason: "Hard cheeses like cheddar, parmesan, and mozzarella are safe provided the dairy is pasteurised.", source: "NHS, Healthline" }, postpartum: { status: "safe", reason: "Safe and a good source of calcium and protein for postpartum recovery.", source: "NHS" } },
  { name: "Soft cheese", emoji: "🫙", category: "Dairy", pregnancy: { status: "avoid", reason: "Mould-ripened soft cheeses (brie, camembert, blue cheese) carry a listeria risk that can harm the baby.", source: "NHS" }, postpartum: { status: "safe", reason: "Safe once the baby is born, including while breastfeeding.", source: "NHS" } },
  { name: "Eggs", emoji: "🥚", category: "Proteins", pregnancy: { status: "safe", reason: "High-quality protein and choline — critical for the baby's brain development. Fully cooked eggs are always safe.", source: "Healthline, Max Healthcare" }, postpartum: { status: "safe", reason: "Excellent protein for tissue repair and recovery. Choline continues to support the baby's brain via breast milk.", source: "Tufts Medicine, Cloudnine" } },
  { name: "Chicken", emoji: "🍗", category: "Proteins", pregnancy: { status: "safe", reason: "Lean protein providing zinc and B vitamins. Must be thoroughly cooked — no pink in the middle.", source: "Healthline, Max Healthcare" }, postpartum: { status: "safe", reason: "A key postpartum recovery food in Indian tradition. Chicken soup and broths are especially recommended for healing.", source: "Cloudnine, Apollo Cradle" } },
  { name: "Salmon", emoji: "🐟", category: "Proteins", pregnancy: { status: "caution", reason: "Safe if fully cooked. Rich in omega-3 fatty acids for fetal brain development. Limit to 2 servings/week due to mercury. Avoid raw.", source: "ACOG, NHS" }, postpartum: { status: "safe", reason: "Excellent omega-3 source that supports postpartum recovery and breast milk quality.", source: "WebMD, UNICEF" } },
  { name: "Lentils / dal", emoji: "🫘", category: "Proteins", pregnancy: { status: "safe", reason: "Outstanding source of folate, iron, fibre, and plant-based protein. Among the most important foods in a vegetarian pregnancy diet.", source: "Healthline, Max Healthcare" }, postpartum: { status: "safe", reason: "Easy to digest and rich in iron and protein. A staple of traditional Indian postpartum recovery diets.", source: "Cloudnine" } },
  { name: "Chickpeas", emoji: "🫘", category: "Proteins", pregnancy: { status: "safe", reason: "Rich in protein, folate, iron, and fibre. A key legume for vegetarian mothers.", source: "Healthline" }, postpartum: { status: "safe", reason: "Good plant-based protein source that supports postpartum tissue repair.", source: "Cloudnine" } },
  { name: "Tofu", emoji: "🟨", category: "Proteins", pregnancy: { status: "safe", reason: "Complete plant-based protein with calcium and iron. A good meat alternative for vegetarian mothers.", source: "Healthline" }, postpartum: { status: "safe", reason: "Plant-based protein that supports healing. Safe during breastfeeding.", source: "WebMD, UNICEF" } },
  { name: "Liver", emoji: "🥩", category: "Proteins", pregnancy: { status: "avoid", reason: "Very high in vitamin A (retinol). Excess retinol during pregnancy is linked to birth defects.", source: "NHS, ACOG" }, postpartum: { status: "caution", reason: "Safe in moderation if not breastfeeding. Limit if breastfeeding due to very high vitamin A content.", source: "NHS" } },
  { name: "Sushi (raw)", emoji: "🍣", category: "Proteins", pregnancy: { status: "avoid", reason: "Raw fish risks listeria and mercury exposure, both harmful to fetal development.", source: "ACOG, NHS" }, postpartum: { status: "caution", reason: "Generally safe if not breastfeeding. If breastfeeding, avoid high-mercury fish like tuna and swordfish.", source: "ACOG" } },
  { name: "Oats", emoji: "🌾", category: "Grains & Fats", pregnancy: { status: "safe", reason: "Complex carbohydrates that provide sustained energy and help prevent constipation.", source: "Healthline, Apollo" }, postpartum: { status: "safe", reason: "Highly recommended postpartum grain. Easy to digest and traditionally known to support breast milk supply.", source: "Healthline, Cloudnine" } },
  { name: "Brown rice", emoji: "🍚", category: "Grains & Fats", pregnancy: { status: "safe", reason: "Whole grain providing sustained energy and fibre. Better than refined white rice for blood sugar management.", source: "Healthline, Apollo" }, postpartum: { status: "safe", reason: "Brown rice and khichdi (rice and lentils) are core Indian postpartum recovery foods. Gentle on digestion.", source: "Cloudnine, Manipal Hospitals" } },
  { name: "Whole wheat bread", emoji: "🍞", category: "Grains & Fats", pregnancy: { status: "safe", reason: "Provides complex carbohydrates, fibre, and B vitamins for sustained energy.", source: "Healthline" }, postpartum: { status: "safe", reason: "Fibre-rich carb that helps prevent postpartum constipation and provides sustained energy.", source: "WebMD, Healthline" } },
  { name: "Walnuts", emoji: "🌰", category: "Grains & Fats", pregnancy: { status: "safe", reason: "Rich in omega-3 fatty acids (ALA), which support fetal brain and eye development.", source: "Healthline" }, postpartum: { status: "safe", reason: "Excellent source of omega-3s and iron. A key nut in postpartum recovery diets.", source: "Cloudnine, UNICEF" } },
  { name: "Almonds", emoji: "🌰", category: "Grains & Fats", pregnancy: { status: "safe", reason: "Rich in protein, healthy fats, calcium, and magnesium. An excellent pregnancy snack.", source: "Mayo Clinic, Apollo" }, postpartum: { status: "safe", reason: "Traditional postpartum snack in India. Provides protein, calcium, and healthy fats for recovery and lactation.", source: "Cloudnine" } },
  { name: "Chia seeds", emoji: "🫙", category: "Grains & Fats", pregnancy: { status: "safe", reason: "High in omega-3s, fibre, and calcium. Supports fetal brain development and maternal digestion.", source: "Healthline" }, postpartum: { status: "safe", reason: "Rich in omega-3 and fibre. Supports recovery and can be easily added to porridge or smoothies.", source: "Cloudnine" } },
  { name: "Ghee", emoji: "🧈", category: "Grains & Fats", pregnancy: { status: "caution", reason: "Safe in moderate amounts. Provides fat-soluble vitamins. Avoid excess — high in saturated fat.", source: "Apollo" }, postpartum: { status: "safe", reason: "A cornerstone of Indian postpartum recovery. Moderate ghee provides calories for lactation and supports wound healing.", source: "Cloudnine" } },
  { name: "Caffeine / coffee", emoji: "☕", category: "Drinks & Other", pregnancy: { status: "caution", reason: "Limit to under 200mg/day (roughly one cup of coffee). Excess is linked to low birth weight.", source: "NHS" }, postpartum: { status: "caution", reason: "Up to 300mg/day is generally fine while breastfeeding, though some babies are more sensitive to caffeine.", source: "NHS" } },
  { name: "Alcohol", emoji: "🍷", category: "Drinks & Other", pregnancy: { status: "avoid", reason: "No safe amount is known during pregnancy. Linked to fetal alcohol spectrum disorder.", source: "ACOG, NHS" }, postpartum: { status: "caution", reason: "If breastfeeding, wait 2–3 hours after a single drink before nursing. Avoid heavy or regular drinking.", source: "ACOG" } },
  { name: "Honey", emoji: "🍯", category: "Drinks & Other", pregnancy: { status: "safe", reason: "Safe for the mother. Botulism spores are not a risk to adults — only to infants under 12 months.", source: "NHS" }, postpartum: { status: "safe", reason: "Safe for the mother. Do not give honey directly to the baby until after their first birthday.", source: "NHS" } },
  { name: "Coconut water", emoji: "🥥", category: "Drinks & Other", pregnancy: { status: "safe", reason: "Natural electrolytes and hydration. A gentle option to combat nausea and dehydration.", source: "WebMD" }, postpartum: { status: "safe", reason: "Excellent hydration for lactating mothers. Helps replenish electrolytes lost during delivery.", source: "Cloudnine, Max Healthcare" } },
  { name: "Gond ladoo", emoji: "🍬", category: "Drinks & Other", pregnancy: { status: "caution", reason: "Traditional Indian sweet. Generally considered safe in moderation, but consult your doctor if you have gestational diabetes.", source: "Cloudnine" }, postpartum: { status: "safe", reason: "A traditional Indian postpartum food made with edible gum, nuts, and ghee. Supports recovery and lactation.", source: "Cloudnine" } },
  { name: "Fennel (saunf)", emoji: "🌿", category: "Drinks & Other", pregnancy: { status: "caution", reason: "Culinary amounts (seeds in cooking, mild tea) are generally safe. Medicinal doses or concentrated supplements should be avoided.", source: "ACOG" }, postpartum: { status: "safe", reason: "Traditional lactation booster. Fennel tea is widely used in India to support breast milk supply.", source: "Cloudnine, Max Healthcare" } },
];

// const BADGE_CONFIG = {
//   safe:    { cls: "cieat-badge-safe",    icon: "✓", label: "Safe"    },
//   avoid:   { cls: "cieat-badge-avoid",   icon: "✕", label: "Avoid"   },
//   caution: { cls: "cieat-badge-caution", icon: "!", label: "Caution" },
// };

const BADGE_CONFIG = {
  safe: {
    cls: "cieat-badge-safe",
    icon: IconCircleCheck,
    label: "Safe",
  },
  avoid: {
    cls: "cieat-badge-avoid",
    icon: IconCircleX,
    label: "Avoid",
  },
  caution: {
    cls: "cieat-badge-caution",
    icon: IconAlertTriangle,
    label: "Caution",
  },
};

const DOT_CLASS = {
  safe: "cieat-dot-safe",
  avoid: "cieat-dot-avoid",
  caution: "cieat-dot-caution",
};

// function Badge({ status }) {
//   const { cls, icon, label } = BADGE_CONFIG[status];
//   return <span className={`cieat-badge ${cls}`}>{icon} {label}</span>;
// }

function Badge({ status }) {
  const { cls, icon: Icon, label } = BADGE_CONFIG[status];

  return (
    <span className={`cieat-badge ${cls}`}>
      <Icon size={16} stroke={2} />
      <span>{label}</span>
    </span>
  );
}

function Dot({ status }) {
  return <span className={`cieat-dot ${DOT_CLASS[status]}`} />;
}

function StatusSection({ eyebrow, data }) {
  return (
    <div className="cieat-status-section">
      <div className="cieat-section-eyebrow">{eyebrow}</div>
      <div className="cieat-status-row">
        <Badge status={data.status} />
        <div className="cieat-status-text">
          <div className="cieat-status-reason">{data.reason}</div>
          <div className="cieat-status-source">Source: {data.source}</div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ food }) {
  return (
    <div className="cieat-result-card">
      <div className="cieat-result-header">
        <span className="cieat-food-emoji">{food.emoji}</span>
        <h2>{food.name}</h2>
      </div>
      <StatusSection eyebrow="During pregnancy" data={food.pregnancy} />
      <StatusSection eyebrow="Postpartum / breastfeeding" data={food.postpartum} />
    </div>
  );
}

function NoResult({ query }) {
  return (
    <div className="cieat-no-result">
      <div className="cieat-no-result-icon">🔍</div>
      <h3>Not in our list yet</h3>
      <p>"{query}" isn't in our database yet. When in doubt, check with your doctor or midwife — they're the best source for personalised advice.</p>
    </div>
  );
}

function FoodGrid({ foods, tab, onSelect }) {
  const categories = useMemo(() => [...new Set(foods.map(f => f.category))], [foods]);

  return (
    <>
      {categories.map(cat => {
        const items = foods.filter(f => f.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <div className="cieat-category-label">{cat}</div>
            <div className="cieat-grid">
              {items.map(f => (
                <button
                  key={f.name}
                  className="cieat-chip"
                  onClick={() => onSelect(f.name)}
                >
                  <span className="cieat-chip-name">{f.emoji} {f.name}</span>
                  <div className="cieat-chip-dots">
                    {tab !== "postpartum" && <Dot status={f.pregnancy.status} />}
                    {tab !== "pregnancy" && <Dot status={f.postpartum.status} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function CanIEatThis() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const normalised = query.trim().toLowerCase();

  const matchedFood = useMemo(
    () => normalised ? FOODS.find(f => f.name.toLowerCase().includes(normalised)) : null,
    [normalised]
  );

  const gridFoods = useMemo(
    () => matchedFood ? FOODS.filter(f => f !== matchedFood) : FOODS,
    [matchedFood]
  );

  function handleSelect(name) {
    setQuery(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <GooeySearch
  query={query}
  setQuery={setQuery}
/>
      <div className="cieat-root">
        <style>{styles}</style>
        <div className="cieat-main">

          {/* Search */}
          <div className="cieat-search-wrap">
            <p className="cieat-search-title">🥗 Is this food safe?</p>
            {/* <div className="cieat-search-input-wrap">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="cieat-input"
              type="text"
              placeholder="Search spinach, mango, paneer..."
              autoComplete="off"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div> */}

            <p className="cieat-search-hint">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              Covers 40+ common foods · Not in our list? Check with your doctor or midwife.
            </p>
          </div>

          {/* Result */}
          {normalised && (
            matchedFood
              ? <ResultCard food={matchedFood} />
              : <NoResult query={query.trim()} />
          )}

          {/* Tabs */}
          <div className="cieat-tabs">
            {[
              { key: "all", label: "All foods" },
              { key: "pregnancy", label: "Pregnancy only" },
              { key: "postpartum", label: "Postpartum only" },
            ].map(t => (
              <button
                key={t.key}
                className={`cieat-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="cieat-legend">
            <span className="cieat-legend-item"><Dot status="safe" /> Safe</span>
            <span className="cieat-legend-item"><Dot status="caution" /> Caution</span>
            <span className="cieat-legend-item"><Dot status="avoid" /> Avoid</span>
            {tab === "all" && (
              <span className="cieat-legend-item" style={{ marginLeft: 2, fontStyle: "italic" }}>
                Left = pregnancy · Right = postpartum
              </span>
            )}
          </div>

          {/* Grid */}
          <FoodGrid foods={gridFoods} tab={tab} onSelect={handleSelect} />

          <p className="cieat-disclaimer">
            For general information only — not medical advice. Always consult your doctor, midwife, or healthcare provider for guidance specific to your situation.
          </p>

        </div>
      </div>
      <BottomDock />
    </>
  );
}