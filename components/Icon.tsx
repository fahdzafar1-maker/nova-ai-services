// Minimal line-icon set (no external icon library).
const P: Record<string, string> = {
  flow: "M4 6h6v4H4zM14 14h6v4h-6zM7 10v4h7M17 10V6h-3",
  nodes: "M5 5h4v4H5zM15 5h4v4h-4zM10 15h4v4h-4zM9 7h6M7 9l5 6M17 9l-5 6",
  crm: "M4 5h16v14H4zM4 9h16M9 9v10",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  filter: "M3 5h18l-7 8v6l-4-2v-4z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  whatsapp: "M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.8-2.8l.8-1-1-2z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  cart: "M3 4h2l2.4 11h11L21 8H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  plus: "M12 4v16M4 12h16M8 3h8v5h5v8h-5v5H8v-5H3V8h5z",
  layout: "M4 4h16v16H4zM4 9h16M10 9v11",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  pen: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  inbox: "M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5",
  funnel: "M3 4h18l-6 8v5l-6 3v-8z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  play: "M8 5v14l11-7z",
  check: "M5 12l5 5 9-10",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  send: "M3 11l18-8-8 18-2-8z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  logout: "M9 4H5v16h4M16 8l4 4-4 4M20 12H9",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 .5-1.5-1.2L15 4h-4l-.5 2.3L9 7.5 7 7l-2 4 2 1-.1 1.5L5 15l2 4 2-.5 1.5 1.2L11 22h4l.5-2.3 1.5-1.2 2 .5 2-4-2-1z",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
  volume: "M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12",
};
export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.7 }: { name: string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={P[name] || P.spark} />
    </svg>
  );
}
