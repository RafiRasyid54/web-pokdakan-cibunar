import { createClient } from '@supabase/supabase-js';

// URL dan Key dibungkus dengan tanda kutip karena merupakan tipe data string
const supabaseUrl = 'https://jilkomuicnukwwibiztt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbGtvbXVpY251a3d3aWJpenR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTgyMTcsImV4cCI6MjA5Njk5NDIxN30.M_5Lgno6K0ssiinjeBUTbP3Mn3HMTgOcA-Tw6kaNvLI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);