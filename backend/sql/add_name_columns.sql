-- Migration script to add first_name and last_name columns to users table

-- Add first_name and last_name columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);

-- Update existing users with placeholder names (optional)
-- UPDATE users SET first_name = 'User', last_name = 'Name' WHERE first_name IS NULL; 