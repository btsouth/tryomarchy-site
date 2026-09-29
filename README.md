# tryomarchy.com

The Try Omarchy page built from the actual Omarchy website source. It uses the same header, footer, theme picker, fonts, interactive pixel field, and ttfx wordmark animation as omarchy.org.

## Source and rebuild

`omarchy-source.json` records the pinned source commit from the [official-site proposal](https://github.com/omacom/omarchy-site/pull/461). Do not hand-edit `index.html` or `_astro`; these are generated output.

To rebuild with Node 24+ and Python 3:

```
python3 scripts/export-omarchy.py
```

An optional path to an existing source checkout reuses its installed dependencies. The exporter copies the pinned commit into a temporary build directory. It adjusts only the standalone entry point, metadata, and outbound navigation, adds the Linux material from `source-overlay/`, then copies the static output and required assets. The source checkout is not modified.

## Linux

Linux is on tryomarchy.com only; the upstream proposal still covers Mac and Windows. `source-overlay/` holds it:

- `try-page-linux.patch` adds Linux to the Try page: the hero, the preview tabs, a download card and a quick start. The export stops if the patch no longer applies to the pinned revision.
- `src/astro/pages/LinuxPage.tsx` and `src/pages/linux.astro` build `/linux/`, with install steps for Software, Ubuntu and the terminal.
- `src/components/icons/LinuxIcon.tsx` is Tux from Simple Icons (CC0).
- `public/images/linux/` holds the demo video and poster from the [Linux repository](https://github.com/btsouth/try-omarchy-linux/tree/master/docs/images).

`linux.flatpakref` is the installer every Linux link points to. It must match the `.flatpakref` in the latest Linux app release, which adds the update repository at `https://flatpak.tryomarchy.com/repo/`. `_headers` serves it with the Flatpak MIME type so browsers hand it to Software.

The shared components and styles come directly from that source. Omarchy navigation and language links lead to the official site. Local download links stay on this page. The official site's analytics integration is omitted; Cloudflare injects its existing Web Analytics script independently.

## Deployment

Cloudflare Pages project `tryomarchy`, connected to `btsouth/tryomarchy-site` on `main`. A push to main deploys to https://tryomarchy.com and www. No server runtime or Cloudflare build step is required.

Preview with `python3 -m http.server 18770 --bind 127.0.0.1`.

Check desktop and mobile layouts, the theme picker, search, footer, and animated wordmark before deploying. Verify that `/ttfx/effects/all.wasm` loads and that the canvas changes across frames. Audio plays only on request; reduced-motion preferences remain respected by the upstream animation engine.

## Media and attribution

Mac screenshot: https://github.com/user-attachments/assets/1368a8f5-5099-43e4-8d3b-3d7d7fba0326 from the [Mac README](https://github.com/omacom/try-omarchy). Windows screenshot and video are the existing website captures. Captured app versions are unknown. A maintainer-provided Mac recording can replace the still later.

Brand assets, theme previews, UI source, fonts, and ttfx engine are from the pinned Omarchy site. The Omarchy brand remains subject to its trademark rights. The optional music track is “We Can Fix Everything (The Ultimate Machine)” by Kevin Koontz, credited in the shared music control. Font license notices remain in `fonts/OFL.txt`.

## Downloads and migration

Keep `/download`, `/TryOmarchy.exe`, `/bootstrap.ps1`, `/linux/`, and `/linux.flatpakref` working. After the official `/try/` page is approved and live, redirect the landing page to `https://omarchy.org/try/`. Preserve executable and bootstrap routes. No landing-page redirect is enabled yet.
