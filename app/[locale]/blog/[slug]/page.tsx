import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getPost, posts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { jsonLd, localeAlternates } from "@/lib/seo";
import { ogImages, ogLocale } from "@/lib/social";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/Button/Button";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { images } from "@/config/images";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import styles from "../blog.module.css";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const c = post.content[locale as Locale];
  return {
    title: c.title,
    description: c.description,
    alternates: localeAlternates(`/blog/${slug}`, locale as Locale),
    openGraph: {
      type: "article",
      title: c.title,
      description: c.description,
      url: `/${locale}/blog/${slug}`,
      siteName: siteConfig.name,
      locale: ogLocale(locale as Locale),
      images: ogImages(locale as Locale, c.title),
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: ogImages(locale as Locale).map((i) => i.url) },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const c = post.content[locale as Locale];
  const t = await getTranslations("Blog");
  const f = await getTranslations("Frames");
  const cta = await getTranslations("Cta");
  const cr = await getTranslations("Crumb");

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.title,
    description: c.description,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <div className={`container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Breadcrumbs
        label={cr("label")}
        locale={locale}
        items={[{ label: cr("home"), href: "/" }, { label: t("eyebrow"), href: "/blog" }, { label: c.title }]}
      />

      <article className={styles.article}>
        <h1>{c.title}</h1>
        <p className={styles.intro}>{c.intro}</p>
        <PhotoFrame ratio="16 / 9" label={f("article")} src={images[post.image].src} position={images[post.image].position} sizes="(min-width: 48rem) 44rem, 100vw" />
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}

        <aside className={styles.cta}>
          <h2 className={styles.ctaTitle}>{t("ctaTitle")}</h2>
          <p>{t("ctaText")}</p>
          <div><Button href={whatsappUrl(cta("message"))}>{cta("whatsapp")}</Button></div>
        </aside>
      </article>
    </div>
  );
}
