import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client (use only in secure server-side contexts)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);