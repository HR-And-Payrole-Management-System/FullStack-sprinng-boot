import { useState } from "react";
import { X, Tag } from "lucide-react";

export default function TopbarBanner({ text, code, onClose }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-(--color-primary) text-white text-sm flex items-center justify-center gap-2 py-2 px-4 relative">
      <Tag size={14} />
      <span>{text}</span>
      {code && (
        <span className="bg-white/20 px-2 py-0.5 rounded font-semibold">{code}</span>
      )}
      <button
            onClick={() => { setVisible(false); onClose?.(); }}
            aria-label="Close promotion banner"
            className="absolute right-4 hover:opacity-70"
            >
            <X size={16} />
            </button>
    </div>
  );
}