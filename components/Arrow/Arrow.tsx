/** Тонкая SVG-стрелка: одинаково выглядит на всех устройствах (не зависит от шрифта/эмодзи). */
export function Arrow({ dir = "right", size = 20, className = "" }: { dir?: "right" | "left" | "up"; size?: number; className?: string }) {
  const rotate = dir === "up" ? -90 : dir === "left" ? 180 : 0;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)`, flex: "none" }}
    >
      <path d="M3 12H21M14 5L21 12L14 19" />
    </svg>
  );
}
