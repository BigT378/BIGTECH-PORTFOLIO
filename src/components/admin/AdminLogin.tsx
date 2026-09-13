import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BrandName } from '@/components/shared';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050608] px-4">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00b4ff]/10 blur-[120px]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="metallic-surface rounded-2xl p-8 glow-blue">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <BrandName size="lg" />
            </div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-3 py-1">
              <Lock size={12} className="text-[#00b4ff]" />
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
                Admin Access
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">Project Manager</h1>
            <p className="mt-1 text-sm text-slate-400">Sign in to manage your portfolio projects.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0a0c12] py-3 pl-11 pr-4 text-white placeholder-slate-500 transition-colors focus:border-[#00b4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]/20"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0a0c12] py-3 pl-11 pr-4 text-white placeholder-slate-500 transition-colors focus:border-[#00b4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b4ff] px-6 py-3.5 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee] hover:glow-blue-strong disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
