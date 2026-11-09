#!/usr/bin/env python3
"""
Генератор фирменных иконок и картинок для соцсетей (фавиконы, OG, Instagram).
Запуск из корня проекта:  python3 scripts/brand/make_assets.py
Нужен Pillow. Шрифты — системные macOS (Helvetica Neue для заголовков, Avenir Next для текста).
Цвета и тексты меняются в блоке НАСТРОЙКИ ниже.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

# ───────────── НАСТРОЙКИ ─────────────
INK = (16, 19, 24)          # почти чёрный (#101318)
PAPER = (248, 249, 251)     # холодный белый (#f8f9fb)
GRAPHITE = (92, 99, 112)    # мягкий серый для подписей
LINE = (176, 182, 193)      # линии чертежа
NAME = "Apartament Demo"
CITY = "Wertheim"           # TODO: подтвердить у заказчика

TEXTS = {
    "de": ("Möblierte Apartments in " + CITY, "Self-Check-in 24/7  ·  Kostenlos parken  ·  Eigene Küche", "Wohnen auf Zeit"),
    "en": ("Furnished apartments in " + CITY, "Self check-in 24/7  ·  Free parking  ·  Full kitchen", "Short and long stays"),
    "ru": ("Меблированные апартаменты в " + CITY, "Заселение 24/7  ·  Бесплатная парковка  ·  Своя кухня", "Посуточно и надолго"),
}

HEAD_FONT = ("/System/Library/Fonts/HelveticaNeue.ttc", 10)   # Medium
BODY_FONT = ("/System/Library/Fonts/Avenir Next.ttc", 7)      # Regular
# ──────────────────────────────────────

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ICONS = os.path.join(ROOT, "public", "icons")
SOCIAL = os.path.join(ROOT, "public", "social")
SS = 4  # суперсэмплинг для гладких линий


def font(spec, size):
    return ImageFont.truetype(spec[0], size, index=spec[1])


def stroke(draw, p0, p1, w, fill):
    """Линия-прямоугольник с квадратными концами (как stroke-linecap: square)."""
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    nx, ny = -uy * w / 2, ux * w / 2
    ex, ey = ux * w / 2, uy * w / 2
    a = (x0 - ex, y0 - ey); b = (x1 + ex, y1 + ey)
    draw.polygon([(a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny), (b[0] - nx, b[1] - ny), (a[0] - nx, a[1] - ny)], fill=fill)


def _norm(a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy)
    return (-dy / L, dx / L)


def _isect(p, d, q, e):
    """Пересечение прямых p + t*d и q + u*e."""
    det = d[0] * (-e[1]) - d[1] * (-e[0])
    t = ((q[0] - p[0]) * (-e[1]) - (q[1] - p[1]) * (-e[0])) / det
    return (p[0] + t * d[0], p[1] + t * d[1])


def miter_polyline(draw, pts, w, fill):
    """Ломаная из трёх точек с острым (miter) соединением в средней точке."""
    h = w / 2
    a, b, c = pts
    n0, n1 = _norm(a, b), _norm(b, c)
    d0, d1 = (b[0] - a[0], b[1] - a[1]), (c[0] - b[0], c[1] - b[1])
    sides = []
    for sgn in (1, -1):
        a2 = (a[0] + sgn * n0[0] * h, a[1] + sgn * n0[1] * h)
        b0 = (b[0] + sgn * n0[0] * h, b[1] + sgn * n0[1] * h)
        b1 = (b[0] + sgn * n1[0] * h, b[1] + sgn * n1[1] * h)
        c2 = (c[0] + sgn * n1[0] * h, c[1] + sgn * n1[1] * h)
        m = _isect(b0, d0, b1, d1)
        sides.append([a2, m, c2])
    draw.polygon(sides[0] + sides[1][::-1], fill=fill)


def mark(draw, x, y, size, fg, w_frac):
    """Знак «A» из тонких линий в квадрате size×size с левым верхним углом (x, y)."""
    s = size / 64
    w = size * w_frac
    P = lambda px, py: (x + px * s, y + py * s)
    miter_polyline(draw, [P(15, 49), P(32, 14), P(49, 49)], w, fg)
    stroke(draw, P(23, 38), P(41, 38), w, fg)


def icon(size, radius=0.22, bg=INK, fg=PAPER, scale=1.0, full_bleed=False, w_frac=None):
    big = size * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if full_bleed:
        d.rectangle([0, 0, big, big], fill=bg)
    else:
        d.rounded_rectangle([0, 0, big - 1, big - 1], radius=int(big * radius), fill=bg)
    inner = big * scale
    off = (big - inner) / 2
    if w_frac is None:
        w_frac = 0.075 if size <= 64 else 0.058
    mark(d, off, off, inner, fg, w_frac)
    return img.resize((size, size), Image.LANCZOS)


def make_icons():
    os.makedirs(ICONS, exist_ok=True)
    for s in (48, 96, 144, 192, 512):
        icon(s).save(os.path.join(ICONS, f"icon-{s}.png"), optimize=True)
    # maskable: знак в безопасной зоне (≈62%), фон на весь холст
    icon(512, bg=INK, scale=0.62, full_bleed=True).save(os.path.join(ICONS, "maskable-512.png"), optimize=True)
    # Apple touch icon: iOS сам скругляет углы, прозрачности быть не должно
    icon(180, bg=INK, scale=0.84, full_bleed=True).convert("RGB").save(os.path.join(ICONS, "apple-touch-icon.png"), optimize=True)
    # favicon.ico (несколько размеров)
    base = icon(256, w_frac=0.09)  # чуть плотнее: при уменьшении до 16 px линии не должны пропадать
    base.save(os.path.join(ROOT, "public", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


# ───────── чертёж фасада для картинок (та же геометрия, что на сайте) ─────────
def elevation(draw, ox, oy, scale, color, w):
    sx = lambda x: ox + x * scale
    sy = lambda y: oy + y * scale
    L = lambda a, b, c, e: stroke(draw, (sx(a), sy(b)), (sx(c), sy(e)), w, color)
    R = lambda x, y, wd, h: [L(x, y, x + wd, y), L(x + wd, y, x + wd, y + h), L(x + wd, y + h, x, y + h), L(x, y + h, x, y)]
    L(0, 480, 1200, 480)                                   # земля
    L(200, 112, 200, 480); L(800, 112, 800, 480)           # стены
    R(190, 100, 620, 12)                                   # парапет
    for y in (210, 300, 390): L(200, y, 800, y)            # этажи
    L(800, 300, 1010, 300); L(1010, 300, 1010, 480)        # пристройка
    L(790, 300, 905, 236); L(905, 236, 1020, 300)
    for r, y in enumerate((140, 235, 325, 415)):           # окна
        for i in range(5):
            x = 235 + i * 115
            if r == 3 and i == 2: continue
            R(x, y, 60, 50); L(x + 30, y, x + 30, y + 50)
    R(830, 340, 50, 50); R(930, 340, 50, 50)
    R(470, 405, 60, 75); L(500, 405, 500, 480)             # дверь
    # арка солнца
    steps = 90
    pts = [(sx(600 - 560 * math.cos(math.pi * t / steps)), sy(480 - 500 * math.sin(math.pi * t / steps))) for t in range(steps + 1)]
    for a, b in zip(pts, pts[1:]): stroke(draw, a, b, w, color)


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if draw.textlength(t, font=fnt) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines


def card(w, h, loc, layout):
    """layout: 'wide' (1200×630), 'square', 'portrait' (1080×1350), 'story' (1080×1920)."""
    head, tag, kicker = TEXTS[loc]
    W, H = w * SS, h * SS
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    pad = int(min(w, h) * 0.075) * SS
    # знак + имя
    msz = int(min(w, h) * 0.075) * SS
    top = pad if layout != "story" else 250 * SS
    m = icon(msz // SS, radius=0.22).resize((msz, msz), Image.LANCZOS)
    img.paste(m, (pad, top), m)
    nf = font(BODY_FONT, int(min(w, h) * 0.032) * SS)
    d.text((pad + msz + 18 * SS, top + msz / 2), NAME.upper(), font=nf, fill=INK, anchor="lm")

    wide = layout == "wide"
    hs = int((60 if wide else 74) * (min(w, h) / (630 if wide else 1080)) * (1.0 if wide else 1.0)) * SS
    if layout in ("square", "portrait", "story"):
        hs = int(w * 0.082) * SS
    hf = font(HEAD_FONT, hs)
    max_w = (int(w * 0.5) if wide else w - 2 * pad // SS) * SS if wide else (w * SS - 2 * pad)
    lines = wrap(d, head, hf, max_w)
    lh = int(hs * 1.06)

    if wide:
        y = top + msz + 70 * SS
    elif layout == "square":
        y = top + msz + 70 * SS
    elif layout == "portrait":
        y = top + msz + 90 * SS
    else:
        y = top + msz + 120 * SS
    kf = font(BODY_FONT, int(min(w, h) * 0.028) * SS)
    d.text((pad, y), kicker.upper(), font=kf, fill=GRAPHITE)
    y += int(kf.size * 2.2)
    for ln in lines:
        d.text((pad, y), ln, font=hf, fill=INK)
        y += lh
    text_bottom = y

    # чертёж
    lw = max(int(1.6 * SS), 2)
    if wide:
        sc = 0.5 * SS
        elevation(d, 560 * SS, 200 * SS, sc / 1.0 * 0.95 / 1, LINE, lw)
    elif layout == "square":
        sc = (w - 2 * pad / SS) / 1200 * SS
        elevation(d, pad, h * SS - pad - 570 * sc - 20 * sc, sc, LINE, lw)
    elif layout == "portrait":
        sc = (w - 2 * pad / SS) / 1200 * SS
        elevation(d, pad, h * SS - pad - 560 * sc - 30 * sc, sc, LINE, lw)
    else:
        sc = (w - 2 * pad / SS) / 1200 * SS
        elevation(d, pad, int(h * SS * 0.5), sc, LINE, lw)

    # нижняя подпись с тонкой линией
    tf = font(BODY_FONT, int(min(w, h) * (0.03 if wide else 0.028)) * SS)
    by = (h - (pad // SS) + 6) * SS if layout != "story" else (h - 330) * SS
    d.line([(pad, by - 30 * SS), (W - pad, by - 30 * SS)], fill=LINE, width=SS) if layout != "wide" else d.line([(pad, by - 50 * SS), (W - pad, by - 50 * SS)], fill=LINE, width=SS)
    d.text((pad, by - 6 * SS if layout == "wide" else by), tag, font=tf, fill=GRAPHITE, anchor="ls")

    out = img.resize((w, h), Image.LANCZOS)
    return out


def make_social():
    os.makedirs(SOCIAL, exist_ok=True)
    sizes = {
        "og": (1200, 630, "wide"),             # Telegram, WhatsApp, Facebook, LinkedIn, iMessage, Slack, X
        "square": (1200, 1200, "square"),      # WhatsApp/Telegram-превью, карусели
        "instagram-post": (1080, 1350, "portrait"),   # Instagram 4:5
        "instagram-story": (1080, 1920, "story"),     # Stories / Reels-обложка 9:16
    }
    for loc in TEXTS:
        for name, (w, h, lay) in sizes.items():
            im = card(w, h, loc, lay)
            path = os.path.join(SOCIAL, f"{name}-{loc}.png")
            im.convert("P", palette=Image.ADAPTIVE, colors=96).save(path, optimize=True)


if __name__ == "__main__":
    make_icons()
    make_social()
    print("done")
