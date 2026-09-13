import { motion } from 'framer-motion';
import {
  Globe, AppWindow, ShoppingCart, Palette,
  Server, Database, Boxes,
  type LucideIcon,
} from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';

type Service = { icon: LucideIcon; title: string; description: string };

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom websites built with modern frameworks, optimized for speed, SEO, and responsiveness across all devices.',
  },
  {
    icon: AppWindow,
    title: 'Web Application Development',
    description: 'Full-featured web applications with complex functionality, real-time data, and scalable architecture.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Development',
    description: 'Online stores with product browsing, cart management, secure checkout, and order tracking.',
  },
  {
    icon: Palette,
    title: 'UI/UX Implementation',
    description: 'Pixel-perfect translation of designs into functional, accessible, and performant interfaces.',
  },
  {
    icon: Server,
    title: 'Backend / API Development',
    description: 'RESTful APIs and server-side logic built with Node.js and Express, designed for reliability and scale.',
  },
  {
    icon: Database,
    title: 'Database Integration',
    description: 'Database design and integration with Supabase, Firebase, PostgreSQL, and MySQL for persistent data.',
  },
  {
    icon: Boxes,
    title: 'Custom Software Solutions',
    description: 'Tailored software built to solve specific problems and meet unique operational requirements.',
  },
];

export function Services() {
  return (
    <SectionWrapper id="services">
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] rounded-full bg-[#00b4ff]/5 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What I Do"
          title="SERVICES"
          subtitle="End-to-end development services for building modern digital products."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative metallic-surface metallic-surface-hover overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00b4ff]/5 blur-2xl transition-opacity group-hover:bg-[#00b4ff]/10" />

              <div className="relative mb-4 inline-flex rounded-xl border border-[#00b4ff]/20 bg-[#00b4ff]/5 p-3">
                <service.icon size={24} className="text-[#00b4ff]" />
              </div>

              <h3 className="relative mb-2 text-lg font-semibold text-white">{service.title}</h3>
              <p className="relative text-sm leading-relaxed text-slate-400">{service.description}</p>

              <div className="relative mt-4 h-px w-full bg-gradient-to-r from-[#00b4ff]/20 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
