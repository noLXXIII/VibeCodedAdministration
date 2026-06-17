import NavBar from './NavBar.jsx';
import '../styles/legal.css';

export default function LegalPageLayout({ title, children }) {
  return (
    <>
      <NavBar variant="landing" />
      <main className="legal-page">
        <h1>{title}</h1>
        <div className="legal-content">{children}</div>
      </main>
    </>
  );
}
