// ============================================================
//  supabase.js  —  Configuración del cliente Supabase
//  ⚠️  Reemplaza los valores con los de tu proyecto en:
//      supabase.com → Settings → API
// ============================================================

const SUPABASE_URL  = 'https://kttmhqqcdbqlaafgwfwt.supabase.co';  // 👈 cambia esto
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dG1ocXFjZGJxbGFhZmd3Znd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTczNzQsImV4cCI6MjA5NDYzMzM3NH0.c1Yu4nWySfKfs80M4arxQPlFjZcK13w0xuoO83T1cJE';                 // 👈 cambia esto

// Importamos la librería desde CDN (ya debe estar en el <head> del HTML)
const { createClient } = supabase;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
