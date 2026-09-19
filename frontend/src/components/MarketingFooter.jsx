import { Link } from "react-router-dom";
import {
  Boxes,
  ShieldCheck,
  BookOpen,
  UserCircle,
  GitBranch,
  Mail,
  ArrowUpRight,
  Server,
  Heart,
} from "lucide-react";

const linkGroups = [
  {
    title: "Product",
    icon: Boxes,
    links: [
      { label: "Modules", href: "#modules" },
      { label: "Product Tour", href: "#features" },
      { label: "Roles & Permissions", href: "#rbac" },
      { label: "Tech Stack", href: "#tech-stack" },
    ],
  },
  {
    title: "Security",
    icon: ShieldCheck,
    links: [
      { label: "Security & Deployment", href: "#tech-stack" },
      { label: "License (MIT)", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot/blob/main/LICENSE" },
      { label: "Source Code", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
    ],
  },
  {
    title: "Resources",
    icon: BookOpen,
    links: [
      { label: "GitHub Repository", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
      { label: "Documentation", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    icon: UserCircle,
    links: [
      { label: "Log In", to: "/login" },
      { label: "Book a Demo", to: "/register" },
    ],
  },
];

const badges = [
  { icon: ShieldCheck, label: "MIT Licensed" },
  { icon: Server, label: "Self-Hosted" },
  { icon: Heart, label: "Open Source" },
];

export default function MarketingFooter() {
  return (
    <footer id="footer" className="bg-white text-slate-500 pt-16 pb-8 px-4 border-t border-slate-200">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Boxes size={18} className="text-white" />
            </div>
            <div className="text-slate-900 font-bold text-xl">
              HRPayroll {/* TODO: replace with your real product name, same as Navbar */}
            </div>
          </div>

          <p className="text-(length:--text-small) mt-4 max-w-xs">
            Free, open-source, self-hosted HR & payroll — built with Spring Boot and React.
          </p>

          {/* Social / contact row */}
          <div className="flex items-center gap-2 mt-5">
            
            <a href="https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors no-underline"
              >
                <GitBranch size={16} />
              </a>
                          
            <a href="mailto:hello@hrpayroll.dev"
              aria-label="Email"
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors no-underline"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Link groups */}
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="flex items-center gap-2 text-slate-900 font-semibold text-(length:--text-small) mb-4">
              <group.icon size={15} className="text-indigo-600" />
              {group.title}
            </h4>
            <ul className="space-y-3 text-(length:--text-small)">
              {group.links.map((l) =>
                l.to ? (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="no-underline hover:text-indigo-600 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ) : (
                  <li key={l.label}>
                    
                   <a href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="no-underline inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      {l.label}
                      {l.href.startsWith("http") && (
                        <ArrowUpRight size={12} className="opacity-50" />
                      )}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Trust badges row */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3 mt-12">
        {badges.map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            <b.icon size={13} className="text-indigo-600" />
            {b.label}
          </span>
        ))}
      </div>

      <div className="max-w-6xl mx-auto border-t border-slate-200 mt-8 pt-6 text-(length:--text-small) text-center text-slate-400">
        © {new Date().getFullYear()} HRPayroll. MIT Licensed. Self-hosted — your data never leaves your servers.
      </div>
    </footer>
  );
}