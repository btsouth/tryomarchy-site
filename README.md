# tryomarchy.com

The Try Omarchy page built from the actual Omarchy website source. It uses the same header, footer, theme picker, fonts, interactive pixel field, and ttfx wordmark animation as omarchy.org.

## Source and rebuild

`omarchy-source.json` records the pinned source commit from the [official-site proposal](https://github.com/omacom/omarchy-site/pull/461). Do not hand-edit `index.html` or `_astro`; these are generated output.

To rebuild with Node 24+ and Python 3:

```
python3 scripts/export-omarchy.py
```

An optional path to an existing source checkout reuses its installed dependencies. The exporter copies the pinned commit into a temporary build directory. It adjusts only the standalone entry points, metadata, and outbound navigation, then copies the static output and required assets. The source checkout is not modified.

## Linux

Linux is part of the upstream proposal. Its `TryPage` covers Mac, Windows and Linux, and `TryLinuxPage` is the Linux setup page, served upstream at `/try/linux/`. The exporter builds `TryLinuxPage` at `/linux/` here, the address the launch posts and the installer's homepage use, and points the two links between the pages at `/` and `/linux/`. `_redirects` sends `/try/` and `/try/linux/` to the same pages.

`linux.flatpakref` is the installer every Linux link points to, on this site and in the upstream proposal. It must match the `.flatpakref` in the latest Linux app release, which adds the update repository at `https://flatpak.tryomarchy.com/repo/`. `_headers` serves it with the Flatpak MIME type so browsers hand it to Software.

The shared components and styles come directly from that source. Omarchy navigation and language links lead to the official site. Local download links stay on this page. The official site's analytics integration is omitted; Cloudflare injects its existing Web Analytics script independently.

The exporter updates the Linux FAQ, requirement badges and launcher button names to match the published app release.

## Deployment

Cloudflare Pages project `tryomarchy`, connected to `btsouth/tryomarchy-site` on `main`. A push to main deploys to https://tryomarchy.com and www. No server runtime or Cloudflare build step is required.

Preview with `python3 -m http.server 18770 --bind 127.0.0.1`.

Check desktop and mobile layouts, the theme picker, search, footer, and animated wordmark before deploying. Verify that `/ttfx/effects/all.wasm` loads and that the canvas changes across frames. Audio plays only on request; reduced-motion preferences remain respected by the upstream animation engine.

## Media and attribution

Mac screenshot: https://github.com/user-attachments/assets/1368a8f5-5099-43e4-8d3b-3d7d7fba0326 from the [Mac README](https://github.com/omacom/try-omarchy). The Windows still is a frame of the Windows 11 laptop recording, and the Linux still is Ubuntu 24.04 running Linux preview 3; `docs/try-media.md` in the source has the capture details. The Mac and Windows app versions are unknown. A maintainer-provided Mac recording can replace the still later.

Brand assets, theme previews, UI source, fonts, and ttfx engine are from the pinned Omarchy site. The Omarchy brand remains subject to its trademark rights. The optional music track is “We Can Fix Everything (The Ultimate Machine)” by Kevin Koontz, credited in the shared music control. Font license notices remain in `fonts/OFL.txt`.

## Downloads and migration

`/import` redirects to the latest Windows release's importer bootstrap, so the
launcher can show `curl -fsSL https://tryomarchy.com/import | bash`. Preserve
this route alongside the download and bootstrap routes.

Keep `/download`, `/TryOmarchy.exe`, `/bootstrap.ps1`, `/linux/`, and `/linux.flatpakref` working. After the official `/try/` page is approved and live, redirect the landing page to `https://omarchy.org/try/` and `/linux/` to `https://omarchy.org/try/linux/`. Keep serving `/linux.flatpakref` here, since the official page links to it, and preserve the executable and bootstrap routes. No landing-page redirect is enabled yet.
