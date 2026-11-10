import { useLocale, useTranslations } from "next-intl";
import { NotFoundView } from "@/components/NotFoundView/NotFoundView";

/* 404 внутри языковой ветки: шапка и подвал остаются, текст на языке посетителя. */
export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  const locale = useLocale();
  return (
    <NotFoundView
      locale={locale}
      texts={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        lead: t("lead"),
        home: t("home"),
        apartments: t("apartments"),
        blog: t("blog"),
      }}
    />
  );
}
