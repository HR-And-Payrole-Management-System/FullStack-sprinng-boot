import { Link } from "react-router-dom";
import {
  Calendar, ShieldCheck, FileText, Building2, Ban,
  Scale, LayoutGrid, Cpu, Code2,
} from "lucide-react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const stats = [
  { icon: Building2, value: "100%", label: "Self-Hosted" },
  { icon: Ban, value: "0", label: "Per-User Fees" },
  { icon: Scale, value: "MIT", label: "License" },
  { icon: LayoutGrid, value: "25+", label: "Modules" },
  { icon: Cpu, value: "Java 21", label: "Backend" },
  { icon: Code2, value: "React 19", label: "Frontend" },
];
// add this component in the same file, above export default function Hero():
function AnimatedHeadline({ text, revealDuration = 1000, holdDuration = 1800, fadeOutDuration = 400 }) {
  const words = text.split(" ");
  const cycleDuration = revealDuration + holdDuration + fadeOutDuration;
  const perCharDelay = revealDuration / text.length;

  const revealEndPct = (revealDuration / cycleDuration) * 100;
  const holdEndPct = ((revealDuration + holdDuration) / cycleDuration) * 100;

  let charIndex = 0;

  return (
    <>
      <style>{`
        @keyframes letter-cycle {
          0%   { opacity: 0; transform: translateY(6px); }
          ${revealEndPct}% { opacity: 1; transform: translateY(0); }
          ${holdEndPct}% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
      `}</style>
      {words.map((word, wi) => {
        const wordSpans = word.split("").map((char) => {
          const i = charIndex++;
          return (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: `letter-cycle ${cycleDuration}ms ease-in-out infinite`,
                animationDelay: `${i * perCharDelay}ms`,
              }}
            >
              {char}
            </span>
          );
        });
        charIndex++; // account for the space between words
        return (
          <span key={wi} style={{ display: "inline-block" }}>
            {wordSpans}
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}


export default function Hero() {
  return (
    
    <section
      id="hero"
      className="relative overflow-hidden py-(--spacing-section) px-4"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, var(--color-primary-soft) 0%, transparent 45%), radial-gradient(circle at 85% 0%, var(--color-primary-soft) 0%, transparent 40%), var(--color-bg-soft)",
      }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="text-left">
          <div className="flex gap-3 mb-6 flex-wrap">
            <Badge dot>Self-Hosted</Badge>
            <Badge>Your Data, Your Server</Badge>
            <Badge>MIT Licensed</Badge>
          </div>

        <h1 className="text-(length:--text-hero) font-(--font-weight-hero) leading-(--text-hero-line) text-(--color-navy)">
        <AnimatedHeadline text="HR & Payroll infrastructure your compliance team will actually approve" />
      </h1>

          <p className="text-(--color-text-muted) text-(length:--text-body) mt-6 max-w-xl">
            Run employee records, payroll, attendance, and performance management
            entirely on infrastructure you control. No third party ever touches
            your employee data, no per-seat pricing that scales against you as
            you grow, and no vendor lock-in if you need to walk away.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <Link to="/register">
              <Button icon={Calendar}>Book a Demo</Button>
            </Link>

            
            <a  href="https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={ShieldCheck} variant="secondary">Security & Deployment</Button>
            </a>

            
            <a  href="https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={FileText} variant="secondary">Documentation</Button>
            </a>
          </div>

          <p className="text-(--color-text-muted) text-(length:--text-small) mt-5">
            No account required to evaluate · Deploy on your own infrastructure · Full data ownership
          </p>
        </div>

        {/* Right: screenshot in a browser-chrome frame */}
        <div className="relative">
          <div className="absolute -inset-6 bg-(--color-primary) opacity-10 blur-3xl rounded-full" />
          <div className="relative bg-white rounded-(--radius-card) shadow-(--shadow-card) border border-(--color-border) overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-(--color-border) bg-(--color-bg-soft)">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <img
              src="/f1.png"
              alt="HRM dashboard preview"
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div id="stats" className="max-w-6xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-(--radius-card) border border-(--color-border) border-t-2 border-t-(--color-primary) py-5 px-3 text-center hover:shadow-(--shadow-card) transition-shadow"
          >
            <s.icon size={18} className="text-(--color-primary) mx-auto mb-2" />
            <div className="text-xl font-bold text-(--color-navy)">{s.value}</div>
            <div className="text-(--color-text-muted) text-(length:--text-small) mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}