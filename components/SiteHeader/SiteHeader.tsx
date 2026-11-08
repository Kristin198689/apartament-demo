"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteHeader.module.css";

const NAV = [
  { key: "apartments", href: "/#apartments" },
  { key: "companies", href: "/#companies" },
  { key: "location", href: "/#location" },
  { key: "faq", href: "/#faq" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/#contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Классика: вниз — прячем, вверх — показываем; у самого верха и при открытом меню всегда виден
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) setHidden(false);
        else if (y > last + 8) setHidden(true);
        else if (y < last - 8) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-open={open} data-hidden={hidden && !open}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          {siteConfig.name}
        </Link>

        <nav className={styles.desktopNav} aria-label={t("label")}>
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className={styles.link}>
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={styles.desktopLangs}>
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("close") : t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.bars} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={styles.backdrop}
        data-open={open}
        aria-hidden="true"
        onClick={close}
      />

      <div id="mobile-menu" className={styles.menu} data-open={open}>
        <nav aria-label={t("label")}>
          <ul className={styles.menuList}>
            {NAV.map((n, i) => (
              <li key={n.key} style={{ "--i": i } as React.CSSProperties}>
                <Link href={n.href} className={styles.menuLink} onClick={close}>
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.menuLangs}>
            <LanguageSwitcher onNavigate={close} />
          </div>
        </nav>
      </div>
    </header>
  );
}
