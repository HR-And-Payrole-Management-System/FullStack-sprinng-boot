import { ShieldCheck, UserCog, User, Sparkles } from "lucide-react";

const exampleRoles = [
  {
    icon: ShieldCheck,
    name: "Admin",
    description: "Full system access — every module, every setting, user management.",
  },
  {
    icon: User,
    name: "Employee",
    description: "Default role on self-registration — own profile, own leave requests, own payslips.",
  },
  {
    icon: UserCog,
    name: "Your custom roles",
    description: "Create HR Manager, Recruiter, Finance, or any role your org needs, with exactly the permissions you assign.",
  },
];

export default function RolesSection() {
  return (
    <section id="rbac" className="py-(--spacing-section) px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-(--color-primary) font-semibold text-(length:--text-small) uppercase tracking-wide">
          Access Control
        </p>
        <h2 className="text-(length:--text-section-title) font-bold text-(--color-navy) mt-2">
          Roles & Permissions, Built to Fit Your Org
        </h2>
        <p className="text-(--color-text-muted) mt-3 max-w-2xl mx-auto">
          Two roles ship by default. Every other role — and exactly what it can see and do —
          is defined by your admins from Settings, not locked into the code.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-12 text-left">
          {exampleRoles.map((r) => (
            <div key={r.name} className="card-enterprise">
              <div className="w-10 h-10 rounded-lg bg-(--color-primary-soft) flex items-center justify-center">
                <r.icon size={20} className="text-(--color-primary)" />
              </div>
              <h3 className="font-bold text-(--color-navy) mt-4">{r.name}</h3>
              <p className="text-(--color-text-muted) text-(length:--text-small) mt-2">
                {r.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-(--color-text-muted) text-(length:--text-small) bg-(--color-badge-bg) rounded-(--radius-pill) px-4 py-2">
          <Sparkles size={14} className="text-(--color-primary)" />
          Fine-grained, permission-based access — enforced on both the API and the UI.
        </div>
      </div>
    </section>
  );
}