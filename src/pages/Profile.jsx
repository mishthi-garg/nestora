import { useState, useMemo } from "react";

// ───────────────────────────── Date math helpers ─────────────────────────────
// Pregnancy week and postpartum day are DERIVED from a single stored date,
// rather than stored as separate numbers — this avoids the profile silently
// drifting out of sync with reality every day the user doesn't open the app.

function getPregnancyWeek(dueDateStr) {
  if (!dueDateStr) return null;
  const due = new Date(dueDateStr);
  const today = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = Math.round((due - today) / msPerWeek);
  const week = 40 - weeksUntilDue;
  return Math.min(Math.max(week, 1), 42); // clamp to a sane range
}

function getPostpartumDay(deliveryDateStr) {
  if (!deliveryDateStr) return null;
  const delivery = new Date(deliveryDateStr);
  const today = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(Math.round((today - delivery) / msPerDay), 0);
}

function getTrimester(week) {
  if (week == null) return null;
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

// ───────────────────────────── Default profile shape ─────────────────────────────
// This is the single source of truth other pages should eventually read from
// (Dashboard's week thread, DailySurvey's stage-based question pool,
// Articles' stage filter) instead of each hardcoding their own constant.

const DEFAULT_PROFILE = {
  name: "",
  stage: "pregnancy", // "pregnancy" | "postpartum"
  dueDate: "",
  deliveryDate: "",
  isFirstPregnancy: true,
  deliveryType: "", // "vaginal" | "c-section" — only relevant once postpartum
  emergencyContactName: "",
  emergencyContactPhone: "",
  languagePreference: "",
  genderPreference: "no-preference", // for specialist matching
};

function Profile() {
  // Swap this useState for a real fetch from Supabase/your backend once
  // wired up — shape stays identical, only the data source changes.
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draft, setDraft] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const week = useMemo(
    () => (profile.stage === "pregnancy" ? getPregnancyWeek(profile.dueDate) : null),
    [profile.stage, profile.dueDate]
  );
  const trimester = useMemo(() => getTrimester(week), [week]);
  const postpartumDay = useMemo(
    () => (profile.stage === "postpartum" ? getPostpartumDay(profile.deliveryDate) : null),
    [profile.stage, profile.deliveryDate]
  );

  function startEditing() {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveProfile() {
    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)]">Profile</h2>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="cursor-pointer text-sm text-gray-700 hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <p className="italic text-sm text-yellow-700 mb-5">
        This shapes your check-ins, articles, and specialist matches
      </p>

      {saved && !isEditing && (
        <div className="rounded-lg bg-[rgb(245,250,240)] border border-[rgb(122,139,105)] text-[rgb(80,100,65)] text-sm px-3 py-2 mb-4">
          Profile updated
        </div>
      )}

      {/* ───────────── Stage summary card (read-only, always visible) ───────────── */}
      {!isEditing && (
        <div className="rounded-xl border-2 border-yellow-700 bg-[rgb(253,246,237)] p-5 mb-5">
          <p className="font-serif text-xl font-medium text-[rgb(40,20,9)] mb-1">
            {profile.name || "Your name"}
          </p>
          {profile.stage === "pregnancy" ? (
            <p className="text-sm text-gray-600">
              {week ? `Week ${week}` : "Due date not set"}
              {trimester ? ` · ${trimester === 1 ? "1st" : trimester === 2 ? "2nd" : "3rd"} trimester` : ""}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {postpartumDay != null ? `Day ${postpartumDay} postpartum` : "Delivery date not set"}
            </p>
          )}
        </div>
      )}

      {/* ───────────── View mode ───────────── */}
      {!isEditing && (
        <div className="flex flex-col gap-3">
          <ProfileRow label="Stage" value={profile.stage === "pregnancy" ? "Pregnancy" : "Postpartum"} />
          {profile.stage === "pregnancy" && (
            <>
              <ProfileRow label="Due date" value={profile.dueDate || "Not set"} />
              <ProfileRow label="First pregnancy" value={profile.isFirstPregnancy ? "Yes" : "No"} />
            </>
          )}
          {profile.stage === "postpartum" && (
            <>
              <ProfileRow label="Delivery date" value={profile.deliveryDate || "Not set"} />
              <ProfileRow
                label="Delivery type"
                value={profile.deliveryType ? capitalize(profile.deliveryType) : "Not set"}
              />
            </>
          )}
          <ProfileRow
            label="Emergency contact"
            value={
              profile.emergencyContactName
                ? `${profile.emergencyContactName} · ${profile.emergencyContactPhone || "no number"}`
                : "Not set"
            }
          />
          <ProfileRow label="Preferred language" value={profile.languagePreference || "No preference"} />
          <ProfileRow
            label="Specialist gender preference"
            value={profile.genderPreference === "no-preference" ? "No preference" : capitalize(profile.genderPreference)}
          />
        </div>
      )}

      {/* ───────────── Edit mode ───────────── */}
      {isEditing && (
        <div className="flex flex-col gap-4">
          <Field label="Name">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => updateDraft("name", e.target.value)}
              placeholder="Your name"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
            />
          </Field>

          <Field label="Stage">
            <div className="flex gap-2">
              {["pregnancy", "postpartum"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateDraft("stage", s)}
                  className={`cursor-pointer flex-1 py-2 rounded-lg text-sm border ${
                    draft.stage === s
                      ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                  : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
                  }`}
                >
                  {s === "pregnancy" ? "Pregnancy" : "Postpartum"}
                </button>
              ))}
            </div>
          </Field>

          {draft.stage === "pregnancy" ? (
            <>
              <Field label="Due date">
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => updateDraft("dueDate", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
                />
              </Field>
              <Field label="Is this your first pregnancy?">
                <div className="flex gap-2">
                  {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((opt) => (
                    <button
                      key={opt.l}
                      onClick={() => updateDraft("isFirstPregnancy", opt.v)}
                      className={`cursor-pointer flex-1 py-2 rounded-lg text-sm border ${
                        draft.isFirstPregnancy === opt.v
                          ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                  : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          ) : (
            <>
              <Field label="Delivery date">
                <input
                  type="date"
                  value={draft.deliveryDate}
                  onChange={(e) => updateDraft("deliveryDate", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
                />
              </Field>
              <Field label="Delivery type">
                <div className="flex gap-2">
                  {[{ v: "vaginal", l: "Vaginal" }, { v: "c-section", l: "C-section" }].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => updateDraft("deliveryType", opt.v)}
                      className={`cursor-pointer flex-1 py-2 rounded-lg text-sm border ${
                        draft.deliveryType === opt.v
                          ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                  : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          <Field label="Emergency contact name">
            <input
              type="text"
              value={draft.emergencyContactName}
              onChange={(e) => updateDraft("emergencyContactName", e.target.value)}
              placeholder="e.g. partner, parent, sibling"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
            />
          </Field>

          <Field label="Emergency contact phone">
            <input
              type="tel"
              value={draft.emergencyContactPhone}
              onChange={(e) => updateDraft("emergencyContactPhone", e.target.value)}
              placeholder="Phone number"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
            />
          </Field>

          <Field label="Preferred language for specialists">
            <input
              type="text"
              value={draft.languagePreference}
              onChange={(e) => updateDraft("languagePreference", e.target.value)}
              placeholder="e.g. Hindi, English"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
            />
          </Field>

          <Field label="Specialist gender preference">
            <div className="flex gap-2">
              {[
                { v: "no-preference", l: "No preference" },
                { v: "female", l: "Female" },
                { v: "male", l: "Male" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => updateDraft("genderPreference", opt.v)}
                  className={`cursor-pointer flex-1 py-2 rounded-lg text-xs sm:text-sm border ${
                    draft.genderPreference === opt.v
                      ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                      : "border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-yellow-50"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-2 mt-2">
            <button
              onClick={cancelEditing}
              className="cursor-pointer flex-1 border border-gray-300 text-gray-500 rounded-lg py-2.5 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="cursor-pointer flex-1 bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── Small presentational helpers ─────────────────────────────

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-[rgb(40,20,9)] text-right">{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-gray-700 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Profile;