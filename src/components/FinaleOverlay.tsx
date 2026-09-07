import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Check,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";

interface Props {
  onClose: () => void;
}

interface Firework {
  x: number;
  y: number;
  particles: {
    angle: number;
    speed: number;
    life: number;
    maxLife: number;
    color: string;
  }[];
  exploded: boolean;
  life: number;
}

interface Restaurant {
  id: string;
  name: string;
  area: string;
  image: string;
}

const FIREWORK_COLORS = [
  "#fbbf24",
  "#f472b6",
  "#c084fc",
  "#38bdf8",
  "#34d399",
  "#fb923c",
  "#ffffff",
];

const RESTAURANTS: Restaurant[] = [
  {
    id: "double-barrel",
    name: "Double Barrel",
    area: "Kottawa",
    image: "/images/restaurants/doubel-barrel-kottawa.jpg",
  },
  {
    id: "workhouse",
    name: "Workhouse",
    area: "Colombo",
    image: "/images/restaurants/workhouse.jpeg",
  },
  {
    id: "hogwarts-cafe",
    name: "Hogwarts Cafe",
    area: "Maharagama",
    image: "/images/restaurants/Hogwarts-Cafe-Maharagama.jpeg",
  },
  {
    id: "keku",
    name: "Keku",
    area: "Nugegoda",
    image: "/images/restaurants/keku-nugegoda.webp",
  },
];

const getDefaultDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const formatDate = (date: string): string => {
  if (!date) return "Choose a date";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
};

export default function FinaleOverlay({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"explosion" | "message" | "invitation">(
    "explosion"
  );
  const [selectedDate, setSelectedDate] = useState(getDefaultDate);
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANTS[0].id);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let fireworks: Firework[] = [];
    let animationId = 0;
    let frame = 0;

    const launchFirework = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const targetY = Math.random() * height * 0.4 + height * 0.1;
      fireworks.push({
        x: startX,
        y: height,
        particles: [],
        exploded: false,
        life: 0,
      });
      (fireworks[fireworks.length - 1] as Firework & { targetY?: number }).targetY =
        targetY;
    };

    const explode = (fw: Firework) => {
      const count = 40 + Math.floor(Math.random() * 20);
      const color =
        FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      fw.particles = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 4 + 2,
        life: 0,
        maxLife: 60 + Math.floor(Math.random() * 30),
        color,
      }));
      fw.exploded = true;
    };

    const render = () => {
      ctx.fillStyle = "rgba(5,5,15,0.15)";
      ctx.fillRect(0, 0, width, height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        const targetY =
          (fw as Firework & { targetY?: number }).targetY ?? height * 0.3;

        if (!fw.exploded) {
          fw.y -= 6;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(fw.x, fw.y);
          ctx.lineTo(fw.x, fw.y + 15);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();

          if (fw.y <= targetY) explode(fw);
        } else {
          for (const p of fw.particles) {
            p.life++;
            const px = fw.x + Math.cos(p.angle) * p.speed * p.life * 0.5;
            const py =
              fw.y +
              Math.sin(p.angle) * p.speed * p.life * 0.5 +
              0.02 * p.life * p.life;
            const alpha = 1 - p.life / p.maxLife;
            if (alpha <= 0) continue;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * 0.15;
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          if (fw.particles.every((p) => p.life >= p.maxLife)) {
            fireworks.splice(i, 1);
          }
        }
      }

      frame++;
      if (frame % 25 === 0 && fireworks.length < 8) launchFirework();
      animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    for (let i = 0; i < 5; i++) {
      setTimeout(() => launchFirework(), i * 200);
    }
    render();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("message"), 2500);
    const t2 = setTimeout(() => setPhase("invitation"), 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const restaurant = RESTAURANTS.find((item) => item.id === selectedRestaurant) ?? RESTAURANTS[0];
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      style={{ zIndex: 200 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/40" />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full my-8 sm:my-12">
        {phase === "explosion" || phase === "message" ? (
          <div
            className={`transition-all duration-1000 ${
              phase === "message"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="text-amber-300" size={24} />
              <Sparkles className="text-pink-400" size={18} />
              <Sparkles className="text-purple-400" size={24} />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight px-4">
              Happy Birthday
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/60 font-light px-4">
              You've discovered every star in your universe.
            </p>
            <p className="mt-1 text-xs sm:text-sm text-white/40 px-4">
              Every memory, every laugh, every moment — they're all you.
            </p>
          </div>
        ) : null}

        {phase === "invitation" && (
          <div className="animate-finale-rise w-full">
            <div
              className="relative rounded-2xl sm:rounded-3xl border border-white/15 backdrop-blur-xl px-4 py-6 sm:px-10 sm:py-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,15,40,0.94), rgba(10,10,25,0.96))",
                boxShadow:
                  "0 0 80px rgba(192,132,252,0.2), 0 0 40px rgba(244,114,182,0.15), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-white/20 rounded-tl-lg sm:rounded-tl-xl" />
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-white/20 rounded-tr-lg sm:rounded-tr-xl" />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-white/20 rounded-bl-lg sm:rounded-bl-xl" />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-white/20 rounded-br-lg sm:rounded-br-xl" />

              <div className="flex items-center justify-center mb-4 sm:mb-5">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)",
                  }}
                >
                  <UtensilsCrossed className="text-amber-300" size={24} />
                </div>
              </div>

              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-300/70 mb-2 sm:mb-3">
                An Invitation
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-2 sm:mb-3">
                Dinner awaits you
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-md mx-auto mb-5 sm:mb-7 px-2">
                You've traveled through 27 years of memories. Now choose where our
                next little story begins.
              </p>

              <div className="grid gap-4 sm:gap-6 text-left">
                <section>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Calendar className="text-pink-400" size={16} />
                    <h3 className="text-xs sm:text-sm font-medium text-white/85">Choose the date</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      min={today}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="w-full rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.06] px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition focus:border-pink-400/70 [color-scheme:dark]"
                      aria-label="Choose dinner date"
                    />
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-white/40">{formatDate(selectedDate)}</p>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <MapPin className="text-emerald-400" size={16} />
                    <h3 className="text-xs sm:text-sm font-medium text-white/85">Choose the place</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {RESTAURANTS.map((item) => {
                      const isSelected = item.id === selectedRestaurant;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedRestaurant(item.id)}
                          className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                            isSelected
                              ? "border-amber-300/80 ring-2 ring-amber-300/20"
                              : "border-white/10 hover:border-white/35"
                          }`}
                          aria-pressed={isSelected}
                        >
                          <img
                            src={item.image}
                            alt={`${item.name} restaurant in ${item.area}`}
                            className="h-20 sm:h-28 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          {isSelected && (
                            <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-[#20142e]">
                              <Check size={14} strokeWidth={3} />
                            </span>
                          )}
                          <span className="absolute bottom-2 left-2.5 right-2">
                            <span className="block text-xs font-medium text-white">{item.name}</span>
                            <span className="block text-[10px] text-white/60">{item.area}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="mt-5 sm:mt-7 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2.5 sm:py-3 text-left">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35">Your evening</p>
                <p className="mt-1 text-xs sm:text-sm text-white/85">
                  {formatDate(selectedDate)} at {restaurant.name}
                </p>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-white/45">{restaurant.area} · 7:30 PM</p>
              </div>

              <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/10">
                <p className="text-xs sm:text-sm text-white/50 italic">
                  Get dressed up. I'll handle the rest.
                </p>
                <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-white/30">
                  (And yes — dessert is already taken care of.)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
