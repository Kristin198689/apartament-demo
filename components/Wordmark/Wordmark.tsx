"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Wordmark.module.css";

/*
 * Название на всю ширину контейнера, полупрозрачные буквы с тонким контуром.
 * SVG + textLength: текст всегда растягивается ровно на ширину, на любом экране.
 */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.wrap} data-visible={visible}>
    <svg
      className={styles.wordmark}
      viewBox="0 12 1000 130"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <text x="0" y="124" textLength="1000" lengthAdjust="spacingAndGlyphs" className={styles.text}>
        {text}
      </text>
    </svg>
    </div>
  );
}
