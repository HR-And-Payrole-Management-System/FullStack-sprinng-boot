const faqs = [
  {
    q: "Is it really free with no limitations?",
    a: "Yes — MIT licensed. There's no paid tier, no feature locks, and no per-user pricing anywhere in the codebase.",
  },
  {
    q: "Who can access our employee data?",
    a: "No one but you. The system is self-hosted — it runs on your own servers or cloud account, and no data is ever transmitted to us or any third party.",
  },
  {
    q: "Can I modify the source code?",
    a: "Yes. Full source is included for both the Spring Boot backend and React frontend. No restrictions on modification, redistribution, or commercial use under MIT.",
  },
  {
    q: "What support is available if something breaks?",
    a: "There's no paid support contract today — support happens through GitHub issues on the project repository. Factor that into your evaluation if you need guaranteed response times.",
  },
  {
    q: "Does it support multiple companies?",
    a: "Yes — Company and Branch are full CRUD entities, so one deployment can track multiple companies and their branches, not just one.",
  },
  {
    q: "Do I need coding skills to install it?",
    a: "Some. There's no one-click installer yet — you'll need to run a Spring Boot backend (Java 21, Maven, MySQL) and a Vite/React frontend separately, and configure a .env file with your own credentials.",
  },
  {
    q: "Which regions is it built for?",
    a: "The core system is region-agnostic — currency, dates, and payroll rules aren't hardcoded to a specific country. There are no region-specific compliance modules (e.g. GDPR, local tax rules) built in yet.",
  },
  {
    q: "Can I upgrade when new versions are released?",
    a: "Versioning and release tagging is still being set up on the project's GitHub repo — check there for the latest release notes before pulling updates.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-(--spacing-section) px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <p className="text-(--color-primary) font-semibold text-(length:--text-small) uppercase tracking-wide">
            FAQ
          </p>
          <h2 className="text-(length:--text-section-title) font-bold text-(--color-navy) mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-(--color-border)">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-(--color-navy)">
                {f.q}
                <span className="text-(--color-primary) group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="text-(--color-text-muted) text-(length:--text-small) mt-3">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}