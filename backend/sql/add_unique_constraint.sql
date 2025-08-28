-- Add unique constraint to prevent duplicate course codes
ALTER TABLE courses ADD CONSTRAINT courses_code_unique UNIQUE (code); 