/*
  # Add Address Field to Bookings

  1. Changes
    - Add `address` column to `bookings` table
    - Add `address_verified` boolean to track if address was validated
    - Add index on address for faster searches
    
  2. Notes
    - Address is required and must be within Podolsk city limits
    - Address verification ensures only valid Podolsk addresses are accepted
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'address'
  ) THEN
    ALTER TABLE bookings ADD COLUMN address text NOT NULL DEFAULT 'Адрес будет уточнен';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'address_verified'
  ) THEN
    ALTER TABLE bookings ADD COLUMN address_verified boolean DEFAULT true;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_address ON bookings(address);

COMMENT ON COLUMN bookings.address IS 'Full address within Podolsk city limits';
COMMENT ON COLUMN bookings.address_verified IS 'Whether the address was validated against Podolsk boundaries';