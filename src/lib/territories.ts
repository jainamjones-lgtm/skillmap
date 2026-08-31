// Normalizes raw Skill.category labels into clean map territories.
// Mapping lives here so seed data stays untouched.

const GROUP: Record<string, string> = {
  "Paid Media": "Paid Media",
  "Creative & Web": "Creative & Web",
  Web: "Creative & Web",
  "Content & Social": "Content & Social",
  Content: "Content & Social",
  "Social Media": "Content & Social",
  "Strategy & Brand": "Strategy & Brand",
  Strategy: "Strategy & Brand",
  Brand: "Strategy & Brand",
  Product: "Strategy & Brand",
  "Lifecycle & Automation": "Lifecycle & Automation",
  Lifecycle: "Lifecycle & Automation",
  Automation: "Lifecycle & Automation",
  Email: "Lifecycle & Automation",
  "Analytics & Data": "Analytics & Data",
  Analytics: "Analytics & Data",
  "AI & Emerging": "AI & Emerging",
  "AI Marketing": "AI & Emerging",
  Growth: "Growth",
};

export function territoryOf(category: string) {
  return GROUP[category] ?? category;
}

export type MapSkill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  demandScore: number;
  description?: string;
  _count: { courses: number };
};

export type Territory = {
  name: string;
  skills: MapSkill[];
  peak: number;
};

export function buildTerritories(skills: MapSkill[]): Territory[] {
  const map = new Map<string, MapSkill[]>();
  for (const s of skills) {
    const key = territoryOf(s.category);
    const list = map.get(key) ?? [];
    list.push(s);
    map.set(key, list);
  }
  const territories = [...map.entries()]
    .map(([name, items]) => {
      const peak = Math.max(...items.map((s) => s.demandScore));
      return { name, skills: items, peak };
    })
    .sort((a, b) => b.peak - a.peak);
  return territories;
}

export function demandTier(score: number, min: number, max: number) {
  const t = max === min ? 0.5 : (score - min) / (max - min);
  // Cuts are deliberately high: the catalogue skews toward in-demand skills,
  // so a low bar would label most of it "high demand" and say nothing.
  if (t >= 0.84) return "Very high demand";
  if (t >= 0.62) return "High demand";
  if (t >= 0.34) return "Moderate demand";
  return "Emerging";
}
/* ------------------------------------------------------------------ *
 * Map layout
 *
 * The map packs every skill as a labelled circle inside its territory
 * ring at a comfortable distance from its neighbours, so the map reads as
 * a map rather than a packed bubble chart.
 * Positions are computed from the data (never hand-placed), so the
 * layout stays correct as skills are added.
 * ------------------------------------------------------------------ */

export type Tier = "high" | "medium" | "low";

export function tierOf(score: number, min: number, max: number): Tier {
  const label = demandTier(score, min, max);
  if (label === "Very high demand" || label === "High demand") return "high";
  if (label === "Moderate demand") return "medium";
  return "low";
}

type SkillNode = {
  skill: MapSkill;
  /** center, in canvas coordinates */
  x: number;
  y: number;
  r: number;
  tier: Tier;
  /** label size in canvas px */
  fontSize: number;
};

export type TerritoryLayout = Territory & {
  x: number;
  y: number;
  r: number;
  nodes: SkillNode[];
  /** skills in this territory beyond the ones drawn as nodes */
  hidden: MapSkill[];
  /** put the name above the ring unless that would collide with the canvas edge */
  labelAbove: boolean;
};

type MapLayout = {
  width: number;
  height: number;
  territories: TerritoryLayout[];
};

const NODE_MIN_R = 28;
const NODE_MAX_R = 56; // wide range so demand differences read at a glance
const NODE_GAP = 17; // nodes float apart rather than packing shoulder to shoulder
export const RING_PAD = 40; // real whitespace inside the ring, as in the reference
const RING_GAP = 56; // territories read as distinct places
const CANVAS_MARGIN = 40;
/**
 * How many skills each territory shows at rest. The reference screen carries
 * one to three nodes per ring; showing all of them at once is what made the
 * map read as a packed bubble chart instead of a map. The remainder stay
 * reachable through the territory itself.
 */
const NODES_PER_TERRITORY = 4;
/** Clusters spread sideways so the finished canvas is landscape, like a map. */
const SPIRAL_SQUASH = 0.5;

type Placed = { x: number; y: number; r: number };

/**
 * Packs circles around the origin, largest first, taking the first slot that
 * clears everything already placed. Walking outward in fine rings with a
 * golden-angle offset keeps successive rings interleaved rather than stacked
 * along one spoke.
 *
 * Unbounded on purpose: the cluster is measured after packing rather than
 * being forced into a guessed radius, which is what previously inflated the
 * rings and shrank the labels to nothing.
 */
function packCluster(radii: number[]) {
  const placed: Placed[] = [];
  for (const r of radii) {
    let spot = { x: 0, y: 0 };
    search: for (let ring = 0; ring < 900; ring++) {
      const dist = ring * 4;
      const steps = ring === 0 ? 1 : Math.max(16, Math.round((2 * Math.PI * dist) / 4));
      for (let step = 0; step < steps; step++) {
        const angle = (step / steps) * Math.PI * 2 + ring * 2.39996;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const clear = placed.every(
          (p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + NODE_GAP,
        );
        if (clear) {
          spot = { x, y };
          break search;
        }
      }
    }
    placed.push({ ...spot, r });
  }
  return placed;
}

/**
 * Label size has to respect the circle, not just the demand score: a node
 * holding "Management" needs a smaller face than one holding "SEO", or the
 * word overflows the circle it sits in.
 */
function labelSize(
  name: string,
  r: number,
  min: number,
  max: number,
  span: number,
  score: number,
) {
  const base = 11 + ((score - min) / span) * 3.5;
  const longestWord = Math.max(...name.split(/[\s/]+/).map((w) => w.length));
  const fits = (r * 2 - 10) / (longestWord * 0.62);
  return Math.max(8, Math.min(base, fits));
}

export function buildMapLayout(skills: MapSkill[]): MapLayout {
  const territories = buildTerritories(skills);
  if (territories.length === 0) return { width: 0, height: 0, territories: [] };

  const scores = skills.map((s) => s.demandScore);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const span = max - min || 1;

  const nodeRadius = (score: number) =>
    NODE_MIN_R + ((score - min) / span) * (NODE_MAX_R - NODE_MIN_R);

  // 1. Pack each cluster on its own, then measure what it actually needs.
  const clusters = territories.map((t) => {
    const ranked = t.skills
      .slice()
      .sort((a, b) => b.demandScore - a.demandScore);
    const ordered = ranked.slice(0, NODES_PER_TERRITORY);
    const hidden = ranked.slice(NODES_PER_TERRITORY);
    const slots = packCluster(ordered.map((s) => nodeRadius(s.demandScore)));

    // Re-centre on the pack's bounding box so the ring sits true.
    const cx = (Math.min(...slots.map((p) => p.x - p.r)) + Math.max(...slots.map((p) => p.x + p.r))) / 2;
    const cy = (Math.min(...slots.map((p) => p.y - p.r)) + Math.max(...slots.map((p) => p.y + p.r))) / 2;
    const r =
      Math.max(...slots.map((p) => Math.hypot(p.x - cx, p.y - cy) + p.r)) + RING_PAD;

    return {
      territory: t,
      r,
      hidden,
      nodes: ordered.map((skill, i) => ({
        skill,
        x: slots[i].x - cx,
        y: slots[i].y - cy,
        r: slots[i].r,
        tier: tierOf(skill.demandScore, min, max),
        fontSize: labelSize(skill.name, slots[i].r, min, max, span, skill.demandScore),
      })),
    };
  });

  // 2. Place the rings, densest first, spiralling out to the first slot that
  //    clears the rings already placed.
  const placed: Placed[] = [];
  const centers = clusters.map((c, i) => {
    if (i === 0) {
      placed.push({ x: 0, y: 0, r: c.r });
      return { x: 0, y: 0 };
    }
    for (let step = 1; step < 60000; step++) {
      const dist = 5 * Math.sqrt(step);
      const angle = step * 0.75;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * SPIRAL_SQUASH;
      const clear = placed.every(
        (p) => Math.hypot(p.x - x, p.y - y) >= p.r + c.r + RING_GAP,
      );
      if (clear) {
        placed.push({ x, y, r: c.r });
        return { x, y };
      }
    }
    placed.push({ x: 0, y: 0, r: c.r });
    return { x: 0, y: 0 };
  });

  // 3. Normalize into a positive canvas, leaving room for outside labels.
  const minX = Math.min(...clusters.map((c, i) => centers[i].x - c.r));
  const maxX = Math.max(...clusters.map((c, i) => centers[i].x + c.r));
  const minY = Math.min(...clusters.map((c, i) => centers[i].y - c.r));
  const maxY = Math.max(...clusters.map((c, i) => centers[i].y + c.r));
  const offsetX = CANVAS_MARGIN - minX;
  const offsetY = CANVAS_MARGIN - minY;

  return {
    width: maxX - minX + CANVAS_MARGIN * 2,
    height: maxY - minY + CANVAS_MARGIN * 2,
    territories: clusters.map((c, i) => {
      const y = centers[i].y + offsetY;
      return {
        ...c.territory,
        x: centers[i].x + offsetX,
        y,
        r: c.r,
        labelAbove: y - c.r > 40,
        nodes: c.nodes,
        hidden: c.hidden,
      };
    }),
  };
}
