"use client";

import { Fragment, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/Button/Button";
import styles from "./FaqSearch.module.css";

const KEYS = Array.from({ length: 22 }, (_, i) => `q${i + 1}`);

/* регистр, диакритика и ß не мешают поиску: «Kaution» = «kaution», «ё» = «е» */
const norm = (s: string) =>
  s.toLowerCase().replace(/ß/g, "ss").replace(/ё/g, "е").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = norm(text).indexOf(norm(q));
  if (i < 0 || norm(text).length !== text.length) return text;
  return (
    <Fragment>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </Fragment>
  );
}

/* FAQ с живым поиском, подсветкой совпадений и плавным раскрытием ответов. */
export function FaqSearch() {
  const t = useTranslations("Faq");
  const c = useTranslations("Cta");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(KEYS[0]);

  const q = query.trim();
  const items = useMemo(
    () => KEYS.map((k) => ({ k, q: t(`items.${k}.q`), a: t(`items.${k}.a`), hay: norm(`${t(`items.${k}.q`)} ${t(`items.${k}.a`)} ${t(`items.${k}.kw`)}`) })),
    [t],
  );
  /* каждое слово запроса должно встретиться (в вопросе, ответе или синонимах); порядок не важен */
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  const all = items.filter((i) => tokens.every((w) => i.hay.includes(w)));
  /* если вместе ничего нет — показываем вопросы, где встречается хотя бы одно слово */
  const shown = all.length || tokens.length < 2 ? all : items.filter((i) => tokens.some((w) => i.hay.includes(w)));
  const chips = t.raw("chips") as string[];

  return (
    <div className={styles.wrap}>
      <div className={styles.side}>
        <label className={styles.search}>
          <span className={styles.searchLabel}>{t("searchLabel")}</span>
          <span className={styles.field}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5 L21 21" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query ? (
              <button type="button" className={styles.clear} onClick={() => setQuery("")} aria-label={t("clear")}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19" /></svg>
              </button>
            ) : null}
          </span>
        </label>
        <div className={styles.chips}>
          {chips.map((c) => (
            <button key={c} type="button" className={styles.chip} data-on={norm(q) === norm(c)} onClick={() => setQuery(norm(q) === norm(c) ? "" : c)}>
              {c}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">{t("count", { count: shown.length })}</p>
      </div>

      <div className={styles.list}>
        {shown.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("empty")}</p>
            <Button href={whatsappUrl(t("askMessage", { q }))} variant="ghost" size="sm">{c("whatsapp")}</Button>
          </div>
        ) : (
          shown.map((i, n) => {
            const isOpen = open === i.k || Boolean(q);
            return (
              <div key={i.k} className={styles.item} data-open={isOpen} style={{ "--n": n } as React.CSSProperties}>
                <h3 className={styles.qWrap}>
                  <button
                    type="button"
                    className={styles.qBtn}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i.k}`}
                    onClick={() => setOpen(open === i.k ? null : i.k)}
                  >
                    <span className={styles.num}>{String(KEYS.indexOf(i.k) + 1).padStart(2, "0")}</span>
                    <span className={styles.q}>{highlight(i.q, q)}</span>
                    <span className={styles.plus} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-${i.k}`} className={styles.a} role="region">
                  <p>{highlight(i.a, q)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
