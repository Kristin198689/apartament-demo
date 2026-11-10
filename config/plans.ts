/*
 * Планировки типов квартир для интерактивного плана (ДЕМО-схемы, не реальные чертежи).
 * Координаты комнат — в системе 520×360 внутри общего контура; площадь комнаты считается
 * пропорционально общей площади типа (см. config/property.ts).
 */
export type RoomKind = "living" | "sleepLiving" | "kitchen" | "bedroom" | "bath" | "hall";

export type Room = { id: string; kind: RoomKind; x: number; y: number; w: number; h: number };

export const PLAN_W = 520;
export const PLAN_H = 360;

export const planLayouts: Record<1 | 2 | 3 | 4, Room[]> = {
  1: [
    { id: "r1-living", kind: "sleepLiving", x: 0, y: 0, w: 300, h: 360 },
    { id: "r1-kitchen", kind: "kitchen", x: 300, y: 0, w: 220, h: 170 },
    { id: "r1-bath", kind: "bath", x: 300, y: 170, w: 220, h: 190 },
  ],
  2: [
    { id: "r2-living", kind: "living", x: 0, y: 0, w: 280, h: 230 },
    { id: "r2-kitchen", kind: "kitchen", x: 0, y: 230, w: 280, h: 130 },
    { id: "r2-bed", kind: "bedroom", x: 280, y: 0, w: 240, h: 200 },
    { id: "r2-bath", kind: "bath", x: 280, y: 200, w: 240, h: 160 },
  ],
  3: [
    { id: "r3-living", kind: "living", x: 0, y: 0, w: 230, h: 180 },
    { id: "r3-kitchen", kind: "kitchen", x: 0, y: 180, w: 230, h: 180 },
    { id: "r3-bed1", kind: "bedroom", x: 230, y: 0, w: 145, h: 170 },
    { id: "r3-bed2", kind: "bedroom", x: 375, y: 0, w: 145, h: 170 },
    { id: "r3-bath", kind: "bath", x: 230, y: 170, w: 130, h: 190 },
    { id: "r3-hall", kind: "hall", x: 360, y: 170, w: 160, h: 190 },
  ],
  4: [
    { id: "r4-living", kind: "living", x: 0, y: 0, w: 200, h: 170 },
    { id: "r4-kitchen", kind: "kitchen", x: 0, y: 170, w: 200, h: 190 },
    { id: "r4-bed1", kind: "bedroom", x: 200, y: 0, w: 160, h: 170 },
    { id: "r4-bed2", kind: "bedroom", x: 360, y: 0, w: 160, h: 170 },
    { id: "r4-bed3", kind: "bedroom", x: 200, y: 170, w: 160, h: 190 },
    { id: "r4-bath", kind: "bath", x: 360, y: 170, w: 160, h: 190 },
  ],
};

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Контуры мебели внутри комнаты (простые линии, в координатах плана). */
export type BedMode = "twin" | "double";

export function furniturePaths(r: Room, bed: BedMode = "twin"): string[] {
  const p = 14;
  const { x, y, w, h } = r;
  switch (r.kind) {
    case "sleepLiving":
      return [
        ...(bed === "double"
          ? [rect(x + p, y + p, 120, 108), `M${x + p} ${y + p + 24} H${x + p + 120}`]
          : [rect(x + p, y + p, 110, 50), `M${x + p} ${y + p + 18} H${x + p + 110}`, rect(x + p, y + p + 62, 110, 50), `M${x + p} ${y + p + 80} H${x + p + 110}`]),
        rect(x + w - 110, y + h - 90, 90, 70),
        rect(x + w - 40, y + p, 26, 110),
      ];
    case "living":
      return [rect(x + p, y + p, Math.min(w * 0.55, 130), 44), rect(x + w * 0.3, y + h * 0.5, Math.min(w * 0.4, 90), 54), rect(x + w - 52, y + p, 38, 70)];
    case "kitchen":
      return [rect(x + p, y + p, w - 2 * p, 24), rect(x + p, y + p, 24, h * 0.62), circle(x + p + 60, y + p + 12, 5), circle(x + p + 84, y + p + 12, 5), rect(x + w * 0.4, y + h * 0.52, Math.min(w * 0.42, 96), 54)];
    case "bedroom": {
      const bw = (w - 3 * p) / 2;
      if (bed === "double") {
        return [rect(x + p, y + p, w - 2 * p - 30, Math.min(h - 2 * p, 100)), `M${x + p} ${y + p + 26} H${x + w - p - 30}`, rect(x + w - 34, y + p, 20, 30), rect(x + w - 34, y + h - 70, 22, 56)];
      }
      return [rect(x + p, y + p, bw, Math.min(h - 2 * p, 96)), `M${x + p} ${y + p + 26} H${x + p + bw}`, rect(x + 2 * p + bw, y + p, bw, Math.min(h - 2 * p, 96)), `M${x + 2 * p + bw} ${y + p + 26} H${x + 2 * p + bw + bw}`, rect(x + w - 34, y + h - 70, 22, 56)];
    }
    case "bath":
      return [rect(x + p, y + p, Math.min(w * 0.45, 70), Math.min(h * 0.5, 70)), circle(x + w - 36, y + p + 24, 13), rect(x + w - 56, y + h - 46, 40, 24)];
    case "hall":
      return [rect(x + p, y + p, 40, h - 2 * p), `M${x + w - 60} ${y + h - 20} A40 40 0 0 1 ${x + w - 20} ${y + h - 60}`];
  }
}
