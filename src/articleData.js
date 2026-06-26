// articleData.js — DRAFT, pending your corrections
//
// Source: 32 URLs provided (you said 34 — double check if 2 got dropped
// when pasting; I only have 32 to work from).
//
// Every field below is a BEST GUESS from the URL slug + general
// subject-matter knowledge — none of these pages were actually fetched.
// Titles especially are guesses at what the page likely calls itself;
// real titles may differ. Correct anything wrong and I'll lock it in.
//
// Tagging scheme (mirrors the hidden-category pattern from the question
// bank — these are internal, used for filtering, not necessarily shown
// verbatim as UI labels unless you want them to be):
//
//   stage:    "pregnancy" | "postpartum" | "both"
//   trimester: 1 | 2 | 3 | null (only set when slug clearly indicates one)
//   category: nutrition | mental-health | physical-health | labor-birth |
//             body-image | relationships | medical-tests | high-risk |
//             newborn-bonding | preparation
//   source:   domain, for credibility display (e.g. "Mayo Clinic", "NHS")

export const ARTICLES = [
  {
    id: "a01",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047208",
    title: "Pregnancy week by week", // GUESS — Mayo Clinic's general pregnancy week-by-week hub article
    stage: "pregnancy",
    trimester: null,
    category: "preparation",
    source: "Mayo Clinic",
  },
  {
    id: "a02",
    url: "https://www.clearblue.com/am-i-pregnant/early-pregnancy-signs",
    title: "Early signs of pregnancy", // GUESS
    stage: "pregnancy",
    trimester: 1,
    category: "preparation",
    source: "Clearblue",
  },
  {
    id: "a03",
    url: "https://www.tommys.org/pregnancy-information/im-pregnant/mental-wellbeing/emotional-changes-pregnancy",
    title: "Emotional changes during pregnancy", // GUESS — fairly confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "mental-health",
    source: "Tommy's",
  },
  {
    id: "a04",
    url: "https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617",
    title: "Postpartum depression: symptoms and causes", // GUESS — confident, standard Mayo URL pattern
    stage: "postpartum",
    trimester: null,
    category: "mental-health",
    source: "Mayo Clinic",
  },
  {
    id: "a05",
    url: "https://my.clevelandclinic.org/health/articles/16092-pregnancy-second-trimester",
    title: "Second trimester of pregnancy", // GUESS
    stage: "pregnancy",
    trimester: 2,
    category: "preparation",
    source: "Cleveland Clinic",
  },
  {
    id: "a06",
    url: "https://www.bswhealth.com/blog/from-bump-to-beyond-the-second-trimester",
    title: "From bump to beyond: the second trimester", // GUESS — slug literally suggests this
    stage: "pregnancy",
    trimester: 2,
    category: "preparation",
    source: "Baylor Scott & White Health",
  },
  {
    id: "a07",
    url: "https://www2.hse.ie/pregnancy-birth/baby-development-pregnancy-stages/baby-development/bonding-with-baby/",
    title: "Bonding with your baby", // GUESS — confident from slug
    stage: "both",
    trimester: null,
    category: "newborn-bonding",
    source: "HSE Ireland",
  },
  {
    id: "a08",
    url: "https://www.hopkinsmedicine.org/health/wellness-and-prevention/common-tests-during-pregnancy",
    title: "Common tests during pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "medical-tests",
    source: "Johns Hopkins Medicine",
  },
  {
    id: "a09",
    url: "https://www.rainbowhospitals.in/blog/pregnancy-checkup-schedule-tests-scans-explained",
    title: "Pregnancy checkup schedule: tests and scans explained", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "medical-tests",
    source: "Rainbow Hospitals",
  },
  {
    id: "a10",
    url: "https://womenshealth.labcorp.com/testing-while-expecting/second-trimester-testing",
    title: "Second trimester testing", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 2,
    category: "medical-tests",
    source: "Labcorp",
  },
  {
    id: "a11",
    url: "https://www.apolloclinic.com/blog/importance-of-ultrasound-scans-during-pregnancy",
    title: "Importance of ultrasound scans during pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "medical-tests",
    source: "Apollo Clinic",
  },
  {
    id: "a12",
    url: "https://my.clevelandclinic.org/health/articles/third-trimester",
    title: "Third trimester of pregnancy", // GUESS
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "Cleveland Clinic",
  },
  {
    id: "a13",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20046767",
    title: "Pregnancy week by week (third trimester)", // GUESS — can't tell exact week range from art-id alone
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "Mayo Clinic",
  },
  {
    id: "a14",
    url: "https://www.thomsonmedical.com/blog/third-trimester",
    title: "Third trimester guide", // GUESS
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "Thomson Medical",
  },
  {
    id: "a15",
    url: "https://www.cloudninecare.com/blog/fear-of-labour-and-childbirth",
    title: "Fear of labour and childbirth", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "mental-health",
    source: "Cloudnine Care",
  },
  {
    id: "a16",
    url: "https://www.pregnancybirthbaby.org.au/fear-of-childbirth",
    title: "Fear of childbirth", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "mental-health",
    source: "Pregnancy, Birth & Baby (Australia)",
  },
  {
    id: "a17",
    url: "https://www.southwestyorkshire.nhs.uk/paths/supporting-your-partner-through-fear-of-pregnancy-and-or-birth-tokophobia/",
    title: "Supporting your partner through fear of pregnancy or birth (tokophobia)", // GUESS — confident, slug names tokophobia explicitly
    stage: "pregnancy",
    trimester: null,
    category: "relationships",
    source: "South West Yorkshire NHS",
  },
  {
    id: "a18",
    url: "https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/signs-of-labor/art-20046184",
    title: "Signs of labor", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "labor-birth",
    source: "Mayo Clinic",
  },
  {
    id: "a19",
    url: "https://www.tommys.org/pregnancy-information/giving-birth/5-positive-ways-prepare-labour",
    title: "5 positive ways to prepare for labour", // GUESS — confident, slug has the number
    stage: "pregnancy",
    trimester: 3,
    category: "labor-birth",
    source: "Tommy's",
  },
  {
    id: "a20",
    url: "https://www.in.pampers.com/pregnancy/giving-birth/article/what-to-pack-in-your-hospital-bag-go-bag-checklist",
    title: "What to pack in your hospital bag: go-bag checklist", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "Pampers India",
  },
  {
    id: "a21",
    url: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/hospital-bag-checklist/",
    title: "Hospital bag checklist", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "NHS",
  },
  {
    id: "a22",
    url: "https://www.tommys.org/pregnancy-information/giving-birth/packing-hospital-bag",
    title: "Packing your hospital bag", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: 3,
    category: "preparation",
    source: "Tommy's",
  },
  {
    id: "a23",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/high-risk-pregnancy/art-20047012",
    title: "High-risk pregnancy: know what to expect", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "high-risk",
    source: "Mayo Clinic",
  },
  {
    id: "a24",
    url: "https://kangaroocareindia.com/blogs/tips-for-managing-a-high-risk-pregnancy/52",
    title: "Tips for managing a high-risk pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "high-risk",
    source: "Kangaroo Care India",
  },
  {
    id: "a25",
    url: "https://roshmfm.com/5-dos-and-donts-during-a-high-risk-pregnancy/",
    title: "5 dos and don'ts during a high-risk pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "high-risk",
    source: "ROSH Maternal Fetal Medicine",
  },
  {
    id: "a26",
    url: "https://harshahospitals.co.in/article/dealing-with-body-image-changes-during-pregnancy/",
    title: "Dealing with body image changes during pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "body-image",
    source: "Harsha Hospitals",
  },
  {
    id: "a27",
    url: "https://utswmed.org/medblog/perinatal-body-dissatisfaction/",
    title: "Perinatal body dissatisfaction", // GUESS — confident from slug
    stage: "both",
    trimester: null,
    category: "body-image",
    source: "UT Southwestern Medical Center",
  },
  {
    id: "a28",
    url: "https://www.eatingdisorderhope.com/blog/how-to-love-your-body-if-youre-struggling-with-body-image-during-pregnancy",
    title: "How to love your body if you're struggling with body image during pregnancy", // GUESS — confident, slug is nearly verbatim
    stage: "pregnancy",
    trimester: null,
    category: "body-image",
    source: "Eating Disorder Hope",
  },
  {
    id: "a29",
    url: "https://www.happyminds.net.au/2024/06/transformed-by-parenthood-navigating-changes-in-relationships-and-self-identity",
    title: "Transformed by parenthood: navigating changes in relationships and self-identity", // GUESS — confident, slug is nearly verbatim
    stage: "postpartum",
    trimester: null,
    category: "relationships",
    source: "Happy Minds",
  },
  {
    id: "a30",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy-nutrition/art-20045082",
    title: "Pregnancy nutrition: foods to avoid and what to eat", // GUESS — slug confirms "nutrition", rest is typical Mayo phrasing
    stage: "pregnancy",
    trimester: null,
    category: "nutrition",
    source: "Mayo Clinic",
  },
  {
    id: "a31",
    url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
    title: "Foods to avoid in pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "nutrition",
    source: "NHS",
  },
  {
    id: "a32",
    url: "https://chetnahospital.co.in/7-pregnancy-foods-to-avoid/",
    title: "7 pregnancy foods to avoid", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "nutrition",
    source: "Chetna Hospital",
  },
  {
    id: "a33",
    url: "https://www.nhs.uk/pregnancy/keeping-well/exercise/",
    title: "Exercise in pregnancy", // GUESS — confident from slug
    stage: "pregnancy",
    trimester: null,
    category: "physical-health",
    source: "NHS",
  },
  {
    id: "a34",
    url: "https://babynama.com/blog/pregnancy/safe-exercises-for-your-first-trimester-of-pregnancy",
    title: "Safe exercises for your first trimester of pregnancy", // GUESS — confident, slug is nearly verbatim
    stage: "pregnancy",
    trimester: 1,
    category: "physical-health",
    source: "BabyNama",
  },
];

// Category labels shown in the filter UI — adjust wording freely, these are
// just my drafted display names for the internal category keys above.
export const CATEGORY_LABELS = {
  all: "All",
  "mental-health": "Mind & Emotions",
  "physical-health": "Physical Health",
  nutrition: "Nutrition",
  "medical-tests": "Tests & Scans",
  "labor-birth": "Labour & Birth",
  "high-risk": "High-Risk Pregnancy",
  "body-image": "Body Image",
  relationships: "Relationships",
  "newborn-bonding": "Bonding",
  preparation: "Getting Ready",
};