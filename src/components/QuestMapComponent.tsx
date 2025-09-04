import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * CodeFly Academy – Quest Map Pack (Production-Ready)
 * ==================================================
 * Hand-off bundle for a senior engineer to drop into any React app.
 * Includes:
 *   • SVG quest map @ 1200×800 with 8 missions (S-curve path)
 *   • Status: completed ✅, current ⚡ (animated ring), locked 🔒
 *   • XP, streaks, badge system + analytics events
 *   • Progress persistence via pluggable DataAdapter (Supabase / REST)
 *   • Export-to-PNG (html-to-image) snapshot for certificates or sharing
 *   • Router hooks for lesson deep-links
 *   • Accessible + dark-theme friendly
 *
 * This single module mirrors a multi-file layout. Split on the ==== markers
 * if you prefer separate files.
 */

// =============================== types.ts ===============================

export type MissionStatus = "completed" | "current" | "locked";
export type IconKey =
  | "castle"
  | "warehouse"
  | "tower"
  | "factory"
  | "lab"
  | "array"
  | "studio"
  | "database";

export interface Mission {
  id: number;             // 1..8 (display order)
  key: string;            // stable key for storage / routing
  name: string;           // display label
  x: number;              // SVG X (0..1200)
  y: number;              // SVG Y (0..800)
  status: MissionStatus;  // completed/current/locked
  icon: IconKey;          // visual icon
  progress?: number;      // 0..1 for current node ring fill
  route?: string;         // optional app route
}

export interface ProgressRecord {
  userId: string;
  courseId: string;                // e.g., "python-9-2025"
  missions: Mission[];             // authoritative ordered array
  xp: number;                      // cumulative points
  streakDays: number;              // consecutive-day streak (UTC roll)
  badges: string[];                // earned badge ids
  updatedAt: string;               // ISO timestamp
}

export interface AnalyticsEvent {
  type:
    | "mission_click"
    | "mission_advance"
    | "progress_update"
    | "xp_awarded"
    | "badge_awarded"
    | "streak_increment"
    | "export_png";
  payload?: Record<string, any>;
}

export const COLORS = {
  bg: "#0b1020",
  pathLocked: "#475569",
  pathComplete: "#22c55e",
  pathCurrent: "#38bdf8",
  nodeLocked: "#94a3b8",
  nodeComplete: "#22c55e",
  nodeCurrent: "#38bdf8",
  label: "#e5e7eb",
  sublabel: "#9ca3af",
};

// Default 8-mission S-curve (1200×800)
export const DEFAULT_MISSIONS: Mission[] = [
  { id: 1, key: "academy",   name: "Operation Beacon",  x: 120,  y: 380, status: "completed", icon: "castle",   route: "/mission/operation-beacon" },
  { id: 2, key: "variables",  name: "Cipher Command", x: 380,  y: 200, status: "completed", icon: "warehouse", route: "/mission/cipher-command" },
  { id: 3, key: "logic",      name: "Ghost Protocol",      x: 600,  y: 180, status: "current",   icon: "tower",    progress: 0.5, route: "/mission/ghost-protocol" },
  { id: 4, key: "loops",      name: "Quantum Breach",     x: 950,  y: 180, status: "locked",    icon: "factory",  route: "/mission/quantum-breach" },
  { id: 5, key: "functions",  name: "Function Lab",     x: 1080, y: 320, status: "locked",    icon: "lab",      route: "/course/5" },
  { id: 6, key: "arrays",     name: "Array Center",     x: 950,  y: 620, status: "locked",    icon: "array",    route: "/course/6" },
  { id: 7, key: "objects",    name: "Object Studio",    x: 620,  y: 660, status: "locked",    icon: "studio",   route: "/course/7" },
  { id: 8, key: "database",   name: "Database Ops",     x: 300,  y: 600, status: "locked",    icon: "database", route: "/course/8" },
];

export const DEFAULT_RECORD = (userId: string, courseId: string): ProgressRecord => ({
  userId,
  courseId,
  missions: DEFAULT_MISSIONS,
  xp: 0,
  streakDays: 0,
  badges: [],
  updatedAt: new Date().toISOString(),
});

// ============================ adapters.ts ============================

/**
 * DataAdapter – pluggable persistence + analytics layer.
 * Swap in SupabaseAdapter or RestAdapter without touching UI.
 */
export interface DataAdapter {
  load(userId: string, courseId: string): Promise<ProgressRecord | null>;
  save(record: ProgressRecord): Promise<void>;
  track?(evt: AnalyticsEvent): void | Promise<void>;
}

/**
 * SupabaseAdapter – expects `@supabase/supabase-js` client instance.
 * SQL schema suggestion (Postgres):
 *
 * create table course_progress (
 *   user_id uuid not null,
 *   course_id text not null,
 *   missions jsonb not null,
 *   xp int not null default 0,
 *   streak_days int not null default 0,
 *   badges jsonb not null default '[]',
 *   updated_at timestamptz not null default now(),
 *   primary key (user_id, course_id)
 * );
 */
export function createSupabaseAdapter(supabase: any): DataAdapter {
  return {
    async load(userId, courseId) {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();
      if (error && (error as any).code !== "PGRST116") throw error; // ignore not-found
      if (!data) return null;
      return {
        userId,
        courseId,
        missions: data.missions as Mission[],
        xp: data.xp,
        streakDays: data.streak_days,
        badges: (data.badges as string[]) ?? [],
        updatedAt: data.updated_at,
      } satisfies ProgressRecord;
    },
    async save(record) {
      const payload = {
        user_id: record.userId,
        course_id: record.courseId,
        missions: record.missions,
        xp: record.xp,
        streak_days: record.streakDays,
        badges: record.badges,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("course_progress")
        .upsert(payload, { onConflict: "user_id,course_id" });
      if (error) throw error;
    },
    track(evt) {
      // Optional: write to a log table or Supabase Analytics/Logflare
      void supabase.from("event_log").insert({
        ts: new Date().toISOString(),
        type: evt.type,
        payload: evt.payload ?? {},
      });
    },
  };
}

/**
 * RestAdapter – if you prefer Next.js API routes or any backend REST.
 */
export function createRestAdapter(baseUrl: string, fetchImpl: typeof fetch = fetch): DataAdapter {
  const j = (r: Response) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)));
  return {
    async load(userId, courseId) {
      const r = await fetchImpl(`${baseUrl}/progress?user=${userId}&course=${courseId}`);
      const d = await j(r);
      return (d as ProgressRecord) ?? null;
    },
    async save(record) {
      await fetchImpl(`${baseUrl}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).then((r) => (r.ok ? undefined : Promise.reject(new Error(`${r.status}`))));
    },
    track(evt) {
      void fetchImpl(`${baseUrl}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evt),
      });
    },
  };
}

// ============================== store.ts ==============================

/** Lightweight reactive store (no external dep).
 *  If you prefer Zustand/Redux, swap this for your preferred store. */

type Listener<T> = (s: T) => void;

export interface QuestState {
  record: ProgressRecord;
}

export interface QuestActions {
  setRecord: (r: ProgressRecord) => void;
  advance: () => void;                           // mark current complete → next current
  setProgress: (p: number) => void;              // update current mission progress 0..1
  addXP: (delta: number) => void;
  addBadge: (badgeId: string) => void;
  incStreak: () => void;
}

export type QuestStore = QuestState & QuestActions & {
  subscribe: (fn: Listener<QuestState>) => () => void;
  getState: () => QuestState;
};

export function createQuestStore(init: ProgressRecord): QuestStore {
  let state: QuestState = { record: init };
  const listeners = new Set<Listener<QuestState>>();
  const notify = () => listeners.forEach((l) => l(state));

  const api: QuestStore = {
    ...state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getState: () => state,

    setRecord(r) { state = { record: { ...r, updatedAt: new Date().toISOString() } }; notify(); },

    advance() {
      const rec = { ...state.record };
      const idx = rec.missions.findIndex((m) => m.status === "current");
      if (idx >= 0) {
        rec.missions[idx] = { ...rec.missions[idx], status: "completed", progress: 1 };
        if (idx + 1 < rec.missions.length) {
          rec.missions[idx + 1] = { ...rec.missions[idx + 1], status: "current", progress: 0 };
          // gamification: award XP on advance
          rec.xp += 50; // configurable
        } else {
          rec.badges = Array.from(new Set([...(rec.badges ?? []), "course_complete"]));
          rec.xp += 100; // completion bonus
        }
      }
      state = { record: { ...rec, updatedAt: new Date().toISOString() } };
      notify();
    },

    setProgress(p) {
      const rec = { ...state.record };
      const idx = rec.missions.findIndex((m) => m.status === "current");
      if (idx >= 0) rec.missions[idx] = { ...rec.missions[idx], progress: Math.max(0, Math.min(1, p)) };
      state = { record: rec }; notify();
    },

    addXP(delta) { state = { record: { ...state.record, xp: Math.max(0, state.record.xp + delta) } }; notify(); },

    addBadge(badgeId) {
      const set = new Set([...(state.record.badges ?? [])]);
      set.add(badgeId);
      state = { record: { ...state.record, badges: Array.from(set) } };
      notify();
    },

    incStreak() {
      state = { record: { ...state.record, streakDays: (state.record.streakDays ?? 0) + 1 } };
      notify();
    },
  };

  return api;
}

// ============================ export.ts =============================

/** Export the rendered map container as PNG (client-side only). */
export async function exportToPng(node: HTMLElement, filename = "codefly-quest-map.png") {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#0b1020" });
  const a = document.createElement("a");
  a.href = dataUrl; a.download = filename; a.click();
}

// =========================== QuestMap.tsx ============================

// Optional lifelike terrain + structures layer ------------------------
export interface Structure {
  id: string;
  x: number; // 0..1200
  y: number; // 0..800
  w: number; // px width (render size)
  h: number; // px height (render size)
  label?: string;
  img: string; // sprite URL (PNG with transparency)
}

function StructuresLayer({ items }: { items: Structure[] }) {
  return (
    <g>
      {items.map((s) => (
        <image key={s.id} href={s.img} x={s.x - s.w / 2} y={s.y - s.h / 2} width={s.w} height={s.h} opacity={0.95} />
      ))}
    </g>
  );
}

// ---- Context wires UI ↔ store ↔ adapter (DECLARED ONCE) ----
interface QuestContextValue {
  store: QuestStore;
  adapter?: DataAdapter;
}
const QuestContext = createContext<QuestContextValue | null>(null);
export const useQuest = () => {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used inside <QuestMapProvider>");
  return ctx;
};

export function QuestMapProvider({
  adapter,
  userId,
  courseId,
  initialRecord,
  children,
}: {
  adapter?: DataAdapter;
  userId: string;
  courseId: string;
  initialRecord?: ProgressRecord;
  children: React.ReactNode;
}) {
  const storeRef = useRef<QuestStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createQuestStore(initialRecord ?? DEFAULT_RECORD(userId, courseId));
  }

  // Load from persistence on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!adapter) return;
      const loaded = await adapter.load(userId, courseId).catch(() => null);
      if (!cancelled && loaded) storeRef.current!.setRecord(loaded);
    })();
    return () => { cancelled = true; };
  }, [adapter, userId, courseId]);

  // Auto-save when record changes (debounced)
  useEffect(() => {
    if (!adapter) return;
    const saveRef: { t?: number } = {};
    const unsub = storeRef.current!.subscribe(async (s) => {
      const rec = s.record;
      if (typeof window === "undefined") { await adapter.save(rec); return; }
      if (saveRef.t) window.clearTimeout(saveRef.t);
      saveRef.t = window.setTimeout(() => adapter.save(rec), 400);
    });
    return () => unsub();
  }, [adapter]);

  const value = useMemo(() => ({ store: storeRef.current!, adapter }), [adapter]);
  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
}

// ---------- Geometry helpers ----------
const curve = (a: Mission, b: Mission) => {
  const dx = b.x - a.x;
  const cp1 = { x: a.x + dx * 0.5, y: a.y };
  const cp2 = { x: a.x + dx * 0.5, y: b.y };
  return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
};

const segmentStyle = (from: Mission, to: Mission) => {
  if (to.status === "completed") return { color: COLORS.pathComplete, mode: "complete" as const };
  if (from.status === "completed" && to.status !== "locked") return { color: COLORS.pathCurrent, mode: "current" as const };
  if (from.status === "completed" && to.status === "locked") return { color: COLORS.pathLocked, mode: "locked-next" as const };
  if (from.status === "current") return { color: COLORS.pathCurrent, mode: "current" as const };
  return { color: COLORS.pathLocked, mode: "locked" as const };
};

// ---------- Icons ----------
function Icon({ type, size = 22, color = "currentColor" }: { type: IconKey; size?: number; color?: string }) {
  const c = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (type) {
    case "castle":
      return (<g><rect x={-size*0.4} y={-size*0.1} width={size*0.8} height={size*0.5} rx={2} {...c}/><path d={`M ${-size*0.4} ${-size*0.1} v-${size*0.25} h${size*0.25} v${size*0.12} h${size*0.1} v-${size*0.12} h${size*0.25} v${size*0.25}`} {...c}/><path d={`M ${-size*0.2} ${size*0.4} v-${size*0.2} h${size*0.4} v${size*0.2}`} {...c}/><path d={`M ${-size*0.05} ${-size*0.35} l${size*0.25} ${size*0.1} l-${size*0.25} ${size*0.1} z`} fill={color}/></g>);
    case "warehouse":
      return (<g><path d={`M ${-size*0.45} ${-size*0.05} L 0 ${-size*0.45} L ${size*0.45} ${-size*0.05}`} {...c}/><rect x={-size*0.45} y={-size*0.05} width={size*0.9} height={size*0.5} rx={2} {...c}/><rect x={-size*0.3} y={size*0.05} width={size*0.25} height={size*0.15} {...c}/><rect x={size*0.05} y={size*0.05} width={size*0.25} height={size*0.15} {...c}/></g>);
    case "tower":
      return (<g><rect x={-size*0.2} y={-size*0.45} width={size*0.4} height={size*0.75} rx={2} {...c}/><path d={`M ${-size*0.2} ${-size*0.45} h${size*0.4} l-${size*0.2} -${size*0.2} z`} {...c}/><path d={`M 0 ${-size*0.05} l${size*0.22} -${size*0.22}`} {...c}/><path d={`M 0 ${-size*0.05} l-${size*0.22} -${size*0.22}`} {...c}/></g>);
    case "factory":
      return (<g><rect x={-size*0.45} y={-size*0.05} width={size*0.9} height={size*0.5} rx={2} {...c}/><rect x={-size*0.4} y={-size*0.25} width={size*0.2} height={size*0.2} {...c}/><circle cx={size*0.2} cy={size*0.2} r={size*0.12} {...c}/><path d={`M ${size*0.2} ${size*0.2} m -${size*0.12} 0 a ${size*0.12} ${size*0.12} 0 0 0 ${size*0.24} 0`} strokeDasharray="2 4" {...c}/></g>);
    case "lab":
      return (<g><path d={`M ${-size*0.2} ${-size*0.38} v${size*0.25} l-${size*0.18} ${size*0.28} h${size*0.76} l-${size*0.18} -${size*0.28} v-${size*0.25}`} {...c}/><path d={`M ${-size*0.2} ${-size*0.13} h${size*0.4}`} {...c}/><path d={`M ${-size*0.05} ${-size*0.38} h${size*0.1}`} {...c}/></g>);
    case "array":
      return (<g>{[0,1,2].map(r=>[0,1,2].map(col=>(<rect key={`${r}-${col}`} x={-size*0.36 + col*(size*0.24)} y={-size*0.36 + r*(size*0.24)} width={size*0.18} height={size*0.18} {...c}/>)))}<text x={size*0.5} y={size*0.15} fontSize={size*0.6} fill={color} fontWeight={700}>[]</text></g>);
    case "studio":
      return (<g><rect x={-size*0.45} y={-size*0.25} width={size*0.9} height={size*0.5} rx={4} {...c}/><path d={`M ${-size*0.25} ${-size*0.25} v-${size*0.15}`} {...c}/><path d={`M ${size*0.25} ${-size*0.25} v-${size*0.15}`} {...c}/><text x={0} y={size*0.1} fontSize={size*0.7} textAnchor="middle" fill={color} fontWeight={700}>{"{}"}</text></g>);
    case "database":
      return (<g><ellipse cx={0} cy={-size*0.35} rx={size*0.35} ry={size*0.14} {...c}/><rect x={-size*0.35} y={-size*0.35} width={size*0.7} height={size*0.6} rx={6} {...c}/><ellipse cx={0} cy={size*0.25} rx={size*0.35} ry={size*0.14} {...c}/></g>);
  }
}

// ---------- Node (medallion) ----------
function MissionNode({ mission, index, onClick }: { mission: Mission; index: number; onClick?: (m: Mission) => void; }) {
  const size = 64; const radius = size/2; const ring = radius + 8; const circumference = 2 * Math.PI * ring;
  const ringColor = mission.status === "completed" ? COLORS.nodeComplete : mission.status === "current" ? COLORS.nodeCurrent : COLORS.nodeLocked;
  const badge = mission.status === "completed" ? "✅" : mission.status === "current" ? "⚡" : "🔒";
  const progress = mission.status === "current" ? Math.max(0, Math.min(1, mission.progress ?? 0)) : mission.status === "completed" ? 1 : 0;
  const dash = circumference * progress;
  return (
    <g transform={`translate(${mission.x}, ${mission.y})`} className="cursor-pointer" onClick={() => onClick?.(mission)}>
      <circle r={ring + 12} fill="transparent" />
      <circle r={ring} stroke={COLORS.pathLocked} strokeOpacity={0.3} strokeWidth={6} fill="transparent" />
      <circle r={ring} stroke={ringColor} strokeWidth={6} strokeDasharray={`${dash} ${circumference - dash}`} fill="transparent" className={mission.status === "current" ? "animate-[spin_6s_linear_infinite]" : ""} style={{ transformOrigin: "center" }} />
      <g filter={mission.status !== "locked" ? "url(#glow)" : undefined}>
        <circle r={radius} fill="#0f172a" stroke={ringColor} strokeWidth={3} />
        <g transform="translate(0,-2)"><Icon type={mission.icon} size={24} color={COLORS.label} /></g>
        <rect x={-10} y={radius - 18} rx={6} ry={6} width={20} height={16} fill="#111827" stroke={ringColor} strokeWidth={1} />
        <text x={0} y={radius - 6} textAnchor="middle" fontSize={11} fill={COLORS.label} fontWeight={700}>{index + 1}</text>
      </g>
      <g transform={`translate(${radius - 6}, ${-radius + 6})`}>
        <circle r={10} fill="#111827" stroke={ringColor} strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" fontSize={12} fill={COLORS.label}>{badge}</text>
      </g>
      <g transform={`translate(0, ${radius + 24})`}>
        <rect x={-84} y={-18} rx={8} ry={8} width={168} height={28} fill="#0b1224" stroke="#1f2937" />
        <text x={0} y={2} textAnchor="middle" fontSize={12} fill={COLORS.label} fontWeight={600}>{mission.name}</text>
      </g>
      <title>{mission.name} — {mission.status.toUpperCase()}</title>
    </g>
  );
}

function PathSegments({ missions }: { missions: Mission[] }) {
  const segments = useMemo(() => missions.slice(0, -1).map((m, i) => ({ from: m, to: missions[i+1], d: curve(m, missions[i+1]) })), [missions]);
  return (
    <g>
      {segments.map((s, i) => {
        const st = segmentStyle(s.from, s.to); const width = 6; const dashArray = "10 8"; const isCurrent = st.mode === "current" || st.mode === "locked-next";
        return (
          <g key={i}>
            <path d={s.d} stroke={COLORS.pathLocked} strokeOpacity={0.25} strokeWidth={width} fill="none" />
            <path d={s.d} stroke={st.color} strokeWidth={width} fill="none" strokeDasharray={dashArray} filter={st.mode === "complete" ? "url(#glowBright)" : undefined} opacity={st.mode === "locked" ? 0.5 : 1} />
            {isCurrent && (<path d={s.d} stroke={COLORS.pathCurrent} strokeWidth={width} fill="none" strokeDasharray="12 10" className="animate-[dashmove_2.2s_linear_infinite]" style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.7))" }} />)}
          </g>
        );
      })}
    </g>
  );
}

export function CodeFlyQuestMap({
  backgroundImageUrl,
  onNodeClick,
  missionsOverride,
  structures = [],
  backgroundFit = "cover",
}: {
  backgroundImageUrl?: string;                  // lifelike terrain PNG
  onNodeClick?: (m: Mission) => void;
  missionsOverride?: Mission[];                 // override store missions
  structures?: Structure[];                     // building sprites
  backgroundFit?: "cover" | "contain";          // how to fit background image
}) {
  const { store } = useQuest();
  const [snap, setSnap] = useState(store.getState());
  useEffect(() => store.subscribe((s) => setSnap(s)), [store]);
  const missions = missionsOverride ?? snap.record.missions;

  const currentIndex = useMemo(() => Math.max(0, missions.findIndex((m) => m.status === "current")), [missions]);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-800">
        {backgroundImageUrl ? (
          <img src={backgroundImageUrl} alt="Fantasy terrain" className={`absolute inset-0 w-full h-full object-${backgroundFit} opacity-95`} />
        ) : (
          <div className="absolute inset-0" style={{ background: "radial-gradient(1200px 800px at 60% 20%, #0e1a36 0%, #091022 60%, #070b17 100%)" }} />
        )}

        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4"/></filter>
            <filter id="glowBright" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22c55e" floodOpacity="0.9"/></filter>
          </defs>

          {/* lifelike buildings/structures below paths/nodes for depth */}
          {structures.length > 0 && <StructuresLayer items={structures} />}

          <PathSegments missions={missions} />
          {missions.map((m, idx) => (
            <MissionNode key={m.id} mission={m} index={idx} onClick={(n) => onNodeClick?.(n)} />
          ))}

          {/* Legend */}
          <g transform="translate(1040, 40)">
            <rect x={-130} y={-24} width={240} height={112} rx={12} fill="#0b1224" opacity={0.85} stroke="#1f2937" />
            <text x={-114} y={0} fill={COLORS.label} fontWeight={700} fontSize={14}>Legend</text>
            <g transform="translate(-114, 16)"><circle cx={0} cy={0} r={8} fill="#0f172a" stroke={COLORS.nodeComplete} strokeWidth={3} /><text x={14} y={4} fill={COLORS.label} fontSize={12}>Completed</text></g>
            <g transform="translate(-114, 36)"><circle cx={0} cy={0} r={8} fill="#0f172a" stroke={COLORS.nodeCurrent} strokeWidth={3} /><text x={14} y={4} fill={COLORS.label} fontSize={12}>Current</text></g>
            <g transform="translate(-114, 56)"><circle cx={0} cy={0} r={8} fill="#0f172a" stroke={COLORS.nodeLocked} strokeWidth={3} /><text x={14} y={4} fill={COLORS.label} fontSize={12}>Locked</text></g>
            <g transform="translate(-114, 76)">
              <rect x={-8} y={-8} width={16} height={16} fill="#64748b" opacity={0.8} /><text x={14} y={4} fill={COLORS.label} fontSize={12}>Structure</text>
            </g>
          </g>
        </svg>

        {/* HUD */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 text-slate-200 text-sm">
          <span className="font-semibold">CodeFly Academy</span>
          <span className="opacity-70">•</span>
          <span>Mission {currentIndex + 1} / {missions.length}</span>
          <span className="opacity-70">•</span>
          <span>{snap.record.xp} XP</span>
          <span className="opacity-70">•</span>
          <span>Streak {snap.record.streakDays}d</span>
        </div>
      </div>

      <style>{`@keyframes dashmove { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 36; } }`}</style>
    </div>
  );
}

// ============================ Demo / Hand-off ============================

/**
 * QuestMapDemo – drop-in page that demonstrates full stack:
 *   - Provider with Supabase or REST adapter
 *   - Export-to-PNG
 *   - Advance/reset, set progress, route mapping
 */
export default function QuestMapDemo({
  adapter,
  userId = "demo-user-1",
  courseId = "python-9-2025",
  backgroundImageUrl,
  routeTo = (path: string) => alert(`Route → ${path}`),
}: {
  adapter?: DataAdapter;
  userId?: string;
  courseId?: string;
  backgroundImageUrl?: string;
  routeTo?: (path: string) => void;
}) {
  const initial = DEFAULT_RECORD(userId, courseId);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <QuestMapProvider adapter={adapter} userId={userId} courseId={courseId} initialRecord={initial}>
      <DemoInner backgroundImageUrl={backgroundImageUrl} routeTo={routeTo} containerRef={containerRef} />
    </QuestMapProvider>
  );
}

// Helper functions for lesson details
function getLessonDescription(key: string): string {
  const descriptions: Record<string, string> = {
    academy: "Begin your tactical programming training at the CodeFly Academy. Master Python fundamentals, variables, and basic syntax. Learn the core concepts that form the foundation of all programming operations.",
    variables: "Infiltrate the Variable Storage Facility to understand data management. Learn how to store, retrieve, and manipulate different types of information in your programs using Python variables and data types.",
    logic: "Scale the Logic Processing Tower to master decision-making in code. Implement if-else statements, boolean logic, and conditional operations to create programs that respond intelligently to different scenarios.",
    loops: "Navigate the Loop Systems Building to automate repetitive tasks. Master for loops, while loops, and iteration techniques to write efficient code that processes large amounts of data.",
    functions: "Breach the Function Development Lab to learn code organization. Create reusable functions, understand parameters and return values, and build modular programs that are easy to maintain and extend.",
    arrays: "Secure the Array Processing Center to handle collections of data. Master lists, arrays, and data structures to organize and manipulate multiple pieces of information efficiently.",
    objects: "Access the Object Design Studio to model real-world entities. Learn object-oriented programming concepts including classes, objects, methods, and properties to create complex applications.",
    database: "Penetrate the Database Operations Center for advanced data management. Learn to store, query, and manipulate large datasets using database concepts and SQL operations."
  };
  return descriptions[key] || "Classified mission details. Advance to previous missions to unlock intelligence briefing.";
}

function getLessonSkills(key: string): string {
  const skills: Record<string, string> = {
    academy: "Python Syntax, Print Statements, Comments",
    variables: "Data Types, Variables, String Operations",
    logic: "If-Else, Boolean Logic, Conditionals",
    loops: "For Loops, While Loops, Iteration",
    functions: "Function Definition, Parameters, Return Values",
    arrays: "Lists, Arrays, Data Structures",
    objects: "Classes, Objects, Methods, OOP",
    database: "SQL, Databases, Data Queries"
  };
  return skills[key] || "Classified Skills";
}

function getLessonDuration(key: string): string {
  const durations: Record<string, string> = {
    academy: "45-60 min",
    variables: "50-65 min", 
    logic: "60-75 min",
    loops: "65-80 min",
    functions: "70-85 min",
    arrays: "60-75 min",
    objects: "80-95 min",
    database: "90-105 min"
  };
  return durations[key] || "Variable Duration";
}

function formatBadgeName(badge: string): string {
  const names: Record<string, string> = {
    course_complete: "Mission Complete",
    speed_runner: "Speed Operator", 
    first_mission: "Tactical Initiate",
    perfect_score: "Elite Operative"
  };
  return names[badge] || badge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function DemoInner({ backgroundImageUrl, routeTo, containerRef }: { backgroundImageUrl?: string; routeTo: (p: string) => void; containerRef: React.RefObject<HTMLDivElement | null>; }) {
  const { store, adapter } = useQuest();
  const [snap, setSnap] = useState(store.getState());
  useEffect(() => store.subscribe((s) => setSnap(s)), [store]);

  const currentIdx = useMemo(() => snap.record.missions.findIndex((m) => m.status === "current"), [snap]);

  const onNodeClick = useCallback((m: Mission) => {
    adapter?.track?.({ type: "mission_click", payload: { key: m.key } });
    if (m.status === "locked") return alert("This mission is locked.");
    if (m.route) routeTo(m.route);
  }, [adapter, routeTo]);

  return (
    <div className="min-h-screen bg-black text-slate-100" ref={containerRef}>
      {/* SPY INTELLIGENCE CENTER HEADER */}
      <div className="relative bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-700/50 shadow-2xl">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-2xl">🕵️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 tracking-wider">
                  🔴 CLASSIFIED INTELLIGENCE CENTER
                </h1>
                <p className="text-red-200 font-mono text-sm">
                  OPERATION: CODEFLY • CLEARANCE LEVEL: TOP SECRET • STATUS: ACTIVE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-red-300 font-mono">AGENT ID: {snap.record.userId}</div>
                <div className="text-xs text-red-300 font-mono">MISSION: {snap.record.courseId}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => store.setRecord(DEFAULT_RECORD(snap.record.userId, snap.record.courseId))} className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 active:scale-95 text-sm border border-red-600 font-mono">🔄 RESET</button>
                <button onClick={() => { store.advance(); adapter?.track?.({ type: "mission_advance" }); }} className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-sm border border-emerald-600 font-mono">✅ ADVANCE</button>
                <button onClick={async () => { if (!containerRef.current) return; await exportToPng(containerRef.current, "intelligence-report.png"); adapter?.track?.({ type: "export_png" }); }} className="px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 active:scale-95 text-sm border border-blue-600 font-mono">📊 EXPORT</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE STATUS BAR */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-green-400">SECURE CONNECTION ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-amber-400">SURVEILLANCE MODE: ENABLED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-red-400">THREAT LEVEL: MINIMAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-blue-400">INTEL FEEDS: {Math.floor(Math.random() * 50) + 10} ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN INTELLIGENCE OPERATIONS CENTER */}
      <div className="p-6 space-y-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* PRIMARY TACTICAL MAP - Takes up 3/4 of the space */}
            <div className="xl:col-span-3">
              <div className="bg-slate-900 rounded-xl border border-red-700/30 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-900/50 to-slate-800/50 p-4 border-b border-red-700/30">
                  <h2 className="font-mono text-red-300 font-bold flex items-center gap-2">
                    🗺️ TACTICAL OPERATIONS MAP
                    <span className="text-xs bg-red-700 px-2 py-1 rounded">LIVE</span>
                  </h2>
                </div>
                <div className="relative">
                  <CodeFlyQuestMap backgroundImageUrl={backgroundImageUrl} onNodeClick={onNodeClick} />
                  {/* Tactical Overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-red-600/50">
                    <div className="text-xs font-mono text-red-300 space-y-1">
                      <div>📍 COORDINATES: {Math.floor(Math.random() * 180) - 90}°N, {Math.floor(Math.random() * 360) - 180}°E</div>
                      <div>🌡️ TEMP: {Math.floor(Math.random() * 30) - 5}°C</div>
                      <div>💨 WIND: {Math.floor(Math.random() * 20)}km/h {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]}</div>
                      <div>👁️ VISIBILITY: {Math.floor(Math.random() * 50) + 50}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTELLIGENCE SIDE PANEL */}
            <div className="xl:col-span-1 space-y-4">
              
              {/* MISSION STATUS */}
              <div className="bg-slate-900 rounded-xl border border-emerald-600/30 shadow-xl">
                <div className="bg-gradient-to-r from-emerald-900/50 to-slate-800/50 p-3 border-b border-emerald-600/30">
                  <h3 className="font-mono text-emerald-300 font-bold text-sm">🎯 MISSION STATUS</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-xs">
                    <div className="text-emerald-400 font-mono mb-1">CURRENT OPERATION:</div>
                    <div className="text-slate-300 font-semibold">{snap.record.missions[currentIdx]?.name || "STANDBY"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono">COMPLETION:</span>
                      <span className="text-emerald-400 font-mono">{Math.round((snap.record.missions[currentIdx]?.progress ?? 0) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(snap.record.missions[currentIdx]?.progress ?? 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={(snap.record.missions[currentIdx]?.progress ?? 0) * 100} 
                    onChange={(e) => store.setProgress(parseInt(e.target.value, 10) / 100)} 
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* AGENT STATISTICS */}
              <div className="bg-slate-900 rounded-xl border border-blue-600/30 shadow-xl">
                <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 p-3 border-b border-blue-600/30">
                  <h3 className="font-mono text-blue-300 font-bold text-sm">👤 AGENT PROFILE</h3>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-slate-400 font-mono">XP:</div>
                      <div className="text-blue-400 font-bold">{snap.record.xp}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono">STREAK:</div>
                      <div className="text-orange-400 font-bold">{snap.record.streakDays} days</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono">BADGES:</div>
                      <div className="text-purple-400 font-bold">{snap.record.badges?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono">MISSIONS:</div>
                      <div className="text-emerald-400 font-bold">{snap.record.missions.filter(m => m.status === 'completed').length}/8</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME INTELLIGENCE FEED */}
              <div className="bg-slate-900 rounded-xl border border-amber-600/30 shadow-xl">
                <div className="bg-gradient-to-r from-amber-900/50 to-slate-800/50 p-3 border-b border-amber-600/30">
                  <h3 className="font-mono text-amber-300 font-bold text-sm">📡 INTEL FEED</h3>
                </div>
                <div className="p-3 max-h-48 overflow-y-auto">
                  <div className="space-y-2 text-xs">
                    {[
                      "📊 Data packet intercepted from server node 7",
                      "🔐 Encryption algorithm updated successfully", 
                      "⚡ System performance optimized by 23%",
                      "🛡️ Security protocols activated",
                      "📈 Mission efficiency increased to 94%",
                      "🔍 Surveillance data analyzed",
                      "💾 Backup systems synchronized",
                      "🎯 Target objectives recalibrated"
                    ].map((msg, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-slate-800/50 rounded border-l-2 border-amber-500/30">
                        <div className="text-amber-400 font-mono text-xs">
                          {new Date(Date.now() - i * 1000 * 60 * Math.floor(Math.random() * 10)).toLocaleTimeString()}
                        </div>
                        <div className="text-slate-300 flex-1">{msg}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLASSIFIED INTELLIGENCE DOSSIERS */}
      <div className="px-6 pb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-r from-red-950/50 via-slate-900/50 to-red-950/50 rounded-xl border border-red-700/30 p-6 mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 font-mono tracking-wider flex items-center gap-3">
              🔒 CLASSIFIED OPERATION DOSSIERS
              <span className="text-sm bg-red-700 px-3 py-1 rounded-full animate-pulse">TOP SECRET</span>
            </h2>
            <p className="text-red-200 font-mono text-sm">CLEARANCE LEVEL: ULTRA • EYES ONLY • CODEWORD: BLACKOPS</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {snap.record.missions.map((mission, idx) => (
              <div key={mission.id} className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                mission.status === 'completed' ? 'border-green-500/50 bg-gradient-to-br from-green-900/30 via-slate-900 to-black shadow-green-500/20' :
                mission.status === 'current' ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/30 via-slate-900 to-black shadow-blue-500/20 animate-pulse' :
                'border-red-500/50 bg-gradient-to-br from-red-900/30 via-slate-900 to-black shadow-red-500/20'
              } shadow-2xl`}>
                
                {/* CLASSIFIED HEADER */}
                <div className={`p-4 border-b ${
                  mission.status === 'completed' ? 'border-green-500/30 bg-green-950/20' :
                  mission.status === 'current' ? 'border-blue-500/30 bg-blue-950/20' :
                  'border-red-500/30 bg-red-950/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                      mission.status === 'completed' ? 'bg-green-600 text-white' :
                      mission.status === 'current' ? 'bg-blue-600 text-white animate-spin' :
                      'bg-red-600 text-white'
                    }`}>
                      {mission.status === 'completed' ? '✓' : 
                       mission.status === 'current' ? '⚡' : '🔒'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      mission.status === 'completed' ? 'bg-green-600 text-green-100' :
                      mission.status === 'current' ? 'bg-blue-600 text-blue-100' :
                      'bg-red-600 text-red-100'
                    }`}>
                      {mission.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white font-mono tracking-wider text-sm">
                    OPERATION: {mission.name.toUpperCase()}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    CLASSIFICATION: {['RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP SECRET'][Math.floor(Math.random() * 4)]}
                  </div>
                </div>

                {/* MISSION DETAILS */}
                <div className="p-4 space-y-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-slate-400 text-xs font-mono mb-2">📋 MISSION BRIEFING:</div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {getLessonDescription(mission.key)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 rounded p-2 border border-slate-600/30">
                      <div className="text-amber-400 font-mono">🎯 OBJECTIVES:</div>
                      <div className="text-slate-300">{getLessonSkills(mission.key)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 border border-slate-600/30">
                      <div className="text-amber-400 font-mono">⏱️ DURATION:</div>
                      <div className="text-slate-300">{getLessonDuration(mission.key)}</div>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-slate-400 text-xs font-mono mb-2">🛡️ SECURITY LEVEL:</div>
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map(level => (
                        <div key={level} className={`w-4 h-2 rounded-full ${
                          level <= (mission.id % 3 + 2) ? 'bg-red-500' : 'bg-slate-600'
                        }`}></div>
                      ))}
                      <span className="text-red-400 font-mono text-xs ml-2">LEVEL {mission.id % 3 + 2}</span>
                    </div>
                  </div>

                  {mission.status === 'completed' && (
                    <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-2">
                      <div className="text-green-400 font-mono text-xs flex items-center gap-2">
                        ✅ MISSION ACCOMPLISHED
                        <span className="text-green-300">• DEBRIEFING COMPLETE</span>
                      </div>
                    </div>
                  )}

                  {mission.status === 'current' && (
                    <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-2">
                      <div className="text-blue-400 font-mono text-xs flex items-center gap-2">
                        ⚡ OPERATION IN PROGRESS
                        <span className="text-blue-300">• ACTIVE</span>
                      </div>
                    </div>
                  )}

                  {mission.status === 'locked' && (
                    <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-2">
                      <div className="text-red-400 font-mono text-xs flex items-center gap-2">
                        🔒 CLASSIFIED ACCESS REQUIRED
                        <span className="text-red-300">• PENDING CLEARANCE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TACTICAL CORNER OVERLAY */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded p-2 border border-red-500/30">
                  <div className="text-red-400 font-mono text-xs">#{mission.id.toString().padStart(3, '0')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPY COMMENDATIONS & CLASSIFIED BADGES */}
      <div className="px-6 pb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-r from-amber-950/50 via-slate-900/50 to-amber-950/50 rounded-xl border border-amber-700/30 p-6 mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 font-mono tracking-wider flex items-center gap-3">
              🎖️ OPERATIVE COMMENDATIONS & BADGES
              <span className="text-sm bg-amber-700 px-3 py-1 rounded-full">CLASSIFIED</span>
            </h2>
            <p className="text-amber-200 font-mono text-sm">SERVICE RECORD • DISTINGUISHED OPERATIONS • FIELD AWARDS</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {snap.record.badges?.length ? snap.record.badges.map((badge, index) => (
              <div key={badge} className="group relative overflow-hidden bg-gradient-to-br from-amber-900/30 via-slate-900 to-black rounded-xl border-2 border-amber-500/50 shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-amber-500/30">
                
                {/* BADGE HEADER */}
                <div className="bg-gradient-to-r from-amber-900/50 to-slate-800/50 p-4 border-b border-amber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-amber-400 font-mono text-xs">BADGE #{(index + 1).toString().padStart(3, '0')}</div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-pulse">🏅</div>
                    <div className="font-bold text-amber-200 font-mono text-sm tracking-wider">
                      {formatBadgeName(badge).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* BADGE DETAILS */}
                <div className="p-4 space-y-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-slate-400 text-xs font-mono mb-2">📋 CITATION:</div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Distinguished service in tactical programming operations. Exceptional performance under classified conditions.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 rounded p-2 border border-slate-600/30">
                      <div className="text-amber-400 font-mono">🗓️ AWARDED:</div>
                      <div className="text-slate-300">
                        {new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 border border-slate-600/30">
                      <div className="text-amber-400 font-mono">⭐ RANK:</div>
                      <div className="text-slate-300">
                        {['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)]}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-2">
                    <div className="text-amber-400 font-mono text-xs flex items-center gap-2">
                      🎖️ COMMENDATION APPROVED
                      <span className="text-amber-300">• OFFICIAL</span>
                    </div>
                  </div>
                </div>

                {/* SECURITY SEAL */}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 border border-amber-500/30">
                  <div className="text-amber-400 text-xs">🔐</div>
                </div>
              </div>
            )) : (
              // NO BADGES PLACEHOLDER
              <div className="col-span-full">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-xl border-2 border-slate-600 p-8 text-center">
                  <div className="text-6xl mb-4 opacity-30">🎖️</div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2 font-mono">NO COMMENDATIONS EARNED</h3>
                  <p className="text-slate-500 font-mono text-sm">
                    COMPLETE CLASSIFIED OPERATIONS TO EARN DISTINGUISHED SERVICE BADGES
                  </p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['🏅 FIRST MISSION', '⚡ SPEED DEMON', '🎯 PERFECT AIM', '🔥 HOT STREAK'].map((badge, i) => (
                      <div key={i} className="bg-slate-800/30 rounded-lg p-2 border border-slate-600/30">
                        <div className="text-xs text-slate-500 font-mono">{badge}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SPY OPERATIONS FOOTER */}
      <footer className="bg-gradient-to-r from-red-950/80 via-black to-red-950/80 border-t-2 border-red-700/50 py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            {/* OPERATIONAL STATUS */}
            <div className="space-y-3">
              <h3 className="text-red-300 font-mono font-bold text-sm tracking-wider">🚨 OPERATIONAL STATUS</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono">SYSTEMS ONLINE</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono">SECURE COMMS ACTIVE</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono">MISSION SYNC ENABLED</span>
                </div>
              </div>
            </div>

            {/* MISSION INSTRUCTIONS */}
            <div className="space-y-3">
              <h3 className="text-blue-300 font-mono font-bold text-sm tracking-wider">📋 TACTICAL PROTOCOLS</h3>
              <div className="space-y-1 text-xs text-slate-400">
                <p className="font-mono">🎯 Click mission nodes to initiate operations</p>
                <p className="font-mono">⚡ Progress auto-synced with HQ database</p>
                <p className="font-mono">🔐 All data encrypted & classified</p>
              </div>
            </div>

            {/* SECURITY CLEARANCE */}
            <div className="space-y-3">
              <h3 className="text-amber-300 font-mono font-bold text-sm tracking-wider">🔒 SECURITY CLEARANCE</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-red-950/30 border border-red-600/30 rounded p-2">
                  <div className="text-red-300 font-mono">CLASSIFICATION: TOP SECRET</div>
                </div>
                <div className="text-slate-400 font-mono">
                  AUTHORIZED PERSONNEL ONLY
                </div>
                <div className="text-slate-500 font-mono text-xs">
                  SESSION ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* BOTTOM SECURITY BAR */}
          <div className="mt-8 pt-4 border-t border-red-700/30">
            <div className="flex items-center justify-center gap-4 text-xs text-red-300 font-mono">
              <span>🛡️ CODEFLY INTELLIGENCE</span>
              <span>•</span>
              <span>🔴 CLASSIFIED OPERATIONS</span>
              <span>•</span>
              <span>⚡ LIVE SYSTEM</span>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500 font-mono">
              UNAUTHORIZED ACCESS WILL BE PROSECUTED • ALL ACTIVITIES MONITORED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================ tests (exported) ============================
// NOTE: These are *not executed* automatically. Import and run runSelfTests() in
// your test runner (Vitest/Jest) or a dev harness. Never changes existing tests.

export function runSelfTests() {
  const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
  const assert = (cond: boolean, msg: string) => { if (!cond) throw new Error(`Test failed: ${msg}`); };

  // --- Test 1: advance moves current → completed and unlocks next
  const base: ProgressRecord = {
    userId: "u",
    courseId: "c",
    missions: [
      { id: 1, key: "m1", name: "M1", x: 0, y: 0, status: "completed", icon: "castle", progress: 1 },
      { id: 2, key: "m2", name: "M2", x: 0, y: 0, status: "current",   icon: "tower",  progress: 0.2 },
      { id: 3, key: "m3", name: "M3", x: 0, y: 0, status: "locked",    icon: "lab" },
    ],
    xp: 0, streakDays: 0, badges: [], updatedAt: new Date().toISOString(),
  };
  const store = createQuestStore(clone(base));
  store.advance();
  const s1 = store.getState().record;
  assert(s1.missions[1].status === "completed" && s1.missions[1].progress === 1, "advance should complete current mission");
  assert(s1.missions[2].status === "current", "advance should set next mission current");
  assert(s1.xp >= 50, "advance should award XP");

  // --- Test 2: setProgress clamps 0..1 on current mission
  store.setProgress(1.5);
  const s2 = store.getState().record;
  assert(s2.missions[2].progress! <= 1 && s2.missions[2].progress! >= 0, "progress clamped 0..1");

  // --- Test 3: complete last mission gives course_complete badge
  store.advance(); // complete m3 (was current), no next → badge
  const s3 = store.getState().record;
  assert(s3.badges.includes("course_complete"), "should award course_complete badge at end");

  // --- Test 4: addXP/addBadge/incStreak
  store.addXP(25); store.addBadge("speed_runner"); store.incStreak();
  const s4 = store.getState().record;
  assert(s4.xp >= 75, "XP increments");
  assert(s4.badges.includes("speed_runner"), "badge added");
  assert(s4.streakDays >= 1, "streak increments");

  return "ok";
}