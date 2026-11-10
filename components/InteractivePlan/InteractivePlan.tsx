"use client";

import { type CSSProperties, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { PLAN_H, PLAN_W, furniturePaths, planLayouts, type Room } from "@/config/plans";
import styles from "./InteractivePlan.module.css";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

/*
 * Интерактивный план: переключатель «1–4 комнаты» перечерчивает план, наведение или
 * касание на комнату подсвечивает её и показывает площадь и что внутри. Демо-данные.
 */
export function InteractivePlan() {
  const t = useTranslations("Plan");
  const a = useTranslations("Apartments");
  const [rooms, setRooms] = useState<1 | 2 | 3 | 4>(2);
  const type = apartmentTypes.find((x) => x.rooms === rooms)!;
  const layout = planLayouts[rooms];
  const [activeId, setActiveId] = useState<string>(layout[0].id);
  const active: Room = layout.find((r) => r.id === activeId) ?? layout[0];

  const total = Number(type.area);
  const areaOf = (r: Room) => Math.round(((r.w * r.h) / (PLAN_W * PLAN_H)) * total);
  const depth = Math.sqrt((total * PLAN_H) / PLAN_W);
  const width = total / depth;

  const choose = (n: 1 | 2 | 3 | 4) => {
    setRooms(n);
    setActiveId(planLayouts[n][0].id);
  };

  const draw = (i: number) => ({ "--i": i }) as CSSProperties;
  const paths = useMemo(
    () => layout.map((r) => ({ r, furn: furniturePaths(r) })),
    [layout],
  );
  const total_i = layout.length;

  return (
    <div className={styles.wrap}>
      <div className={styles.switch} role="group" aria-label={t("typeLabel")}>
        {([1, 2, 3, 4] as const).map((n) => (
          <button key={n} type="button" className={styles.opt} aria-pressed={rooms === n} onClick={() => choose(n)}>
            <span className={styles.big}>{n}</span>
            <span className={styles.small}>{a("rooms", { count: n })}</span>
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <svg className={styles.svg} viewBox={`0 0 ${PLAN_W + 120} ${PLAN_H + 130}`} role="img" aria-label={t("caption")} focusable="false">
          <g key={rooms} transform="translate(60 70)">
            {/* подсветка активной комнаты */}
            <rect x={active.x} y={active.y} width={active.w} height={active.h} className={styles.hl} />

            {/* стены (контур каждой комнаты) и мебель */}
            {paths.map(({ r, furn }, i) => (
              <g key={r.id}>
                <path pathLength={1} className={styles.wall} style={draw(i)} d={`M${r.x} ${r.y} H${r.x + r.w} V${r.y + r.h} H${r.x} Z`} />
                {furn.map((d, k) => (
                  <path key={k} pathLength={1} className={styles.furn} style={draw(total_i + i + k * 0.3)} d={d} />
                ))}
              </g>
            ))}

            {/* внешний контур потолще */}
            <path pathLength={1} className={styles.outer} style={draw(0)} d={`M0 0 H${PLAN_W} V${PLAN_H} H0 Z`} />

            {/* размеры */}
            <path pathLength={1} className={styles.dim} style={draw(total_i + 2)} d={`M0 -30 H${PLAN_W} M0 -38 V-22 M${PLAN_W} -38 V-22`} />
            <path pathLength={1} className={styles.dim} style={draw(total_i + 3)} d={`M-30 0 V${PLAN_H} M-38 0 H-22 M-38 ${PLAN_H} H-22`} />
            <text x={PLAN_W / 2} y="-40" textAnchor="middle" className={styles.dimText}>{fmt(width)} m</text>
            <text transform={`translate(-42 ${PLAN_H / 2}) rotate(-90)`} textAnchor="middle" className={styles.dimText}>{fmt(depth)} m</text>

            {/* подписи площади */}
            {layout.map((r) => (
              <text key={r.id} x={r.x + r.w / 2} y={r.y + r.h - 12} textAnchor="middle" className={styles.area} data-on={r.id === activeId}>
                {areaOf(r)} m²
              </text>
            ))}

            {/* области наведения/касания */}
            {layout.map((r) => (
              <rect
                key={`hit-${r.id}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                className={styles.hit}
                tabIndex={0}
                role="button"
                aria-label={`${t(`rooms.${r.kind}.name`)}, ${areaOf(r)} m²`}
                aria-pressed={r.id === activeId}
                onMouseEnter={() => setActiveId(r.id)}
                onFocus={() => setActiveId(r.id)}
                onClick={() => setActiveId(r.id)}
              />
            ))}
          </g>
        </svg>

        <aside className={styles.panel} aria-live="polite">
          <p className={styles.spec}>
            {a("rooms", { count: rooms })} · {type.area} m² · {type.guests} {a("cols.guests")} · {type.beds} {a("cols.beds")}
          </p>
          <h3 className={styles.room}>{t(`rooms.${active.kind}.name`)}</h3>
          <p className={styles.roomArea}>{areaOf(active)} <span>m²</span></p>
          <p className={styles.desc}>{t(`rooms.${active.kind}.desc`)}</p>
          <p className={styles.hint}>{t("hint")}</p>
        </aside>
      </div>
    </div>
  );
}
