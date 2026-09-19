import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users2, Home as HomeIcon, UserCircle, Clock, Plane, Wallet,
  BarChart3, FileText, Bell, ChevronDown, LogIn, UserPlus,
} from "lucide-react";
import {
  Layers, Package, Gift, Building2, Newspaper, Mail,
} from "lucide-react";

const BRAND_NAME = "HRPayroll"; // TODO: replace with your real product name

const menu = [
  { label: "Home", href: "/home", icon: HomeIcon, sectionId: "hero" },
  { label: "Services", href: "/home#features", icon: Layers, sectionId: "features" },
  { label: "Product", href: "/home#modules", icon: Package, sectionId: "modules" },
  { label: "Free Software", href: "/home#stats", icon: Gift, sectionId: "stats" },
  { label: "Company", href: "/home#footer", icon: Building2, sectionId: "footer" },
  { label: "Blog", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-sprinng-boot", icon: Newspaper }, // TODO: real blog/docs URL
  { label: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== "/home") return;

    const sectionIds = menu.filter((m) => m.sectionId).map((m) => m.sectionId);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (item) => {
    if (!item.sectionId) {
      return location.pathname === item.href.split("#")[0];
    }
    return location.pathname === "/home" && activeSection === item.sectionId;
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 shadow-(--shadow-nav) bg-white no-underline">
      <Link to="/home" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 rounded-lg bg-(--color-primary-soft) flex items-center justify-center">
          <Users2 size={20} className="text-(--color-primary)" />
        </div>
        <div>
          <div className="font-bold text-lg text-(--color-navy) leading-tight">
            {BRAND_NAME.split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-[letter-in_0.4s_ease-out_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-(length:--text-small) text-(--color-text-muted) leading-tight">
            People · Payroll · Performance
          </div>
        </div>
      </Link>

      <div className="flex gap-6 items-center">
        {menu.map((item) => (
          
          <a  key={item.label}
            href={item.href}
            className={`flex items-center gap-1.5 text-(length:--text-small) font-medium no-underline transition-colors pb-1 border-b-2 ${
              isActive(item)
                ? "text-(--color-primary) border-(--color-primary)"
                : "text-(--color-text-muted) border-transparent hover:text-(--color-primary)"
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
                <button aria-label="Notifications" className="relative group">
          <Bell
            size={20}
            className="text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors animate-[bell-ring_4s_ease-in-out_infinite]"
          />
          <span className="absolute -top-1 -right-1 flex">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              0
            </span>
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <div className="w-9 h-9 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-semibold text-(length:--text-small)">
              DU
            </div>
            <div className="leading-tight text-left">
              <div className="text-(length:--text-small) font-semibold text-(--color-navy)">
                Demo User {/* TODO: wire to real session, or remove this block on a logged-out marketing page */}
              </div>
              <div className="text-[11px] text-(--color-text-muted)">Preview</div>
            </div>
            <ChevronDown
              size={14}
              className={`text-(--color-text-muted) transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-(--radius-card) shadow-(--shadow-card) border border-(--color-border) py-2 no-underline">
              <Link
                to="/account-settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-(length:--text-small) text-(--color-navy) hover:bg-(--color-bg-soft) no-underline"
              >
                <UserCircle size={16} />
                My Profile
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-(length:--text-small) text-(--color-navy) hover:bg-(--color-bg-soft) no-underline"
              >
                <LogIn size={16} />
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-(length:--text-small) text-(--color-navy) hover:bg-(--color-bg-soft) no-underline"
              >
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}