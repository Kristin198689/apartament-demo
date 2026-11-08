"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { isTodo, siteConfig } from "@/config/site";
import styles from "./ContactForm.module.css";

/*
 * Форма не отправляет данные на наш сервер: собирает сообщение и открывает WhatsApp.
 * Ничего не хранится и не логируется. Пока номер = TODO, показываем пояснение.
 */
export function ContactForm() {
  const t = useTranslations("Contact");
  const [error, setError] = useState<string | null>(null);
  const missingNumber = isTodo(siteConfig.whatsappNumber);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim().slice(0, 120);
    const arrival = String(f.get("arrival") ?? "");
    const departure = String(f.get("departure") ?? "");
    const guests = Number(f.get("guests"));
    const note = String(f.get("note") ?? "").trim().slice(0, 600);

    if (!name || !arrival || !departure || !Number.isInteger(guests) || guests < 1 || guests > 99) {
      setError(t("errorRequired"));
      return;
    }
    if (departure <= arrival) {
      setError(t("errorDates"));
      return;
    }
    setError(null);

    const text = t("message", { name, arrival, departure, guests, note: note || "—" });
    if (missingNumber) return;
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.field}>
        <span>{t("name")}</span>
        <input name="name" type="text" autoComplete="organization" maxLength={120} required />
      </label>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>{t("arrival")}</span>
          <input name="arrival" type="date" required />
        </label>
        <label className={styles.field}>
          <span>{t("departure")}</span>
          <input name="departure" type="date" required />
        </label>
      </div>
      <label className={styles.field}>
        <span>{t("guests")}</span>
        <input name="guests" type="number" inputMode="numeric" min={1} max={99} defaultValue={1} required />
      </label>
      <label className={styles.field}>
        <span>{t("note")}</span>
        <textarea name="note" rows={2} maxLength={600} />
      </label>

      {error && <p role="alert" className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submit}>{t("submit")}</button>
      <p className={styles.hint}>{missingNumber ? t("noNumber") : t("privacy")}</p>
    </form>
  );
}
