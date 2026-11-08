"use client";

import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import styles from "./ElevationDrawing.module.css";

/*
 * Второй чертёж: фасад многоэтажного дома с осями и размерами.
 * Рисуется медленно по мере прокрутки секции (--p от 0 до 1), слоями:
 * контур → окна → детали → размеры и оси.
 */
const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

function build() {
  const outline = [
    "M0 480 H1200",
    "M200 480 V112 M800 480 V112",
    "M190 100 H810 V112 H190 Z",
    "M200 210 H800 M200 300 H800 M200 390 H800",
    "M800 480 V300 H1010 V480",
    "M790 300 L905 236 L1020 300",
  ];

  const windows: string[] = [];
  const rows = [140, 235, 325, 415];
  rows.forEach((y, r) => {
    for (let i = 0; i < 5; i++) {
      const x = 235 + i * 115;
      if (r === 3 && i === 2) continue; // место двери
      windows.push(rect(x, y, 60, 50), `M${x + 30} ${y} V${y + 50}`);
    }
  });
  windows.push(rect(830, 340, 50, 50), rect(930, 340, 50, 50), "M855 340 V390 M955 340 V390");

  const details: string[] = [];
  details.push(rect(470, 405, 60, 75), "M500 405 V480", "M455 395 H545", "M450 480 V486 H550 V480");
  [[1, 2], [3, 2], [1, 1], [3, 1]].forEach(([i, r]) => {
    const x = 235 + i * 115, y = rows[r];
    details.push(rect(x - 12, y + 22, 84, 30));
    for (let k = 1; k < 7; k++) details.push(`M${x - 12 + k * 12} ${y + 22} V${y + 52}`);
  });
  details.push(circle(110, 425, 52), "M110 478 V440", circle(1105, 440, 42), "M1105 478 V458");
  details.push("M40 480 A560 500 0 0 1 1160 480");

  const dims: string[] = [
    "M150 100 V480",
    "M140 100 H160 M140 210 H160 M140 300 H160 M140 390 H160 M140 480 H160",
    "M200 530 H800 M200 520 V540 M800 520 V540",
    circle(200, 40, 16) + " M200 56 V100",
    circle(500, 40, 16) + " M500 56 V100",
    circle(800, 40, 16) + " M800 56 V100",
    Array.from({ length: 34 }, (_, i) => `M${i * 36 + 14} 480 l-12 16`).join(" "),
  ];

  return { outline, windows, details, dims };
}

export function ElevationDrawing({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const L = useMemo(build, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.9 - r.top) / (r.height + vh * 0.35);
      el.style.setProperty("--p", Math.min(Math.max(p, 0), 1).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const P = (d: string, i: number) => <path key={`${i}-${d.length}`} pathLength={1} d={d} className={styles.draw} />;
  const body = (
    <>
      <g className={styles.l1}>{L.outline.map(P)}</g>
      <g className={styles.l2}>{L.windows.map(P)}</g>
      <g className={styles.l3}>{L.details.map(P)}</g>
      <g className={styles.l4}>{L.dims.map(P)}</g>
      <g className={styles.texts}>
        {([[480, "±0,00"], [390, "+3,00"], [300, "+6,00"], [210, "+9,00"], [112, "+12,00"]] as const).map(([y, t]) => (
          <text key={t} x="132" y={y + 4} textAnchor="end">{t}</text>
        ))}
        {([[200, "A"], [500, "B"], [800, "C"]] as const).map(([x, t]) => (
          <text key={t} x={x} y="45" textAnchor="middle">{t}</text>
        ))}
        <text x="500" y="560" textAnchor="middle">TODO m</text>
      </g>
    </>
  );

  return (
    <div ref={ref} className={styles.wrap} style={{ "--p": 0 } as CSSProperties} role="img" aria-label={label}>
      <svg className={`${styles.svg} ${styles.wide}`} viewBox="0 0 1200 570" aria-hidden="true" focusable="false">{body}</svg>
      <svg className={`${styles.svg} ${styles.narrow}`} viewBox="150 20 900 560" aria-hidden="true" focusable="false">{body}</svg>
    </div>
  );
}
