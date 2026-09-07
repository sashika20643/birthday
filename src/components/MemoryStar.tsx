import { useState } from "react";
import { CATEGORY_META, type Memory } from "@/memories";

interface Props {
  memory: Memory;
  visited: boolean;
  onClick: () => void;
}

export default function MemoryStar({ memory, visited, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[memory.category];
  const size = visited ? 14 : 10;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{
        left: `${memory.x * 100}%`,
        top: `${memory.y * 100}%`,
        zIndex: 20,
      }}
      aria-label={`Open memory: ${memory.title}`}
    >
      {/* invisible larger tap target for mobile */}
      <span className="absolute -inset-4 sm:-inset-2" />

      {/* outer glow */}
      <span
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: size * 4,
          height: size * 4,
          left: -size * 1.5,
          top: -size * 1.5,
          background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
          opacity: hovered ? 1 : visited ? 0.6 : 0.35,
          transform: hovered ? "scale(1.5)" : "scale(1)",
        }}
      />
      {/* pulsing ring for visited */}
      {visited && (
        <span
          className="absolute rounded-full animate-ping-slow"
          style={{
            width: size * 2,
            height: size * 2,
            left: -size / 2,
            top: -size / 2,
            border: `1px solid ${meta.color}`,
            opacity: 0.5,
          }}
        />
      )}
      {/* the star itself */}
      <span
        className="relative block rounded-full transition-all duration-300"
        style={{
          width: size,
          height: size,
          background: meta.color,
          boxShadow: `0 0 ${hovered ? 20 : 12}px ${meta.glow}, 0 0 ${hovered ? 40 : 20}px ${meta.glow}`,
          transform: hovered ? "scale(1.4)" : "scale(1)",
        }}
      />
      {/* hover label */}
      <span
        className={`absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium backdrop-blur-md transition-all duration-200 ${
          hovered ? "opacity-100 -translate-y-1" : "opacity-0"
        }`}
        style={{
          background: "rgba(15,15,30,0.85)",
          color: meta.color,
          border: `1px solid ${meta.glow}`,
        }}
      >
        {memory.category}
      </span>
    </button>
  );
}
