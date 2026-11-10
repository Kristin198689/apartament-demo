"use client";

import styles from "./PrintButton.module.css";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className={styles.btn} onClick={() => window.print()}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <path d="M7 9 V3 H17 V9 M7 17 H4 V9 H20 V17 H17 M7 14 H17 V21 H7 Z" />
      </svg>
      {label}
    </button>
  );
}
