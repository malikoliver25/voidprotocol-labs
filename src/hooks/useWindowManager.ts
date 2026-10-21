import { useCallback, useEffect, useRef, useState } from "react";

export interface OsWindow {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  minimized: boolean;
  z: number;
  x: number | null;
  y: number | null;
  w: number;
  h: number;
}

interface DragState {
  id: string;
  offX: number;
  offY: number;
  moved: boolean;
  lastX: number;
  lastY: number;
  raf: number;
  onMove: (ev: PointerEvent) => void;
  onUp: () => void;
}

const DRAG_THRESHOLD = 3;

export function useWindowManager(windowDefs: Array<Pick<OsWindow, "id" | "title" | "icon">>) {
  const [windows, setWindows] = useState<OsWindow[]>(() =>
    windowDefs.map((d) => ({
      ...d,
      open: false,
      minimized: false,
      z: 0,
      x: null,
      y: null,
      w: 640,
      h: 480,
    }))
  );
  const zRef = useRef(10);
  const [isMobile, setIsMobile] = useState(false);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  /* open with cascade position so windows never stack at (0,0) */
  const openWindow = useCallback((id: string) => {
    setWindows((ws) => {
      const z = ++zRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return ws.map((w) => {
        if (w.id !== id) return w;
        if (w.open && w.x != null) return { ...w, minimized: false, z };
        const i = ws.indexOf(w);
        const width = Math.min(w.w, vw - 32);
        const height = Math.min(w.h, vh - 160);
        const x = Math.max(16, Math.min(vw - width - 16, (vw - width) / 2 + (i % 3) * 36));
        const y = Math.max(60, (vh - height) / 2 - 40 + (i % 3) * 32);
        return { ...w, open: true, minimized: false, z, x, y };
      });
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, open: false } : w)));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((ws) => {
      const top = Math.max(...ws.filter((w) => w.open).map((w) => w.z), 0);
      const focused = ws.find((w) => w.id === id);
      if (!focused || focused.z === top) return ws;
      const z = ++zRef.current;
      return ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w));
    });
  }, []);

  /* desktop drag: window-level listeners, NO pointer capture —
     pointerup stays on its target so ✕/_ clicks fire normally */
  const beginDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (isMobile || e.button !== 0) return;
      const win = windows.find((w) => w.id === id);
      const el = (e.currentTarget as HTMLElement).closest(".os-win") as HTMLElement | null;
      if (!win || !el) return;
      /* measure the REAL rendered position — heals any state/DOM mismatch */
      const rect = el.getBoundingClientRect();
      const d: DragState = {
        id,
        offX: e.clientX - rect.left,
        offY: e.clientY - rect.top,
        moved: false,
        lastX: rect.left,
        lastY: rect.top,
        raf: 0,
        onMove: () => {},
        onUp: () => {},
      };
      const clamp = (x: number, y: number) => ({
        x: Math.max(-40, Math.min(window.innerWidth - 120, x)),
        y: Math.max(0, Math.min(window.innerHeight - 80, y)),
      });
      d.onMove = (ev: PointerEvent) => {
        const cur = dragRef.current;
        if (!cur || cur.id !== id) return;
        const nx = ev.clientX - d.offX;
        const ny = ev.clientY - d.offY;
        if (!cur.moved && Math.hypot(nx - cur.lastX, ny - cur.lastY) < DRAG_THRESHOLD) return;
        cur.moved = true;
        const p = clamp(nx, ny);
        cur.lastX = p.x;
        cur.lastY = p.y;
        if (!cur.raf) {
          cur.raf = requestAnimationFrame(() => {
            cur.raf = 0;
            const el2 = document.querySelector(`.os-win[data-id="${id}"]`) as HTMLElement | null;
            if (el2) el2.style.transform = `translate3d(${cur.lastX}px, ${cur.lastY}px, 0)`;
          });
        }
      };
      d.onUp = () => {
        const cur = dragRef.current;
        dragRef.current = null;
        window.removeEventListener("pointermove", d.onMove);
        if (cur && cur.moved) {
          /* commit tracked coords — not regex-scraped DOM */
          setWindows((ws) =>
            ws.map((w) => (w.id === id ? { ...w, x: cur.lastX, y: cur.lastY } : w))
          );
        }
      };
      dragRef.current = d;
      window.addEventListener("pointermove", d.onMove);
      window.addEventListener("pointerup", d.onUp, { once: true });
      focusWindow(id);
    },
    [isMobile, windows, focusWindow]
  );

  return {
    windows,
    isMobile,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    beginDrag,
  };
}
