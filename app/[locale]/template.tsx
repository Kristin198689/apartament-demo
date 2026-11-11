import type { ReactNode } from "react";

/* Шаблон пересоздаётся при каждом переходе между страницами: лист «выезжает» с тонкой линией сверху. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="sheet">{children}</div>;
}
