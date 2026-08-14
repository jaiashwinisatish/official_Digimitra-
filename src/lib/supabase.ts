import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvfugrbaincliadaxqcw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnVncmJhaW5jbGlhZGF4cWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDA2MjMsImV4cCI6MjEwMjE3NjYyM30.jl4XOzeq4QqTdsJ617dQRFPndxq3OgqBb4gc_hsp0yA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
});
