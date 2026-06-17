import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { I18nProvider } from "./i18n/I18nContext";
import { ThemeProvider } from "./theme/ThemeContext";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectLayout } from "./pages/ProjectLayout";
import { BoardPage } from "./pages/BoardPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { TasklistPage } from "./pages/TasklistPage";
import { CalendarPage } from "./pages/CalendarPage";
import { MembersPage } from "./pages/MembersPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
// @ts-ignore - NavBar is a JSX component
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <NavBar variant="app" />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectLayout />}>
                <Route index element={<Navigate to="board" replace />} />
                <Route path="board" element={<BoardPage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="tasklist" element={<TasklistPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="members" element={<MembersPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
