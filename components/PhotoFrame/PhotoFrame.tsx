"use client";

import Image from "next/image";
import { Lightbox, type LightboxItem } from "@/components/Lightbox/Lightbox";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./PhotoFrame.module.css";

type Props = {
  /** CSS aspect-ratio, напр. "16 / 9" */
  ratio?: string;
  /** Пропорции на телефоне (по умолчанию как ratio) */
  ratioMobile?: string;
  /** Подпись: что здесь будет за фото */
  label: string;
  /** Путь к видео (mp4). Если задан — вместо заглушки играет беззвучный цикл */
  video?: string;
  poster?: string;
  /** Фото (путь из /public). Если задано — вместо заглушки показывается оно */
  src?: string;
  /** object-position для кадрирования фото */
  position?: string;
  /** Для первого экрана (LCP) */
  priority?: boolean;
  /** Подсказка браузеру о ширине фото */
  sizes?: string;
  /** Открывать фото на весь экран по клику (по умолчанию да) */
  zoom?: boolean;
  /** Фото с одинаковым group листаются в просмотре вместе */
  group?: string;
  /** "bleed" — на всю ширину экрана без боковых линий */
  variant?: "default" | "bleed";
  className?: string;
};

/*
 * Тонкая рамка-заглушка под будущее фото. Рамка и диагонали «рисуются» при появлении.
 * Когда появятся настоящие фото, заменить на next/image внутри такого же контейнера.
 */
export function PhotoFrame({ ratio = "4 / 3", ratioMobile, label, video, poster, src, position, priority = false, sizes = "(min-width: 64rem) 40vw, 100vw", zoom = true, group, variant = "default", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(priority); // первый экран открывается сразу, не дожидаясь скрипта (LCP)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lb, setLb] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const canZoom = Boolean(src) && zoom && !video;

  function openLightbox() {
    if (!src) return;
    let items: LightboxItem[] = [{ src, alt: label, position }];
    let index = 0;
    if (group) {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-lb-group="${group}"]`));
      items = nodes.map((n) => ({ src: n.dataset.lbSrc ?? "", alt: n.dataset.lbAlt ?? "", position: n.dataset.lbPos }));
      index = Math.max(0, nodes.findIndex((n) => n.dataset.lbSrc === src));
    }
    setLb({ items, index });
  }

  useEffect(() => {
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) videoRef.current?.pause();
  }, [video]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      // начинаем чуть раньше, чем рамка появится в окне, и не ждём заметной доли площади
      { threshold: 0.02, rootMargin: "0px 0px 15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      {...(src ? {} : { role: "img", "aria-label": label })}
      className={`${styles.frame} ${variant === "bleed" ? styles.bleed : ""} ${src ? styles.hasImage : ""} ${className}`}
      data-visible={visible}
      {...(canZoom ? { role: "button", tabIndex: 0, "aria-label": `${label}`, onClick: openLightbox, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); } } } : {})}
      {...(group && src ? { "data-lb-group": group, "data-lb-src": src, "data-lb-alt": label, "data-lb-pos": position ?? "" } : {})}
      style={{ "--ratio": ratio, "--ratio-sm": ratioMobile ?? ratio } as CSSProperties}
    >
      <div className={styles.box}>
        {video ? (

          <video
            ref={videoRef}
            className={styles.video}
            src={video}
            poster={poster ?? src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes={sizes}
            quality={80}
            priority={priority}
            className={styles.photo}
            style={{ objectPosition: position ?? "50% 50%" }}
          />
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </div>
      {lb ? <Lightbox items={lb.items} index={lb.index} onIndex={(i) => setLb({ ...lb, index: i })} onClose={() => setLb(null)} /> : null}
    </div>
  );
}
