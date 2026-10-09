"use client";
import { useEffect, useRef } from "react";

/** Animated neural network: drifting nodes, connections, and data pulses travelling along links. */
export function NeuralBg({ className = "", density = 46 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type N = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: N[] = [];
    const pulses: { a: number; b: number; t: number; s: number }[] = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(density * Math.min(1, (w * h) / (1400 * 800)) + 10);
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: Math.random() * 1.6 + 0.6 }));
    };
    const LINK = 150;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) { n.x += n.vx; n.y += n.vy; }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(90,168,255,${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduce && pulses.length < 14 && Math.random() < 0.0009) pulses.push({ a: i, b: j, t: 0, s: 0.006 + Math.random() * 0.01 });
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(139,233,255,.75)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.t += p.s;
        const a = nodes[p.a], b = nodes[p.b];
        if (p.t >= 1 || !a || !b) { pulses.splice(k, 1); continue; }
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grd.addColorStop(0, "rgba(61,216,255,.95)"); grd.addColorStop(1, "rgba(61,216,255,0)");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    resize();
    frame();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [density]);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
