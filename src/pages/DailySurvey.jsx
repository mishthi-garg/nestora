import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTodaysQuestions, toSeverity, aggregateAnswersByDimension } from "../questionBank";
import leafIcon from "../icons/leaf.png"
import BottomDock from "../components/BottomDock";
// Set this from the user's actual profile once Member 1's profile data is wired in.
// "pregnancy" or "postpartum" changes which questions are eligible.
const CURRENT_STAGE = "postpartum";

const completionMessages = {
  1: {
    title: "Wonderful! Looks like you're doing well today.",
    text: "I'm glad today has been a good one. Keep taking care of yourself, and I'll check in again tomorrow.",
  },
  2: {
    title: "Thanks for checking in.",
    text: "Looks like today had a few bumps. Take it easy, and I'll be here tomorrow.",
  },
  3: {
    title: "Thanks for checking in.",
    text: "Today sounds like it was a bit difficult. Remember to rest and reach out if you need support.",
  },
  4: {
    title: "Thank you for sharing.",
    text: "It sounds like today was especially challenging. Be kind to yourself, and consider reaching out to someone you trust if you need extra support.",
  },
};

function DailySurvey() {
    const navigate = useNavigate();

    // In a real build, seenRecently would come from stored history of the last
    // few days' question ids, fetched from the backend. Empty array is fine for
    // a fresh demo session.
    const todaysQuestions = useMemo(
        () => getTodaysQuestions({ stage: CURRENT_STAGE, seenRecently: [], targetCount: 7 }),
        []
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: severityValue }
    const [showEscalation, setShowEscalation] = useState(false);
    const [showComplete, setShowComplete] = useState(false);

    const currentQuestion = todaysQuestions[currentIndex];
    const isLastQuestion = currentIndex === todaysQuestions.length - 1;
    const [overallSeverity, setOverallSeverity] = useState(0);

    function recordAnswer(severityValue) {
        const updatedAnswers = { ...answers, [currentQuestion.id]: severityValue };
        setAnswers(updatedAnswers);

        // Hard rule: a critical question answered at max severity fires escalation
        // immediately, independent of any trend logic elsewhere in the app. This
        // check happens the moment the answer is given, not after the full survey.
        const isHighSeverity = severityValue >= 3; // 2 or 3 on a 0-3 scale, or "yes" on yesno
        if (currentQuestion.critical && isHighSeverity) {
            setShowEscalation(true);
            return;
        }

        if (isLastQuestion) {
            finishSurvey(updatedAnswers);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }

    function handleSlider(rawResponse) {
        const severity = toSeverity(currentQuestion, rawResponse);
        recordAnswer(severity);
    }

     // Per the roadmap: produce the same per-dimension score shape Chatbot.jsx
    // accumulates, so both features can eventually write to one unified
    // profile. For now this just logs it — wire this to a real
    // POST /api/wellbeing/scores call once the backend/DB exists.
    function finishSurvey(finalAnswers) {
        const dimensionScores = aggregateAnswersByDimension(finalAnswers, todaysQuestions);
        console.log("Today's dimension scores:", dimensionScores);
        const values = Object.values(finalAnswers);
        const avgSeverity =
        values.reduce((sum, value) => sum + value, 0) / values.length;

        setOverallSeverity(avgSeverity);
        // TODO: persist dimensionScores to backend, keyed by date + user id,
        // once DB integration is ready. Do NOT use localStorage per project
        // convention — this stays in-memory/log-only until then.
        setShowComplete(true);
    }

    // ───────────────────────────── Escalation screen ─────────────────────────────
    if (showEscalation) {
        return (
            <div className="p-4 sm:p-6 max-w-md mx-auto">
                <div className="rounded-xl border-2 border-[rgb(255,214,166)] bg-[rgb(255,241,238)] p-6 flex flex-col gap-4">
                    <p className="font-semibold text-[rgb(140,60,65)] text-lg">
                        Thank you for telling me that.
                    </p>
                    <p className="text-sm text-[rgb(140,60,65)]">
                        What you're feeling matters, and you don't have to carry it alone. I'd like to
                        connect you with someone who can help right now.
                    </p>

                    <div className="rounded-lg bg-white shadow-xs p-4">
                        <p className="text-sm font-medium text-[rgb(40,20,9)] mb-1">
                            You can talk to someone right now:
                        </p>
                        <p className="text-sm text-[rgb(40,20,9)]">
                            iCall (mental health helpline): <span className="font-semibold">9152987821</span>
                        </p>
                        <p className="text-sm text-[rgb(40,20,9)]">
                            AASRA (24x7 crisis line): <span className="font-semibold">9820466726</span>
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/consultation", { state: { urgent: true } })}
                        className="cursor-pointer bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)]"
                    >
                        Connect me to a professional now
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer text-sm text-gray-400 hover:text-gray-600"
                    >
                        Not right now, take me back
                    </button>
                </div>
            </div>
        );
    }

    // ───────────────────────────── Completion screen ─────────────────────────────
    if (showComplete) {
        console.log(overallSeverity);
        const message =
        overallSeverity <= 2.5
            ? completionMessages[1]
            : overallSeverity <= 3.5
            ? completionMessages[2]
            : overallSeverity <= 4.5
            ? completionMessages[3]
            : completionMessages[4];
        return (
            <div className="mt-12 p-4 sm:p-6 max-w-md mx-auto">
                <div className="rounded-xl border-2 border-yellow-700 bg-[rgb(253,246,237)] p-6 flex flex-col gap-3 text-center">
                    <div className="relative">
                        <img
                            src={leafIcon}
                            alt="leaf"
                            className="absolute -bottom-4 w-20 h-auto rounded-xl "
                        />
                    </div>
                    <div>
                        <p className="font-semibold text-[rgb(40,20,9)] text-lg">{message.title}</p>
                        <p className="text-sm text-gray-500">
                            {message.text}
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="cursor-pointer w-full mt-2 bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[rgb(60,35,20)]"
                        >
                            Back to dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ───────────────────────────── Question screen ─────────────────────────────
    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Progress dots — keeps the "under 60 seconds" feel visible, not a percentage bar */}
            <div className="flex items-center gap-1.5 mb-6">
                {todaysQuestions.map((q, i) => (
                    <span
                        key={q.id}
                        className={`h-1.5 flex-1 rounded-full ${i < currentIndex ? "bg-yellow-700" : i === currentIndex ? "bg-[rgb(233,131,80)]" : "bg-gray-200"
                            }`}
                    ></span>
                ))}
            </div>

            <div className="rounded-xl border-2 border-[rgb(255,214,166)] bg-[rgb(253,246,237)] p-6 min-h-[220px] flex flex-col justify-between">
                <p className="font-bold text-[rgb(40,20,9)] text-2xl leading-snug mb-4">
                    {currentQuestion.text}
                </p>

                <div className="mt-6">
                    <div className="grid grid-cols-1 gap-4 min-h-80">
                        {[
                            { label: "Most of the time", value: 4 },
                            { label: "Sometimes", value: 3 },
                            { label: "Rarely", value: 2 },
                            { label: "Not at all", value: 1 },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSlider(option.value)}
                                className="cursor-pointer bg-gray-50 rounded-xl border border-[rgb(255,214,166)] py-3 px-2 text-lg text-[rgb(40,20,9)] hover:border-yellow-700 hover:bg-yellow-50"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
                Question {currentIndex + 1} of {todaysQuestions.length}
            </p>
            <BottomDock />
        </div>
    );
}

export default DailySurvey;