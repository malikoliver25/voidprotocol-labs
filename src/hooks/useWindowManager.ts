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

  const [isMobile, setIsMobile] = useState(false);
  const dragRef = useRef<{ id: string; offX: number; offY: number; startX: number; startY: number; moved: boolean; raf: number; onMove: (ev: PointerEvent) => void; onUp: () => void } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows((ws) => {
      const z = Math.max(...ws.map((w) => w.z), 10) + 1;
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
      return ws.map((w) => (w.id === id ? { ...w, z: top + 1, minimized: false } : w));
    });
  }, []);

  /* desktop drag — STATE-driven: every pointermove (rAF-throttled) commits
     x/y to state so React re-renders with the position we just set.
     No DOM-direct transforms, so re-renders can never snap the window back. */
  const beginDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (isMobile || e.button !== 0) return;
      const win = windows.find((w) => w.id === id);
      const el = (e.currentTarget as HTMLElement).closest(".os-win") as HTMLElement | null;
      if (!win || !el) return;
      const rect = el.getBoundingClientRect();
      const d = {
        id,
        offX: e.clientX - rect.left,
        offY: e.clientY - rect.top,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
        raf: 0,
        onMove: (_ev: PointerEvent) => {},
        onUp: () => {},
      };
      d.onMove = (ev: PointerEvent) => {
        if (!dragRef.current || dragRef.current.id !== id) return;
        const nx = ev.clientX - d.offX;
        const ny = ev.clientY - d.offY;
        if (!d.moved && Math.hypot(nx - (win.x ?? rect.left), ny - (win.y ?? rect.top)) < DRAG_THRESHOLD) return;
        d.moved = true;
        if (d.raf) return;
        d.raf = requestAnimationFrame(() => {
          d.raf = 0;
          const x = Math.max(-40, Math.min(window.innerWidth - 120, nx));
          const y = Math.max(0, Math.min(window.innerHeight - 80, ny));
          setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
        });
      };
      d.onUp = () => {
        dragRef.current = null;
        window.removeEventListener("pointermove", d.onMove);
        if (d.raf) cancelAnimationFrame(d.raf);
      };
      dragRef.current = d;
      window.addEventListener("pointermove", d.onMove);
      window.addEventListener("pointerup", d.onUp, { once: true });
      focusWindow(id);
    },
    [isMobile, windows, focusWindow]
  );

  /* taskbar chip: restore if minimized, focus if behind, minimize only if front */
  const activateWindow = useCallback((id: string) => {
    setWindows((ws) => {
      const target = ws.find((w) => w.id === id);
      if (!target) return ws;
      if (target.minimized) {
        const z = Math.max(...ws.map((w) => w.z), 10) + 1;
        return ws.map((w) => (w.id === id ? { ...w, minimized: false, z } : w));
      }
      const top = Math.max(...ws.filter((w) => w.open).map((w) => w.z), 0);
      if (target.z !== top) {
        const z = top + 1;
        return ws.map((w) => (w.id === id ? { ...w, z } : w));
      }
      return ws.map((w) => (w.id === id ? { ...w, minimized: true } : w));
    });
  }, []);

  return {
    windows,
    isMobile,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    activateWindow,
    beginDrag,
  };
}
