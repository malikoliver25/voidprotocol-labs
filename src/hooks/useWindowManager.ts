import { useCallback, useEffect, useRef, useState } from "react";

export interface OsWindow {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  minimized: boolean;
  z: number;
  /* desktop position; null until first drag */
  x: number | null;
  y: number | null;
  w: number;
  h: number;
}

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
  const dragRef = useRef<{ id: string; offX: number; offY: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows((ws) => {
      const z = ++zRef.current;
      return ws.map((w) => (w.id === id ? { ...w, open: true, minimized: false, z } : w));
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
      const z = ++zRef.current;
      return ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w));
    });
  }, []);

  /* pointer drag on titlebar — mouse + touch via pointer events; desktop only */
  const beginDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (isMobile) return;
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      const el = (e.currentTarget as HTMLElement).closest(".os-win") as HTMLElement;
      if (!el) return;
      /* auto-position if never placed */
      const i = windows.indexOf(win);
      const x = win.x ?? Math.max(16, (window.innerWidth - win.w) / 2 + (i % 3) * 28);
      const y = win.y ?? Math.max(16, (window.innerHeight - win.h) / 2 - 40 + (i % 3) * 24);
      if (win.x == null) {
        setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
      }
      dragRef.current = { id, offX: e.clientX - x, offY: e.clientY - y };
      el.setPointerCapture?.(e.pointerId);
      focusWindow(id);
    },
    [isMobile, windows, focusWindow]
  );

  const moveDrag = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const x = Math.max(-40, Math.min(window.innerWidth - 120, e.clientX - d.offX));
    const y = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - d.offY));
    /* live transform during drag for 60fps; commit on release */
    const el = document.querySelector(`.os-win[data-id="${d.id}"]`) as HTMLElement | null;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const endDrag = useCallback(() => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const el = document.querySelector(`.os-win[data-id="${d.id}"]`) as HTMLElement | null;
    if (el) {
      const m = el.style.transform.match(/translate3d\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px/);
      if (m) {
        const x = parseFloat(m[1]);
        const y = parseFloat(m[2]);
        setWindows((ws) => ws.map((w) => (w.id === d.id ? { ...w, x, y } : w)));
      }
      el.style.transform = "";
    }
  }, []);

  return {
    windows,
    isMobile,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    beginDrag,
    moveDrag,
    endDrag,
  };
}
