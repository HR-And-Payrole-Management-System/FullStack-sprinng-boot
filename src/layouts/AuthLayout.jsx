import { useState, useEffect } from 'react';
import ParticlesBackground from '../components/common/ParticlesBackground';
import '../styles/auth-layout.css';

const HEADLINE_LINES = ['Manage your people', 'and payroll', 'in one place'];
const TYPE_SPEED_MS = 45;       // ~42 chars total ≈ 1.9s to type — matches your "2s" cycle
const LINE_PAUSE_MS = 140;      // brief pause before starting the next line
const HOLD_MS = 1400;           // how long the finished text stays before retyping
const RESET_PAUSE_MS = 300;     // blank pause before retyping starts

function useTypewriter(lines) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'holding' | 'resetting'

  useEffect(() => {
    let timer;
    const currentLine = lines[lineIndex];

    if (phase === 'typing') {
      if (charIndex < currentLine.length) {
        timer = setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED_MS);
      } else if (lineIndex < lines.length - 1) {
        timer = setTimeout(() => {
          setLineIndex((l) => l + 1);
          setCharIndex(0);
        }, LINE_PAUSE_MS);
      } else {
        timer = setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('resetting'), HOLD_MS);
    } else if (phase === 'resetting') {
      setLineIndex(0);
      setCharIndex(0);
      timer = setTimeout(() => setPhase('typing'), RESET_PAUSE_MS);
    }

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, charIndex, lineIndex]);

  const displayedLines = lines.map((line, i) => {
    if (i < lineIndex) return line;
    if (i === lineIndex && phase !== 'resetting') return line.slice(0, charIndex);
    return '';
  });

  const activeLineIndex = phase === 'holding' ? lines.length - 1 : lineIndex;
  const showCursor = phase !== 'resetting';

  return { displayedLines, activeLineIndex, showCursor };
}

function AuthLayout({ children, eyebrow, title, subtitle }) {
  const { displayedLines, activeLineIndex, showCursor } = useTypewriter(HEADLINE_LINES);

  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <ParticlesBackground />

        <div className="auth-brand-content">
          <div className="auth-brand-mark">HRMS</div>

           <h1 className="auth-brand-headline auth-typewriter">
          {displayedLines.map((line, i) => (
            <span key={i}>
              {line}
              {i === activeLineIndex && showCursor && <span className="auth-typewriter-cursor" />}
              {i < displayedLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

          <p className="auth-brand-sub">
            A secure platform built for your organization — employee
            records, attendance, leave, and payroll, backed by enterprise-grade
            security standards.
          </p>

          <div className="auth-brand-footer">
            <span className="auth-brand-dot" />
            Connection is encrypted — Secure Connection
          </div>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-card">
          {eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
          {title && <h2 className="auth-title">{title}</h2>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}

          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;