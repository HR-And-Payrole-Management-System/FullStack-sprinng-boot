import { useState, useRef, useCallback, useEffect } from "react";
import { Send, X } from "lucide-react";

// TODO: replace with your real Telegram username or bot username (without the @)
const TELEGRAM_USERNAME = "sengsang2006";

export default function TelegramChatButton() {
  const [dismissed, setDismissed] = useState(false);
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem("telegram-btn-pos");
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 80, y: window.innerHeight - 100 };
  });
  const dragging = useRef(false);
  const moved = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const clamp = useCallback((x, y) => {
    const size = 56;
    const maxX = window.innerWidth - size - 12;
    const maxY = window.innerHeight - size - 12;
    return { x: Math.min(Math.max(x, 12), maxX), y: Math.min(Math.max(y, 12), maxY) };
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    moved.current = false;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    moved.current = true;
    const next = clamp(e.clientX - offset.current.x, e.clientY - offset.current.y);
    setPos(next);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    localStorage.setItem("telegram-btn-pos", JSON.stringify(pos));
  };

  useEffect(() => {
    const onResize = () => setPos((p) => clamp(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  if (dismissed) return null;

  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-2"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="bg-white shadow-(--shadow-card) rounded-(--radius-card) px-4 py-2 text-(length:--text-small) text-(--color-navy) flex items-center gap-2 whitespace-nowrap">
        Questions? Chat with us
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-(--color-text-muted) hover:text-(--color-navy)"
        >
          <X size={14} />
        </button>
      </div>

      
      <a  href={`https://t.me/${TELEGRAM_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on Telegram"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={(e) => {
          if (moved.current) e.preventDefault(); // don't open Telegram if it was a drag, not a click
        }}
        className="w-14 h-14 rounded-full bg-[#229ED9] shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-grab active:cursor-grabbing touch-none"
      >
        <Send size={24} className="text-white" fill="white" />
      </a>
    </div>
  );
}