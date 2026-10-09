import { NeuralBg } from "./NeuralBg";
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative -mt-[72px] overflow-hidden pt-[72px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(43,143,255,.20),transparent_65%)]" />
      <div className="grid-bg absolute inset-0" />
      <NeuralBg density={22} className="opacity-70" />
      <div className="wrap relative pb-14 pt-16 sm:pt-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
