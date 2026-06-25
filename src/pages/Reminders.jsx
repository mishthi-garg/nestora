import { useState, useMemo } from "react";

// Color mapping per reminder type — used for the dot/badge on each date
// Matches the app's warm cream/peach/brown palette used on Dashboard.
const TYPE_STYLES = {
  medicine: {
    label: "Medicine",
    dot: "bg-[rgb(193,102,107)]",
    bg: "bg-[rgb(255,241,238)]",
    border: "border-[rgb(193,102,107)]",
    text: "text-[rgb(140,60,65)]",
  },
  appointment: {
    label: "Appointment",
    dot: "bg-yellow-700",
    bg: "bg-[rgb(253,246,237)]",
    border: "border-yellow-700",
    text: "text-[rgb(40,20,9)]",
  },
  other: {
    label: "Other",
    dot: "bg-[rgb(233,131,80)]",
    bg: "bg-[rgb(251,234,203)]",
    border: "border-[rgb(255,214,166)]",
    text: "text-[rgb(150,80,30)]",
  },
};

function formatKey(date) {
  // Local-date key, avoids UTC offset bugs from toISOString()
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthGrid(year, month) {
  // month is 0-indexed. Returns array of Date objects (42 cells, 6 weeks)
  // including leading/trailing days from adjacent months for a full grid.
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startDay);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

function Reminders() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // reminders: { "2026-06-25": [{ id, type, title, time, notes }, ...] }
  const [reminders, setReminders] = useState({});

  // Draft form state for the modal
  const [draftType, setDraftType] = useState("medicine");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const monthGrid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });

  function goPrevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function goNextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function openDay(date) {
    setSelectedDate(date);
    setDraftType("medicine");
    setDraftTitle("");
    setDraftTime("");
    setDraftNotes("");
    setShowModal(true);
  }

  function saveReminder() {
    if (!draftTitle.trim()) return; // basic guard — don't save empty entries

    const key = formatKey(selectedDate);
    const newEntry = {
      id: Date.now(),
      type: draftType,
      title: draftTitle.trim(),
      time: draftTime,
      notes: draftNotes.trim(),
    };

    setReminders((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newEntry],
    }));

    setShowModal(false);
  }

  function deleteReminder(dateKey, id) {
    setReminders((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((r) => r.id !== id),
    }));
  }

  const selectedKey = selectedDate ? formatKey(selectedDate) : null;
  const selectedReminders = selectedKey ? reminders[selectedKey] || [] : [];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header / month nav */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)]">Reminders</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={goPrevMonth}
            className="cursor-pointer w-9 h-9 rounded-full border border-yellow-700 text-[rgb(40,20,9)] hover:bg-yellow-50"
          >
            ‹
          </button>
          <p className="font-medium text-[rgb(40,20,9)] w-36 text-center">{monthLabel}</p>
          <button
            onClick={goNextMonth}
            className="cursor-pointer w-9 h-9 rounded-full border border-yellow-700 text-[rgb(40,20,9)] hover:bg-yellow-50"
          >
            ›
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm text-gray-500">
        {Object.entries(TYPE_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
            {style.label}
          </div>
        ))}
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-gray-400 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {monthGrid.map((date, i) => {
          const key = formatKey(date);
          const dayReminders = reminders[key] || [];
          const isCurrentMonth = date.getMonth() === viewMonth;
          const isToday = formatKey(date) === formatKey(today);

          // Determine dominant background tint
          let cellBg = "bg-yellow-50";
          if (dayReminders.some((r) => r.type === "appointment")) cellBg = TYPE_STYLES.appointment.bg;
          else if (dayReminders.some((r) => r.type === "medicine")) cellBg = TYPE_STYLES.medicine.bg;
          else if (dayReminders.some((r) => r.type === "other")) cellBg = TYPE_STYLES.other.bg;

          return (
            <button
              key={i}
              onClick={() => openDay(date)}
              className={`relative aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl border text-center p-1.5 sm:p-2 cursor-pointer transition
                ${isCurrentMonth ? cellBg : "bg-gray-50"}
                ${isToday ? "border-yellow-700 border-2" : "border-[rgb(255,214,166)]"}
                hover:border-[rgb(233,131,80)]`}
            >
              <span className={`text-sm sm:text-md ${isCurrentMonth ? "text-[rgb(40,20,9)]" : "text-gray-400"}`}>
                {date.getDate()}
              </span>

              {/* Dots for each reminder type present that day */}
              <div className="absolute bottom-1 left-1.5 sm:bottom-1.5 sm:left-2 flex gap-1">
                {dayReminders.slice(0, 3).map((r) => (
                  <span key={r.id} className={`w-1.5 h-1.5 rounded-full ${TYPE_STYLES[r.type].dot}`}></span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day detail / add modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[rgb(40,20,9)]">
                {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button onClick={() => setShowModal(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 text-xl">
                ×
              </button>
            </div>

            {/* Existing reminders for this day */}
            {selectedReminders.length > 0 && (
              <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto">
                {selectedReminders.map((r) => (
                  <div key={r.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${TYPE_STYLES[r.type].bg} ${TYPE_STYLES[r.type].border}`}>
                    <div>
                      <p className={`text-sm font-medium ${TYPE_STYLES[r.type].text}`}>{r.title}</p>
                      {r.time && <p className="text-xs text-gray-500">{r.time}</p>}
                    </div>
                    <button
                      onClick={() => deleteReminder(selectedKey, r.id)}
                      className="cursor-pointer text-gray-400 hover:text-[rgb(193,102,107)] text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new reminder form */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {Object.entries(TYPE_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setDraftType(key)}
                    className={`cursor-pointer flex-1 text-sm py-1.5 rounded-lg border ${
                      draftType === key ? `${style.bg} ${style.border} ${style.text} font-medium` : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Title (e.g. Iron tablet, Dr. Rao visit)"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
              />

              <input
                type="time"
                value={draftTime}
                onChange={(e) => setDraftTime(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700"
              />

              <textarea
                placeholder="Notes (optional)"
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                rows={2}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-700 resize-none"
              />

              <button
                onClick={saveReminder}
                className="cursor-pointer bg-[rgb(40,20,9)] text-white rounded-lg py-2 text-sm font-medium hover:bg-[rgb(60,35,20)]"
              >
                Save reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;