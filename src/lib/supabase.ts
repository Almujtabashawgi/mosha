import { createClient } from '@supabase/supabase-js';

// The anon key is public by design; data is protected by Row Level Security
// (see supabase/setup.sql). Values can be overridden with Vercel env variables.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://mqklhyqprouooifigdyq.supabase.co';
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2xoeXFwcm91b29pZmlnZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTg4OTUsImV4cCI6MjA5NDYzNDg5NX0.e0HrO9U25VMauzoqvP4cBKTZNUamFSELt4ojV-zULcs';

export const supabase = createClient(url, anonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = 'products';
