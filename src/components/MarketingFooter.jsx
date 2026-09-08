import { Link } from "react-router-dom";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Modules", href: "#modules" },
      { label: "Product Tour", href: "#features" },
      { label: "Roles & Permissions", href: "#rbac" },
      { label: "Tech Stack", href: "#tech-stack" },
    ],
  },
  {
    title: "Security",
    links: [
      { label: "Security & Deployment", href: "#tech-stack" },
      { label: "License (MIT)", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot/blob/main/LICENSE" },
      { label: "Source Code", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub Repository", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
      { label: "Documentation", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", to: "/login" },
      { label: "Book a Demo", to: "/register" },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer id="footer" className="bg-(--color-dark) text-slate-400 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="text-white font-bold text-xl">
            HRPayroll {/* TODO: replace with your real product name, same as Navbar */}
          </div>
          <p className="text-(length:--text-small) mt-3 max-w-xs">
            Free, open-source, self-hosted HR & payroll — built with Spring Boot and React.
          </p>
        </div>

        {linkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-white font-semibold text-(length:--text-small) mb-3">{group.title}</h4>
            <ul className="space-y-2 text-(length:--text-small)">
              {group.links.map((l) =>
                l.to ? (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ) : (
                  <li key={l.label}>
                    
                    <a  href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/10 mt-12 pt-6 text-(length:--text-small) text-center">
        © {new Date().getFullYear()} HRPayroll. MIT Licensed. Self-hosted — your data never leaves your servers.
      </div>
    </footer>
  );
}