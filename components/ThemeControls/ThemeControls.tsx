"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeControls.module.css";

type Props = { blueprintLabel: string; crosshairLabel: string; soundLabel: string };

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
export function ThemeControls({ blueprintLabel, crosshairLabel, soundLabel }: Props) {
  const [blueprint, setBlueprint] = useState(false);
  const [cross, setCross] = useState(true);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    setBlueprint(document.documentElement.dataset.theme === "blueprint");
    setCross(read("crosshair") !== "off");
    setSound(read("sound") === "on");
  }, []);

  // тихий «скрип карандаша» на нажатие кнопок и ссылок; по умолчанию выключен
  useEffect(() => {
    if (!sound) return;
    let ctx: AudioContext | null = null;
    const scratch = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("a, button")) return;
      try {
        ctx ??= new AudioContext();
        const len = Math.floor(ctx.sampleRate * 0.09);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 3200 + Math.random() * 1800;
        f.Q.value = 1.4;
        const g = ctx.createGain();
        g.gain.value = 0.07;
        src.connect(f).connect(g).connect(ctx.destination);
        src.start();
      } catch { /* звук необязателен */ }
    };
    document.addEventListener("pointerdown", scratch);
    return () => { document.removeEventListener("pointerdown", scratch); void ctx?.close(); };
  }, [sound]);

  function toggleSound() {
    const next = !sound;
    setSound(next);
    write("sound", next ? "on" : "off");
    window.dispatchEvent(new CustomEvent("pencil-change", { detail: next }));
  }

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
      <button type="button" className={`${styles.btn} ${styles.snd}`} aria-pressed={sound} onClick={toggleSound} title={soundLabel} aria-label={soundLabel}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10" />
        </svg>
        <span className={styles.text}>{soundLabel}</span>
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
