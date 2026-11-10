"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { PLAN_H, PLAN_W, furniturePaths, planLayouts } from "@/config/plans";
import styles from "./PlanCompare.module.css";

type N = 1 | 2 | 3 | 4;

function Mini({ rooms }: { rooms: N }) {
  return (
    <svg className={styles.svg} viewBox={`-6 -6 ${PLAN_W + 12} ${PLAN_H + 12}`} aria-hidden="true" focusable="false">
      {planLayouts[rooms].map((r) => (
        <g key={r.id}>
          <path className={styles.wall} d={`M${r.x} ${r.y} H${r.x + r.w} V${r.y + r.h} H${r.x} Z`} />
          {furniturePaths(r, "twin").map((d, k) => (
            <path key={k} className={styles.furn} d={d} />
          ))}
        </g>
      ))}
      <path className={styles.outer} d={`M0 0 H${PLAN_W} V${PLAN_H} H0 Z`} />
    </svg>
  );
}

/* Два плана рядом: выбираешь типы A и B, видишь разницу в площади и спальных местах. */
export function PlanCompare() {
  const t = useTranslations("Plan.compare");
  const [pick, setPick] = useState<{ A: N; B: N }>({ A: 1, B: 3 });
  const info = (n: N) => apartmentTypes.find((x) => x.rooms === n)!;
  const diff = Number(info(pick.B).area) - Number(info(pick.A).area);

  const col = (side: "A" | "B") => {
    const ty = info(pick[side]);
    return (
      <div className={styles.col}>
        <p className={styles.label}>{t(side === "A" ? "a" : "b")}</p>
        <div className={styles.switch} role="group" aria-label={t(side === "A" ? "a" : "b")}>
          {([1, 2, 3, 4] as const).map((n) => (
            <button key={n} type="button" aria-pressed={pick[side] === n} onClick={() => setPick({ ...pick, [side]: n })}>{n}</button>
          ))}
        </div>
        <Mini rooms={pick[side]} />
        <dl className={styles.spec}>
          <div><dt>{t("area")}</dt><dd>{ty.area} m²</dd></div>
          <div><dt>{t("rooms")}</dt><dd>{ty.rooms}</dd></div>
          <div><dt>{t("guests")}</dt><dd>{ty.guests}</dd></div>
          <div><dt>{t("beds")}</dt><dd>{ty.beds}</dd></div>
        </dl>
      </div>
    );
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{t("title")}</h3>
      <div className={styles.grid}>
        {col("A")}
        {col("B")}
      </div>
      <p className={styles.diff} aria-live="polite">
        {diff === 0 ? t("diffSame") : diff > 0 ? t("diffMore", { d: diff }) : t("diffLess", { d: -diff })}
      </p>
    </div>
  );
}
