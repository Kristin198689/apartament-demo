"use client";

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
  /** "bleed" — на всю ширину экрана без боковых линий */
  variant?: "default" | "bleed";
  className?: string;
};

/*
 * Тонкая рамка-заглушка под будущее фото. Рамка и диагонали «рисуются» при появлении.
 * Когда появятся настоящие фото, заменить на next/image внутри такого же контейнера.
 */
export function PhotoFrame({ ratio = "4 / 3", ratioMobile, label, video, poster, variant = "default", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`${styles.frame} ${variant === "bleed" ? styles.bleed : ""} ${className}`}
      data-visible={visible}
      style={{ "--ratio": ratio, "--ratio-sm": ratioMobile ?? ratio } as CSSProperties}
    >
      <div className={styles.box}>
        {video ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </div>
    </div>
  );
}
