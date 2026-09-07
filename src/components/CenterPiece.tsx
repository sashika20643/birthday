import { CATEGORY_META, type MemoryCategory, MEMORIES } from "@/memories";

interface Props {
  visitedIds: Set<string>;
  visitedCount: number;
  totalCount: number;
  allVisited: boolean;
  onOrbClick: () => void;
}

export default function CenterPiece({
  visitedIds,
  visitedCount,
  totalCount,
  allVisited,
  onOrbClick,
}: Props) {
  const categories = Object.keys(CATEGORY_META) as MemoryCategory[];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6">
      {/* center glowing orb */}
      <div className="relative mb-6 sm:mb-8 animate-float">
        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow"
          style={{
            width: 120,
            height: 120,
            background: allVisited
              ? "radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(244,114,182,0.4) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(192,132,252,0.4) 0%, rgba(56,189,248,0.2) 50%, transparent 70%)",
          }}
        />
        <button
          onClick={onOrbClick}
          disabled={!allVisited}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-1000 outline-none ${
            allVisited
              ? "border-amber-300/40 cursor-pointer hover:scale-110 active:scale-95 pointer-events-auto animate-orb-glow"
              : "border-white/15 cursor-default"
          }`}
          style={{
            background: allVisited
              ? "radial-gradient(circle at 35% 30%, rgba(60,40,10,0.9), rgba(25,15,5,0.95))"
              : "radial-gradient(circle at 35% 30%, rgba(40,30,70,0.9), rgba(10,10,25,0.95))",
            boxShadow: allVisited
              ? "0 0 60px rgba(251,191,36,0.5), 0 0 30px rgba(244,114,182,0.3), inset 0 0 30px rgba(244,114,182,0.15)"
              : "0 0 40px rgba(192,132,252,0.3), inset 0 0 30px rgba(56,189,248,0.1)",
          }}
          aria-label={allVisited ? "Start the birthday surprise" : "27 years"}
        >
          <div className="text-center">
            <p
              className="text-2xl sm:text-3xl font-light tracking-tight transition-colors duration-1000"
              style={{ color: allVisited ? "#fbbf24" : "rgba(255,255,255,0.9)" }}
            >
              27
            </p>
            <p
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-0.5 transition-colors duration-1000"
              style={{ color: allVisited ? "rgba(244,114,182,0.7)" : "rgba(255,255,255,0.5)" }}
            >
              years
            </p>
          </div>
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white/90 text-center tracking-tight animate-fade-in-slow">
        27 years of you
      </h1>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/40 text-center max-w-xs sm:max-w-sm animate-fade-in-slow px-2">
        {allVisited
          ? "Tap the star to begin your surprise."
          : "Each star holds a memory. Tap to explore the universe we've made together."}
      </p>

      {/* progress */}
      <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 animate-fade-in-slow">
        <div className="w-32 sm:w-40 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(visitedCount / totalCount) * 100}%`,
              background:
                "linear-gradient(90deg, #fbbf24, #f472b6, #c084fc, #38bdf8)",
            }}
          />
        </div>
        <span className="text-[11px] sm:text-xs text-white/40 tabular-nums">
          {visitedCount} / {totalCount}
        </span>
      </div>

      {/* legend */}
      <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 max-w-[90%] sm:max-w-md animate-fade-in-slow">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const inCat = MEMORIES.filter((m) => m.category === cat);
          const visitedInCat = inCat.filter((m) => visitedIds.has(m.id)).length;
          return (
            <div key={cat} className="flex items-center gap-1 sm:gap-1.5">
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ background: meta.color, boxShadow: `0 0 8px ${meta.glow}` }}
              />
              <span className="text-[10px] sm:text-[11px] text-white/40">
                {cat} {visitedInCat}/{inCat.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
