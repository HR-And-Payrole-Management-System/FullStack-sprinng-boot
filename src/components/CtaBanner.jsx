import { Download } from "lucide-react";
import Button from "./ui/Button";
import CtaParticles from "./CtaParticles";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-20 px-4 bg-(--color-primary) text-center ">
      <CtaParticles />
      <div className="relative z-10">
        <h2 className="text-(length:--text-section-title) font-bold text-white">
          See if HRPayroll fits your organization
        </h2>
        <p className="text-white/85 mt-3 max-w-xl mx-auto">
          Talk through your setup, your compliance requirements, and how self-hosting works for your infrastructure — no commitment, no sales pressure.
        </p>
        
        <a  href="https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8"
        >
          <Button icon={Download} variant="dark">
            Get It on GitHub
          </Button>
        </a>
      </div>
    </section>
  );
}