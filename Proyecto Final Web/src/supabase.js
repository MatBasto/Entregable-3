import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hksxaaphqkzlaegfucmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrc3hhYXBocWt6bGFlZ2Z1Y21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzA0MjcsImV4cCI6MjA2MzY0NjQyN30.Up5MQ3JslFIKpw3QGqJ6W76AB4aWMyOLBTeoqMrEvHw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
