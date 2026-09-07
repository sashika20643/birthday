import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let animationId = 0;

    const createStars = () => {
      const count = Math.floor((width * height) / 3500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.7;
      const startY = Math.random() * height * 0.5;
      shootingStars.push({
        x: startX,
        y: startY,
        len: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 6,
        angle: Math.PI / 4 + (Math.random() * 0.3 - 0.15),
        alpha: 1,
        life: 0,
        maxLife: 80,
      });
    };

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // subtle nebula glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.6
      );
      grad.addColorStop(0, "rgba(30,20,60,0.15)");
      grad.addColorStop(0.5, "rgba(10,10,30,0.05)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // stars
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        const alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        ctx.fill();
      }

      // shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha = 1 - ss.life / ss.maxLife;

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;
        const sg = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        sg.addColorStop(0, `rgba(255,255,255,${ss.alpha})`);
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = sg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      // occasionally spawn a shooting star
      frame++;
      if (frame % 180 === 0 && Math.random() > 0.4) spawnShootingStar();

      animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    };

    createStars();
    render();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
