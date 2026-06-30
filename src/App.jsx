import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from "react-router-dom";

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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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


  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[rgb(255,242,198)] sniglet-regular">
        {user && (
          <div className="bg-[rgb(255,252,235)] p-4 shadow-sm border-b-2 border-[rgb(255,214,166)] flex items-center justify-between">
            <NavLink
              to="/"
              className="font-['Fraunces'] font-bold italic text-2xl text-yellow-700"
            >
              Nestora
            </NavLink>
            <div className="flex items-center gap-4">
              {/* Profile hover card */}
              <div
                className="relative p-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              ><NavLink to="/profile">Profile</NavLink>
                {isHovered && (
                  <div className="absolute items-center flex flex-col gap-2 right-0 top-8 bg-yellow-50 border border-[rgb(255,214,166)] rounded-xl shadow-lg py-4 px-6 min-w-max z-10">
                    <p className="text-[rgb(40,20,9)] font-medium">{user.email}</p>
                    <Link 
                    to="/profile"
                    className="cursor-pointer hover:underline">
                      View Profile
                    </Link>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="w-full px-3 py-1 rounded text-white cursor-pointer bg-[rgb(40,20,9)] hover:bg-yellow-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>


          </div>
        )}
        <div className="p-6">
          <Routes>
            <Route
              path="/auth"
              element={user ? <Navigate to="/" replace /> :
                <Auth
                  supabase={supabase}
                  onAuthenticated={(session) => {
                    setUser(session.user);
                  }}
                />}
            />
            <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
            <Route path="/specialists" element={<ProtectedRoute user={user}><Specialists /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute user={user}><Reminders /></ProtectedRoute>} />
            <Route path="/dailysurvey" element={<ProtectedRoute user={user}><DailySurvey /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute user={user}><Consultation /></ProtectedRoute>} />
            <Route path="/articles" element={<ProtectedRoute user={user}><Articles /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute user={user}><Chatbot /></ProtectedRoute>} />
            <Route path="/foodinfo" element={<ProtectedRoute user={user}><FoodInfo /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;