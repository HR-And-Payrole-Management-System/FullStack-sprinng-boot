import {
  Users, Building2, Clock, CalendarDays, Wallet,
  Briefcase, Target, GraduationCap, FileText,
  BarChart3, Mail, ShieldCheck,
} from "lucide-react";

const modules = [
  {
    icon: Users,
    title: "Employee Management",
    points: [
      "Full employee profiles with organization cascade",
      "Auto-tracked employment history",
      "Login-account linking per employee",
    ],
  },
  {
    icon: Building2,
    title: "Organization Structure",
    points: [
      "Company → Branch → Department → Position hierarchy",
      "Job Roles and Locations",
      "Dependent dropdowns across all org forms",
    ],
  },
  {
    icon: Clock,
    title: "Attendance",
    points: [
      "Check-in / check-out tracking",
      "Manual adjustment with reason",
      "Server-side filters by employee, department, branch, date",
    ],
  },
  {
    icon: CalendarDays,
    title: "Leave Management",
    points: [
      "Configurable leave types",
      "Self-service request + manager review",
      "Approve / reject with comments",
    ],
  },
  {
    icon: Wallet,
    title: "Payroll",
    points: [
      "Salary structures with per-employee assignment",
      "Draft → Approve → Paid workflow",
      "Printable payslips",
    ],
  },
  {
    icon: Briefcase,
    title: "Recruitment",
    points: [
      "Job postings",
      "Candidate pipeline",
      "Applications tracking",
    ],
  },
  {
    icon: Target,
    title: "Performance",
    points: [
      "Review cycles",
      "Goal setting",
      "Performance reviews",
    ],
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    points: [
      "Training programs",
      "Employee enrollment",
      "Enrollment status tracking",
    ],
  },
  {
    icon: FileText,
    title: "Documents",
    points: [
      "Document upload per employee",
      "Verification workflow",
    ],
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    points: [
      "Employee, attendance, and leave reports",
      "Workforce insights: attrition, tenure, demographics",
      "Payroll cost analytics",
    ],
  },
  {
    icon: Mail,
    title: "Communication",
    points: [
      "Internal mail",
      "Notifications",
      "Shared calendar",
    ],
  },
  {
    icon: ShieldCheck,
    title: "System Administration",
    points: [
      "Role-based access control",
      "Audit log of every change",
      "System settings",
    ],
  },
];

export default function ModulesGrid() {
  return (
    <section id="modules" className="py-(--spacing-section) px-4 bg-(--color-bg-soft)">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-(--color-primary) font-semibold text-(length:--text-small) uppercase tracking-wide">
          Modules
        </p>
        <h2 className="text-(length:--text-section-title) font-bold text-(--color-navy) mt-2">
          {modules.length} Modules. Full Employee Lifecycle.
        </h2>
        <p className="text-(--color-text-muted) mt-3 max-w-2xl mx-auto">
          From first job posting to final payslip — every workflow below is a real, built module in this project.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
          {modules.map((m) => (
            <div key={m.title} className="card-enterprise">
              <div className="w-10 h-10 rounded-lg bg-(--color-primary-soft) flex items-center justify-center">
                <m.icon size={20} className="text-(--color-primary)" />
              </div>
              <h3 className="font-bold text-(--color-navy) mt-4">{m.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {m.points.map((p) => (
                  <li key={p} className="text-(--color-text-muted) text-(length:--text-small) flex gap-2">
                    <span className="text-(--color-primary)">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}