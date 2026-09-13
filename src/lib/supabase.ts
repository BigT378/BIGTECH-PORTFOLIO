import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Project = {
  id: string;
  title: string;
  short_description: string;
  full_description: string | null;
  category: string;
  technologies: string[];
  thumbnail_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  project_status: string;
  project_date: string | null;
  sort_order: number;
  case_study_problem: string | null;
  case_study_solution: string | null;
  case_study_features: string | null;
  case_study_technology: string | null;
  case_study_architecture: string | null;
  case_study_process: string | null;
  case_study_challenges: string | null;
  case_study_outcome: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectScreenshot = {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type ProjectWithScreenshots = Project & {
  screenshots: ProjectScreenshot[];
};
