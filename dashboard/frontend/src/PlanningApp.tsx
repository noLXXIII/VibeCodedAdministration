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
import { UserSwitcher } from "./components/UserSwitcher";
import { ThemeToggle } from "./components/PlanningThemeToggle";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import "./styles/theme.css";
import "./styles/base.css";
import "./styles/layout.css";
// @ts-ignore - NavBar is a JSX component
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <NavBar variant="app" />
          <main className="app-main" style={{ paddingBottom: "60px" }}>
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
          
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8px 16px",
            background: "var(--bg-panel)",
            borderTop: "1px solid var(--border)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
          }}>
            <UserSwitcher />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
