import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORY_META, type Memory } from "@/memories";

interface Props {
  memory: Memory | null;
  onClose: () => void;
}

export default function MemoryModal({ memory, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageUrl(null);
    setImageError(false);
    if (!memory) return;

    let cancelled = false;
    fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        memory.imageQuery
      )}&per_page=1`,
      { headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY || "" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const url = data?.photos?.[0]?.src?.large;
        if (url) setImageUrl(url);
        else setImageError(true);
      })
      .catch(() => !cancelled && setImageError(true));

    return () => {
      cancelled = true;
    };
  }, [memory]);

  // lock scroll while open
  useEffect(() => {
    if (memory) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [memory]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!memory) return null;
  const meta = CATEGORY_META[memory.category];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      style={{ zIndex: 100 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0a0a1a]/95 shadow-2xl animate-modal-rise mx-auto"
        style={{ boxShadow: `0 0 60px ${meta.glow}, 0 20px 80px rgba(0,0,0,0.6)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* image area */}
        <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-[#0d0d22] to-[#15152e]">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 animate-pulse-slow"
                  style={{
                    background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full block"
                    style={{ background: meta.color, boxShadow: `0 0 20px ${meta.glow}` }}
                  />
                </div>
                <p className="text-sm text-white/40">[ image placeholder ]</p>
                <p className="text-xs text-white/25 mt-1">{memory.imageQuery}</p>
              </div>
            </div>
          )}
          {/* category badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span
              className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-md"
              style={{
                background: "rgba(0,0,0,0.5)",
                color: meta.color,
                border: `1px solid ${meta.glow}`,
              }}
            >
              {memory.category}
            </span>
          </div>
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/70 transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* text area */}
        <div className="p-5 sm:p-6 md:p-8">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3"
            style={{ color: meta.color }}
          >
            {memory.title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            {memory.description}
          </p>
        </div>
      </div>
    </div>
  );
}
