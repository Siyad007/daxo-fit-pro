-- Fix database schema to allow null values for optional fields
-- Run this script if you're still getting constraint errors

-- Drop existing constraints if they exist
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_age_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_weight_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_height_check;

-- Make columns nullable
ALTER TABLE users ALTER COLUMN age DROP NOT NULL;
ALTER TABLE users ALTER COLUMN weight DROP NOT NULL;
ALTER TABLE users ALTER COLUMN height DROP NOT NULL;
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;
ALTER TABLE users ALTER COLUMN goal DROP NOT NULL;
ALTER TABLE users ALTER COLUMN activity_level DROP NOT NULL;
ALTER TABLE users ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE users ALTER COLUMN daily_calorie_target DROP NOT NULL;

-- Ensure email and password remain NOT NULL
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- Add unique constraint on email if not exists
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
