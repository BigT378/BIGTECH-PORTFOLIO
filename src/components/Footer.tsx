import { Mail, Github, ArrowUp } from 'lucide-react';
import { BrandName } from './shared';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#070a10] py-12">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00b4ff]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <BrandName />
            <p className="max-w-xs text-center text-sm text-slate-500 md:text-left">
              Build. Create. Develop. — Modern digital experiences engineered with precision.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="mailto:bigtech0111@gmail.com"
              className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition-all hover:border-[#00b4ff]/30 hover:text-[#00b4ff]"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://github.com/BigT378"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition-all hover:border-[#00b4ff]/30 hover:text-[#00b4ff]"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="#home"
              className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition-all hover:border-[#00b4ff]/30 hover:text-[#00b4ff]"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} BIGTECH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
