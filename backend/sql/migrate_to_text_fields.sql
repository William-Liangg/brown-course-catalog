-- Migration to change VARCHAR fields to TEXT to avoid truncation errors
-- This will allow unlimited length for text fields

-- Drop existing constraints if they exist
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_code_key;

-- Alter table to change VARCHAR fields to TEXT
ALTER TABLE courses ALTER COLUMN code TYPE TEXT;
ALTER TABLE courses ALTER COLUMN days TYPE TEXT;
ALTER TABLE courses ALTER COLUMN location TYPE TEXT;
ALTER TABLE courses ALTER COLUMN professor TYPE TEXT;

-- Add back unique constraint on code if needed
ALTER TABLE courses ADD CONSTRAINT courses_code_key UNIQUE (code); 