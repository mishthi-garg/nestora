import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import heartImg from "../icons/heart.png"
import camImg from "../icons/camera.png"
import micImg from "../icons/mic.png"
// Mock available slots — swap for a real availability API tied to the
// specialist's id later. Kept simple/flat on purpose.
const MOCK_SLOTS = [
    { id: "slot1", label: "Today, 4:00 PM" },
    { id: "slot2", label: "Today, 6:30 PM" },
    { id: "slot3", label: "Tomorrow, 10:00 AM" },
    { id: "slot4", label: "Tomorrow, 1:00 PM" },
    { id: "slot5", label: "Tomorrow, 5:00 PM" },
];

// Fallback list shown only if the user landed here without picking a
// specialist first (e.g. typed the URL directly) — keeps this page usable
// standalone, without duplicating the full Specialists directory.
const QUICK_PICK_SPECIALISTS = [
    { id: 1, name: "Dr. Anita Rao", type: "Gynaecologist" },
    { id: 3, name: "Dr. Meera Iyer", type: "Psychologist" },
    { id: 4, name: "Rohan Verma", type: "Therapist" },
];

function Consultation() {
    const navigate = useNavigate();
    const location = useLocation();

    const { specialistId, specialistName, urgent } = location.state || {};

    const [pickedSpecialist, setPickedSpecialist] = useState(
        specialistName ? { id: specialistId, name: specialistName } : null
    );
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [stage, setStage] = useState(urgent ? "urgent" : "booking"); // urgent | booking | confirmed | call
    //const [stage, setStage] = useState("urgent"); // urgent | booking | confirmed | call


    function confirmBooking() {
        if (!pickedSpecialist || !selectedSlot) return;
        setStage("confirmed");
    }

    function startCall() {
        setStage("call");
    }

    // ───────────────────────────── Urgent entry point ─────────────────────────────
    // Reached only via DailySurvey's escalation screen (navigate with { urgent: true }).
    // Skips slot-picking — the point is immediate connection, not scheduling.
    if (stage === "urgent") {
        return (
            <div className="p-4 sm:p-6 max-w-lg mx-auto">
                <div className="rounded-xl border-2 border-[rgb(193,102,107)] bg-[rgb(255,241,238)] p-6 flex flex-col gap-4 text-center">
                    <div className="flex justify-center">
                        <img
                            src={heartImg}
                            alt="heart"
                            className="w-12 h-auto rounded-xl "
                        />
                    </div>
                    <p className="font-semibold text-[rgb(140,60,65)] text-lg">
                        Connecting you to a professional now
                    </p>
                    <p className="mb-4 text-sm text-[rgb(140,60,65)]">
                        You don't need an appointment slot for this — we're prioritizing getting you
                        to someone who can help right away.
                    </p>

                    <div className="rounded-lg bg-white border border-[rgb(193,102,107)] p-4 flex flex-col gap-2">
                        <p className="text-md font-medium text-[rgb(40,20,9)]">Dr. Meera Iyer</p>
                        <p className="text-xs text-gray-500">Psychologist · Available now</p>
                    </div>

                    <button
                        onClick={startCall}
                        className="cursor-pointer bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)]"
                    >
                        Join now
                    </button>

                    <div className="mt-6 rounded-lg bg-white shadow-xs p-4">
                        <p className="text-sm text-gray-500 mb-1">If you need to talk to someone immediately:</p>
                        <p className="text-sm text-[rgb(40,20,9)]">iCall: <span className="font-semibold">9152987821</span></p>
                        <p className="text-sm text-[rgb(40,20,9)]">AASRA: <span className="font-semibold">9820466726</span></p>
                    </div>
                </div>
            </div>
        );
    }

    // ───────────────────────────── Mock video call screen ─────────────────────────────
    if (stage === "call") {
        return (
            <div className="p-4 sm:p-6 max-w-xl mx-auto">
                <div className="rounded-xl border-2 border-yellow-700 bg-[rgb(40,20,9)] aspect-[4/3] flex flex-col items-center justify-center text-center p-6">
                    <p className="text-white text-lg font-medium">
                        {pickedSpecialist?.name || "Dr. Meera Iyer"}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">Connecting…</p>
                    <div className="mt-6 w-16 h-16 rounded-full bg-[rgb(193,102,107)] flex items-center justify-center text-white text-xl">
                        {(pickedSpecialist?.name || "M")[0]}
                    </div>
                </div>

                <div className="px-8 flex justify-between gap-4 mt-5">
                    <button className="cursor-pointer w-12 h-12 rounded-full border border-yellow-700 flex items-center justify-center text-[rgb(40,20,9)] hover:bg-yellow-50">
                        <img
                            src={micImg}
                            alt="mic"
                            className="w-4.5 h-auto rounded-xl "
                        />
                    </button>
                    <button className="cursor-pointer w-12 h-12 rounded-full border border-yellow-700 flex items-center justify-center text-[rgb(40,20,9)] hover:bg-yellow-50">
                        <img
                            src={camImg}
                            alt="camera"
                            className="w-4.5 h-auto rounded-xl "
                        />
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer w-12 h-12 rounded-full bg-[rgb(193,102,107)] flex items-center justify-center text-white text-xl hover:bg-[rgb(170,85,90)]"
                    >
                        &times;
                    </button>
                </div>
                <p className="mt-4 text-xs text-gray-400 text-center mt-3">
                    Demo call — no real video stream is connected
                </p>
            </div>
        );
    }

    // ───────────────────────────── Confirmed booking screen ─────────────────────────────
    if (stage === "confirmed") {
        const slot = MOCK_SLOTS.find((s) => s.id === selectedSlot);
        return (
            <div className="p-4 sm:p-6 max-w-md mx-auto">
                <div className="rounded-xl border-2 border-yellow-700 bg-[rgb(253,246,237)] p-6 flex flex-col gap-3 text-center">
                    <p className="text-3xl">&#9989;</p>
                    <p className="font-semibold text-[rgb(40,20,9)] text-lg">Consultation booked</p>
                    <p className="text-sm text-gray-500">
                        {pickedSpecialist.name} · {slot?.label}
                    </p>
                    <p className="text-sm text-gray-500">
                        You'll get a reminder before the call, and a link will appear here when it's time.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer mt-2 bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)]"
                    >
                        Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ───────────────────────────── Normal booking flow ─────────────────────────────
    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(40,20,9)] mb-1">
                Online consultation
            </h2>
            <p className="italic text-sm text-yellow-700 mb-5">
                Book a video consultation from wherever you are
            </p>

            {/* Specialist — either passed in, or pick one now */}
            {pickedSpecialist ? (
                <div className="rounded-xl border-2 border-[rgb(255,214,166)] bg-[rgb(253,246,237)] p-4 flex items-center justify-between mb-5">
                    <div>
                        <p className="text-sm text-gray-500">Consulting with</p>
                        <p className="font-semibold text-[rgb(40,20,9)]">{pickedSpecialist.name}</p>
                    </div>
                    <button
                        onClick={() => setPickedSpecialist(null)}
                        className="cursor-pointer text-sm text-yellow-700 hover:underline"
                    >
                        Change
                    </button>
                </div>
            ) : (
                <div className="mb-5">
                    <p className="text-sm text-gray-500 mb-2">Choose a specialist</p>
                    <div className="flex flex-col gap-2">
                        {QUICK_PICK_SPECIALISTS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setPickedSpecialist(s)}
                                className="cursor-pointer text-left rounded-lg border border-[rgb(255,214,166)] bg-[rgb(253,246,237)] py-3 px-6 hover:border-yellow-700"
                            >
                                <p className="font-medium text-[rgb(40,20,9)] text-md mb-1">{s.name}</p>
                                <p className="text-xs text-gray-500">{s.type}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Slot picker — only meaningful once a specialist is chosen */}
            {pickedSpecialist && (
                <div className="mb-6 rounded-xl p-6 border-2 border-[rgb(255,214,166)] bg-[rgb(253,246,237)]">
                    <p className="text-sm text-gray-500 mb-4">Pick a time</p>
                    <div className="grid grid-cols-2 gap-2">
                        {MOCK_SLOTS.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`cursor-pointer text-sm rounded-lg border-2 py-2.5 px-2 ${selectedSlot === slot.id
                                        ? "border-yellow-700 bg-yellow-50 font-medium text-[rgb(40,20,9)]"
                                        : "bg-gray-50 border-[rgb(255,214,166)] text-yellow-700 hover:bg-yellow-50"
                                    }`}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={confirmBooking}
                disabled={!pickedSpecialist || !selectedSlot}
                className={`cursor-pointer w-full rounded-lg py-2.5 text-sm font-medium ${pickedSpecialist && selectedSlot
                        ? "bg-[rgb(40,20,9)] text-white hover:bg-[rgb(60,35,20)]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Confirm booking
            </button>
        </div>
    );
}

export default Consultation;