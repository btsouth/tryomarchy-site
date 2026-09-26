# tryomarchy.com

Try Omarchy for Mac and Windows. Static HTML, CSS, and JavaScript with local fonts and real product media. No build step or third-party runtime dependencies in the source. Cloudflare injects its Web Analytics script on the live site.

## Deployment

Cloudflare Pages project `tryomarchy`, connected to `btsouth/tryomarchy-site` on `main`. A push to main deploys automatically to https://tryomarchy.com and www.

Preview locally with `python3 -m http.server 18770 --bind 127.0.0.1`.

## Content and media

Mac screenshot: https://github.com/user-attachments/assets/1368a8f5-5099-43e4-8d3b-3d7d7fba0326 from the [Mac README](https://github.com/omacom/try-omarchy), retrieved 2026-09-25. Windows screenshot and video are the existing website captures. Captured app versions are unknown. Replace these with current real captures when available; do not simulate a Mac recording with Windows footage.

The Mac screenshot and Windows poster are compressed to WebP. Windows video only loads when requested and pauses when switching platforms. Animation pauses offscreen, in hidden tabs, and under reduced motion. The footer also has a motion toggle. Theme and preview preferences stay in local storage.

The Omarchy mark and wordmark come from the official brand kit and remain subject to Omarchy trademark rights. Inline UI icons follow simple Lucide-style geometry. Fonts are locally hosted under their existing OFL license.

## Downloads and migration

Download links resolve to latest stable release assets. Recheck requirements against both app READMEs when releases change.

Keep `/download`, `/TryOmarchy.exe`, and `/bootstrap.ps1` working. After the proposed official `/try/` page is approved and live, redirect only the landing page to `https://omarchy.org/try/`. Preserve the download and bootstrap routes, and verify www, root, and all three compatibility paths after deployment. Do not redirect to an unpublished page.
