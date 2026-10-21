import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import { AppShell } from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Curriculum from './pages/Curriculum'
import ModulePage from './pages/ModulePage'
import ReviewQueue from './pages/ReviewQueue'
import Statistics from './pages/Statistics'
import SettingsPage from './pages/Settings'
import StudySessionPage from './pages/StudySession'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          {/* Distraction-free study interface: no sidebar, no bottom nav. */}
          <Route path="/study" element={<StudySessionPage />} />

          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculum/week/:week" element={<ModulePage />} />
            <Route path="/review" element={<ReviewQueue />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  )
}
