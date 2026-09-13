import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/bigtech0111@gmail.com`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            _subject: `BIGTECH Contact: ${form.name}`,
          }),
        }
      );

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `w-full rounded-xl border bg-[#0a0c12] px-4 py-3 text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-500/50 focus:ring-red-500/20'
        : 'border-white/10 focus:border-[#00b4ff]/40 focus:ring-[#00b4ff]/20'
    }`;

  return (
    <SectionWrapper id="contact">
      <div className="absolute left-1/3 top-1/4 h-[300px] w-[300px] rounded-full bg-[#00b4ff]/5 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Get In Touch"
          title="CONTACT"
          subtitle="Have a project in mind? Let's build something together."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="metallic-surface rounded-2xl p-8">
              <h3 className="mb-6 text-lg font-semibold text-white">Contact Information</h3>

              <div className="space-y-6">
                <a
                  href="mailto:bigtech0111@gmail.com"
                  className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"
                >
                  <div className="inline-flex rounded-xl border border-[#00b4ff]/20 bg-[#00b4ff]/5 p-3">
                    <Mail size={22} className="text-[#00b4ff]" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Email</div>
                    <div className="text-sm text-white group-hover:text-[#00b4ff]">bigtech0111@gmail.com</div>
                  </div>
                </a>

                <a
                  href="https://github.com/BigT378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"
                >
                  <div className="inline-flex rounded-xl border border-[#00b4ff]/20 bg-[#00b4ff]/5 p-3">
                    <Github size={22} className="text-[#00b4ff]" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">GitHub</div>
                    <div className="text-sm text-white group-hover:text-[#00b4ff]">github.com/BigT378</div>
                  </div>
                </a>
              </div>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-[#00b4ff]/20 to-transparent" />

              <p className="mt-6 text-sm leading-relaxed text-slate-400">
                Available for website development, web applications, and custom software
                projects. Reach out with your project details and let's discuss how to bring
                it to life.
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="metallic-surface rounded-2xl p-8" noValidate>
              <div className="mb-5">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass('name')}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass('email')}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass('message')} resize-none`}
                  placeholder="Tell me about your project..."
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b4ff] px-6 py-4 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee] hover:glow-blue-strong disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  <CheckCircle size={18} />
                  Message sent successfully. I'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={18} />
                  Something went wrong. Please try again or email directly.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
