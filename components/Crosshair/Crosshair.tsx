"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Crosshair.module.css";

/*
 * Тонкое перекрестье, как в чертёжной программе: две линии следуют за мышью,
 * рядом подпись с координатами. Только с мышью на широком экране; выключается кнопкой в футере.
 */
export function Crosshair() {
  const [enabled, setEnabled] = useState(false);
  const v = useRef<HTMLDivElement>(null);
  const h = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => {
      // с мышью по умолчанию включено, на телефоне — только если включили кнопкой в шапке
      let v: string | null = null;
      try { v = localStorage.getItem("crosshair"); } catch { /* ignore */ }
      setEnabled(!reduce.matches && (mq.matches ? v !== "off" : v === "on"));
    };
    compute();
    const onChange = (e: Event) => setEnabled(!reduce.matches && (e as CustomEvent<boolean>).detail);
    mq.addEventListener("change", compute);
    window.addEventListener("crosshair-change", onChange);
    return () => {
      mq.removeEventListener("change", compute);
      window.removeEventListener("crosshair-change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = 0, y = 0;
    const draw = () => {
      raf = 0;
      if (v.current) v.current.style.transform = `translateX(${x}px)`;
      if (h.current) h.current.style.transform = `translateY(${y}px)`;
      if (label.current) {
        label.current.style.transform = `translate(${Math.min(x + 12, innerWidth - 130)}px, ${Math.max(y - 36, 4)}px)`;
        label.current.textContent = `x ${String(Math.round(x)).padStart(4, "0")}  y ${String(Math.round(y + window.scrollY)).padStart(4, "0")}`;
      }
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      document.documentElement.dataset.crosshair = "on";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => { delete document.documentElement.dataset.crosshair; };
    // палец: перекрестье следует за касанием, подпись чуть выше пальца
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      x = t.clientX;
      y = t.clientY;
      document.documentElement.dataset.crosshair = "on";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    window.addEventListener("touchcancel", onLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("touchcancel", onLeave);
      delete document.documentElement.dataset.crosshair;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={v} className={styles.v} />
      <div ref={h} className={styles.h} />
      <span ref={label} className={styles.label} />
    </div>
  );
}
