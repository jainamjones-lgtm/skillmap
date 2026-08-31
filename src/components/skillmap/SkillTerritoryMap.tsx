"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { MapSkill, TerritoryLayout, Tier } from "@/lib/territories";
import { buildMapLayout, demandTier, RING_PAD } from "@/lib/territories";

type Props = {
  skills: MapSkill[];
  /** highlight the skill the surrounding page is about */
  activeSlug?: string;
  /**
   * `embedded` sizes itself to the page flow; `full` fills its parent, for the
   * dedicated skill-map screen.
   */
  variant?: "embedded" | "full";
  /** fires when a territory is opened, for the "+N more" affordance */
  onSelectTerritory?: (territory: TerritoryLayout | null) => void;
};

const TIER_RING: Record<Tier, string> = {
  high: "var(--color-demand-high)",
  medium: "var(--color-demand-medium)",
  low: "var(--color-demand-low)",
};

const TIER_DOT: Record<Tier, string> = {
  high: "bg-demand-high",
  medium: "bg-demand-medium",
  low: "bg-demand-low",
};

const LEGEND: { tier: Tier; label: string }[] = [
  { tier: "high", label: "High demand" },
  { tier: "medium", label: "Medium demand" },
  { tier: "low", label: "Emerging" },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function SkillTerritoryMap({
  skills,
  activeSlug,
  variant = "embedded",
  onSelectTerritory,
}: Props) {
  const titleId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [openTerritory, setOpenTerritory] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);

  const layout = useMemo(() => buildMapLayout(skills), [skills]);
  const { width: W, height: H } = layout;

  const scores = skills.map((s) => s.demandScore);
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;

  /** node centre as a fraction of the canvas, for keyboard reveal */
  const nodeIndex = useMemo(() => {
    const out = new Map<string, { r: number; fx: number; fy: number }>();
    for (const t of layout.territories) {
      for (const node of t.nodes) {
        out.set(node.skill.slug, {
          r: node.r,
          fx: (t.x + node.x) / (W || 1),
          fy: (t.y + node.y) / (H || 1),
        });
      }
    }
    return out;
  }, [layout, W, H]);

  /**
   * Pans a node into view when it is reached by keyboard — the canvas is
   * clipped, so a focused node off-screen would otherwise be invisible.
   */
  const revealNode = useCallback(
    (slug: string) => {
      const vp = viewportRef.current;
      const layer = layerRef.current;
      const hit = nodeIndex.get(slug);
      if (!vp || !layer || !hit) return;
      const box = layer.getBoundingClientRect();
      const view = vp.getBoundingClientRect();
      const cx = box.left + hit.fx * box.width;
      const cy = box.top + hit.fy * box.height;
      const pad = (hit.r / (W || 1)) * box.width + 24;
      setPan((prev) => {
        let { x, y } = prev;
        if (cx - pad < view.left) x += view.left - (cx - pad);
        if (cx + pad > view.right) x -= cx + pad - view.right;
        if (cy - pad < view.top) y += view.top - (cy - pad);
        if (cy + pad > view.bottom) y -= cy + pad - view.bottom;
        return x === prev.x && y === prev.y ? prev : { x, y };
      });
    },
    [nodeIndex, W],
  );

  const chooseTerritory = useCallback(
    (t: TerritoryLayout) => {
      const next = openTerritory === t.name ? null : t.name;
      setOpenTerritory(next);
      onSelectTerritory?.(next ? t : null);
    },
    [openTerritory, onSelectTerritory],
  );

  const stepZoom = (factor: number) => {
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor));
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Links and buttons keep their own clicks; only bare canvas drags.
    if (e.button !== 0 || (e.target as HTMLElement).closest("a, button"))
      return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
    setGrabbing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    setPan({ x: e.clientX - d.x, y: e.clientY - d.y });
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) {
      drag.current = null;
      setGrabbing(false);
    }
  };

  if (skills.length === 0) {
    return <p className="text-sm text-muted">No skills to map yet.</p>;
  }

  /**
   * Percentages of the layer, so the map fits with no JS at all. Fixed to 4
   * decimals: full float precision serializes differently on the server and
   * the client, which React reports as an unpatchable hydration mismatch.
   */
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;
  const pctW = (v: number) => pct(v, W);
  const pctH = (v: number) => pct(v, H);
  /** canvas px → container units, so type scales with the layer */
  const cq = (v: number) => `${((v / W) * 100).toFixed(4)}cqw`;

  return (
    <div
      className={variant === "full" ? "h-full min-h-[520px] w-full" : "w-full"}
    >
      <div
        ref={viewportRef}
        role="group"
        aria-labelledby={titleId}
        className={`map-paper relative flex touch-none overflow-hidden border border-hairline ${
          variant === "full"
            ? "h-full w-full"
            : "aspect-[7/6] w-full rounded-xl sm:aspect-[8/7]"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          cursor: grabbing ? "grabbing" : "grab",
          containerType: "size",
        }}
      >
        <p id={titleId} className="sr-only">
          Skill demand map. {skills.length} skills grouped into{" "}
          {layout.territories.length} territories. Each circle is a skill, sized
          and coloured by how much the market is hiring for it. Use the zoom
          buttons to change scale, drag to pan, and open a skill to see its
          detail.
        </p>

        {/*
          The layer keeps the canvas aspect and shrinks to fit its box, so
          everything inside can be sized in percentages and the map lays out
          correctly before any JavaScript runs. Zoom and pan then ride on top
          as a single composited transform.
        */}
        <div
          ref={layerRef}
          className="relative m-auto"
          style={{
            aspectRatio: `${W} / ${H}`,
            width: `min(100cqw, ${(W / H).toFixed(4)} * 100cqh)`,
            containerType: "size",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: grabbing ? undefined : "transform 200ms ease-out",
          }}
        >
          {layout.territories.map((t) => (
            <div
              key={t.name}
              className={`absolute rounded-full border transition-colors duration-150 ${
                openTerritory === t.name
                  ? "border-primary/40 bg-surface"
                  : "border-hairline bg-surface/45"
              }`}
              style={{
                left: pctW(t.x - t.r),
                top: pctH(t.y - t.r),
                width: pctW(t.r * 2),
                height: pctH(t.r * 2),
              }}
            >
              {/* Territory name sits inside the ring, as in the reference. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-center font-semibold tracking-tight whitespace-nowrap text-muted/70"
                style={{
                  fontSize: cq(25),
                  top: pct(RING_PAD * 0.42, t.r * 2),
                }}
              >
                {t.name.replace(" & ", " · ")}
              </span>

              {t.nodes.map((node) => {
                const isActive = activeSlug === node.skill.slug;
                const ring = TIER_RING[node.tier];
                const tier = demandTier(node.skill.demandScore, min, max);
                const courses = node.skill._count.courses;
                return (
                  <Link
                    key={node.skill.slug}
                    href={`/skill/${node.skill.slug}`}
                    title={node.skill.name}
                    aria-label={`${node.skill.name}. Demand score ${node.skill.demandScore} of 100, ${tier.toLowerCase()}. ${courses} ${courses === 1 ? "course" : "courses"}.`}
                    aria-current={isActive ? "page" : undefined}
                    onFocus={() => revealNode(node.skill.slug)}
                    className={`map-blob absolute flex items-center justify-center rounded-full text-center transition-transform duration-150 ease-out hover:z-20 hover:scale-[1.08] ${
                      node.tier === "high" && !isActive ? "demand-pulse" : ""
                    } ${isActive ? "z-20 scale-[1.12]" : ""}`}
                    style={{
                      // percentages of the territory box, which is square
                      left: pct(t.r + node.x - node.r, t.r * 2),
                      top: pct(t.r + node.y - node.r, t.r * 2),
                      width: pct(node.r, t.r),
                      height: pct(node.r, t.r),
                      background: `linear-gradient(135deg, color-mix(in srgb, ${ring} 22%, transparent), transparent 70%), color-mix(in srgb, ${ring} 9%, var(--color-canvas))`,
                      border: `${node.tier === "high" ? 2 : 1.5}px solid ${ring}`,
                      boxShadow: isActive
                        ? `0 0 0 4px color-mix(in srgb, ${ring} 30%, transparent), 0 12px 32px color-mix(in srgb, ${ring} 25%, transparent)`
                        : undefined,
                    }}
                  >
                    <span
                      className="pointer-events-none leading-tight font-semibold text-ink"
                      style={{
                        fontSize: cq(node.fontSize),
                        maxWidth: pct(node.r * 2 - 8, node.r * 2),
                        overflowWrap: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {node.skill.name}
                    </span>
                  </Link>
                );
              })}

              {t.hidden.length > 0 && (
                <button
                  type="button"
                  aria-pressed={openTerritory === t.name}
                  aria-label={`Show the other ${t.hidden.length} ${t.hidden.length === 1 ? "skill" : "skills"} in ${t.name}`}
                  onClick={() => chooseTerritory(t)}
                  className="map-blob absolute left-1/2 z-10 -translate-x-1/2 rounded-full border border-hairline bg-canvas/90 font-semibold whitespace-nowrap text-muted backdrop-blur-sm transition hover:border-primary hover:text-primary"
                  style={{
                    bottom: pct(RING_PAD / 3, t.r * 2),
                    fontSize: cq(15),
                    padding: `${cq(4)} ${cq(10)}`,
                  }}
                >
                  +{t.hidden.length} more
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Zoom controls — below the sticky site header (z-40). */}
        <div className="surface-card absolute top-4 left-4 z-20 flex flex-col p-1 shadow-lift">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => stepZoom(1.3)}
            disabled={zoom >= MAX_ZOOM}
            className="grid size-8 place-items-center rounded text-ink transition hover:bg-surface-variant disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <span aria-hidden="true" className="my-0.5 h-px bg-hairline" />
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => stepZoom(1 / 1.3)}
            disabled={zoom <= MIN_ZOOM}
            className="grid size-8 place-items-center rounded text-ink transition hover:bg-surface-variant disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-hairline bg-canvas/90 px-3 py-2.5 shadow-lift backdrop-blur-md">
          <h4 className="t-micro text-ink">Demand</h4>
          <ul className="mt-2 flex flex-col gap-1.5">
            {LEGEND.map((l) => (
              <li key={l.tier} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full ${TIER_DOT[l.tier]}`}
                />
                <span className="text-xs text-muted">{l.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
