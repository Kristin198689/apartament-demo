import { isTodo } from "@/config/site";
import styles from "./Placeholder.module.css";

/** Показывает значение или заметный маркер TODO. */
export function Val({ v }: { v: string }) {
  return isTodo(v) ? <span className={styles.todo}>TODO</span> : <>{v}</>;
}
