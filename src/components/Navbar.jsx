import { Link } from "react-router-dom";
import {
  Users2, Home, UserCircle, Clock, Plane, Wallet,
  BarChart3, FileText, Bell, ChevronDown,
  Layers, Package, Gift, Building2, Newspaper, Mail,
} from "lucide-react";

const menu = [
  { label: "Services", href: "#features", icon: Layers },
  { label: "Product", href: "#modules", icon: Package },
  { label: "Free Software", href: "#stats", icon: Gift },
  { label: "Company", href: "#footer", icon: Building2 },
  { label: "Blog", href: "https://github.com/HR-And-Payrole-Management-System/FullStack-sprinng-boot", icon: Newspaper },// TODO: real blog/docs URL
  { label: "Contact", href: "#footer", icon: Mail },
];
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 shadow-(--shadow-nav) bg-white no-underline">
      <Link to="/home" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 rounded-lg bg-(--color-primary-soft) flex items-center justify-center">
          <Users2 size={20} className="text-(--color-primary)" />
        </div>
        <div>
          <div className="font-bold text-lg text-(--color-navy) leading-tight">
            HRPayroll {/* TODO: replace with your real product name */}
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
            className="flex items-center gap-1.5 text-(length:--text-small) font-medium text-(--color-text-muted) hover:text-(--color-primary) no-underline transition-colors"
          >
            <item.icon size={16} />
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="relative">
          <Bell size={20} className="text-(--color-text-muted)" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            0
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-default">
          <div className="w-9 h-9 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-semibold text-(length:--text-small)">
            DU
          </div>
          <div className="leading-tight">
            <div className="text-(length:--text-small) font-semibold text-(--color-navy)">
              Demo User {/* TODO: wire to real session, or remove this block on a logged-out marketing page */}
            </div>
            <div className="text-[11px] text-(--color-text-muted)">Preview</div>
          </div>
          <ChevronDown size={14} className="text-(--color-text-muted)" />
        </div>
      </div>
    </nav>
  );
}