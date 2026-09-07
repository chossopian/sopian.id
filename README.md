# sopian.id — Personal Portfolio

Personal portfolio website for **Muhamad Sopian** — Application Developer & IT Administrative Specialist.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and [Supabase](https://supabase.com) (self-hosted).

## Tech Stack

- **Framework:** Astro 7 (server output, `@astrojs/node` adapter)
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **Projects:** Astro Content Collections (markdown files, version-controlled)
- **Blog:** Supabase Postgres table (`posts`) — supports future auto-publishing pipelines
- **Deployment:** Docker + Dokploy (self-hosted)

## Project Structure

```text
/
├── src/
│   ├── components/       # Reusable Astro components (Header, Footer, Hero, etc.)
│   ├── content/
│   │   └── projects/     # Markdown files — one per project
│   ├── content.config.ts # Content Collections schema
│   ├── data/
│   │   └── profile.ts    # CV data: skills, experience, education
│   ├── layouts/
│   │   └── Layout.astro  # Base HTML layout, SEO, dark mode, view transitions
│   ├── lib/
│   │   └── supabase.ts   # Supabase client + blog post queries
│   └── pages/
│       ├── index.astro           # Homepage
│       ├── projects/index.astro  # Projects listing
│       ├── projects/[slug].astro # Project detail (prerendered)
│       ├── blog/index.astro      # Blog listing (SSR, from Supabase)
│       └── blog/[slug].astro     # Blog post detail (SSR, from Supabase)
├── supabase/
│   └── schema.sql         # SQL schema for the `posts` table + RLS policies
├── Dockerfile
└── astro.config.mjs
```

## Development

```bash
npm install
cp .env.example .env   # then fill in your Supabase credentials
npm run dev
```

Visit `http://localhost:4321`.

## Adding a New Project

Create a new markdown file in `src/content/projects/`, e.g. `my-project.md`:

```markdown
---
title: "My Project"
tagline: "Short one-liner"
description: "Longer description shown on cards and SEO meta."
category: "Web Development"
tags: ["Astro", "TypeScript"]
role: "Solo Developer"
period: "2025"
featured: true
order: 3
---

## Overview

Write the full case study here in Markdown.
```

The project will automatically appear on `/projects` and `/projects/my-project`.

## Managing Blog Posts

Blog posts live in Supabase (table: `posts`), **not** in the git repo — this is intentional, to support future automated/AI-generated content pipelines.

1. Run `supabase/schema.sql` once on your self-hosted Supabase instance to create the `posts` table.
2. To write a post manually: open **Supabase Studio** → `posts` table → insert a new row (`title`, `slug`, `content` in Markdown, `status: 'published'`, `published_at`).
3. The post immediately appears on `/blog` and `/blog/{slug}` — no rebuild/redeploy needed, since blog pages are server-rendered.

## Environment Variables

See `.env.example`:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL of your self-hosted Supabase instance |
| `SUPABASE_ANON_KEY` | Public anon key (read-only access to published posts via RLS) |
| `PUBLIC_SITE_URL` | Public site URL, used for canonical links |

## Deployment (Dokploy)

This project includes a multi-stage `Dockerfile` ready for Dokploy:

1. Push this repo to GitHub.
2. In Dokploy, create a new **Application** from the GitHub repo.
3. Set build type to **Dockerfile**.
4. Add the environment variables listed above in the Dokploy app settings.
5. Deploy. The app listens on port `4321`.
