import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgtdvlrabardadzosqgk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Zyn-fnvHa6Q1ZLaNmfVoew_bDvRUPYN';

export const supabase = createClient(supabaseUrl, supabaseKey);
