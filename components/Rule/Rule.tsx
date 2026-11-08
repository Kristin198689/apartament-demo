"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Rule.module.css";

/** Тонкая линия-разделитель, «рисуется» слева направо при появлении. Родитель — position: relative. */
export function Rule({ edge = "top" }: { edge?: "top" | "bottom" }) {
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
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${styles.rule} ${edge === "bottom" ? styles.bottom : styles.top}`}
      data-visible={visible}
    />
  );
}
