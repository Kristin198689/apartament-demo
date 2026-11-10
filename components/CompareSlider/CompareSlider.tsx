"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { PLAN_H, PLAN_W, furniturePaths, planLayouts } from "@/config/plans";
import styles from "./CompareSlider.module.css";

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;

/*
 * Сравнение «номер в отеле» и «апартаменты»: два чертежа одного размера кадра,
 * разделитель можно тянуть (мышь, палец, клавиши ←/→). Контраст виден сразу.
 */
export function CompareSlider() {
  const t = useTranslations("Compare");
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  // Подсказка: один раз покачиваем разделитель, когда блок показался на экране
  useEffect(() => {
    const el = boxRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 2600;
        const tick = (now: number) => {
          if (touched.current) return;
          const p = Math.min((now - start) / dur, 1);
          setPos(50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p * 0.3));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setPos(50);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const type = apartmentTypes[1];
  const plan = planLayouts[2];
  const s = 0.78;

  const onDown = (e: React.PointerEvent) => {
    touched.current = true;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={boxRef}
        className={styles.box}
        onPointerDown={onDown}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* Нижний слой: апартаменты */}
        <svg className={`${styles.scene} ${styles.apt}`} viewBox="0 0 640 360" aria-hidden="true" focusable="false">
          <g transform={`translate(${(640 - PLAN_W * s) / 2} ${(360 - PLAN_H * s) / 2}) scale(${s})`}>
            {plan.map((r) => (
              <g key={r.id}>
                <path className={styles.wall} d={rect(r.x, r.y, r.w, r.h)} />
                {furniturePaths(r).map((d, i) => <path key={i} className={styles.furn} d={d} />)}
              </g>
            ))}
            <path className={styles.outer} d={rect(0, 0, PLAN_W, PLAN_H)} />
          </g>
          <text x="618" y="30" textAnchor="end" className={styles.tag}>{t("apartment")} · {type.area} m²</text>
        </svg>

        {/* Верхний слой: номер в отеле, виден левее разделителя */}
        <div className={styles.top} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <svg className={`${styles.scene} ${styles.hotel}`} viewBox="0 0 640 360" aria-hidden="true" focusable="false">
            <g transform="translate(170 70)">
              <path className={styles.outer} d={rect(0, 0, 180, 220)} />
              <path className={styles.furn} d={rect(14, 14, 90, 140) + " M14 44 H104"} />
              <path className={styles.furn} d={rect(120, 14, 46, 46)} />
              <path className={styles.furn} d={rect(120, 160, 46, 46) + " M120 160 L166 206"} />
              <path className={styles.furn} d={rect(14, 168, 56, 38)} />
              <path className={styles.wall} d="M180 90 H150" />
            </g>
            <text x="22" y="30" className={styles.tag}>{t("hotel")} · 12 m²</text>
          </svg>
        </div>

        {/* Разделитель */}
        <div className={styles.divider} style={{ left: `${pos}%` }} aria-hidden="true">
          <span className={styles.handle}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18" />
            </svg>
          </span>
        </div>

        <input
          className={styles.range}
          type="range"
          min={4}
          max={96}
          value={Math.round(pos)}
          aria-label={t("hint")}
          onChange={(e) => { touched.current = true; setPos(Number(e.target.value)); }}
        />
      </div>

      <p className={styles.hint}>{t("hint")}</p>

      <div className={styles.lists}>
        <ul className={styles.list}>
          <li className={styles.listTitle}>{t("hotel")}</li>
          {[0, 1, 2].map((i) => <li key={i}>{t(`hotelPoints.${i}`)}</li>)}
        </ul>
        <ul className={`${styles.list} ${styles.listApt}`}>
          <li className={styles.listTitle}>{t("apartment")}</li>
          {[0, 1, 2].map((i) => <li key={i}>{t(`aptPoints.${i}`)}</li>)}
        </ul>
      </div>
    </div>
  );
}
