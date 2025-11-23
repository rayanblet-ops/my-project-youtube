import { createClient } from '@supabase/supabase-js';

// Supabase Project URL (извлечен из JWT токена: ref = mhiiswceyaitskrrqspf)
const supabaseUrl = 'https://mhiiswceyaitskrrqspf.supabase.co';

// Supabase Anon (public) key - JWT токен
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oaWlzd2NleWFpdHNrcnJxc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDQwNzAsImV4cCI6MjA3OTQyMDA3MH0.zTzCkTkCb5ozX059nZW9reHYWlG9ftGwRQlE_eoZ67E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
