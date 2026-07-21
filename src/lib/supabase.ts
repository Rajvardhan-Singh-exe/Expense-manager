import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://zekjbpdmeywuchtwmagn.supabase.co'

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpla2picGRtZXl3dWNodHdtYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NTA3OTAsImV4cCI6MjEwMDIyNjc5MH0.MKTKovLvwV_eXRczUIvn_acEh6rKU0H3XxUfGBu37VM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
