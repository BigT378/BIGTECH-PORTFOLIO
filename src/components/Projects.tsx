import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Github, X, ArrowRight, Calendar, Tag,
  Image as ImageIcon, Loader2, FolderOpen,
} from 'lucide-react';
import { SectionWrapper, SectionHeading } from './shared';
import { supabase, type Project, type ProjectScreenshot } from '@/lib/supabase';

type ProjectWithScreenshots = Project & { screenshots: ProjectScreenshot[] };

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProjectWithScreenshots | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
      return;
    }

    const all = data as Project[];
    setProjects(all);
    setFeatured(all.filter((p) => p.is_featured));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openProject = async (project: Project) => {
    setLoadingDetail(true);
    const { data: screenshots } = await supabase
      .from('project_screenshots')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });

    setSelected({ ...project, screenshots: (screenshots as ProjectScreenshot[]) ?? [] });
    setLoadingDetail(false);
  };

  if (loading) {
    return (
      <SectionWrapper id="projects">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#00b4ff]" />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <>
      <SectionWrapper id="projects" className="bg-[#070a10]">
        <div className="absolute right-1/4 top-0 h-[300px] w-[300px] rounded-full bg-[#00b4ff]/5 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Portfolio"
            title="PROJECTS"
            subtitle="A collection of projects built with modern technologies."
          />

          {featured.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00b4ff]/40 to-transparent" />
                <h3 className="font-mono-tech text-sm uppercase tracking-widest text-[#00b4ff]">
                  Featured Projects
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00b4ff]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {featured.map((project, i) => (
                  <FeaturedCard key={project.id} project={project} onClick={() => openProject(project)} index={i} />
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              {featured.length > 0 && (
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  <h3 className="font-mono-tech text-sm uppercase tracking-widest text-slate-400">
                    All Projects
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} onClick={() => openProject(project)} index={i} />
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 inline-flex rounded-2xl border border-[#00b4ff]/15 bg-[#00b4ff]/5 p-5">
                <FolderOpen size={40} className="text-[#00b4ff]/50" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Projects coming soon.</h3>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                New projects are being prepared. Check back shortly to see the latest work from BIGTECH.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      <ProjectModal project={selected} loading={loadingDetail} onClose={() => setSelected(null)} />
    </>
  );
}

function FeaturedCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl metallic-surface metallic-surface-hover text-left"
    >
      {project.thumbnail_url ? (
        <div className="relative aspect-video overflow-hidden bg-[#0a0c12]">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-grid-sm bg-[#0a0c12]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00b4ff]/10 to-transparent" />
          <span className="text-3xl font-bold text-white/20">{project.title.charAt(0)}</span>
        </div>
      )}

      <div className="p-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-3 py-1 text-xs font-mono-tech text-[#00b4ff]">
            {project.category}
          </span>
          <span className="text-xs text-slate-500">{project.project_status}</span>
        </div>
        <h4 className="mb-2 text-xl font-bold text-white">{project.title}</h4>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-400">{project.short_description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#00b4ff]">
          View Details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.button>
  );
}

function ProjectCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl metallic-surface metallic-surface-hover text-left"
    >
      {project.thumbnail_url ? (
        <div className="relative aspect-video overflow-hidden bg-[#0a0c12]">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-grid-sm bg-[#0a0c12]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00b4ff]/10 to-transparent" />
          <span className="text-2xl font-bold text-white/20">{project.title.charAt(0)}</span>
        </div>
      )}

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-2.5 py-0.5 text-xs font-mono-tech text-[#00b4ff]">
            {project.category}
          </span>
        </div>
        <h4 className="mb-2 text-lg font-bold text-white">{project.title}</h4>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-400">{project.short_description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-slate-400">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function ProjectModal({ project, loading, onClose }: {
  project: ProjectWithScreenshots | null;
  loading: boolean;
  onClose: () => void;
}) {
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    setActiveScreenshot(0);
  }, [project]);

  const caseStudySections = project ? [
    { label: 'Problem', value: project.case_study_problem },
    { label: 'Solution', value: project.case_study_solution },
    { label: 'Features', value: project.case_study_features },
    { label: 'Technology', value: project.case_study_technology },
    { label: 'Architecture', value: project.case_study_architecture },
    { label: 'Development Process', value: project.case_study_process },
    { label: 'Challenges', value: project.case_study_challenges },
    { label: 'Outcome', value: project.case_study_outcome },
  ].filter((s) => s.value && s.value.trim()) : [];

 return (
  <AnimatePresence>
    {project && (
      <>
        {/* Darkened Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
        />

        {/* Centering Wrapper Container */}
        <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0c12] scrollbar-hide"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#00b4ff]" />
              </div>
            ) : (
              <>
                {/* Hero image / screenshot gallery */}
                <div className="relative h-64 overflow-hidden bg-[#0f131c] sm:h-80">
                  {project.screenshots.length > 0 || project.thumbnail_url ? (
                    <img
                      src={project.screenshots[activeScreenshot]?.image_url ?? project.thumbnail_url ?? ''}
                      alt={project.screenshots[activeScreenshot]?.caption ?? project.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-grid-sm">
                      <ImageIcon size={48} className="text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-transparent to-transparent" />

                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#00b4ff]/20 bg-[#00b4ff]/5 px-3 py-1 text-xs font-mono-tech text-[#00b4ff]">
                      <Tag size={10} className="mr-1 inline" />
                      {project.category}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {project.project_status}
                    </span>
                    {project.project_date && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={12} />
                        {new Date(project.project_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{project.title}</h2>

                  {project.full_description ? (
                    <p className="mb-6 leading-relaxed text-slate-300">{project.full_description}</p>
                  ) : (
                    <p className="mb-6 leading-relaxed text-slate-300">{project.short_description}</p>
                  )}

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screenshot gallery */}
                  {project.screenshots.length > 1 && (
                    <div className="mb-6">
                      <h4 className="mb-3 font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
                        Screenshots
                      </h4>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                        {project.screenshots.map((shot, i) => (
                          <button
                            key={shot.id}
                            onClick={() => setActiveScreenshot(i)}
                            className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                              activeScreenshot === i
                                ? 'border-[#00b4ff] glow-blue'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={shot.image_url} alt={shot.caption ?? `Screenshot ${i + 1}`} loading="lazy" className="h-full w-full object-contain" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case study */}
                  {caseStudySections.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-4 font-mono-tech text-xs uppercase tracking-widest text-[#00b4ff]">
                        Case Study
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {caseStudySections.map((section) => (
                          <div key={section.label} className="rounded-xl border border-white/5 bg-[#0f131c] p-4">
                            <h5 className="mb-2 text-sm font-semibold text-white">{section.label}</h5>
                            <p className="text-sm leading-relaxed text-slate-400">{section.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00b4ff] px-6 py-3 text-sm font-semibold text-[#050608] transition-all hover:bg-[#22d3ee] hover:glow-blue-strong"
                      >
                        <ExternalLink size={18} />
                        View Live Project
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#00b4ff]/40"
                      >
                        <Github size={18} />
                        View on GitHub
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);
}