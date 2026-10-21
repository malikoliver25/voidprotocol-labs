/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050A06",
        ink: "#0A120C",
        panel: "#0D1810",
        hairline: "#1A3324",
        "hairline-strong": "#274A33",
        mist: "#7FA98C",
        "mist-soft": "#B8E6C4",
        paper: "#D8F5DE",
        signal: "#9CFF57",
        cyan: "#54FF9F",
        ember: "#FFB347",
        "phosphor": "#3DFF88",
        "phosphor-dim": "#1E7A44",
        "signal-soft": "rgba(156,255,87,0.10)",
        "cyan-soft": "rgba(84,255,159,0.10)",
        "ember-soft": "rgba(255,179,71,0.10)",
      },
      fontFamily: {
        display: ['"VT323"', '"Space Grotesk"', "monospace"],
        mono: ['"VT323"', '"JetBrains Mono"', "monospace"],
        body: ['"VT323"', '"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        "display-hero": ["clamp(28px,5vw,52px)", { lineHeight: "0.95", letterSpacing: "0.01em", fontWeight: "400" }],
        "heading-section": ["clamp(22px,3vw,30px)", { lineHeight: "1.0", letterSpacing: "0.01em", fontWeight: "400" }],
        "heading-card": ["18px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.65", fontWeight: "400" }],
        "body-sm": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "label": ["11px", { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "400" }],
      },
      maxWidth: {
        frame: "1440px",
      },
      animation: {
        "hairline-draw": "hairlineDraw 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "cursor-blink": "cursorBlink 1.06s step-end infinite",
        "flicker": "crtFlicker 4s linear infinite",
        "aurora-drift": "auroraDrift 24s ease-in-out infinite alternate",
        "corona-pulse": "coronaPulse 5s ease-in-out infinite",
      },
      keyframes: {
        hairlineDraw: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        cursorBlink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        crtFlicker: {
          "0%,100%": { opacity: "1" },
          "3%": { opacity: "0.92" },
          "6%": { opacity: "1" },
          "41%": { opacity: "0.97" },
          "44%": { opacity: "1" },
        },
        auroraDrift: {
          "0%": { transform: "translate3d(-4%, -2%, 0) scale(1) rotate(0deg)", opacity: "0.7" },
          "50%": { transform: "translate3d(3%, 2%, 0) scale(1.08) rotate(6deg)", opacity: "0.9" },
          "100%": { transform: "translate3d(-2%, 4%, 0) scale(1.04) rotate(-4deg)", opacity: "0.75" },
        },
        coronaPulse: {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
      },
    },
  },
  plugins: [],
};
