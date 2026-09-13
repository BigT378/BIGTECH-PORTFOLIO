import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Code2, Terminal, Cpu } from 'lucide-react';

const HeroScene = lazy(() =>
  import('./HeroScene').then((m) => ({ default: m.HeroScene })),
);

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-grid">
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050608]/50 to-[#050608]" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00b4ff]/10 blur-[120px]" />
      <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#22d3ee]/5 blur-[100px]" />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00b4ff] glow-blue" />
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
              Developer & Technology Brand
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            <span className="block">BUILD.</span>
            <span className="block text-gradient-blue">CREATE.</span>
            <span className="block">DEVELOP.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            BIGTECH is a developer and technology brand focused on building modern websites,
            web applications, digital products, and useful software — engineered with clean
            design, functionality, and performance at the core.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#00b4ff] px-8 py-4 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee] hover:glow-blue-strong"
            >
              VIEW MY WORK
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-[#00b4ff]/40 hover:bg-white/10"
            >
              <Mail size={18} />
              CONTACT BIGTECH
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 flex items-center gap-8 text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Code2 size={20} className="text-[#00b4ff]/60" />
              <span className="text-sm font-mono-tech">Frontend</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Terminal size={20} className="text-[#00b4ff]/60" />
              <span className="text-sm font-mono-tech">Backend</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Cpu size={20} className="text-[#00b4ff]/60" />
              <span className="text-sm font-mono-tech">Full Stack</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-[#00b4ff]"
          />
        </div>
      </motion.div>
    </section>
  );
}
