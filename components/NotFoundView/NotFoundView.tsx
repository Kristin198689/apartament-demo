import type { CSSProperties } from "react";
import btn from "@/components/Button/Button.module.css";
import { Arrow } from "@/components/Arrow/Arrow";
import { HeroBlueprint } from "@/components/HeroBlueprint/HeroBlueprint";
import styles from "./NotFoundView.module.css";

export type NotFoundTexts = {
  eyebrow: string;
  title: string;
  lead: string;
  home: string;
  apartments: string;
  blog: string;
};

const s = (i: number) => ({ "--i": i }) as CSSProperties;

/*
 * 404 на весь экран. Фон — наш плотный чертёж плана. Поверх — огромные цифры «404»,
 * вычерченные тонкими линиями: «0» — это дверной проём с открытой дверью.
 * Всё рисуется при загрузке; сверху медленно идёт линия-сканер.
 * Обычные ссылки (<a>), чтобы работало и без провайдера переводов.
 */
export function NotFoundView({ texts, locale }: { texts: NotFoundTexts; locale: string }) {
  const four = "M150 0 L0 250 V320 H150 V360 H230 V320 H260 V250 H230 V0 Z M150 90 V250 H55 Z";
  const zero = "M0 120 A120 120 0 0 1 240 120 V240 A120 120 0 0 1 0 240 Z M70 120 A50 50 0 0 1 170 120 V240 A50 50 0 0 1 70 240 Z";
  const bubble = (cx: number) => `M${cx - 14} -28 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M${cx} -14 V-2`;

  return (
    <section className={styles.stage} aria-labelledby="nf-title">
      <HeroBlueprint />
      <div className={styles.scan} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <svg className={styles.digits} viewBox="0 -50 1000 520" role="img" aria-label="404" focusable="false">
          {/* линия земли и размеры */}
          <path pathLength={1} className={styles.thin} style={s(0)} d="M0 400 H1000" />

          <g transform="translate(60 0)">
            <path pathLength={1} className={styles.outline} style={s(1)} d={four} fillRule="evenodd" />
            <path pathLength={1} className={styles.thin} style={s(5)} d={`${bubble(130)} M0 440 H260 M0 432 V448 M260 432 V448`} />
          </g>

          <g transform="translate(380 0)">
            <path pathLength={1} className={styles.outline} style={s(2)} d={zero} fillRule="evenodd" />
            <path pathLength={1} className={styles.door} style={s(4)} d="M170 240 V140 M70 240 A100 100 0 0 1 170 140" />
            <path pathLength={1} className={styles.thin} style={s(6)} d={`${bubble(120)} M0 440 H240 M0 432 V448 M240 432 V448`} />
          </g>

          <g transform="translate(680 0)">
            <path pathLength={1} className={styles.outline} style={s(3)} d={four} fillRule="evenodd" />
            <path pathLength={1} className={styles.thin} style={s(7)} d={`${bubble(130)} M0 440 H260 M0 432 V448 M260 432 V448`} />
          </g>
        </svg>

        <div className={styles.text}>
          <div className={styles.copy}>
            <p className={styles.label}>
              <span className={styles.code}>404</span>
              <span>{texts.eyebrow}</span>
              <span className={styles.dim} aria-hidden="true" />
            </p>
            <h1 id="nf-title" className={styles.title}>{texts.title}</h1>
            <p className={styles.lead}>{texts.lead}</p>
          </div>

          <div className={styles.actions}>
            <a className={`${btn.button} ${btn.primary}`} href={`/${locale}`}>
              <span>{texts.home}</span>
              <Arrow className={btn.arrow} />
            </a>
            <a className={`${btn.button} ${btn.ghost}`} href={`/${locale}#apartments`}>
              <span>{texts.apartments}</span>
              <Arrow className={btn.arrow} />
            </a>
            <a className={styles.more} href={`/${locale}/blog`}>{texts.blog}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
