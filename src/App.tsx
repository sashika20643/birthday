import { useState } from "react";
import Starfield from "@/components/Starfield";
import MemoryStar from "@/components/MemoryStar";
import MemoryModal from "@/components/MemoryModal";
import ConstellationOverlay from "@/components/ConstellationOverlay";
import CenterPiece from "@/components/CenterPiece";
import FinaleOverlay from "@/components/FinaleOverlay";
import { MEMORIES, type Memory } from "@/memories";

export default function App() {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [showFinale, setShowFinale] = useState(false);

  const allVisited = visitedIds.size === MEMORIES.length;

  const handleStarClick = (memory: Memory) => {
    setActiveMemory(memory);
    setVisitedIds((prev) => new Set(prev).add(memory.id));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05050f]">
      <Starfield />
      <ConstellationOverlay memories={MEMORIES} visitedIds={visitedIds} />

      <CenterPiece
        visitedIds={visitedIds}
        visitedCount={visitedIds.size}
        totalCount={MEMORIES.length}
        allVisited={allVisited}
        onOrbClick={() => allVisited && setShowFinale(true)}
      />

      {/* interactive stars */}
      <div className="absolute inset-0" style={{ zIndex: 20 }}>
        {MEMORIES.map((memory) => (
          <MemoryStar
            key={memory.id}
            memory={memory}
            visited={visitedIds.has(memory.id)}
            onClick={() => handleStarClick(memory)}
          />
        ))}
      </div>

      <MemoryModal memory={activeMemory} onClose={() => setActiveMemory(null)} />

      {showFinale && <FinaleOverlay onClose={() => setShowFinale(false)} />}
    </div>
  );
}
