import { useState } from "react";
import { LayoutDashboard, Users, Wallet, Clock, Briefcase, BarChart3 } from "lucide-react";

const screens = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    tab: "Dashboard",
    title: "Analytics Dashboard",
    description: "Workforce KPIs, headcount trends, attrition by department, and tenure distribution — computed live from your employee data.",
    image: null, // TODO: replace with "/screenshots/dashboard.png" once you export a real screenshot
  },
  {
    key: "employees",
    icon: Users,
    tab: "Employees",
    title: "Employee Directory",
    description: "Server-paginated employee list with organization cascade (Company → Branch → Department → Position), search, and filters.",
    image: null, // TODO: "/screenshots/employees.png"
  },
  {
    key: "payroll",
    icon: Wallet,
    tab: "Payroll",
    title: "Payroll Runs",
    description: "Salary structures, per-employee assignment, and a Draft → Approve → Paid payroll workflow with printable payslips.",
    image: null, // TODO: "/screenshots/payroll.png"
  },
  {
    key: "attendance",
    icon: Clock,
    tab: "Attendance",
    title: "Attendance & Leave",
    description: "Check-in/check-out tracking, adjustment requests, and a leave approval workflow with configurable leave types.",
    image: null, // TODO: "/screenshots/attendance.png"
  },
  {
    key: "recruitment",
    icon: Briefcase,
    tab: "Recruitment",
    title: "Recruitment Pipeline",
    description: "Job postings, candidate applications, and hiring workflow management.",
    image: null, // TODO: "/screenshots/recruitment.png"
  },
  {
    key: "reports",
    icon: BarChart3,
    tab: "Reports",
    title: "Reports & Analytics",
    description: "Exportable employee, attendance, and leave reports alongside payroll cost and headcount analytics.",
    image: null, // TODO: "/screenshots/reports.png"
  },
];

export default function ScreenshotShowcase() {
  const [active, setActive] = useState(screens[0].key);
  const current = screens.find((s) => s.key === active);

  return (
    <section id="features" className="py-(--spacing-section) px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-(--color-primary) font-semibold text-(length:--text-small) uppercase tracking-wide">
          Product Tour
        </p>
        <h2 className="text-(length:--text-section-title) font-bold text-(--color-navy) mt-2">
          See It in Action
        </h2>
        <p className="text-(--color-text-muted) mt-3 max-w-2xl mx-auto">
          Every screen shown is a real, functional module in this project — not a mockup.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {screens.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-(--radius-pill) text-(length:--text-small) font-medium transition-colors ${
                active === s.key
                  ? "bg-(--color-primary) text-white"
                  : "bg-(--color-badge-bg) text-(--color-text-muted) hover:text-(--color-navy)"
              }`}
            >
              <s.icon size={16} />
              {s.tab}
            </button>
          ))}
        </div>

        {/* Browser-chrome frame so the placeholder/screenshot reads as a real product, not a floating image */}
        <div className="mt-8 card-enterprise !p-0 overflow-hidden text-left">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-(--color-border) bg-(--color-bg-soft)">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 text-(length:--text-small) text-(--color-text-muted)">
              yourdomain.com/{current.key}
            </span>
          </div>

          {current.image ? (
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-auto block"
            />
          ) : (
            <div className="aspect-video bg-(--color-bg-soft) flex flex-col items-center justify-center gap-2 text-(--color-text-muted)">
              <current.icon size={40} />
              <span className="text-(length:--text-small)">
                Screenshot coming soon — {current.title}
              </span>
            </div>
          )}
          <div className="p-6 border-t border-(--color-border)">
            <h3 className="font-bold text-(--color-navy)">{current.title}</h3>
            <p className="text-(--color-text-muted) text-(length:--text-small) mt-1">
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}