import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Loader2, Upload, Star, StarOff,
  Eye, EyeOff, ArrowUp, ArrowDown, ExternalLink, Github as GithubIcon,
  Save, Image as ImageIcon, AlertCircle, LogOut, PanelsTopLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Project, type ProjectScreenshot } from '@/lib/supabase';
import { BrandName } from '@/components/shared';

type EditFormData = Partial<Project> & {
  technologies_input?: string;
};

const EMPTY_FORM: EditFormData = {
  title: '',
  short_description: '',
  full_description: '',
  category: 'Web Application',
  technologies: [],
  technologies_input: '',
  thumbnail_url: '',
  live_url: '',
  github_url: '',
  is_published: false,
  is_featured: false,
  project_status: 'In Development',
  project_date: '',
  sort_order: 0,
  case_study_problem: '',
  case_study_solution: '',
  case_study_features: '',
  case_study_technology: '',
  case_study_architecture: '',
  case_study_process: '',
  case_study_challenges: '',
  case_study_outcome: '',
};

const CATEGORIES = ['Web Application', 'Website', 'E-commerce', 'Mobile App', 'API', 'Software', 'Other'];
const STATUSES = ['In Development', 'Completed', 'Maintenance', 'Planning', 'Archived'];

export function ProjectManager() {
  const { signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EditFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([]);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingShots, setUploadingShots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const fileThumbRef = useRef<HTMLInputElement>(null);
  const fileShotsRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setProjects(data as Project[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const startNew = () => {
    setForm({ ...EMPTY_FORM, sort_order: projects.length });
    setEditing(null);
    setScreenshots([]);
    setShowForm(true);
  };

  const startEdit = (project: Project) => {
    setForm({
      ...project,
      technologies_input: project.technologies?.join(', ') ?? '',
      project_date: project.project_date ?? '',
    });
    setEditing(project);
    setShowForm(true);
    fetchScreenshots(project.id);
  };

  const fetchScreenshots = async (projectId: string) => {
    const { data } = await supabase
      .from('project_screenshots')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    setScreenshots((data as ProjectScreenshot[]) ?? []);
  };

  const uploadThumbnail = async (file: File) => {
    setUploadingThumb(true);
    const ext = file.name.split('.').pop();
    const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('project-images').upload(path, file);
    if (upErr) {
      setError(upErr.message);
      setUploadingThumb(false);
      return;
    }
    const { data: urlData } = supabase.storage
  .from('project-images')
  .getPublicUrl(path);

if (!urlData?.publicUrl) {
  setError('Thumbnail uploaded, but Supabase could not generate the image URL.');
  setUploadingThumb(false);
  return;
}

setForm((f) => ({
  ...f,
  thumbnail_url: urlData.publicUrl,
}));

setError('');
    setUploadingThumb(false);
  };

  const uploadScreenshots = async (files: FileList) => {
    if (!editing) return;
    setUploadingShots(true);
    const newShots: ProjectScreenshot[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `screenshots/${editing.id}/${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('project-images').upload(path, file);
      if (upErr) continue;
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(path);
      const { data: insData } = await supabase
        .from('project_screenshots')
        .insert({ project_id: editing.id, image_url: urlData.publicUrl, sort_order: screenshots.length + i })
        .select()
        .single();
      if (insData) newShots.push(insData as ProjectScreenshot);
    }
    setScreenshots([...screenshots, ...newShots]);
    setUploadingShots(false);
  };

  const deleteScreenshot = async (shot: ProjectScreenshot) => {
    await supabase.from('project_screenshots').delete().eq('id', shot.id);
    setScreenshots(screenshots.filter((s) => s.id !== shot.id));
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    if (!form.title?.trim() || !form.short_description?.trim()) {
      setError('Title and short description are required.');
      setSaving(false);
      return;
    }

    const technologies = (form.technologies_input ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      short_description: form.short_description,
      full_description: form.full_description ?? null,
      category: form.category ?? 'Web Application',
      technologies,
      thumbnail_url: form.thumbnail_url || null,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      is_published: form.is_published ?? false,
      is_featured: form.is_featured ?? false,
      project_status: form.project_status ?? 'In Development',
      project_date: form.project_date || null,
      sort_order: form.sort_order ?? 0,
      case_study_problem: form.case_study_problem || null,
      case_study_solution: form.case_study_solution || null,
      case_study_features: form.case_study_features || null,
      case_study_technology: form.case_study_technology || null,
      case_study_architecture: form.case_study_architecture || null,
      case_study_process: form.case_study_process || null,
      case_study_challenges: form.case_study_challenges || null,
      case_study_outcome: form.case_study_outcome || null,
    };

    if (editing) {
      const { error: updErr } = await supabase.from('projects').update(payload).eq('id', editing.id);
      if (updErr) setError(updErr.message);
      else {
        setShowForm(false);
        fetchProjects();
      }
    } else {
      const { error: insErr } = await supabase.from('projects').insert(payload);
      if (insErr) setError(insErr.message);
      else {
        setShowForm(false);
        fetchProjects();
      }
    }
    setSaving(false);
  };

  const togglePublished = async (project: Project) => {
    await supabase.from('projects').update({ is_published: !project.is_published }).eq('id', project.id);
    fetchProjects();
  };

  const toggleFeatured = async (project: Project) => {
    await supabase.from('projects').update({ is_featured: !project.is_featured }).eq('id', project.id);
    fetchProjects();
  };

  const moveOrder = async (project: Project, direction: 'up' | 'down') => {
    const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((p) => p.id === project.id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const swap = sorted[swapIdx];
    await Promise.all([
      supabase.from('projects').update({ sort_order: swap.sort_order }).eq('id', project.id),
      supabase.from('projects').update({ sort_order: project.sort_order }).eq('id', swap.id),
    ]);
    fetchProjects();
  };

  const deleteProject = async () => {
    if (!confirmDelete) return;
    await supabase.from('projects').delete().eq('id', confirmDelete.id);
    setConfirmDelete(null);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[#050608]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0c12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandName />
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <span className="hidden font-mono-tech text-sm uppercase tracking-widest text-[#00b4ff] sm:block">
              Project Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <PanelsTopLeft size={16} />
              <span className="hidden sm:inline">View Portfolio</span>
            </a>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Actions bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-sm text-slate-400">
              {projects.length} total · {projects.filter((p) => p.is_published).length} published
            </p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00b4ff] px-5 py-2.5 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee]"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Project list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#00b4ff]" />
          </div>
        ) : (
          <div className="space-y-3">
            {[...projects]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((project) => (
                <div key={project.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0c12] p-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#0f131c]">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-white">{project.title}</h3>
                      {project.is_featured && (
                        <Star size={14} className="shrink-0 fill-[#00b4ff] text-[#00b4ff]" />
                      )}
                    </div>
                    <p className="truncate text-sm text-slate-400">{project.short_description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          project.is_published
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {project.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-slate-500">{project.category}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveOrder(project, 'up')}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      aria-label="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOrder(project, 'down')}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      aria-label="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <div className="mx-1 h-5 w-px bg-white/10" />
                    <button
                      type="button"
                      onClick={() => toggleFeatured(project)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-[#00b4ff]"
                      aria-label="Toggle featured"
                    >
                      {project.is_featured ? (
                        <Star size={16} className="fill-[#00b4ff] text-[#00b4ff]" />
                      ) : (
                        <StarOff size={16} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublished(project)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      aria-label="Toggle published"
                    >
                      {project.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <div className="mx-1 h-5 w-px bg-white/10" />
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(project)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

            {projects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ImageIcon size={48} className="mb-4 text-slate-600" />
                <p className="text-slate-500">No projects yet. Click "Add Project" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Create form modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectForm
            form={form}
            setForm={setForm}
            editing={editing}
            saving={saving}
            error={error}
            onClose={() => setShowForm(false)}
            onSave={save}
            screenshots={screenshots}
            onUploadThumb={uploadThumbnail}
            onUploadShots={uploadScreenshots}
            onDeleteScreenshot={deleteScreenshot}
            uploadingThumb={uploadingThumb}
            uploadingShots={uploadingShots}
            fileThumbRef={fileThumbRef}
            fileShotsRef={fileShotsRef}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[61] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0a0c12] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <Trash2 size={22} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Project</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone.</p>
                </div>
              </div>
              <p className="mb-6 text-sm text-slate-300">
                Are you sure you want to delete <span className="font-semibold text-white">{confirmDelete.title}</span>?
                All screenshots associated with this project will also be removed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteProject}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectForm({
  form,
  setForm,
  editing,
  saving,
  error,
  onClose,
  onSave,
  screenshots,
  onUploadThumb,
  onUploadShots,
  onDeleteScreenshot,
  uploadingThumb,
  uploadingShots,
  fileThumbRef,
  fileShotsRef,
}: {
  form: EditFormData;
  setForm: React.Dispatch<React.SetStateAction<EditFormData>>;
  editing: Project | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  screenshots: ProjectScreenshot[];
  onUploadThumb: (file: File) => void;
  onUploadShots: (files: FileList) => void;
  onDeleteScreenshot: (shot: ProjectScreenshot) => void;
  uploadingThumb: boolean;
  uploadingShots: boolean;
  fileThumbRef: React.RefObject<HTMLInputElement>;
  fileShotsRef: React.RefObject<HTMLInputElement>;
}) {
  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0a0c12] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#00b4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]/20';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-10 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0c12] shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0c12] px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
                placeholder="Project name"
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category ?? 'Web Application'}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Short Description *</label>
            <input
              type="text"
              value={form.short_description ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
              className={inputClass}
              placeholder="One-line summary shown on cards"
            />
          </div>

          <div>
            <label className={labelClass}>Full Description</label>
            <textarea
              rows={3}
              value={form.full_description ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, full_description: e.target.value }))}
              className={`${inputClass} resize-none`}
              placeholder="Detailed description shown in the project modal"
            />
          </div>

          <div>
            <label className={labelClass}>Technologies (comma-separated)</label>
            <input
              type="text"
              value={form.technologies_input ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, technologies_input: e.target.value }))}
              className={inputClass}
              placeholder="React, TypeScript, Supabase, Node.js"
            />
          </div>

          {/* Thumbnail upload */}
          <div>
            <label className={labelClass}>Thumbnail</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-32 overflow-hidden rounded-lg border border-white/10 bg-[#0f131c]">
                {form.thumbnail_url ? (
                  <img src={form.thumbnail_url} alt="Thumbnail" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon size={20} className="text-slate-600" />
                  </div>
                )}
              </div>
              <input
                ref={fileThumbRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onUploadThumb(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => fileThumbRef.current?.click()}
                disabled={uploadingThumb}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {uploadingThumb ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload Thumbnail
              </button>
              {form.thumbnail_url && (
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, thumbnail_url: '' }))}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Live URL</label>
              <input
                type="url"
                value={form.live_url ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, live_url: e.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                type="url"
                value={form.github_url ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, github_url: e.target.value }))}
                className={inputClass}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {/* Status & flags */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.project_status ?? 'In Development'}
                onChange={(e) => setForm((prev) => ({ ...prev, project_status: e.target.value }))}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={form.project_date ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, project_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published ?? false}
                onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="h-4 w-4 rounded accent-[#00b4ff]"
              />
              <span className="text-sm text-slate-300">Published</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured ?? false}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded accent-[#00b4ff]"
              />
              <span className="text-sm text-slate-300">Featured</span>
            </label>
          </div>

          {/* Screenshots (only when editing existing project) */}
          {editing && (
            <div>
              <label className={labelClass}>Screenshots</label>
              <div className="mb-3 flex flex-wrap gap-3">
                {screenshots.map((shot) => (
                  <div
                    key={shot.id}
                    className="group relative h-20 w-32 overflow-hidden rounded-lg border border-white/10"
                  >
                    <img
                      src={shot.image_url}
                      alt={shot.caption ?? 'Screenshot'}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onDeleteScreenshot(shot)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
                {screenshots.length === 0 && (
                  <p className="text-sm text-slate-500">No screenshots uploaded yet.</p>
                )}
              </div>
              <input
                ref={fileShotsRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && onUploadShots(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileShotsRef.current?.click()}
                disabled={uploadingShots}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {uploadingShots ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload Screenshots
              </button>
            </div>
          )}

          {/* Case Study */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
                Case Study (Optional)
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { key: 'case_study_problem', label: 'Problem' },
                { key: 'case_study_solution', label: 'Solution' },
                { key: 'case_study_features', label: 'Features' },
                { key: 'case_study_technology', label: 'Technology' },
                { key: 'case_study_architecture', label: 'Architecture' },
                { key: 'case_study_process', label: 'Development Process' },
                { key: 'case_study_challenges', label: 'Challenges' },
                { key: 'case_study_outcome', label: 'Outcome' },
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <textarea
                    rows={2}
                    value={(form[field.key as keyof EditFormData] as string) ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className={`${inputClass} resize-none`}
                    placeholder={`${field.label}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex gap-3 border-t border-white/10 bg-[#0a0c12] px-6 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00b4ff] px-4 py-3 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee] disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {editing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}