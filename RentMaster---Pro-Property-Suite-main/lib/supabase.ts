
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


 * DATABASE SCHEMA (Run in Supabase SQL Editor):
 * create table profiles (
 *   id uuid references auth.users on delete cascade,
 *   full_name text,
 *   role text check (role in ('TENANT', 'OWNER', 'ADMIN')),
 *   avatar_url text,
 *   primary key (id)
 * );
 * 
 * create table properties (
 *   id uuid default uuid_generate_v4() primary key,
 *   owner_id uuid references profiles(id),
 *   name text not null,
 *   type text,
 *   address text,
 *   city text,
 *   price numeric,
 *   description text,
 *   image_url text,
 *   amenities text[],
 *   rating numeric default 5.0
 * );
 * 
 * create table bookings (
 *   id uuid default uuid_generate_v4() primary key,
 *   property_id uuid references properties(id),
 *   tenant_id uuid references auth.users(id),
 *   check_in date,
 *   status text default 'pending'
 * );
 
