import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error, count } = await supabase
  .from('notes')
  .select('id', { count: 'exact', head: true });

if (error) {
  console.error('Keep-alive query failed:', error.message);
  process.exit(1);
}

console.log(`Keep-alive OK — notes table reachable (count: ${count ?? 'n/a'}).`);
