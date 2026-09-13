import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';

export function GitHubSection() {
  return (
    <SectionWrapper id="github" className="bg-[#070a10]">
      <div className="absolute right-1/4 top-0 h-[300px] w-[300px] rounded-full bg-[#00b4ff]/5 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Open Source"
          title="GITHUB"
          subtitle="Explore code, projects, and experiments on GitHub."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <a
            href="https://github.com/BigT378"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl metallic-surface metallic-surface-hover p-10 text-center"
          >
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00b4ff]/10 blur-3xl transition-all group-hover:bg-[#00b4ff]/20" />

            <div className="relative mb-6 inline-flex rounded-2xl border border-[#00b4ff]/20 bg-[#00b4ff]/5 p-5">
              <Github size={48} className="text-[#00b4ff]" />
            </div>

            <h3 className="relative mb-2 text-2xl font-bold text-white">BigT378</h3>
            <p className="relative mb-6 text-slate-400">
              Visit the GitHub profile to explore repositories and code.
            </p>

            <span className="relative inline-flex items-center gap-2 rounded-xl border border-[#00b4ff]/30 bg-[#00b4ff]/10 px-6 py-3 text-sm font-semibold text-[#00b4ff] transition-all group-hover:bg-[#00b4ff]/20">
              View GitHub Profile
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
