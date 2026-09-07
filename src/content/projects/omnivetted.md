---
title: "Omnivetted"
tagline: "AI-Curated Tools Directory with Autonomous Pipeline"
description: "An AI tools directory platform featuring a fully autonomous discovery and curation pipeline. The system scrapes websites, uses LLMs (Gemini) to evaluate and score tools, auto-extracts preview images, and publishes vetted listings directly to a Supabase-backed Astro frontend."
category: "AI & Automation"
tags: ["Astro", "Supabase", "Python", "Tailwind CSS", "daisyUI", "AI/LLM", "Web Scraping", "Automation Pipeline"]
role: "Solo Developer"
period: "2025"
liveUrl: "https://omnivetted.com"
featured: true
order: 1
publishedAt: 2025-08-01
---

## Overview

Omnivetted is an AI tools discovery platform built around a fully autonomous curation pipeline. Instead of manually researching and writing up every listing, the system does the heavy lifting end-to-end: discovering fresh tools, scraping and cleaning their content, evaluating them with an AI engine, and publishing structured listings straight into the database.

## The Pipeline

The backbone of the project is a Python-based automation pipeline (`omnivetted-pipeline`) that runs in four stages for every tool:

1. **Scrape** — Fetches and cleans the target website's content, stripping noise to isolate meaningful text.
2. **AI Evaluation** — Sends the cleaned content to an AI engine (Gemini) which generates a name, tagline, description, category, pricing type, and a benchmark score.
3. **Image Extraction** — Automatically extracts an OpenGraph/preview image from the source site and uploads it to Supabase Storage.
4. **Publish** — Upserts the finalized listing into a Supabase `tools` table, going live instantly on the frontend.

The pipeline supports three modes: single URL processing, batch processing from a file of URLs, and a fully autonomous **auto-discovery mode** that finds fresh, unindexed tools from the web and processes them in batches — no human input required.

## Frontend

The public-facing directory is built with **Astro** (server output) and **Tailwind CSS + daisyUI**, querying **Supabase** directly for live tool data. Each listing gets a clean, SEO-friendly slug and a dedicated detail page.

## Key Technical Highlights

- End-to-end automation from raw URL to published listing with zero manual data entry.
- LLM-based content evaluation and structured data extraction (name, category, score, pricing model).
- Automated image pipeline: extraction, upload, and CDN-ready storage via Supabase.
- Idempotent database writes using `upsert` on slug to safely re-run and update existing entries.
- Modular architecture separating scraping, AI processing, image handling, and discovery logic into independent components.
