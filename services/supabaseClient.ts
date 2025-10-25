import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lexzgtmqduxojscssrcf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleHpndG1xZHV4b2pzY3NzcmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODIwMDIsImV4cCI6MjA3Njk1ODAwMn0._lCz1AcgsbZjDxep5tbHpcSAPF3C8x7lPQUnFNIkkPY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);