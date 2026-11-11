"use client";

import { type CSSProperties, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { PLAN_H, PLAN_W, furniturePaths, planLayouts, type BedMode, type Room } from "@/config/plans";
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
  const [bed, setBed] = useState<BedMode>("twin");
  const [layers, setLayers] = useState({ furn: true, dim: true, area: true });
  const svgRef = useRef<SVGSVGElement>(null);
  const type = apartmentTypes.find((x) => x.rooms === rooms)!;
  const layout = planLayouts[rooms];
  const [activeId, setActiveId] = useState<string>(layout[0].id);
  const active: Room = layout.find((r) => r.id === activeId) ?? layout[0];

  const total = Number(type.area);
  const areaOf = (r: Room) => Math.round(((r.w * r.h) / (PLAN_W * PLAN_H)) * total);
  const depth = Math.sqrt((total * PLAN_H) / PLAN_W);
  const width = total / depth;

  // Курсор-линейка: показывает координаты в метрах, как в CAD (только мышь)
  const [cur, setCur] = useState<{ x: number; y: number } | null>(null);
  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.pointerType !== "mouse") return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const x = p.x - 60;
    const y = p.y - 70;
    setCur(x >= 0 && x <= PLAN_W && y >= 0 && y <= PLAN_H ? { x, y } : null);
  }

  const choose = (n: 1 | 2 | 3 | 4) => {
    setRooms(n);
    setActiveId(planLayouts[n][0].id);
  };

  const draw = (i: number) => ({ "--i": i }) as CSSProperties;
  const paths = useMemo(
    () => layout.map((r) => ({ r, furn: furniturePaths(r, bed) })),
    [layout, bed],
  );
  const total_i = layout.length;
  const bedrooms = layout.filter((r) => r.kind === "bedroom" || r.kind === "sleepLiving").length;
  const bedsShown = bed === "double" ? Number(type.beds) - bedrooms : Number(type.beds);

  // Скачать план как самостоятельный SVG: стили переносим в атрибуты, анимацию отключаем
  function download() {
    const src = svgRef.current;
    if (!src) return;
    const clone = src.cloneNode(true) as SVGSVGElement;
    const a = Array.from(src.querySelectorAll("path, rect, text"));
    const b = Array.from(clone.querySelectorAll("path, rect, text"));
    a.forEach((el, i) => {
      const cs = getComputedStyle(el);
      const tgt = b[i] as SVGElement;
      const hit = (tgt as unknown as HTMLElement).getAttribute("role") === "button";
      if (hit) { tgt.remove(); return; }
      tgt.setAttribute("style", [
        `fill:${el.tagName === "text" ? "#5c6370" : cs.fill === "none" ? "none" : cs.fill}`,
        `fill-opacity:${cs.fillOpacity}`,
        `stroke:${cs.stroke === "none" ? "none" : "#101318"}`,
        `stroke-width:${cs.strokeWidth}`,
        `stroke-opacity:${cs.strokeOpacity}`,
        "stroke-dasharray:none",
        "stroke-dashoffset:0",
        `font-family:Helvetica,Arial,sans-serif`,
        `font-size:${cs.fontSize}`,
      ].join(";"));
      tgt.removeAttribute("class");
    });
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.insertAdjacentHTML("afterbegin", '<rect width="100%" height="100%" fill="#ffffff"/>');
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${clone.outerHTML}`], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `plan-${rooms}-rooms.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
      <div className={styles.switch} role="group" aria-label={t("typeLabel")}>
        {([1, 2, 3, 4] as const).map((n) => (
          <button key={n} type="button" className={styles.opt} aria-pressed={rooms === n} onClick={() => choose(n)}>
            <span className={styles.big}>{n}</span>
            <span className={styles.small}>{a("rooms", { count: n })}</span>
          </button>
        ))}
      </div>
      <div className={styles.bed} role="group" aria-label={t("bedLabel")}>
        <button type="button" aria-pressed={bed === "twin"} onClick={() => setBed("twin")}>{t("bedTwin")}</button>
        <button type="button" aria-pressed={bed === "double"} onClick={() => setBed("double")}>{t("bedDouble")}</button>
      </div>
      <div className={styles.bed} role="group" aria-label={t("layers")}>
        {(["furn", "dim", "area"] as const).map((k) => (
          <button key={k} type="button" aria-pressed={layers[k]} onClick={() => setLayers({ ...layers, [k]: !layers[k] })}>{t(k)}</button>
        ))}
      </div>
      </div>

      <div className={styles.stage}>
        <svg ref={svgRef} className={styles.svg} data-nofurn={!layers.furn} data-nodim={!layers.dim} data-noarea={!layers.area} viewBox={`0 0 ${PLAN_W + 120} ${PLAN_H + 130}`} role="img" aria-label={t("caption")} focusable="false" onPointerMove={onMove} onPointerLeave={() => setCur(null)}>
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

            {cur ? (
              <g className={styles.cad} pointerEvents="none">
                <path d={`M${cur.x} -26 V${PLAN_H + 8} M-26 ${cur.y} H${PLAN_W + 8}`} />
                <text x={Math.min(cur.x + 8, PLAN_W - 70)} y={Math.max(cur.y - 8, 12)}>
                  {fmt((cur.x / PLAN_W) * width)} × {fmt((cur.y / PLAN_H) * depth)} m
                </text>
              </g>
            ) : null}

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
            {a("rooms", { count: rooms })} · {type.area} m² · {type.guests} {a("cols.guests")} · {bedsShown} {a("cols.beds")}
          </p>
          <h3 className={styles.room}>{t(`rooms.${active.kind}.name`)}</h3>
          <p className={styles.roomArea}>{areaOf(active)} <span>m²</span></p>
          <p className={styles.desc}>{t(`rooms.${active.kind}.desc`)}</p>
          <p className={styles.hint}>{t("hint")}</p>
          <button type="button" className={styles.dl} onClick={download}>{t("download")}</button>
        </aside>
      </div>
    </div>
  );
}
