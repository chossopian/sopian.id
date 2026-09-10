import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] SUPABASE_URL or SUPABASE_ANON_KEY is not set. Blog features will not work until these are configured in .env'
  );
} else {
  console.log(`[supabase] Using Supabase URL: ${supabaseUrl}`);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    // Fail fast instead of hanging if the self-hosted instance is slow/unreachable
    global: {
      fetch: (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        return fetch(url, { ...options, signal: controller.signal }).finally(() =>
          clearTimeout(timeoutId)
        );
      },
    },
  }
);

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// --- Simple in-memory cache (per server process) ---
// Avoids hitting Supabase on every single request, which was causing
// multi-second delays on the /blog pages. TTL keeps content reasonably fresh.
const CACHE_TTL_MS = 60_000; // 1 minute

let postsCache: { data: Post[]; expiresAt: number } | null = null;
const postCacheBySlug = new Map<string, { data: Post | null; expiresAt: number }>();

export async function getPublishedPosts(): Promise<Post[]> {
  if (postsCache && postsCache.expiresAt > Date.now()) {
    return postsCache.data;
  }

  const startTime = Date.now();
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    console.log(`[supabase] getPublishedPosts took ${Date.now() - startTime}ms`);

    if (error) {
      console.error('[supabase] Failed to fetch posts:', error.message);
      // Serve stale cache if available instead of an empty list
      return postsCache?.data ?? [];
    }

    const posts = data as Post[];
    postsCache = { data: posts, expiresAt: Date.now() + CACHE_TTL_MS };
    return posts;
  } catch (err) {
    console.error(`[supabase] Error fetching posts after ${Date.now() - startTime}ms (timeout or network issue):`, err);
    return postsCache?.data ?? [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const cached = postCacheBySlug.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('[supabase] Failed to fetch post:', error.message);
      return cached?.data ?? null;
    }

    const post = data as Post;
    postCacheBySlug.set(slug, { data: post, expiresAt: Date.now() + CACHE_TTL_MS });
    return post;
  } catch (err) {
    console.error('[supabase] Error fetching post (timeout or network issue):', err);
    return cached?.data ?? null;
  }
}
