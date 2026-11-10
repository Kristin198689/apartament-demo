"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LineIcon.module.css";

const ICONS = {
  checkin: ["M8 24 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0", "M24 24 H42", "M36 24 V31", "M42 24 V33"],
  parking: ["M6 6 H42 V42 H6 Z", "M17 36 V12 H26 a7.5 7.5 0 0 1 0 15 H17"],
  kitchen: ["M10 20 H38 V37 H10 Z", "M6 20 H42", "M38 27 H44", "M18 14 V9", "M24 14 V6", "M30 14 V9"],
  wifi: ["M7 19 a24 24 0 0 1 34 0", "M13 26 a15 15 0 0 1 22 0", "M19 33 a6 6 0 0 1 10 0", "M24 40 V40.1"],
  beds: ["M6 14 V38", "M6 30 H42 V38", "M6 38 H42", "M10 24 H22 V30", "M42 30 V22 H26 V30"],
  balcony: ["M6 18 H42", "M6 40 H42", "M12 18 V40", "M20 18 V40", "M28 18 V40", "M36 18 V40"],
} as const;

export type IconName = keyof typeof ICONS;

/** Тонкая иконка, «рисуется» при появлении — тот же приём, что у чертежа. */
export function LineIcon({ name, size = "md" }: { name: IconName; size?: "md" | "sm" | "lg" }) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={`${styles.icon} ${size === "sm" ? styles.sm : ""} ${size === "lg" ? styles.lg : ""}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
      data-visible={visible}
    >
      {ICONS[name].map((d, i) => (
        <path key={i} pathLength={1} d={d} style={{ transitionDelay: `${i * 120}ms` }} />
      ))}
    </svg>
  );
}
