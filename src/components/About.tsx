import { motion } from 'framer-motion';
import { Code2, Layers, Zap, Target } from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';

const VALUES = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Maintainable, well-structured code built to scale and last.',
  },
  {
    icon: Layers,
    title: 'Modern Stack',
    description: 'React, TypeScript, Node.js, and modern database technologies.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Fast, optimized applications with attention to every detail.',
  },
  {
    icon: Target,
    title: 'Functional Design',
    description: 'Interfaces that are both beautiful and genuinely useful.',
  },
];

export function About() {
  return (
    <SectionWrapper id="about">
      <div className="absolute left-1/4 top-0 h-[300px] w-[300px] rounded-full bg-[#00b4ff]/5 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About"
          title="ABOUT BIGTECH"
          subtitle="Building modern digital experiences with purpose and precision."
        />

        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-lg leading-relaxed text-slate-300"
          >
            BIGTECH builds modern digital experiences — websites, web applications, and
            software products — with a focus on clean design, functionality, performance,
            and useful technology. Every project is approached with engineering discipline
            and creative attention, delivering products that work as well as they look.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="metallic-surface metallic-surface-hover rounded-2xl p-6"
            >
              <div className="mb-4 inline-flex rounded-xl border border-[#00b4ff]/20 bg-[#00b4ff]/5 p-3">
                <value.icon size={24} className="text-[#00b4ff]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
