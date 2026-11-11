"use client";

import { useEffect, useRef, useState } from "react";

/*
 * «Режим карандаша»: за мышью тянется тонкая линия, которая гаснет за секунду.
 * Включается кнопкой в шапке (вместе со звуком); только мышь, без reduced-motion.
 */
export function PencilTrail() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => { try { return localStorage.getItem("sound") === "on"; } catch { return false; } };
    setOn(read() && mq.matches && !reduce.matches);
    const h = (e: Event) => setOn((e as CustomEvent<boolean>).detail && mq.matches && !reduce.matches);
    window.addEventListener("pencil-change", h);
    return () => window.removeEventListener("pencil-change", h);
  }, []);

  useEffect(() => {
    const cv = ref.current;
    if (!on || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      cv.width = innerWidth * dpr;
      cv.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--color-text").trim() || "#111";
    const tick = () => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > 900) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.strokeStyle = color();
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i].t) / 900;
        ctx.globalAlpha = Math.max(0, a) * 0.5;
        ctx.lineWidth = 1 + a * 0.8;
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
      raf = pts.length ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: MouseEvent) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(tick);
    };
    addEventListener("mousemove", move, { passive: true });
    addEventListener("resize", size);
    return () => {
      removeEventListener("mousemove", move);
      removeEventListener("resize", size);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [on]);

  if (!on) return null;
  return <canvas ref={ref} aria-hidden="true" data-print="hide" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 70 }} />;
}
