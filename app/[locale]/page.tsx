import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Statement } from "@/components/Statement/Statement";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Hero } from "@/sections/Home/Hero";
import { Amenities } from "@/sections/Home/Amenities";
import { Apartments } from "@/sections/Home/Apartments";
import { PlanSection } from "@/sections/Home/PlanSection";
import { Companies } from "@/sections/Home/Companies";
import { Location } from "@/sections/Home/Location";
import { Hook } from "@/sections/Home/Hook";
import { Steps } from "@/sections/Home/Steps";
import { Reviews } from "@/sections/Home/Reviews";
import { Faq } from "@/sections/Home/Faq";
import { Contact } from "@/sections/Home/Contact";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const f = await getTranslations("Frames");
  const s1 = await getTranslations("Statement1");
  const s2 = await getTranslations("Statement2");

  return (
    <>
      <Hero />
      <Statement eyebrow={s1("eyebrow")} pain={s1("pain")} relief={s1("relief")} />
      <Amenities />
      <Apartments />
      <PlanSection />
      <Companies />
      <Location />
      <Hook />
      <PhotoFrame variant="bleed" ratio="21 / 9" ratioMobile="4 / 3" label={f("panorama")} src={images.panorama.src} position={images.panorama.position} sizes="100vw" />
      <Statement eyebrow={s2("eyebrow")} pain={s2("pain")} relief={s2("relief")} />
      <Steps />
      <Reviews />
      <Faq />
      <Contact />
    </>
  );
}
