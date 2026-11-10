import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView/NotFoundView";
import { fontDisplay, fontSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404", robots: { index: false } };

/* Запасная 404: неизвестный язык в адресе (например /xx) — до языковой ветки дело не доходит. */
export default function RootNotFound() {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body>
        <NotFoundView
          locale="en"
          texts={{
            eyebrow: "Error",
            title: "Page not found",
            lead: "The address may have been mistyped or the page has moved. Choose where to go next.",
            home: "Back to home",
            apartments: "View apartments",
            blog: "Read the blog",
          }}
        />
      </body>
    </html>
  );
}
