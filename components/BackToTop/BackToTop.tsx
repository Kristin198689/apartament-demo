"use client";

import { Arrow } from "@/components/Arrow/Arrow";
import styles from "./BackToTop.module.css";

export function BackToTop({ label }: { label: string }) {
  function up() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
  return (
    <button type="button" className={styles.btn} onClick={up}>
      <span>{label}</span>
      <span className={styles.circle}><Arrow dir="up" size={18} /></span>
    </button>
  );
}
