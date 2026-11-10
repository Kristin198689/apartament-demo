"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Arrow } from "@/components/Arrow/Arrow";
import styles from "./Lightbox.module.css";

export type LightboxItem = { src: string; alt: string; position?: string };

type Props = { items: LightboxItem[]; index: number; onIndex: (i: number) => void; onClose: () => void };

/*
 * Просмотр фото на весь экран в рамке-чертеже: Esc, клик по фону, стрелки ←/→, свайп.
 * Фокус возвращается на исходное фото при закрытии.
 */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const t = useTranslations("Lightbox");
  const closeRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const item = items[index];
  const many = items.length > 1;

  const go = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, many, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerUp={(e) => {
        if (startX.current !== null && many && Math.abs(e.clientX - startX.current) > 60) go(e.clientX < startX.current ? 1 : -1);
        startX.current = null;
      }}
    >
      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <div className={styles.frame} key={item.src}>
          <Image src={item.src} alt={item.alt} fill sizes="100vw" quality={85} className={styles.img} style={{ objectPosition: item.position ?? "50% 50%" }} priority />
        </div>
        <p className={styles.caption}>
          <span>{item.alt}</span>
          {many ? <span className={styles.count}>{index + 1} / {items.length}</span> : null}
        </p>
      </div>

      <button ref={closeRef} type="button" className={`${styles.btn} ${styles.close}`} onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label={t("close")}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19" /></svg>
      </button>
      {many ? (
        <>
          <button type="button" className={`${styles.btn} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t("prev")}><Arrow dir="left" /></button>
          <button type="button" className={`${styles.btn} ${styles.next}`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t("next")}><Arrow /></button>
        </>
      ) : null}
    </div>,
    document.body,
  );
}
