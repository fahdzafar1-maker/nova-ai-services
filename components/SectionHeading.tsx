export function SectionHeading({ eyebrow, title, intro, center = false }: { eyebrow: string; title: React.ReactNode; intro?: string; center?: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h-display mt-3 text-3xl leading-[1.1] sm:text-4xl lg:text-[44px]">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-silver-400 sm:text-lg">{intro}</p>}
    </div>
  );
}
