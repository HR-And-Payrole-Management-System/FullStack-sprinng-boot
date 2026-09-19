import { Download } from "lucide-react";
import Button from "./ui/Button";
import CtaParticles from "./CtaParticles";

export default function CtaBanner() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 text-center"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(99, 60, 180, 0.35), transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 80%, rgba(30, 80, 180, 0.3), transparent 60%),
          linear-gradient(rgba(5,5,10,0.85), rgba(5,5,10,0.85)),
          url('/b1.png')
        `,
        backgroundBlendMode: "normal, normal, multiply, normal",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CtaParticles />
      <div className="relative z-10">
        <h2 className="text-(length:--text-section-title) font-bold text-white">
          See if HRPayroll fits your organization
        </h2>
        <p className="text-white/85 mt-3 max-w-xl mx-auto">
          Talk through your setup, your compliance requirements, and how self-hosting works for your infrastructure — no commitment, no sales pressure.
        </p>

        
         <a href="https://github.com/HR-And-Payrole-Management-System/FullStack-springng-boot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8"
        >
          <Button icon={Download} variant="primary">
            Get It on GitHub
          </Button>
        </a>
      </div>
    </section>
  );
}