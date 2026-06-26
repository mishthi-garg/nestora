import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Articles from './pages/Articles'
import Chatbot from './pages/Chatbot'
import Consultation from './pages/Consultation'
import DailySurvey from './pages/DailySurvey'
import Dashboard from './pages/Dashboard'
import Reminders from './pages/Reminders'
import Specialists from './pages/Specialists'
import Profile from './pages/Profile'

function App() {

  return (

    <BrowserRouter>
      <div className="min-h-screen bg-[rgb(255,242,198)] sniglet-regular">
        <div className="bg-[rgb(255,252,235)] p-4 shadow-sm border-b-2 border-[rgb(255,214,166)] flex items-center justify-between">
            <NavLink to="/" className="font-['Fraunces'] font-bold italic text-2xl text-yellow-700">Nestora </NavLink>
            <NavLink to="/profile">Profile</NavLink>
        </div>
        
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/dailysurvey" element={<DailySurvey />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

    </BrowserRouter>

  )
}

export default App;