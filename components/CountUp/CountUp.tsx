"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = { value: number; pad?: number; duration?: number };

/** Число «нарастает» от 0 при появлении в окне. SSR отдаёт итоговое значение. */
export function CountUp({ value, pad = 0, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  const armed = useRef(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    armed.current = true;
    setN(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armed.current) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
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
  }, [value, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {String(n).padStart(pad, "0")}
    </span>
  );
}
