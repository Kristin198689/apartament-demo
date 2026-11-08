"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./SiteHeader.module.css";

export function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <ul className={styles.langs}>
      {routing.locales.map((l) => (
        <li key={l}>
          <Link
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            aria-current={l === current ? "true" : undefined}
            className={styles.lang}
            onClick={onNavigate}
          >
            {l.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
