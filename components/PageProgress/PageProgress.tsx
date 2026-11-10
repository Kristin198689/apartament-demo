"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import styles from "./PageProgress.module.css";

/*
 * Переход между страницами: тонкая линия-чертёж «прочерчивается» сверху слева направо
 * при клике по внутренней ссылке и завершается, когда новая страница открылась.
 */
export function PageProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);
  const first = useRef(true);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // якорь на этой же странице
      setState("loading");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setState("done");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 700);
    return () => window.clearTimeout(timer.current);
  }, [pathname]);

  return <div className={styles.bar} data-state={state} aria-hidden="true" />;
}
