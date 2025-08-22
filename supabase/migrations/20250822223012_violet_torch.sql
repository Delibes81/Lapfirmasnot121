/*
  # Add RLS policy for laptop insertion

  1. Security Changes
    - Add policy to allow anonymous users to insert laptops
    - This enables the public interface to add new laptops without authentication

  2. Policy Details
    - Allows INSERT operations for anonymous (public) users
    - Applies to all columns in the laptops table
*/

-- Add policy to allow anonymous users to insert laptops
CREATE POLICY "Allow anonymous users to insert laptops"
  ON laptops
  FOR INSERT
  TO anon
  WITH CHECK (true);