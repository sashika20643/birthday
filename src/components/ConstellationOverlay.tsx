import { useEffect, useRef } from "react";
import { CATEGORY_META, type Memory } from "@/memories";

interface Props {
  memories: Memory[];
  visitedIds: Set<string>;
}

export default function ConstellationOverlay({ memories, visitedIds }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const visited = memories.filter((m) => visitedIds.has(m.id));
      if (visited.length < 2) return;

      // draw lines between visited stars, ordered by nearest neighbor chain
      const points = visited.map((m) => ({
        x: m.x * width,
        y: m.y * height,
        color: CATEGORY_META[m.category].glow,
      }));

      // connect each point to its nearest 2 visited neighbors
      for (let i = 0; i < points.length; i++) {
        const dists = points
          .map((p, j) => ({
            j,
            d: i === j ? Infinity : Math.hypot(p.x - points[i].x, p.y - points[i].y),
          }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);

        for (const { j } of dists) {
          if (j <= i) continue; // avoid double-draw
          const grad = ctx.createLinearGradient(
            points[i].x,
            points[i].y,
            points[j].x,
            points[j].y
          );
          grad.addColorStop(0, points[i].color);
          grad.addColorStop(1, points[j].color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      draw();
    };

    draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [memories, visitedIds]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
      style={{ zIndex: 10 }}
    />
  );
}
