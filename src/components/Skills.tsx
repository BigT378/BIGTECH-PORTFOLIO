import { motion } from 'framer-motion';
import {
  Code2, FileCode, Braces, Atom, Wind,
  Server, Boxes, Network,
  Database, Cloud, Table,
  GitBranch, Github, Codepen, Rocket, PenTool,
  type LucideIcon,
} from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';

type Skill = { name: string; icon: LucideIcon };

const SKILL_GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML', icon: FileCode },
      { name: 'CSS', icon: Braces },
      { name: 'JavaScript', icon: Code2 },
      { name: 'TypeScript', icon: Code2 },
      { name: 'React', icon: Atom },
      { name: 'Tailwind CSS', icon: Wind },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: Server },
      { name: 'Express', icon: Boxes },
      { name: 'REST APIs', icon: Network },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'Supabase', icon: Cloud },
      { name: 'Firebase', icon: Cloud },
      { name: 'MySQL', icon: Table },
      { name: 'PostgreSQL', icon: Database },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', icon: GitBranch },
      { name: 'GitHub', icon: Github },
      { name: 'VS Code', icon: Codepen },
      { name: 'Vercel', icon: Rocket },
      { name: 'Figma', icon: PenTool },
    ],
  },
];

export function Skills() {
  return (
    <SectionWrapper id="skills" className="bg-[#070a10]">
      <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/5 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Technical Stack"
          title="SKILLS & TECHNOLOGIES"
          subtitle="A comprehensive toolkit for building modern web applications end-to-end."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="metallic-surface rounded-2xl p-6 lg:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00b4ff]/40 to-transparent" />
                <h3 className="font-mono-tech text-sm uppercase tracking-widest text-[#00b4ff]">
                  {group.title}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00b4ff]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: si * 0.05 }}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-[#0a0c12] p-4 transition-all hover:border-[#00b4ff]/30 hover:bg-[#0f131c]"
                  >
                    <skill.icon
                      size={28}
                      className="text-slate-400 transition-colors group-hover:text-[#00b4ff]"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
