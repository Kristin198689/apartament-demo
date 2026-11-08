/*
 * Генератор архитектурного чертежа под любой размер холста (W×H).
 * Всё считается в долях от W и H, поэтому чертёж заполняет весь hero
 * и на десктопе, и на телефоне (две раскладки: 1440×900 и 480×1000).
 */
export type Layers = {
  walls: string[];
  inner: string[];
  furn: string[];
  grid: string[];
  extra: string[];
};

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function buildDrawing(W: number, H: number): Layers {
  const u = Math.min(W, H) / 100; // условная единица
  const t = Math.max(u * 0.9, 7); // толщина стены

  const x0 = W * 0.07, x1 = W * 0.93;
  const y0 = H * 0.12, y1 = H * 0.92;
  const c1 = x0 + (x1 - x0) * 0.38;
  const c2 = x0 + (x1 - x0) * 0.7;
  const rA = y0 + (y1 - y0) * 0.42;
  const rB = y0 + (y1 - y0) * 0.72;

  const walls: string[] = [rect(x0, y0, x1 - x0, y1 - y0), rect(x0 + t, y0 + t, x1 - x0 - 2 * t, y1 - y0 - 2 * t)];

  const inner: string[] = [];
  // вертикальные стены с дверными проёмами
  const vWall = (x: number, ya: number, yb: number, g0: number, g1: number) => {
    inner.push(`M${x} ${ya} V${g0}`, `M${x} ${g1} V${yb}`);
    const L = g1 - g0;
    inner.push(`M${x} ${g0} H${r1(x + L)}`, `M${r1(x + L)} ${g0} A${r1(L)} ${r1(L)} 0 0 1 ${x} ${g1}`);
  };
  const hWall = (y: number, xa: number, xb: number, g0: number, g1: number) => {
    inner.push(`M${xa} ${y} H${g0}`, `M${g1} ${y} H${xb}`);
    const L = g1 - g0;
    inner.push(`M${g0} ${y} V${r1(y + L)}`, `M${g0} ${r1(y + L)} A${r1(L)} ${r1(L)} 0 0 0 ${g1} ${y}`);
  };
  const dw = u * 7; // ширина двери
  vWall(c1, y0 + t, rA, y0 + (rA - y0) * 0.55, y0 + (rA - y0) * 0.55 + dw);
  vWall(c2, y0 + t, rA, y0 + (rA - y0) * 0.3, y0 + (rA - y0) * 0.3 + dw);
  hWall(rA, x0 + t, x1 - t, x0 + (c1 - x0) * 0.5, x0 + (c1 - x0) * 0.5 + dw);
  vWall(c1, rA, y1 - t, rA + (rB - rA) * 0.35, rA + (rB - rA) * 0.35 + dw);
  hWall(rB, c1, c2, c1 + (c2 - c1) * 0.4, c1 + (c2 - c1) * 0.4 + dw);
  vWall(c2, rA, y1 - t, rB + (y1 - rB) * 0.3, rB + (y1 - rB) * 0.3 + dw);

  // окна: серия засечек по внешним стенам
  const nTop = Math.max(Math.round((x1 - x0) / (u * 14)), 4);
  for (let i = 1; i < nTop; i++) {
    const x = x0 + ((x1 - x0) * i) / nTop;
    inner.push(`M${r1(x)} ${y0} V${y0 + t} M${r1(x + u * 4)} ${y0} V${y0 + t}`);
  }
  const nSide = Math.max(Math.round((y1 - y0) / (u * 16)), 4);
  for (let i = 1; i < nSide; i++) {
    const y = y0 + ((y1 - y0) * i) / nSide;
    inner.push(`M${x0} ${r1(y)} H${x0 + t} M${x0} ${r1(y + u * 4)} H${x0 + t}`);
    inner.push(`M${x1} ${r1(y)} H${x1 - t} M${x1} ${r1(y + u * 4)} H${x1 - t}`);
  }

  // мебель
  const furn: string[] = [];
  // гостиная A
  furn.push(rect(x0 + t + u * 4, y0 + t + u * 4, u * 24, u * 9)); // диван
  furn.push(`M${x0 + t + u * 4} ${y0 + t + u * 8} H${x0 + t + u * 28}`);
  furn.push(rect(x0 + t + u * 8, y0 + t + u * 18, u * 14, u * 7)); // столик
  furn.push(rect(x0 + t + u * 6, rA - u * 9, u * 10, u * 4)); // ТВ-тумба
  // спальня B
  furn.push(rect(c1 + u * 6, y0 + t + u * 5, u * 18, u * 24)); // кровать
  furn.push(`M${c1 + u * 6} ${y0 + t + u * 12} H${c1 + u * 24}`, rect(c1 + u * 25, y0 + t + u * 6, u * 4, u * 4));
  // спальня C
  furn.push(rect(c2 + u * 6, y0 + t + u * 5, u * 16, u * 22), `M${c2 + u * 6} ${y0 + t + u * 11} H${c2 + u * 22}`);
  // кухня D
  furn.push(`M${x0 + t + u * 2} ${rA + u * 6} H${x0 + t + u * 2 + u * 22} V${rA + u * 6 + u * 5} H${x0 + t + u * 7} V${rA + u * 6 + u * 24} H${x0 + t + u * 2} Z`);
  furn.push(circle(x0 + t + u * 9, rA + u * 8.5, u * 1.1), circle(x0 + t + u * 13, rA + u * 8.5, u * 1.1));
  furn.push(rect(x0 + t + u * 16, rA + u * 18, u * 12, u * 9)); // стол
  [[16, 14], [22, 14], [16, 29], [22, 29]].forEach(([dx, dy]) => furn.push(circle(x0 + t + u * (dx + 2), rA + u * dy, u * 1.6)));
  // ванная E
  furn.push(rect(c1 + u * 3, rA + u * 3, u * 22, u * 9), circle(c1 + u * 6, rB - u * 7, u * 2.4), rect(c1 + u * 3, rB - u * 12, u * 4, u * 4));
  // гостиная G
  furn.push(rect(c2 + u * 6, rA + u * 5, u * 22, u * 9), rect(c2 + u * 10, rA + u * 20, u * 12, u * 8));
  // холл F: линии лестницы / шкаф
  for (let i = 0; i < 8; i++) furn.push(`M${c1 + u * 3} ${rB + u * (3 + i * 2.4)} H${c1 + u * 18}`);

  // сетка осей и размеры (рисуются по скроллу)
  const grid: string[] = [];
  [x0, c1, c2, x1].forEach((x) => {
    grid.push(`M${r1(x)} 0 V${r1(H)}`);
    grid.push(circle(r1(x), y0 - u * 9, u * 2.6) + ` M${r1(x)} ${y0 - u * 6.4} V${y0 - u * 3}`);
  });
  [y0, rA, rB, y1].forEach((y) => {
    grid.push(`M0 ${r1(y)} H${r1(W)}`);
    grid.push(circle(x0 - u * 9, r1(y), u * 2.6) + ` M${x0 - u * 6.4} ${r1(y)} H${x0 - u * 3}`);
  });
  // размерные цепочки
  const dimTop = y0 - u * 4;
  grid.push(`M${x0} ${dimTop} H${x1}`);
  [x0, c1, c2, x1].forEach((x) => grid.push(`M${r1(x)} ${dimTop - u * 1.2} V${dimTop + u * 1.2}`));
  const dimLeft = x0 - u * 4;
  grid.push(`M${dimLeft} ${y0} V${y1}`);
  [y0, rA, rB, y1].forEach((y) => grid.push(`M${dimLeft - u * 1.2} ${r1(y)} H${dimLeft + u * 1.2}`));
  const dimBot = y1 + u * 4;
  grid.push(`M${x0} ${dimBot} H${x1}`, `M${x0} ${dimBot - u * 1.2} V${dimBot + u * 1.2}`, `M${x1} ${dimBot - u * 1.2} V${dimBot + u * 1.2}`);

  // дополнительные элементы (по скроллу, позже)
  const extra: string[] = [];
  // линия разреза со стрелками и кругами
  extra.push(`M${x0 - u * 10} ${r1((rA + rB) / 2)} H${x1 + u * 10}`);
  extra.push(circle(x0 - u * 12, r1((rA + rB) / 2), u * 2.2), circle(x1 + u * 12, r1((rA + rB) / 2), u * 2.2));
  // штриховка
  const hx = c2 + u * 4, hy = rB + u * 3, hw = x1 - t - c2 - u * 8, hh = y1 - t - rB - u * 6;
  extra.push(rect(hx, hy, hw, hh));
  for (let i = 1; i < 14; i++) {
    const d = (hw + hh) * (i / 14);
    const ax = Math.min(d, hw), ay = d - ax;
    const bx = Math.max(d - hh, 0), by = Math.min(d, hh);
    extra.push(`M${r1(hx + ax)} ${r1(hy + ay)} L${r1(hx + bx)} ${r1(hy + by)}`);
  }
  // масштабная линейка
  const sy = y1 + u * 9;
  extra.push(`M${x1 - u * 36} ${sy} H${x1}`);
  for (let i = 0; i <= 6; i++) extra.push(`M${r1(x1 - u * 36 + (u * 36 * i) / 6)} ${sy - u * (i % 2 ? 0.8 : 1.5)} V${sy + u * (i % 2 ? 0.8 : 1.5)}`);
  // стрелка севера
  const nx = x1 - u * 8, ny = y0 - u * 12;
  extra.push(circle(nx, ny, u * 3.4), `M${nx} ${ny - u * 3.4} V${ny + u * 3.4} M${nx} ${ny - u * 3.4} L${nx - u * 1.3} ${ny - u * 0.8} M${nx} ${ny - u * 3.4} L${nx + u * 1.3} ${ny - u * 0.8}`);
  // метки уровней
  [[x1 + u * 4, y0 + u * 6], [x0 - u * 14, y1 - u * 6]].forEach(([lx, ly]) =>
    extra.push(`M${r1(lx)} ${r1(ly)} l${u * 2} ${-u * 3} l${u * 2} ${u * 3} Z M${r1(lx - u)} ${r1(ly)} h${u * 6}`));
  // углы-метки
  [[8, 8, 1, 1], [W - 8, 8, -1, 1], [8, H - 8, 1, -1], [W - 8, H - 8, -1, -1]].forEach(([cx, cy, sx, sy2]) =>
    extra.push(`M${cx} ${cy + sy2 * u * 3} V${cy} H${cx + sx * u * 3}`));

  return { walls, inner, furn, grid, extra };
}
