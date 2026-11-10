"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import styles from "./ScrollRuler.module.css";

type Mark = { n: string; el: HTMLElement };

/*
 * Тонкая вертикальная «линейка» у правого края: отметки по номерам секций (01…11),
 * активная подсвечена, по клику — плавный переход к секции. Только на широких экранах.
 */
export function ScrollRuler({ label }: { label: string }) {
  const pathname = usePathname();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const found: Mark[] = [];
    document.querySelectorAll<HTMLElement>("[data-section-n]").forEach((node) => {
      const section = node.closest("section");
      if (section) found.push({ n: node.dataset.sectionN ?? "", el: section as HTMLElement });
    });
    setMarks(found);
    setActive(null);
  }, [pathname]);

  useEffect(() => {
    if (!marks.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const m of marks) {
        const r = m.el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = m.n;
      }
      setActive(current);
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
  }, [marks]);

  if (!marks.length) return null;

  const go = (el: HTMLElement) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={styles.ruler} aria-label={label}>
      <ul className={styles.list}>
        {marks.map((m) => (
          <li key={m.n}>
            <button
              type="button"
              className={styles.mark}
              data-active={active === m.n}
              aria-label={`${label} ${m.n}`}
              aria-current={active === m.n ? "true" : undefined}
              onClick={() => go(m.el)}
            >
              <span className={styles.num}>{m.n}</span>
              <span className={styles.tick} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
