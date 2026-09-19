import SEO from "../components/SEO";
import TopbarBanner from "../components/TopbarBanner";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ScreenshotShowcase from "../components/ScreenshotShowcase";
import ModulesGrid from "../components/ModulesGrid";
import RolesSection from "../components/RolesSection";
import TechStackSection from "../components/TechStackSection";
import CtaBanner from "../components/CtaBanner";
import TelegramChatButton from "../components/TelegramChatButton";
import MarketingFooter from "../components/MarketingFooter";


export default function Home() {
  return (
    <>
      <SEO
        title="HRPayroll — Complete Open-Source HR & Payroll System"
        description="Manage employees, payroll, attendance, recruitment, and performance in one self-hosted platform."
        url="https://yourdomain.com/"
      />
      <a href="#main" className="skip-link">Skip to content</a>
      <TopbarBanner text="🎉 v1.0 is live — self-hosted HR & Payroll, MIT licensed, free forever" />
      <Navbar />
      <main id="main">
        <Hero />
        <ScreenshotShowcase />
        <ModulesGrid />
        <RolesSection />
        <TechStackSection />
        <CtaBanner />
        <TelegramChatButton />
        
      </main>
      <MarketingFooter />
    </>
  );
}