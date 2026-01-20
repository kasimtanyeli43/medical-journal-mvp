-- Run this in Supabase SQL Editor

-- First, check if users exist
SELECT email, role FROM "User";

-- If not, create demo users with hashed password for 'demo123'
-- Hash: $2a$10$rOvHJnkzXhMJ5kPJL5J5deE5fFJ3fZJ5fJ5fJ5fJ5fJ5fJ5fJ5fJ (example, needs real bcrypt hash)

-- We'll use a simple approach: create via API or use Prisma Studio
