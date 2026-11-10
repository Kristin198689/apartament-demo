import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Качества, с которыми next/image отдаёт фото (80 — для галереи, 85 — запас для hero)
  images: { qualities: [75, 80, 85] },
};

export default withNextIntl(nextConfig);
