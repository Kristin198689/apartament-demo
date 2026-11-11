import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CompareSlider } from "@/components/CompareSlider/CompareSlider";
import { NoWaitArt } from "@/components/NoWaitArt/NoWaitArt";
import { Statement } from "@/components/Statement/Statement";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Hero } from "@/sections/Home/Hero";
import { Amenities } from "@/sections/Home/Amenities";
import { Apartments } from "@/sections/Home/Apartments";
import { PlanSection } from "@/sections/Home/PlanSection";
import { Companies } from "@/sections/Home/Companies";
import { Day } from "@/sections/Home/Day";
import { Location } from "@/sections/Home/Location";
import { Hook } from "@/sections/Home/Hook";
import { Steps } from "@/sections/Home/Steps";
import { Faq } from "@/sections/Home/Faq";
import { Contact } from "@/sections/Home/Contact";
import { jsonLd, siteUrl } from "@/lib/seo";
import { isTodo, siteConfig } from "@/config/site";
import { apartmentTypes } from "@/config/property";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const f = await getTranslations("Frames");
  const s1 = await getTranslations("Statement1");
  const s2 = await getTranslations("Statement2");

  const faq = await getTranslations("Faq");
  const Meta = await getTranslations("Meta");
  // в FAQ-разметку попадают только готовые ответы, без TODO
  const faqItems = Array.from({ length: 22 }, (_, i) => `q${i + 1}`)
    .map((k) => ({ q: faq(`items.${k}.q`), a: faq(`items.${k}.a`) }))
    .filter((x) => !x.a.includes("TODO"));
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: siteConfig.name,
      description: Meta("description", { city: siteConfig.city }),
      inLanguage: locale,
      ...(isTodo(siteConfig.domain) ? {} : { url: `${siteUrl()}/${locale}` }),
      amenityFeature: ["Self check-in", "Free parking", "Full kitchen", "WiFi"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      makesOffer: apartmentTypes.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Accommodation", name: `${x.rooms}`, floorSize: { "@type": "QuantitativeValue", value: Number(x.area), unitCode: "MTK" }, occupancy: { "@type": "QuantitativeValue", maxValue: Number(x.guests) } } })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Hero />
      <Statement eyebrow={s1("eyebrow")} pain={s1("pain")} relief={s1("relief")} figure={<CompareSlider />} />
      <Amenities />
      <Apartments />
      <PlanSection />
      <Companies />
      <Day />
      <Location />
      <Hook />
      <PhotoFrame variant="bleed" ratio="21 / 9" ratioMobile="4 / 3" label={f("panorama")} src={images.panorama.src} position={images.panorama.position} sizes="100vw" />
      <Statement eyebrow={s2("eyebrow")} pain={s2("pain")} relief={s2("relief")} figure={<NoWaitArt />} />
      <Steps />
      <Faq />
      <Contact />
    </>
  );
}
