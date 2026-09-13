/*
# BigTech Portfolio - Projects Schema

1. Overview
This migration creates the complete data model for the BigTech developer portfolio's
dynamic project system. It supports projects with thumbnails, multiple screenshots,
categories, technologies, live/GitHub URLs, featured status, case studies, and ordering.

2. New Tables
- `projects`: Core project records (title, descriptions, category, tech, URLs, status, featured, order, dates)
- `project_screenshots`: Multiple screenshots per project (image URL, caption, order)

3. Storage
- Storage bucket `project-images` for thumbnails and screenshots

4. Security (RLS)
- projects: public can SELECT only published (is_published = true); authenticated admin can do all CRUD
- project_screenshots: public can SELECT only screenshots of published projects; authenticated admin can do all CRUD
- Storage: public can read project-images bucket; only authenticated can upload/update/delete

5. Notes
- Admin access is controlled via Supabase Auth (email/password). No public registration.
- The admin signs in through the Supabase auth flow; RLS uses auth.uid() to verify authenticated status.
- sort_order controls project display order; featured flag controls featured section.
- Case study fields are all optional (nullable) and only displayed when populated.
*/

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text,
  category text NOT NULL DEFAULT 'Web Application',
  technologies text[] NOT NULL DEFAULT '{}',
  thumbnail_url text,
  live_url text,
  github_url text,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  project_status text NOT NULL DEFAULT 'In Development',
  project_date date,
  sort_order integer NOT NULL DEFAULT 0,
  -- Case study fields (all optional)
  case_study_problem text,
  case_study_solution text,
  case_study_features text,
  case_study_technology text,
  case_study_architecture text,
  case_study_process text,
  case_study_challenges text,
  case_study_outcome text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read only published projects
DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "public_read_published_projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated admin can insert
DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin can update
DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated admin can delete
DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON projects(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- ============================================================
-- PROJECT SCREENSHOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS project_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_screenshots ENABLE ROW LEVEL SECURITY;

-- Public can read screenshots of published projects only
DROP POLICY IF EXISTS "public_read_published_screenshots" ON project_screenshots;
CREATE POLICY "public_read_published_screenshots"
  ON project_screenshots FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_screenshots.project_id
      AND projects.is_published = true
    )
  );

-- Authenticated admin can insert
DROP POLICY IF EXISTS "admin_insert_screenshots" ON project_screenshots;
CREATE POLICY "admin_insert_screenshots"
  ON project_screenshots FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin can update
DROP POLICY IF EXISTS "admin_update_screenshots" ON project_screenshots;
CREATE POLICY "admin_update_screenshots"
  ON project_screenshots FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated admin can delete
DROP POLICY IF EXISTS "admin_delete_screenshots" ON project_screenshots;
CREATE POLICY "admin_delete_screenshots"
  ON project_screenshots FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_screenshots_project_id ON project_screenshots(project_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_project_images" ON storage.objects;
CREATE POLICY "public_read_project_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "admin_upload_project_images" ON storage.objects;
CREATE POLICY "admin_upload_project_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "admin_update_project_images" ON storage.objects;
CREATE POLICY "admin_update_project_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images') WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "admin_delete_project_images" ON storage.objects;
CREATE POLICY "admin_delete_project_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
