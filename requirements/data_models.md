BUILDING MODEL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE building_type AS ENUM ('residential', 'commercial', 'office', 'mixed');
CREATE TYPE tax_generation_period AS ENUM ('monthly', 'quarterly', 'yearly');
CREATE TYPE building_status AS ENUM ('active', 'inactive', 'maintenance');

-- Create buildings table
CREATE TABLE buildings (
-- Primary key and metadata
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_by UUID, -- Will reference users table when implemented
updated_by UUID, -- Will reference users table when implemented

-- Basic building information
name VARCHAR(255) NOT NULL,
type building_type NOT NULL,
status building_status DEFAULT 'active',
description TEXT,

-- Address information
city VARCHAR(100) NOT NULL,
district VARCHAR(100) NOT NULL,
street VARCHAR(255) NOT NULL,
number VARCHAR(50) NOT NULL,
entrance VARCHAR(50),
postal_code VARCHAR(20) NOT NULL,

-- Physical properties
common_parts_area DECIMAL(10,2), -- in square meters
quadrature DECIMAL(10,2), -- total building area in square meters
parking_slots INTEGER DEFAULT 0,
basements INTEGER DEFAULT 0,
apartment_count INTEGER DEFAULT 0, -- Will be calculated from apartments

-- Financial information
balance DECIMAL(15,2) DEFAULT 0.00,
monthly_fee DECIMAL(10,2) DEFAULT 0.00,
debt DECIMAL(15,2) DEFAULT 0.00,

-- Tax and billing settings
tax_generation_period tax_generation_period DEFAULT 'monthly',
tax_generation_day INTEGER DEFAULT 1 CHECK (tax_generation_day >= 1 AND tax_generation_day <= 31),
homebook_start_date DATE NOT NULL,
next_tax_date DATE,

-- Features and settings
invoice_enabled BOOLEAN DEFAULT false,

-- Operational metrics
total_units INTEGER DEFAULT 0, -- Total apartment units
occupied_units INTEGER DEFAULT 0, -- Currently occupied units
irregularities INTEGER DEFAULT 0, -- Count of reported issues

-- Computed fields (will be updated by triggers/functions)
occupancy_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage
monthly_revenue DECIMAL(15,2) DEFAULT 0.00,
annual_revenue DECIMAL(15,2) DEFAULT 0.00,

-- Search and indexing
search_vector TSVECTOR,

-- Constraints
CONSTRAINT valid_occupancy_rate CHECK (occupancy_rate >= 0 AND occupancy_rate <= 100),
CONSTRAINT valid_occupied_units CHECK (occupied_units <= total_units),
CONSTRAINT positive_apartment_count CHECK (apartment_count >= 0),
CONSTRAINT positive_total_units CHECK (total_units >= 0),
CONSTRAINT positive_occupied_units CHECK (occupied_units >= 0)
);

-- Create indexes for performance
CREATE INDEX idx_buildings_type ON buildings(type);
CREATE INDEX idx_buildings_status ON buildings(status);
CREATE INDEX idx_buildings_city ON buildings(city);
CREATE INDEX idx_buildings_district ON buildings(district);
CREATE INDEX idx_buildings_created_at ON buildings(created_at);
CREATE INDEX idx_buildings_next_tax_date ON buildings(next_tax_date);
CREATE INDEX idx_buildings_occupancy_rate ON buildings(occupancy_rate);
CREATE INDEX idx_buildings_debt ON buildings(debt) WHERE debt > 0;
CREATE INDEX idx_buildings_search_vector ON buildings USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_buildings_search_vector()
RETURNS TRIGGER AS $$
BEGIN
NEW.search_vector := to_tsvector('english',
COALESCE(NEW.name, '') || ' ' ||
COALESCE(NEW.description, '') || ' ' ||
COALESCE(NEW.city, '') || ' ' ||
COALESCE(NEW.district, '') || ' ' ||
COALESCE(NEW.street, '') || ' ' ||
COALESCE(NEW.number, '')
);
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER trigger_update_buildings_search_vector
  BEFORE INSERT OR UPDATE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_buildings_search_vector();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$

BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update next tax date
CREATE OR REPLACE FUNCTION update_next_tax_date()
RETURNS TRIGGER AS
$$

DECLARE
next*date DATE;
BEGIN
-- Calculate next tax date based on period and generation day
CASE NEW.tax_generation_period
WHEN 'monthly' THEN
next_date := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' + (NEW.tax_generation_day - 1) * INTERVAL '1 day';
WHEN 'quarterly' THEN
next*date := DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months' + (NEW.tax_generation_day - 1) * INTERVAL '1 day';
WHEN 'yearly' THEN
next_date := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' + (NEW.tax_generation_day - 1) \* INTERVAL '1 day';
END CASE;

-- Only update if next_tax_date is null (new record) or if tax settings changed
IF OLD IS NULL OR OLD.tax_generation_period != NEW.tax_generation_period OR OLD.tax_generation_day != NEW.tax_generation_day THEN
NEW.next_tax_date := next_date;
END IF;

RETURN NEW;
END;

$$
LANGUAGE plpgsql;

-- Create trigger for next tax date updates
CREATE TRIGGER trigger_update_next_tax_date
  BEFORE INSERT OR UPDATE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_next_tax_date();

-- Insert some sample data for testing
INSERT INTO buildings (
  name, type, city, district, street, number, postal_code,
  homebook_start_date, total_units, occupied_units, monthly_fee
) VALUES
  ('Сграда Витоша', 'residential', 'София', 'Център', 'ул. Витоша', '15', '1000', '2023-01-01', 24, 20, 150.00),
  ('Бизнес Център Лозенец', 'office', 'София', 'Лозенец', 'бул. Драган Цанков', '22', '1164', '2023-01-01', 30, 25, 200.00),
  ('Търговски Комплекс Младост', 'commercial', 'София', 'Младост', 'ул. Бизнес Парк', '8', '1784', '2023-01-01', 15, 12, 300.00);
$$
