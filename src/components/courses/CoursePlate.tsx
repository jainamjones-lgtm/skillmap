import Image from "next/image";

/**
 * Course artwork slot. When a course has a stock hero image it fills the
 * plate (behind any overlay children). Otherwise this falls back to a warm
 * tonal plate: a tint bloom over the surface ramp with the course's own
 * initials ghosted into it, so cards stay distinguishable at a glance instead
 * of reading as identical blank rectangles.
 */
/* Warm hues only — a cold tint would read as a different brand. */
const TINTS = [
  "#ba0036",
  "#ff385c",
  "#ffb400",
  "#7e5700",
  "#c31432",
  "#e21e4a",
] as const;

export function tintFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
}

function monogram(title: string) {
  return title
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function CoursePlate({
  title,
  tint,
  imageUrl,
  className = "",
  children,
}: {
  title: string;
  tint: string;
  imageUrl?: string | null;
  className?: string;
  children?: React.ReactNode;
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 15% 10%, ${tint}30, transparent 60%), linear-gradient(135deg, ${tint}1f, var(--color-surface-low) 78%)`,
      }}
    >
      <span
        aria-hidden
        className="absolute right-4 bottom-3 text-[4rem] leading-none font-black tracking-tight select-none"
        style={{ color: `${tint}26` }}
      >
        {monogram(title)}
      </span>
      {children}
    </div>
  );
}
