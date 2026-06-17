import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Status from './pages/Status.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/status" element={<Status />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
