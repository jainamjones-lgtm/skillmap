import Link from "next/link";

export function Logo({
  className = "",
  href = "/dashboard",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-[26px] font-black leading-none tracking-tight text-primary ${className}`}
    >
      SkillMap
    </Link>
  );
}
