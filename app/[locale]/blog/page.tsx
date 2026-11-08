import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { posts } from "@/content/blog/posts";
import { localeAlternates } from "@/lib/seo";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { Arrow } from "@/components/Arrow/Arrow";
import styles from "./blog.module.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: localeAlternates("/blog", locale as Locale),
  };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const f = await getTranslations("Frames");
  const cr = await getTranslations("Crumb");

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs label={cr("label")} locale={locale} items={[{ label: cr("home"), href: "/" }, { label: t("eyebrow") }]} />
      <header className={styles.head}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.lead}>{t("lead")}</p>
      </header>

      <ul className={styles.list}>
        {posts.map((p) => {
          const c = p.content[locale as Locale];
          return (
            <li key={p.slug} className={styles.item}>
              <Link href={`/blog/${p.slug}`} className={styles.itemLink}>
                <PhotoFrame ratio="3 / 2" label={f("article")} />
                <h2 className={styles.itemTitle}>{c.title}</h2>
                <p className={styles.itemText}>{c.description}</p>
                <span className={styles.more}>{t("read")} <Arrow size={18} /></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
