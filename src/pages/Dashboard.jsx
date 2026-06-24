import { useNavigate } from "react-router-dom";
import docIcon from "../icons/doctor-icon.png"
import reminderIcon from "../icons/reminder-icon.png"
import surveyIcon from "../icons/survey-icon.png"
import consultIcon from "../icons/consult-icon.png"
import articleIcon from "../icons/article.png"
import botIcon from "../icons/bot-icon.png"

function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex md:w-2/3 w-full flex-col gap-6 justify-end">
                    <h2 className="text-4xl text-[rgb(40,20,9)] italic">Hello!</h2>
                    <div className="px-4 rounded-xl border-2 py-8 border-[rgb(255,214,166)] bg-[rgb(253,246,237)] flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div>
                            <p className="font-semibold text-[rgb(40,20,9)]">Hey! Kindly complete your daily survey.</p>
                            <p className="text-sm text-gray-500 mt-1">Just a couple of quick questions, takes under a minute.</p>
                        </div>
                        <button
                            onClick={() => navigate('/dailysurvey')}
                            className="cursor-pointer shadow-sm rounded-2xl bg-[rgb(40,20,9)] px-5 py-2 font-medium text-white hover:bg-yellow-700 whitespace-nowrap"
                        >
                            Go
                        </button>
                    </div>

                </div>
                <div className="px-4 w-full md:w-1/3 max-h-70 overflow-y-auto rounded-xl border-2 py-6 border-[rgb(255,214,166)] bg-[rgb(253,246,237)] flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Next medicine</p>
                        <p className="font-semibold text-[rgb(40,20,9)]">Iron + Folic acid</p>
                        <p className="text-xs text-gray-400 mt-0.5">After lunch · 1:00 PM</p>
                    </div>
                    <div className="border-t border-[rgb(255,214,166)] pt-4">
                        <p className="text-sm text-gray-500">Next appointment</p>
                        <p className="font-semibold text-[rgb(40,20,9)]">Dr. Anita Rao</p>
                        <p className="text-xs text-gray-400 mt-0.5">Thu, Jun 26 · 11:30 AM</p>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 p-4 font-bold text-lg text-[rgb(40,20,9)]">

                    <div
                        onClick={() => navigate('/specialists')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Specialists</p>
                        <img
                            src={docIcon}
                            alt="Doctor"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>

                    <div
                        onClick={() => navigate('/reminders')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Reminders</p>
                        <img
                            src={reminderIcon}
                            alt="Reminder"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>
                    <div
                        onClick={() => navigate('/dailysurvey')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Daily Survey</p>
                        <img
                            src={surveyIcon}
                            alt="Survey"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>
                    <div
                        onClick={() => navigate('/consultation')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Online Consultaion</p>
                        <img
                            src={consultIcon}
                            alt="Consult"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>
                    <div
                        onClick={() => navigate('/articles')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Articles For You</p>
                        <img
                            src={articleIcon}
                            alt="Article"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>
                    <div
                        onClick={() => navigate('/chatbot')}
                        className="flex px-8 justify-between gap-6 items-center cursor-pointer shadow-md rounded-4xl border-2 py-8 border-[rgb(255,214,166)] bg-yellow-50 hover:border-[rgb(233,131,80)] hover:bg-[rgb(251,234,203)]">
                        <p>Wellness Companion</p>
                        <img
                            src={botIcon}
                            alt="Chatbot"
                            className="w-20 h-auto rounded-xl "
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;