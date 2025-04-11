import { NextConfig } from 'next';

// This configuration ensures that:
// 1. The page is dynamically rendered at runtime
// 2. Static paths are still generated for i18n
// 3. Data fetching is always fresh
export const dynamic = 'force-dynamic';

// Allow static generation of i18n paths
export const dynamicParams = true;

// Use Node.js runtime for Supabase
export const runtime = 'nodejs';

// Disable fetch caching to ensure fresh data
export const fetchCache = 'default-no-store';

export const revalidate = 0; // Disable static page generation for this segment 