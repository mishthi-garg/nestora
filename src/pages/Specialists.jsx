import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomDock from "../components/BottomDock";
// Mock data — swap this for a real API call (location-based search) later.
// Structure kept flat and simple so the fetch replacement only touches this array.
const SPECIALISTS = [
  {
    id: 1,
    name: "Dr. Anita Rao",
    type: "Gynaecologist",
    qualifications: "MBBS, MS (OBG)",
    distanceKm: 1.2,
    rating: 4.8,
    clinic: "Sunrise Women's Clinic",
    offersOnline: true,
  },
  {
    id: 2,
    name: "Dr. Kavita Sharma",
    type: "Gynaecologist",
    qualifications: "MBBS, DGO",
    distanceKm: 2.5,
    rating: 4.6,
    clinic: "City Maternity Centre",
    offersOnline: false,
  },
  {
    id: 3,
    name: "Dr. Meera Iyer",
    type: "Psychologist",
    qualifications: "PhD Clinical Psychology",
    distanceKm: 1.8,
    rating: 4.9,
    clinic: "Mindful Space Counselling",
    offersOnline: true,
  },
  {
    id: 4,
    name: "Rohan Verma",
    type: "Therapist",
    qualifications: "M.A. Psychotherapy",
    distanceKm: 3.1,
    rating: 4.5,
    clinic: "Calm Minds Therapy",
    offersOnline: true,
  },
  {
    id: 5,
    name: "Dr. Priya Nair",
    type: "Psychologist",
    qualifications: "M.Phil, RCI Licensed",
    distanceKm: 4.0,
    rating: 4.7,
    clinic: "New Beginnings Wellness",
    offersOnline: true,
  },
  {
    id: 6,
    name: "Dr. Sneha Joshi",
    type: "Gynaecologist",
    qualifications: "MBBS, MD (OBG)",
    distanceKm: 2.9,
    rating: 4.4,
    clinic: "Lotus Women's Hospital",
    offersOnline: false,
  },
];

const FILTERS = ["All", "Gynaecologist", "Psychologist", "Therapist"];

function Specialists() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredSpecialists =
    activeFilter === "All"
      ? SPECIALISTS
      : SPECIALISTS.filter((s) => s.type === activeFilter);

  return (
    <div className="p-4 sm:p-6 mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)] mb-2">
        Specialists near you
      </h2>
      <p className="italic text-sm text-yellow-700 mb-5">
        Gynaecologists, psychologists, and therapists near you
      </p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full text-sm border transition
              ${
                activeFilter === filter
                  ? "bg-yellow-700 border-yellow-700 text-white font-medium"
                  : "bg-yellow-50 border-[rgb(255,214,166)] text-[rgb(40,20,9)] hover:bg-orange-100"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Specialist list */}
      <div className="flex flex-col gap-4 px-8">
        {filteredSpecialists.map((s) => (
          <div
            key={s.id}
            className="rounded-4xl border-1 border-yellow-300 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-[rgb(40,20,9)] text-base sm:text-lg">{s.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                  {s.type}
                </span>
                {s.offersOnline && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[rgb(255,241,238)] text-[rgb(140,60,65)] border border-[rgb(193,102,107)]">
                    Online consultation available
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{s.qualifications}</p>
              <p className="text-sm text-gray-500">{s.clinic}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                <span>{s.distanceKm} km away</span>
                <span>·</span>
                <span>★ {s.rating}</span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col gap-2 sm:w-44 shrink-0">
              <button
                onClick={() => navigate(`/specialists/${s.id}`)}
                className="cursor-pointer flex-1 sm:flex-none bg-yellow-50 text-[rgb(40,20,9)] border border-[rgb(255,214,166)] rounded-4xl px-3 py-2 text-sm font-medium hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]"
              >
                View details
              </button>
              {s.offersOnline && (
                <button
                  onClick={() => navigate("/consultation", { state: { specialistId: s.id, specialistName: s.name } })}
                  className="cursor-pointer flex-1 sm:flex-none bg-yellow-50 text-[rgb(40,20,9)] border border-[rgb(255,214,166)] rounded-4xl px-3 py-2 text-sm font-medium hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]"
                >
                  Book online consultation
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredSpecialists.length === 0 && (
          <p className="text-center text-gray-400 py-10">No specialists found for this filter.</p>
        )}
      </div>
      <BottomDock />
    </div>
  );
}

export default Specialists;