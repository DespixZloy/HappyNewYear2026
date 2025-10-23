/*
  # Create Bookings System

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `client_name` (text, not null) - Client's full name
      - `phone` (text, not null) - Client's phone number
      - `event_date` (date, not null) - Date of the event
      - `time_slot` (text, not null) - Selected time slot (9:00-12:00, 13:00-17:00, etc.)
      - `children_count` (integer, not null) - Number of children at the event
      - `event_format` (text, not null) - Format: kindergarten, school, home
      - `base_price` (integer, not null) - Base price for time slot
      - `total_price` (integer, not null) - Total calculated price
      - `status` (text, default 'pending') - Booking status
      - `created_at` (timestamptz, default now())
      - `telegram_sent` (boolean, default false) - Notification sent status
      
  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public to insert bookings
    - Add policy for authenticated users to view all bookings
    
  3. Notes
    - Public can create bookings (for customers)
    - Only authenticated users can view booking history (for business owners)
    - Telegram notifications will be sent via Edge Function
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text NOT NULL,
  event_date date NOT NULL,
  time_slot text NOT NULL CHECK (time_slot IN ('9:00-12:00', '13:00-17:00', '18:00-23:00', '23:00-3:00')),
  children_count integer NOT NULL CHECK (children_count > 0),
  event_format text NOT NULL CHECK (event_format IN ('kindergarten', 'school', 'home')),
  base_price integer NOT NULL,
  total_price integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  telegram_sent boolean DEFAULT false
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);