import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { certifications } from "@/data/certs";
import BootSequence from "@/components/BootSequence/BootSequence";
import AgentDock from "@/components/AgentDock/AgentDock";
import ThreeField from "@/components/ThreeField/ThreeField";
import TransmissionForm from "@/components/TransmissionForm/TransmissionForm";
import { useWindowManager } from "@/hooks/useWindowManager";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function useKonami(onUnlock: () => void) {
  const seq = useMemo(() => ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], []);
  const posRef = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[posRef.current]) {
        posRef.current += 1;
        if (posRef.current === seq.length) {
          posRef.current = 0;
          onUnlock();
        }
      } else {
        posRef.current = k === seq[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [seq, onUnlock]);
}

/* ---- window contents ---- */

function AboutContent() {
  return (
    <div className="space-y-4 p-5 font-mono text-[15px] leading-relaxed text-mist-soft">
      <p className="text-paper glow-phosphor-soft">
        {profile.realName} <span className="text-mist">// {profile.handle}</span>
      </p>
      <p className="text-phosphor">{profile.title} — {profile.employer}</p>
      <p>{profile.summary}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px] text-mist">
        <dt>BASE</dt><dd>{profile.location}</dd>
        <dt>MOBILITY</dt><dd>{profile.openToRelocation}</dd>
        <dt>STATUS</dt><dd className="text-signal">{profile.status} — {profile.clearance}</dd>
        <dt>UPLINK</dt><dd><a href={`mailto:${profile.email}`} className="text-cyan hover:text-paper underline">{profile.email}</a></dd>
        <dt>GITHUB</dt><dd><a href={profile.github} target="_blank" rel="noreferrer" className="text-cyan hover:text-paper underline">malikoliver25 ↗</a></dd>
        <dt>LINKEDIN</dt><dd><a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-cyan hover:text-paper underline">malik-o ↗</a></dd>
      </dl>
      <p className="text-mist text-[13px]">$ cat manifesto.txt<span className="crt-cursor ml-1" aria-hidden="true" /></p>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="space-y-3 overflow-auto p-5">
      {projects.map((p, i) => (
        <a key={p.codename} href={p.url} target="_blank" rel="noreferrer"
           className="block rounded border border-hairline bg-void/60 p-3.5 hover:border-phosphor/50 hover:bg-phosphor/[0.04] transition-colors group">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[15px] text-paper group-hover:glow-phosphor-soft">{String(i + 1).padStart(2, "0")} — {p.codename}</span>
            <span className={`font-mono text-[11px] tracking-widest ${p.status === "ACTIVE" ? "text-signal" : "text-mist"}`}>[{p.status}]</span>
          </div>
          <p className="mt-1.5 font-mono text-[13px] leading-relaxed text-mist">{p.description}</p>
          <p className="mt-2 font-mono text-[11px] tracking-widest text-cyan/70">{p.techStack.join(" · ")}</p>
        </a>
      ))}
    </div>
  );
}

function SkillsContent() {
  return (
    <div className="grid gap-4 overflow-auto p-5 sm:grid-cols-2">
      {skillCategories.map((cat) => (
        <div key={cat.category} className="rounded border border-hairline bg-void/60 p-3.5">
          <div className="flex items-center gap-2 font-mono text-[13px] text-paper">
            <span className="text-cyan">{cat.icon}</span>{cat.category}
          </div>
          <ul className="mt-2 space-y-1.5">
            {cat.skills.map((s) => (
              <li key={s.name} className="font-mono text-[12px]">
                <div className="flex justify-between text-mist"><span>{s.name}</span><span className="text-phosphor">{"▮".repeat(s.level)}{"▯".repeat(5 - s.level)}</span></div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LogContent() {
  return (
    <div className="overflow-auto p-5 font-mono text-[13px]">
      <div className="space-y-2">
        {certifications.map((c) => (
          <div key={`${c.name}-${c.issued}`} className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
            <span className="text-mist-soft">{c.verified ? "✓" : "·"} {c.name}</span>
            <span className="text-mist text-[12px]">{c.issuer} • {c.issued}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
          <span className="text-signal">▸ ROLE — Founding Backend / AI Engineer, Triton Sentinel</span>
          <span className="text-mist text-[12px]">2026-07</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
          <span className="text-mist-soft">▸ DEPLOYMENT — MTM Industrial AI portal live</span>
          <span className="text-mist text-[12px]">2025-11</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
          <span className="text-mist-soft">▸ DEPLOYMENT — Sentinel-Core graph engine</span>
          <span className="text-mist text-[12px]">2025-09</span>
        </div>
      </div>
    </div>
  );
}

function ScreensaverContent({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative h-full min-h-[300px]">
      <ThreeField reduced={reduced} />
    </div>
  );
}

function TransmissionContent() {
  return (
    <div className="p-5">
      <p className="mb-4 font-mono text-[13px] text-mist">$ establish uplink — direct reply within 24h</p>
      <TransmissionForm />
    </div>
  );
}

function TrashContent() {
  return (
    <div className="p-8 text-center font-mono text-[14px] leading-loose text-mist">
      <p className="text-paper glow-phosphor-soft">TRASH.EXE</p>
      <p className="mt-3">nothing deleted.</p>
      <p>nothing forgotten.</p>
      <p className="mt-3 text-mist/60">you found the easter egg. VANTA is proud of you. 🌘</p>
    </div>
  );
}

/* ---- app ---- */

const WINDOW_DEFS = [
  { id: "about", title: "ABOUT.EXE", icon: "▤" },
  { id: "projects", title: "C:\\PROJECTS", icon: "▨" },
  { id: "skills", title: "SKILLS.SYS", icon: "▥" },
  { id: "log", title: "SIGNAL.LOG", icon: "▦" },
  { id: "screensaver", title: "FIELD.SCR", icon: "◉" },
  { id: "transmission", title: "UPLINK.FRM", icon: "✉" },
  { id: "trash", title: "TRASH.EXE", icon: "🗑" },
];
export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const now = useClock();
  const wm = useWindowManager(WINDOW_DEFS);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  useKonami(() => setUnlocked(true));

  useEffect(() => {
    if (!bootComplete) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [bootComplete]);

  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const contentFor = (id: string) => {
    switch (id) {
      case "about": return <AboutContent />;
      case "projects": return <ProjectsContent />;
      case "skills": return <SkillsContent />;
      case "log": return <LogContent />;
      case "screensaver": return <ScreensaverContent reduced={reduced} />;
      case "transmission": return <TransmissionContent />;
      case "trash": return <TrashContent />;
    }
  };

  const winH = (id: string) => {
    switch (id) {
      case "screensaver": return 420;
      case "about": return 560;
      case "projects": return 600;
      default: return 480;
    }
  };

  return (
    <div className="crt-scanlines crt-vignette min-h-dvh bg-void text-paper">
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      <a href="#desktop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-phosphor focus:px-4 focus:py-3 focus:text-void focus:font-mono focus:text-sm">Skip to content</a>

      {/* menu bar */}
      <header className="os-pill sticky top-0 z-50 border-x-0 border-t-0">
        <div className="mx-auto flex h-[44px] max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-[15px] font-bold tracking-widest text-phosphor glow-phosphor-soft">m4lik-os</span>
            <span className="hidden font-mono text-[12px] text-mist sm:inline">{profile.title} @ {profile.employer}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[13px] text-mist">
            <span className="hidden sm:inline">{profile.location}</span>
            <span className="text-phosphor tabular-nums">{clock}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* desktop */}
      <main id="desktop" className="relative min-h-[calc(100dvh-44px-56px)]">
        {/* wallpaper */}
        <div className="aurora-canvas" aria-hidden="true">
          <div className="aurora-a" /><div className="aurora-b" /><div className="aurora-c" />
        </div>

        {/* konami unlock */}
        {unlocked && (
          <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2 rounded border border-signal/40 bg-void/90 px-4 py-2 font-mono text-[13px] text-signal glow-phosphor-soft">
            CHEAT CODE ACCEPTED — OPERATOR MODE
          </div>
        )}

        {/* icon grid */}
        <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-3 gap-2 p-5 sm:grid-cols-4 sm:gap-4 sm:p-8 lg:grid-cols-7">
          {WINDOW_DEFS.map((d) => (
            <button key={d.id} onClick={() => wm.openWindow(d.id)} className="os-icon"
              aria-label={`Open ${d.title}`}>
              <span className="text-[34px] leading-none text-phosphor glow-phosphor-soft sm:text-[40px]" aria-hidden="true">{d.icon}</span>
              <span className="font-mono text-[12px] tracking-wider text-mist-soft">{d.title}</span>
            </button>
          ))}
        </div>

        {/* welcome hint */}
        {wm.windows.every((w) => !w.open) && (
          <div className="pointer-events-none relative z-10 mx-auto mt-6 max-w-[520px] px-5 text-center font-mono text-[14px] leading-relaxed text-mist">
            <p><span className="text-phosphor glow-phosphor">m4lik-os v3.0</span> — portfolio OS of Malik Oliver</p>
            <p className="mt-2 text-[13px]">tap an icon to open a window<span className="crt-cursor ml-1.5" aria-hidden="true" /></p>
          </div>
        )}

        {/* windows */}
        {wm.windows.filter((w) => w.open && !w.minimized).map((w) => (
          <section key={w.id}
            data-id={w.id}
            className={`os-win os-window absolute z-${Math.min(w.z, 40)} ${wm.isMobile ? "os-window-mobile" : ""}`}
            style={wm.isMobile ? undefined : {
              left: 0, top: 0,
              width: `min(${w.w}px, calc(100vw - 32px))`,
              transform: `translate3d(${w.x ?? 0}px, ${w.y ?? 0}px, 0)`,
            }}
            aria-label={w.title}
            onPointerDown={() => wm.focusWindow(w.id)}
          >
            <div className="os-titlebar"
              onPointerDown={(e) => wm.beginDrag(e, w.id)}
              onPointerMove={wm.moveDrag}
              onPointerUp={wm.endDrag}
              onPointerCancel={wm.endDrag}>
              <span className="truncate font-mono text-[13px] tracking-widest text-phosphor glow-phosphor-soft">{w.title}</span>
              <span className="flex items-center gap-1.5">
                <button onClick={() => wm.minimizeWindow(w.id)} aria-label={`Minimize ${w.title}`} className="grid h-7 w-7 place-items-center rounded border border-hairline font-mono text-[12px] text-mist hover:text-paper hover:border-hairline-strong">_</button>
                <button onClick={() => wm.closeWindow(w.id)} aria-label={`Close ${w.title}`} className="grid h-7 w-7 place-items-center rounded border border-hairline font-mono text-[12px] text-mist hover:text-[#FF6B6B] hover:border-[#FF6B6B]/50">✕</button>
              </span>
            </div>
            <div className="max-h-[calc(100dvh-160px)] overflow-hidden" style={{ maxHeight: wm.isMobile ? undefined : winH(w.id) }}>
              {contentFor(w.id)}
            </div>
          </section>
        ))}
      </main>

      {/* taskbar */}
      <footer className="os-pill fixed inset-x-0 bottom-0 z-50 border-x-0 border-b-0">
        <div className="mx-auto flex h-[56px] max-w-[1440px] items-center gap-2 overflow-x-auto px-3 sm:px-5">
          <span className="shrink-0 font-mono text-[13px] text-phosphor glow-phosphor-soft">TASKS:</span>
          {wm.windows.filter((w) => w.open).length === 0 && (
            <span className="font-mono text-[12px] text-mist/60">none running</span>
          )}
          {wm.windows.filter((w) => w.open).map((w) => (
            <button key={w.id} onClick={() => (w.minimized ? wm.focusWindow(w.id) : wm.minimizeWindow(w.id))}
              className={`os-taskchip shrink-0 font-mono text-[12px] ${w.minimized ? "text-mist" : "text-phosphor"}`}>
              <span aria-hidden="true">{WINDOW_DEFS.find((d) => d.id === w.id)?.icon}</span>
              <span className="truncate">{w.title}</span>
            </button>
          ))}
        </div>
      </footer>

      <AgentDock enabled={bootComplete} />
    </div>
  );
}
