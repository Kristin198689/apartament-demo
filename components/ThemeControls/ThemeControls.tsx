"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeControls.module.css";

type Props = { blueprintLabel: string; crosshairLabel: string };

const read = (k: string) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const write = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* ignore */ }
};

/*
 * Две кнопки в шапке: режим «синька» и перекрестье курсора.
 * Видны сразу (значок + подпись на широких экранах); выбор запоминается в браузере.
 */
export function ThemeControls({ blueprintLabel, crosshairLabel }: Props) {
  const [blueprint, setBlueprint] = useState(false);
  const [cross, setCross] = useState(true);

  useEffect(() => {
    setBlueprint(document.documentElement.dataset.theme === "blueprint");
    setCross(read("crosshair") !== "off");
  }, []);

  function toggleBlueprint() {
    const next = !blueprint;
    setBlueprint(next);
    if (next) document.documentElement.setAttribute("data-theme", "blueprint");
    else document.documentElement.removeAttribute("data-theme");
    write("theme", next ? "blueprint" : "light");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next ? "#1f4fd8" : "#f8f9fb");
  }

  function toggleCross() {
    const next = !cross;
    setCross(next);
    write("crosshair", next ? "on" : "off");
    window.dispatchEvent(new CustomEvent("crosshair-change", { detail: next }));
  }

  return (
    <div className={styles.group}>
      <button type="button" className={`${styles.btn} ${styles.blueprint}`} aria-pressed={blueprint} onClick={toggleBlueprint} title={blueprintLabel} aria-label={blueprintLabel}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M3 3 H21 V21 H3 Z M3 9 H21 M3 15 H21 M9 3 V21 M15 3 V21" />
        </svg>
        <span className={styles.text}>{blueprintLabel}</span>
      </button>
      <button type="button" className={`${styles.btn} ${styles.cross}`} aria-pressed={cross} onClick={toggleCross} title={crosshairLabel} aria-label={crosshairLabel}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M12 2 V9 M12 15 V22 M2 12 H9 M15 12 H22" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        <span className={styles.text}>{crosshairLabel}</span>
      </button>
    </div>
  );
}
