import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mqklhyqprouooifigdyq.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2xoeXFwcm91b29pZmlnZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTg4OTUsImV4cCI6MjA5NDYzNDg5NX0.e0HrO9U25VMauzoqvP4cBKTZNUamFSELt4ojV-zULcs";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);