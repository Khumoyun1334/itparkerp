import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlxrvkxrbdxkypzjayhz.supabase.co';
const supabaseAnonKey = 'sb_publishable_N7fHSZyyDm1VA1hG9Lujmw_q-j7R0Ig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);