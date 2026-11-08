import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import styles from "./Statement.module.css";

type Props = {
  id?: string;
  eyebrow: string;
  /** Проблема клиента, одной строкой */
  pain: string;
  /** Как это решается у нас */
  relief: string;
  tone?: "ink" | "gray" | "light";
};

/*
 * Контрастная смысловая секция: боль → решение. Тонкие линии «чертежа»
 * рисуются фоном, одна линия-сканер медленно проходит по секции.
 */
export function Statement({ id, eyebrow, pain, relief, tone = "ink" }: Props) {
  return (
    <section id={id} className={`${styles.section} ${tone === "ink" ? "tone-ink" : tone === "gray" ? "tone-gray" : ""}`}>
      <Rule />
      <div className={styles.grid} aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <div className={styles.scan} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.eyebrow}>{eyebrow}</Reveal>
        <Reveal as="div" className={styles.pain} delay={80}>
          <p>{pain}</p>
        </Reveal>
        <Reveal as="div" className={styles.relief} delay={260}>
          <p>{relief}</p>
        </Reveal>
      </div>
    </section>
  );
}
