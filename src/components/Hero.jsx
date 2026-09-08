import { Link } from "react-router-dom";
import { Calendar, ShieldCheck, FileText } from "lucide-react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const stats = [
  { value: "100%", label: "Self-Hosted" },
  { value: "0", label: "Per-User Fees" },
  { value: "MIT", label: "License" },
  { value: "25+", label: "Modules" },
  { value: "Java 21", label: "Backend" },
  { value: "React 19", label: "Frontend" },
];

export default function Hero() {
  return (
    <section id="hero" className="bg-(--color-bg-soft) text-center py-(--spacing-section) px-4">
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        <Badge dot>Self-Hosted</Badge>
        <Badge>Your Data, Your Server</Badge>
        <Badge>MIT Licensed</Badge>
      </div>

      <h1 className="text-(length:--text-hero) font-(--font-weight-hero) leading-(--text-hero-line) max-w-4xl mx-auto text-(--color-navy)">
        HR & Payroll infrastructure your compliance team will actually approve
      </h1>

      <p className="text-(--color-text-muted) text-(length:--text-body) max-w-2xl mx-auto mt-6">
        Run employee records, payroll, attendance, and performance management
        entirely on infrastructure you control. No third party ever touches
        your employee data, no per-seat pricing that scales against you as
        you grow, and no vendor lock-in if you need to walk away.
      </p>

      <img
        src="/hero-illustration.svg"
        alt="HRM dashboard preview"
        loading="lazy"
        decoding="async"
        width="600"
        height="400"
        className="mx-auto mt-8 rounded-(--radius-card) shadow-(--shadow-card)"
      />

      <div className="flex justify-center gap-4 mt-8 flex-wrap">
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

      <p className="text-(--color-text-muted) text-(length:--text-small) mt-4">
        No account required to evaluate · Deploy on your own infrastructure · Full data ownership
      </p>

      <div id="stats" className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="card-enterprise py-5 px-3">
            <div className="text-2xl font-bold text-(--color-primary)">{s.value}</div>
            <div className="text-(--color-text-muted) text-(length:--text-small) mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}