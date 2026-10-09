"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useId } from "react";

/** The Fahd AI brand robot: a slim, professional assistant drawn in SVG (no external images). */
export function Robot({ className = "", interactive = true }: { className?: string; interactive?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 14 });
  const sy = useSpring(my, { stiffness: 60, damping: 14 });
  const headRotate = useTransform(sx, [-1, 1], [-7, 7]);
  const eyeX = useTransform(sx, [-1, 1], [-5, 5]);
  const eyeY = useTransform(sy, [-1, 1], [-3, 3]);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, mx, my]);

  const g = (n: string) => `${n}-${uid}`;
  return (
    <motion.svg
      viewBox="0 0 320 420"
      className={className}
      role="img"
      aria-label="Fahd AI assistant robot"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id={g("shell")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F8FF" />
          <stop offset=".55" stopColor="#C9D4E5" />
          <stop offset="1" stopColor="#7E90AE" />
        </linearGradient>
        <linearGradient id={g("dark")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C1C3D" />
          <stop offset="1" stopColor="#040D22" />
        </linearGradient>
        <linearGradient id={g("visor")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A1A3A" />
          <stop offset=".6" stopColor="#020814" />
          <stop offset="1" stopColor="#11305F" />
        </linearGradient>
        <radialGradient id={g("core")}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".35" stopColor="#8BE9FF" />
          <stop offset="1" stopColor="#2B8FFF" stopOpacity="0" />
        </radialGradient>
        <filter id={g("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={g("halo")}>
          <stop offset="0" stopColor="#2B8FFF" stopOpacity=".35" />
          <stop offset="1" stopColor="#2B8FFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* halo + floor shadow */}
      <circle cx="160" cy="200" r="170" fill={`url(#${g("halo")})`} />
      <motion.ellipse cx="160" cy="405" rx="70" ry="9" fill="#000" opacity=".45"
        animate={{ rx: [70, 58, 70], opacity: [0.45, 0.3, 0.45] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      {/* arms */}
      <g>
        <path d="M86 214 C62 236 56 282 64 318" stroke={`url(#${g("shell")})`} strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="64" cy="324" r="13" fill={`url(#${g("dark")})`} stroke="#5AA8FF" strokeOpacity=".5" />
        <motion.g style={{ originX: "234px", originY: "214px" }} animate={{ rotate: [0, -16, 0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}>
          <path d="M234 214 C262 228 276 252 282 232" stroke={`url(#${g("shell")})`} strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="284" cy="226" r="13" fill={`url(#${g("dark")})`} stroke="#5AA8FF" strokeOpacity=".5" />
        </motion.g>
      </g>

      {/* torso */}
      <path d="M96 200 Q160 182 224 200 L214 330 Q160 352 106 330 Z" fill={`url(#${g("shell")})`} />
      <path d="M112 214 Q160 200 208 214 L200 318 Q160 334 120 318 Z" fill={`url(#${g("dark")})`} />
      {/* chest core */}
      <motion.circle cx="160" cy="258" r="30" fill={`url(#${g("core")})`} animate={{ opacity: [0.55, 1, 0.55], r: [26, 31, 26] }} transition={{ duration: 2.4, repeat: Infinity }} />
      <circle cx="160" cy="258" r="13" fill="none" stroke="#8BE9FF" strokeWidth="2" filter={`url(#${g("glow")})`} />
      <path d="M128 296 H192" stroke="#2B8FFF" strokeOpacity=".5" strokeWidth="2" strokeDasharray="4 6" />
      {/* hips */}
      <rect x="128" y="336" width="64" height="20" rx="10" fill={`url(#${g("dark")})`} />
      <path d="M140 356 L136 392 M180 356 L184 392" stroke={`url(#${g("shell")})`} strokeWidth="16" strokeLinecap="round" />

      {/* neck */}
      <rect x="146" y="170" width="28" height="22" rx="6" fill={`url(#${g("dark")})`} />

      {/* head */}
      <motion.g style={{ rotate: headRotate, originX: "160px", originY: "170px" }}>
        <line x1="160" y1="40" x2="160" y2="62" stroke="#C9D4E5" strokeWidth="4" />
        <motion.circle cx="160" cy="36" r="7" fill="#3DD8FF" filter={`url(#${g("glow")})`} animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        <rect x="82" y="60" width="156" height="116" rx="46" fill={`url(#${g("shell")})`} />
        {/* ear modules */}
        <rect x="70" y="96" width="18" height="46" rx="9" fill={`url(#${g("dark")})`} />
        <rect x="232" y="96" width="18" height="46" rx="9" fill={`url(#${g("dark")})`} />
        <rect x="76" y="108" width="6" height="22" rx="3" fill="#2B8FFF" opacity=".9" />
        <rect x="238" y="108" width="6" height="22" rx="3" fill="#2B8FFF" opacity=".9" />
        {/* visor */}
        <rect x="98" y="82" width="124" height="70" rx="32" fill={`url(#${g("visor")})`} stroke="#5AA8FF" strokeOpacity=".35" />
        <path d="M110 92 Q140 84 170 88" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <motion.g animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} style={{ originY: "117px" }}>
            <rect x="124" y="108" width="24" height="18" rx="9" fill="#3DD8FF" filter={`url(#${g("glow")})`} />
            <rect x="172" y="108" width="24" height="18" rx="9" fill="#3DD8FF" filter={`url(#${g("glow")})`} />
          </motion.g>
          <path d="M146 138 Q160 145 174 138" stroke="#3DD8FF" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" fill="none" />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}

/** Compact head used for the chat launcher and avatars. */
export function RobotHead({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rh-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F8FF" /><stop offset="1" stopColor="#8EA0BD" /></linearGradient>
      </defs>
      <line x1="32" y1="4" x2="32" y2="12" stroke="#C9D4E5" strokeWidth="2" />
      <circle cx="32" cy="5" r="3" fill="#3DD8FF" />
      <rect x="8" y="12" width="48" height="40" rx="16" fill="url(#rh-shell)" />
      <rect x="13" y="20" width="38" height="24" rx="11" fill="#040D22" />
      <rect x="20" y="27" width="8" height="7" rx="3.5" fill="#3DD8FF" />
      <rect x="36" y="27" width="8" height="7" rx="3.5" fill="#3DD8FF" />
    </svg>
  );
}
