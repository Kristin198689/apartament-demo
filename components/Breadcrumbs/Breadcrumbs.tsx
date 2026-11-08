import { Link } from "@/i18n/navigation";
import { jsonLd } from "@/lib/seo";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href?: string };

/** Хлебные крошки + разметка BreadcrumbList. Последняя крошка — текущая страница. */
export function Breadcrumbs({ items, label, locale }: { items: Crumb[]; label: string; locale: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `/${locale}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label={label} className={styles.nav}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <ol className={styles.list}>
        {items.map((c, i) => (
          <li key={i} className={styles.item}>
            {c.href && i < items.length - 1 ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
