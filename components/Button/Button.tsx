import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/Arrow/Arrow";
import styles from "./Button.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  block?: boolean;
  size?: "md" | "sm";
  className?: string;
};

export function Button({ href, children, variant = "primary", block = false, size = "md", className = "" }: Props) {
  const cls = `${styles.button} ${styles[variant]} ${block ? styles.block : ""} ${size === "sm" ? styles.sm : ""} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <Arrow className={styles.arrow} />
    </>
  );
  const external = href.startsWith("http");
  if (external || href.startsWith("#")) {
    return (
      <a
        className={cls}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}
