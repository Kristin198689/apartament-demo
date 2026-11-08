import type { ReactNode } from "react";
import styles from "./LegalPage.module.css";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className={`container ${styles.page}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body} lang="de">{children}</div>
    </article>
  );
}
