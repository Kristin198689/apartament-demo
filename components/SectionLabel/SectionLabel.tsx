import styles from "./SectionLabel.module.css";

/*
 * Ярлык секции с «размерной линией» как на чертеже: номер, текст и линия с засечками.
 * Рисуется, когда родитель (Reveal) получает data-visible="true".
 */
export function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className={styles.label}>
      <span className={styles.idx}>{n}</span>
      <span className={styles.text}>{text}</span>
      <span className={styles.dim} aria-hidden="true" />
    </div>
  );
}
