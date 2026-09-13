import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';
import { BrandName } from './shared';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
              scrolled
                ? 'border border-white/5 bg-[#0a0c12]/80 backdrop-blur-xl glow-blue'
                : 'border border-transparent bg-transparent'
            }`}
          >
            <a href="#home" className="transition-opacity hover:opacity-80">
              <BrandName />
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="mx-2 h-6 w-px bg-white/10" />
              <a
                href="https://github.com/BigT378"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-[#00b4ff]/30 hover:text-white"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-300 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 z-50 h-full w-72 border-l border-white/10 bg-[#0a0c12] p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <BrandName />
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-300" aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="https://github.com/BigT378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-base font-medium text-slate-300"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
