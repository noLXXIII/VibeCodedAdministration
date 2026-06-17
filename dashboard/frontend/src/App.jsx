import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Status from './pages/Status.jsx';
import Admin from './pages/Admin.jsx';
import Impressum from './pages/Impressum.jsx';
import Datenschutz from './pages/Datenschutz.jsx';
import About from './pages/About.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import PlanningApp from './planning/App';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/status" element={<Status />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/about" element={<About />} />
        <Route path="/planning/*" element={<PlanningApp />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
