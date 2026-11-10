"use client";

import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { buildDrawing, type Layers } from "./drawing";
import styles from "./HeroBlueprint.module.css";

/*
 * Фоновый чертёж за всем hero: плотный, крупный, на весь экран.
 * Стены/мебель рисуются при загрузке; сетка, размеры и детали «дорисовываются»
 * по мере скролла (--p от 0 до 1), чертёж слегка уплывает вверх.
 * Две раскладки: широкая (десктоп) и вытянутая (телефон).
 */
function Drawing({ layers, className }: { layers: Layers; className: string }) {
  const draw = (d: string, i: number) => (
    <path key={`${i}-${d.length}`} pathLength={1} d={d} className={styles.draw} style={{ "--i": i } as CSSProperties} />
  );
  return (
    <svg
      className={className}
      viewBox={className.includes("wide") ? "0 0 1440 900" : "0 0 480 1000"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.walls}>{layers.walls.map(draw)}</g>
      <g className={styles.inner}>{layers.inner.map(draw)}</g>
      <g className={styles.furn}>{layers.furn.map(draw)}</g>
      <g className={`${styles.scroll} ${styles.c}`}>{layers.grid.map(draw)}</g>
      <g className={`${styles.scroll} ${styles.d}`}>{layers.extra.map(draw)}</g>
    </svg>
  );
}

export function HeroBlueprint() {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useMemo(() => buildDrawing(1440, 900), []);
  const tall = useMemo(() => buildDrawing(480, 1000), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      el.dataset.ready = "true";
      return;
    }
    const start = requestAnimationFrame(() => {
      el.dataset.ready = "true";
    });
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = Math.max(el.parentElement?.offsetHeight ?? 800, 400);
      el.style.setProperty("--p", Math.min(Math.max(window.scrollY / (h * 1.7), 0), 1).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();

    // Зона под строкой фактов: чертёж там полностью скрыт, чтобы линии не перечёркивали слова
    const hero = el.parentElement;
    const facts = hero?.querySelector<HTMLElement>("[data-hero-facts]");
    const setBand = () => {
      if (!facts) return;
      const w = el.getBoundingClientRect();
      const f = facts.getBoundingClientRect();
      el.style.setProperty("--band", `${Math.max(w.bottom - f.top + 6, 0).toFixed(0)}px`);
    };
    setBand();
    const ro = new ResizeObserver(setBand);
    if (hero) ro.observe(hero);
    if (facts) ro.observe(facts);
    document.fonts?.ready.then(setBand);
    window.addEventListener("resize", setBand);

    // Лёгкий параллакс слоёв за мышью (только с мышью)
    let pRaf = 0;
    let mx = 0, my = 0;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!pRaf) {
        pRaf = requestAnimationFrame(() => {
          pRaf = 0;
          el.style.setProperty("--mx", mx.toFixed(3));
          el.style.setProperty("--my", my.toFixed(3));
        });
      }
    };
    if (fine) window.addEventListener("mousemove", onMove, { passive: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (pRaf) cancelAnimationFrame(pRaf);
      ro.disconnect();
      window.removeEventListener("resize", setBand);
      cancelAnimationFrame(start);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <div className={styles.inner}>
        <Drawing layers={wide} className={`${styles.svg} ${styles.wide}`} />
        <Drawing layers={tall} className={`${styles.svg} ${styles.tall}`} />
      </div>
    </div>
  );
}
