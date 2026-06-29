import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

import { supabase } from "./supabaseClient";
import Auth from "./Auth";

import Articles from "./pages/Articles";
import Chatbot from "./pages/Chatbot";
import Consultation from "./pages/Consultation";
import DailySurvey from "./pages/DailySurvey";
import Dashboard from "./pages/Dashboard";
import Reminders from "./pages/Reminders";
import Specialists from "./pages/Specialists";
import Profile from "./pages/Profile";
import FoodInfo from "./pages/FoodInfo";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? false);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(255,242,198)]">
        <div className="w-10 h-10 rounded-full border-2 border-yellow-700 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Auth
        supabase={supabase}
        onAuthenticated={(newSession) => setSession(newSession)}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[rgb(255,242,198)] sniglet-regular">
        <div className="bg-[rgb(255,252,235)] p-4 shadow-sm border-b-2 border-[rgb(255,214,166)] flex items-center justify-between">
          <NavLink
            to="/"
            className="font-['Fraunces'] font-bold italic text-2xl text-yellow-700"
          >
            Nestora
          </NavLink>

          <NavLink to="/profile">Profile</NavLink>

          {/* Optional Sign Out */}
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-3 py-1 rounded bg-yellow-600 text-white"
          >
            Sign Out
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile session={session} />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/dailysurvey" element={<DailySurvey />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/foodinfo" element={<FoodInfo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;