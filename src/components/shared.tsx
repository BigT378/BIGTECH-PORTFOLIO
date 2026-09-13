import { type ReactNode } from 'react';

export function BrandName({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textClass =
    size === 'lg'
      ? 'text-3xl font-bold tracking-[0.08em]'
      : size === 'sm'
        ? 'text-base font-bold tracking-[0.08em]'
        : 'text-xl font-bold tracking-[0.08em]';
  const imageClass =
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';

  return (
    <span className="inline-flex items-center gap-3">
      <span className={`${imageClass} overflow-hidden rounded-full border border-[#00b4ff]/50 bg-[#050608] p-0.5 shadow-[0_0_18px_rgba(0,180,255,0.2)]`}>
        <img
          src="/BIGTECH_LOGO.jpeg"
          alt="BIGTECH logo"
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      <span className={`${textClass} text-white`}>BIG<span className="text-[#00b4ff]">TECH</span></span>
    </span>
  );
}

export function SectionWrapper({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-24 lg:py-32 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-16 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00b4ff] glow-blue" />
        <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">{label}</span>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">{subtitle}</p>}
    </div>
  );
}
