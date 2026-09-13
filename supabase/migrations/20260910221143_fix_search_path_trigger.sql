/*
# Fix search_path on update_updated_at function

Sets a secure search_path on the trigger function to resolve the security advisor warning.
*/

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
DROP FUNCTION IF EXISTS update_updated_at();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
