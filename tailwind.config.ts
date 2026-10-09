import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: { 950: "#020814", 900: "#040D22", 800: "#071631", 700: "#0B2147", 600: "#11305F" },
        electric: { DEFAULT: "#2B8FFF", 400: "#5AA8FF", 600: "#1567E8" },
        cyan: { DEFAULT: "#3DD8FF", 300: "#8BE9FF" },
        silver: { DEFAULT: "#C9D4E5", 400: "#93A4BF", 600: "#61718C" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(43,143,255,.55)",
        card: "0 1px 0 rgba(255,255,255,.04) inset, 0 20px 50px -24px rgba(0,0,0,.6)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseRing: { "0%": { transform: "scale(.9)", opacity: ".7" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
        dash: { to: { strokeDashoffset: "0" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 2.2s ease-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
