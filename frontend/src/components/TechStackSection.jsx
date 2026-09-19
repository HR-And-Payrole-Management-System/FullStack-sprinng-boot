import { Server, Database, Shield, Boxes, Lock, HardDrive, Eye, GitBranch } from "lucide-react";

const stack = [
  { name: "Spring Boot 3.5.5", detail: "Java 21 backend, REST APIs" },
  { name: "React 19", detail: "Component UI, Vite build" },
  { name: "MySQL", detail: "Primary relational database" },
  { name: "Spring Security + JWT", detail: "Stateless authentication" },
  { name: "Spring Data JPA", detail: "ORM / repository layer" },
  { name: "MapStruct", detail: "DTO ↔ entity mapping" },
  { name: "OAuth2 Client", detail: "Google & GitHub login" },
  { name: "WebSocket (STOMP)", detail: "Real-time notifications" },
  { name: "Tailwind CSS v4", detail: "Utility-first styling" },
];

const requirements = [
  { icon: Server, label: "Java", value: "21+" },
  { icon: Database, label: "Database", value: "MySQL 8.0+" },
  { icon: Boxes, label: "Node.js", value: "20+ (for building the frontend)" },
  { icon: Shield, label: "Build tool", value: "Maven (wrapper included)" },
];

const trustPoints = [
  { icon: HardDrive, label: "Self-Hosted", detail: "Runs on your own servers — no vendor cloud in the loop" },
  { icon: Lock, label: "Your Data Stays Yours", detail: "No third party ever has access to your database" },
  { icon: Eye, label: "Source-Available", detail: "Every line of code is auditable, MIT licensed" },
  { icon: GitBranch, label: "No Lock-In", detail: "Standard MySQL + Java — export or migrate anytime" },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-(--spacing-section) px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Trust bar */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {trustPoints.map((t) => (
            <div
              key={t.label}
              className="bg-slate-50 rounded-(--radius-card) p-5 border border-slate-200 text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <t.icon size={18} className="text-indigo-600" />
              </div>
              <div className="text-slate-900 font-semibold text-(length:--text-small) mt-3">{t.label}</div>
              <div className="text-slate-500 text-(length:--text-small) mt-1">{t.detail}</div>
            </div>
          ))}
        </div>

        <p className="text-indigo-600 font-semibold text-(length:--text-small) uppercase tracking-wide">
          Under the Hood
        </p>
        <h2 className="text-(length:--text-section-title) font-bold text-slate-900 mt-2">
          Built on a Modern, Battle-Tested Stack
        </h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          No proprietary runtime. Standard Java + Node tooling, deployable anywhere.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 text-left">
          {stack.map((s) => (
            <div
              key={s.name}
              className="bg-slate-50 rounded-(--radius-card) p-5 border border-slate-200 transition hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <h3 className="font-semibold text-slate-900">{s.name}</h3>
              <p className="text-slate-500 text-(length:--text-small) mt-1">{s.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="text-slate-900 font-bold mt-16 mb-6">Server Requirements</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {requirements.map((r) => (
            <div
              key={r.label}
              className="bg-slate-50 rounded-(--radius-card) p-5 border border-slate-200 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <r.icon size={20} className="text-indigo-600" />
              </div>
              <div className="text-slate-900 font-semibold text-(length:--text-small)">{r.label}</div>
              <div className="text-slate-500 text-(length:--text-small)">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}