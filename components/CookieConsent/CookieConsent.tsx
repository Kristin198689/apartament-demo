"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./CookieConsent.module.css";

const KEY = "consent";

/*
 * Cookie-плашка. Сейчас на сайте нет трекинга, выбор лишь запоминается в браузере
 * и рассылается событием "consent-change" (detail: "granted" | "denied") — под будущую аналитику.
 * Открыть заново можно ссылкой «Настройки cookie» в футере (событие "consent-open").
 */
export function CookieConsent() {
  const t = useTranslations("Consent");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch { setOpen(true); }
    const reopen = () => setOpen(true);
    window.addEventListener("consent-open", reopen);
    return () => window.removeEventListener("consent-open", reopen);
  }, []);

  function choose(v: "granted" | "denied") {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("consent-change", { detail: v }));
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className={`${styles.bar} no-print`} role="region" aria-label={t("label")}>
      <p className={styles.text}>{t("text")}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={() => choose("denied")}>{t("reject")}</button>
        <button type="button" className={styles.solid} onClick={() => choose("granted")}>{t("accept")}</button>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("consent-open"))} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "0.25em", textDecorationThickness: "1px" }}>
      {label}
    </button>
  );
}
