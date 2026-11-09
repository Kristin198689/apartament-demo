"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./FloorPlan.module.css";

export type FloorPlanLabels = {
  living: string;
  bedroom: string;
  bath: string;
  balcony: string;
  entrance: string;
  type: string;
  area: string;
  caption: string; // текстовое описание для скринридеров
};

export type FloorPlanDemo = {
  typeValue: string; // напр. "2 Zimmer"
  area: string; // "42"
  width: string; // "9,20"
  depth: string; // "6,40"
  living: string;
  bedroom: string;
  bath: string;
};

type Props = {
  labels: FloorPlanLabels;
  demo?: FloorPlanDemo;
  areaValue?: string;
  className?: string;
};

/*
 * Чертёж: тонкие чёткие линии, без «карандашной» неровности.
 * Условный план — НЕ реальная планировка. Линии дорисовываются
 * (stroke-dashoffset) при появлении в окне. Цвета — из токенов.
 */
export function FloorPlan({ labels, demo, areaValue = "TODO", className = "" }: Props) {
  const area = demo?.area ?? areaValue;
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Порядок: стены → мебель → размеры → акценты → штамп
  const d = (i: number) => ({ "--i": i }) as CSSProperties;
  const L = (i: number, dAttr: string) => (
    <path pathLength={1} className={styles.draw} style={d(i)} d={dAttr} />
  );

  return (
    <svg
      ref={ref}
      className={`${styles.plan} ${className}`}
      viewBox="0 0 640 520"
      role="img"
      aria-label={labels.caption}
      data-visible={visible}
    >
      <g className={styles.wall}>
        {L(0, "M240 420 H40 V60 H560 V420 H300")}
        {L(1, "M330 60 V140")}
        {L(1, "M330 200 V310")}
        {L(1, "M330 360 V420")}
        {L(2, "M330 250 H560")}
      </g>

      <g className={styles.furn}>
        {L(3, "M60 80 H230 V120 H60 Z")}
        {L(3, "M90 90 h24 M140 90 h24")}
        {L(4, "M70 300 H200 V360 H70 Z M70 318 H200")}
        {L(4, "M230 330 H290 V390 H230 Z")}
        {L(5, "M380 90 H520 V210 H380 Z M380 120 H520")}
        {L(6, "M430 270 H540 V310 H430 Z")}
        {L(6, "M350 380 a14 14 0 1 0 0.1 0")}
      </g>

      <g className={styles.dim}>
        {L(7, "M40 36 H560 M40 28 V44 M560 28 V44")}
        {L(8, "M16 60 V420 M8 60 H24 M8 420 H24")}
      </g>

      <g className={styles.accent}>
        {L(9, "M240 420 V360 M240 360 A60 60 0 0 1 300 420")}
        {L(10, "M560 100 H610 V220 H560")}
      </g>

      <g className={styles.text}>
        <text x="300" y="22" textAnchor="middle" className={styles.fade} style={d(9)}>{demo ? `${demo.width} m` : "TODO m"}</text>
        <text transform="translate(26 240) rotate(-90)" textAnchor="middle" className={styles.fade} style={d(9)}>{demo ? `${demo.depth} m` : "TODO m"}</text>
        <text x="60" y="150" className={styles.fade} style={d(8)}>{labels.living}{demo ? ` · ${demo.living} m²` : ""}</text>
        <text x="380" y="78" className={styles.fade} style={d(8)}>{labels.bedroom}{demo ? ` · ${demo.bedroom} m²` : ""}</text>
        <text x="430" y="336" className={styles.fade} style={d(8)}>{labels.bath}{demo ? ` · ${demo.bath} m²` : ""}</text>
        <text x="562" y="240" className={styles.fade} style={d(10)}>{labels.balcony}</text>
        <text x="256" y="446" className={styles.fade} style={d(10)}>{labels.entrance}</text>
      </g>

      <g className={styles.stamp}>
        {L(11, "M400 460 H600 V508 H400 Z M400 484 H600 M500 460 V508")}
        <text x="410" y="477" className={styles.fade} style={d(11)}>{labels.type}</text>
        <text x="410" y="501" className={styles.fade} style={d(11)}>{labels.area}</text>
        <text x="510" y="477" className={styles.fade} style={d(11)}>{demo?.typeValue ?? "TODO"}</text>
        <text x="510" y="501" className={styles.fade} style={d(11)}>{area === "TODO" ? "TODO" : `${area} m²`}</text>
      </g>
    </svg>
  );
}
