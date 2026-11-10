import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { isTodo, siteConfig } from "@/config/site";
import { ogImages, ogLocale } from "@/lib/social";
import type { Locale } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { ScrollRuler } from "@/components/ScrollRuler/ScrollRuler";
import { PageProgress } from "@/components/PageProgress/PageProgress";
import { Crosshair } from "@/components/Crosshair/Crosshair";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#f8f9fb",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = t("title", { city: siteConfig.city });
  const description = t("description", { city: siteConfig.city });
  const loc = locale as Locale;

  return {
    metadataBase: new URL(isTodo(siteConfig.domain) ? "http://localhost:3000" : siteConfig.domain),
    title,
    description,
    applicationName: siteConfig.name,
    manifest: "/site.webmanifest",
    // Иконки: favicon.ico для старых браузеров и поисковых систем, SVG с тёмной темой,
    // PNG кратных 48 px (требование Google для значка в выдаче), Apple Touch Icon для iOS.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/icon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "default" },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: `/${locale}`,
      locale: ogLocale(loc),
      images: ogImages(loc, title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages(loc, title).map((i) => i.url),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const stamp = (await getTranslations({ locale, namespace: "Print" }))("stamp", { name: siteConfig.name, city: siteConfig.city });
  const rulerLabel = (await getTranslations({ locale, namespace: "Nav" }))("ruler");

  return (
    <html lang={locale} className={`${fontSans.variable} ${fontDisplay.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(localStorage.getItem('theme')==='blueprint')d.setAttribute('data-theme','blueprint');}catch(e){}",
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <PageProgress />
          <Crosshair />
          <SiteHeader />
          <ScrollRuler label={rulerLabel} />
          <div className="header-spacer" aria-hidden="true" />
          <main>{children}</main>
          <SiteFooter />
          <div className="print-stamp" aria-hidden="true">{stamp}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
