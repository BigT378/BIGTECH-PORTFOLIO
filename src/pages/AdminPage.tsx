import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { Loader2 } from 'lucide-react';

export function AdminPage() {
  const { user, loading } = useAuth();
  const [redirectKey, setRedirectKey] = useState(0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050608]">
        <Loader2 size={32} className="animate-spin text-[#00b4ff]" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={() => setRedirectKey((k) => k + 1)} />;
  }

  return <ProjectManager key={redirectKey} />;
}
