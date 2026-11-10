"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./KeyCodeDemo.module.css";

const CODE = [4, 8, 2, 1]; // демо-код

/*
 * Мини-демо самозаселения: когда блок появляется в окне, цифры кода «набираются»,
 * дверь на чертеже открывается. Повтор — по кнопке. Код вымышленный.
 */
export function KeyCodeDemo() {
  const t = useTranslations("KeyDemo");
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [typed, setTyped] = useState(0);
  const [spin, setSpin] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setTyped(0);
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(CODE.length);
      setOpen(true);
      return;
    }
    CODE.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setSpin(i), 350 + i * 650));
      timers.current.push(window.setTimeout(() => { setTyped(i + 1); setSpin(null); }, 350 + i * 650 + 420));
    });
    timers.current.push(window.setTimeout(() => setOpen(true), 350 + CODE.length * 650 + 200));
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [play]);

  return (
    <div ref={rootRef} className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.title}>{t("title")}</p>
        <p className={styles.caption}>{t("caption")}</p>
      </div>

      <div className={styles.code} aria-live="polite">
        {CODE.map((n, i) => (
          <span key={i} className={styles.cell} data-on={i < typed}>
            {i < typed ? n : spin === i ? (n + 3) % 10 : ""}
          </span>
        ))}
      </div>

      <div className={styles.door} data-open={open}>
        <svg viewBox="0 0 120 150" aria-hidden="true" focusable="false">
          <path className={styles.frame} d="M20 140 V12 H100 V140" />
          <path className={styles.floor} d="M0 140 H120" />
          <path className={styles.closed} d="M26 134 V18 H94 V134 Z" />
          <path className={styles.knob} d="M84 80 h4" />
          <path className={styles.leaf} d="M26 134 L58 120 V32 L26 18" />
          <path className={styles.swing} d="M94 134 A68 68 0 0 0 58 120" />
        </svg>
        <span className={styles.state}>{open ? t("open") : t("locked")}</span>
      </div>

      <button type="button" className={styles.replay} onClick={play} aria-label={t("replay")}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5" />
        </svg>
      </button>
    </div>
  );
}
