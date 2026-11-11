"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

export function CopyButton({ text, label, doneLabel }: { text: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch { /* буфер недоступен */ }
  }
  return (
    <button type="button" className={styles.btn} onClick={copy} aria-live="polite">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        {done ? <path d="M4 12 L10 18 L20 6" /> : <path d="M8 8 H20 V21 H8 Z M4 16 V3 H16" />}
      </svg>
      {done ? doneLabel : label}
    </button>
  );
}
