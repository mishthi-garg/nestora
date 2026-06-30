import { useState, useMemo, useEffect, createContext, useContext } from "react";
import { supabase } from "../supabaseClient";

function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

// ───────────────────────────── Date math helpers ─────────────────────────────
// (unchanged from before — pregnancy week / postpartum day are still derived,
// not stored, so the profile never silently drifts out of sync)

function getPregnancyWeek(dueDateStr) {
  if (!dueDateStr) return null;
  const due = new Date(dueDateStr);
  const today = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = Math.round((due - today) / msPerWeek);
  const week = 40 - weeksUntilDue;
  return Math.min(Math.max(week, 1), 42);
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

// ───────────────────────────── DB <-> app field mapping ─────────────────────────────
// Supabase/Postgres convention is snake_case columns; the rest of the app
// (Dashboard, DailySurvey, Articles) expects camelCase. Convert at the boundary
// so only this file needs to know about the DB's naming.

function rowToProfile(row) {
  return {
    name: row.name ?? "",
    stage: row.stage ?? "pregnancy",
    dueDate: row.due_date ?? "",
    deliveryDate: row.delivery_date ?? "",
    isFirstPregnancy: row.is_first_pregnancy ?? true,
    deliveryType: row.delivery_type ?? "",
    emergencyContactName: row.emergency_contact_name ?? "",
    emergencyContactPhone: row.emergency_contact_phone ?? "",
    languagePreference: row.language_preference ?? "",
    genderPreference: row.gender_preference ?? "no-preference",
  };
}

function profileToRow(profile, userId) {
  return {
    id: userId,
    name: profile.name,
    stage: profile.stage,
    due_date: profile.dueDate || null,
    delivery_date: profile.deliveryDate || null,
    is_first_pregnancy: profile.isFirstPregnancy,
    delivery_type: profile.deliveryType,
    emergency_contact_name: profile.emergencyContactName,
    emergency_contact_phone: profile.emergencyContactPhone,
    language_preference: profile.languagePreference,
    gender_preference: profile.genderPreference,
    updated_at: new Date().toISOString(),
  };
}

const EMPTY_PROFILE = {
  name: "",
  stage: "pregnancy",
  dueDate: "",
  deliveryDate: "",
  isFirstPregnancy: true,
  deliveryType: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  languagePreference: "",
  genderPreference: "no-preference",
};

function Profile({user}) {

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  // Fetch this user's profile row on mount / whenever the user changes
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (cancelled) return;

      if (error) {
        // PGRST116 = no row found yet (e.g. trigger hasn't run) — not fatal
        if (error.code !== "PGRST116") {
          setLoadError("Couldn't load your profile. Please refresh.");
        }
        setLoading(false);
        return;
      }

      setProfile(rowToProfile(data));
      setLoading(false);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    setSaveError("");
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function saveProfile() {
    setSaving(true);
    setSaveError("");

    // upsert: inserts if the row somehow doesn't exist yet, updates otherwise
    const { error } = await supabase
      .from("profiles")
      .upsert(profileToRow(draft, user.id));

    setSaving(false);

    if (error) {
      setSaveError("Couldn't save your changes. Please try again.");
      return;
    }

    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-lg mx-auto text-sm text-gray-500 flex items-center justify-center">
        Loading your profile...
      </div>
    );
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

      {loadError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 mb-4">
          {loadError}
        </div>
      )}

      {saved && !isEditing && (
        <div className="rounded-lg bg-[rgb(245,250,240)] border border-[rgb(122,139,105)] text-[rgb(80,100,65)] text-sm px-3 py-2 mb-4">
          Profile updated
        </div>
      )}

      {/* ───────────── Stage summary card (read-only, always visible) ───────────── */}
      {!isEditing && (
        <div className="rounded-xl border-2 border-yellow-700 bg-[rgb(253,246,237)] p-5 mb-5">
          <p className="font-serif text-xl font-medium text-[rgb(40,20,9)] mb-1">
            {profile.name || user.user_metadata.full_name}
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

          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="cursor-pointer flex-1 border border-gray-300 text-gray-500 rounded-lg py-2.5 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="cursor-pointer flex-1 bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
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