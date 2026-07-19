-- Add materials column to lectures table
-- Stores an array of JSON objects: [{ "name": "Document Name", "url": "https://..." }]
ALTER TABLE lectures ADD COLUMN IF NOT EXISTS materials JSONB DEFAULT '[]'::jsonb;
