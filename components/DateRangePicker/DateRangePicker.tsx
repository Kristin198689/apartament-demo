"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Arrow } from "@/components/Arrow/Arrow";
import styles from "./DateRangePicker.module.css";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);

/*
 * Свой календарь в линейном стиле для выбора заезда и выезда.
 * Внутри — скрытые поля arrival/departure (ISO), поэтому форма работает как раньше.
 * Есть кнопка «в календарь» (.ics).
 */
export function DateRangePicker() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [hover, setHover] = useState<string>("");
  const [openPanel, setOpenPanel] = useState(false);

  const fmtDay = (s: string) => (s ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(parse(s)) : "—");
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(view);
  const weekdays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 1 + i))),
    [locale],
  );

  // сетка месяца (неделя с понедельника)
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];

  const pick = (d: Date) => {
    const v = iso(d);
    if (!start || (start && end)) {
      setStart(v);
      setEnd("");
    } else if (v > start) {
      setEnd(v);
      setOpenPanel(false);
    } else {
      setStart(v);
    }
  };

  const nights = start && end ? nightsBetween(start, end) : 0;
  const daysTo = start ? Math.round((parse(start).getTime() - today.getTime()) / 86400000) : -1;
  const weeks = Math.floor(nights / 7);
  const previewEnd = !end && start && hover && hover > start ? hover : end;

  function downloadIcs() {
    if (!start || !end) return;
    const d = (s: string) => s.replaceAll("-", "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//" + siteConfig.name + "//Stay//EN",
      "BEGIN:VEVENT",
      `UID:${d(start)}-${d(end)}@stay`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${d(start)}`,
      `DTEND;VALUE=DATE:${d(end)}`,
      `SUMMARY:${t("icsTitle", { name: siteConfig.name })}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stay.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className={styles.wrap}>
      <input type="hidden" name="arrival" value={start} />
      <input type="hidden" name="departure" value={end} />

      <div className={styles.fields}>
        <button type="button" className={styles.field} data-active={openPanel && !start} onClick={() => setOpenPanel((v) => !v)} aria-expanded={openPanel}>
          <span className={styles.label}>{t("arrival")}</span>
          <span className={styles.value}>{fmtDay(start)}</span>
        </button>
        <span className={styles.arrow} aria-hidden="true"><Arrow size={18} /></span>
        <button type="button" className={styles.field} data-active={openPanel && Boolean(start) && !end} onClick={() => setOpenPanel((v) => !v)} aria-expanded={openPanel}>
          <span className={styles.label}>{t("departure")}</span>
          <span className={styles.value}>{fmtDay(end)}</span>
        </button>
      </div>

      <div className={styles.meta}>
        {nights > 0 ? (
          <span className={styles.nights}>
            {t("nights", { count: nights })}
            {weeks > 0 ? <span className={styles.sub}> · {t("weeks", { count: weeks })}</span> : null}
            {daysTo >= 0 ? <span className={styles.sub}> · {daysTo === 0 ? t("arrivesToday") : t("inDays", { count: daysTo })}</span> : null}
          </span>
        ) : <span className={styles.hintText}>{t("pickDates")}</span>}
        {nights > 0 ? (
          <button type="button" className={styles.ics} onClick={downloadIcs}>{t("addToCalendar")}</button>
        ) : null}
      </div>

      <div className={styles.panel} data-open={openPanel}>
        <div className={styles.panelInner}>
          <div className={styles.head}>
            <button type="button" className={styles.nav} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} aria-label={t("prevMonth")} disabled={view <= new Date(today.getFullYear(), today.getMonth(), 1)}>
              <Arrow dir="left" size={18} />
            </button>
            <span className={styles.month}>{monthLabel}</span>
            <button type="button" className={styles.nav} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label={t("nextMonth")}>
              <Arrow size={18} />
            </button>
          </div>

          <div className={styles.grid} role="grid" aria-label={monthLabel}>
            {weekdays.map((w) => <span key={w} className={styles.wd}>{w}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const v = iso(d);
              const past = d < today;
              const isStart = v === start;
              const isEnd = v === end;
              const inRange = Boolean(start && previewEnd && v > start && v < previewEnd);
              return (
                <button
                  key={v}
                  type="button"
                  className={styles.day}
                  disabled={past}
                  data-start={isStart}
                  data-end={isEnd}
                  data-range={inRange}
                  data-today={v === iso(today)}
                  aria-pressed={isStart || isEnd}
                  onClick={() => pick(d)}
                  onMouseEnter={() => setHover(v)}
                  onFocus={() => setHover(v)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <p className={styles.legend}>{start && !end ? t("pickDeparture") : t("pickArrival")}</p>
        </div>
      </div>
    </div>
  );
}
