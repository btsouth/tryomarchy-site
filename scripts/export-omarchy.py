#!/usr/bin/env python3
"""Build the standalone page from the pinned official-site proposal.

Usage: python3 scripts/export-omarchy.py [existing source checkout]
The checkout is only read. All adjustments happen in a temporary directory.
"""
from pathlib import Path
import json
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
REVISION = '173d1c7f7adbc642b6898b765275adeed0c0e261'
SOURCE = 'https://github.com/btsouth/omarchy-site.git'


def run(*args, cwd=None):
    subprocess.run(args, cwd=cwd, check=True)


def edit(path, before, after):
    text = path.read_text()
    if before not in text:
        raise RuntimeError(f'Upstream integration point changed: {path.name}')
    path.write_text(text.replace(before, after))


with tempfile.TemporaryDirectory(prefix='tryomarchy-native-') as temp:
    temp = Path(temp)
    if len(sys.argv) > 1:
        source = Path(sys.argv[1]).resolve()
    else:
        source = temp / 'source'
        run('git', 'clone', SOURCE, str(source))
    work = temp / 'build'
    work.mkdir()
    archive = subprocess.check_output(['git', 'archive', REVISION], cwd=source)
    subprocess.run(['tar', '-x', '-C', str(work)], input=archive, check=True)
    # Reuse installed dependencies when rebuilding on the development box.
    if (source / 'node_modules').is_dir():
        (work / 'node_modules').symlink_to(source / 'node_modules', target_is_directory=True)
    else:
        run('npm', 'ci', cwd=work)

    # Only hosting/navigation changes. Shared header, footer, shaders, theme
    # picker, styles, icons, and fonts are reused, with only link destinations adapted.
    (work / 'src/pages/index.astro').write_text('''---
import Base from '../layouts/Base.astro'
import { TryPage } from '@/astro/pages/TryPage'
---
<Base title="Try Omarchy on Mac and Windows" description="Explore the Omarchy Linux desktop in a virtual machine on your Mac or Windows PC. Free, open source, and no dual boot required." path="/">
  <TryPage client:load />
</Base>
''')
    base = work / 'src/layouts/Base.astro'
    edit(base, "import { ClientRouter } from 'astro:transitions'", '')
    edit(base, '<ClientRouter fallback="swap" />', '')
    edit(base, 'const url = `${SITE_URL}${path}`', "const url = 'https://tryomarchy.com/'")
    edit(base, 'const ogImage = socialImage(path)', "const ogImage = { url: 'https://tryomarchy.com/og.png', width: '1200', height: '630', alt: 'Try Omarchy on Mac and Windows' }")
    text = base.read_text()
    text = re.sub(r'\s*<script is:inline defer data-domain="omarchy.org"[^>]+/>', '', text)
    text = re.sub(r'\s*\{Object.entries\(locales\).*?\)\)\}', '', text, flags=re.S)
    text = re.sub(r'\s*<link rel="alternate" hreflang="x-default"[^>]+/>', '', text)
    base.write_text(text)
    edit(work / 'src/i18n/site.ts', 'export function localizedHref(href: string): string {', '''export function localizedHref(href: string): string {
  if (href.startsWith('/') && !href.startsWith('//')) {
    if (/^\\/try\\/?(?:[?#]|$)/.test(href)) return href.replace(/^\\/try\\/?/, '/')
    return `https://omarchy.org${href}`
  }''')
    edit(work / 'src/astro/router-shim.tsx', "return navigate(href, { history: replace ? 'replace' : 'push' })", "if (new URL(href, window.location.href).origin !== window.location.origin) { window.location.assign(href); return Promise.resolve() }\n    return navigate(href, { history: replace ? 'replace' : 'push' })")
    edit(work / 'src/lib/hash-scroll.ts', "if (window.location.pathname === '/') {", "if (window.location.origin === 'https://omarchy.org' && window.location.pathname === '/') {")
    # Native <a> links outside the Link wrapper need their public destination.
    edit(work / 'src/components/SiteHeader.tsx', 'href="/news/rss.xml"', 'href="https://omarchy.org/news/rss.xml"')
    # TryPage is deliberately untouched: copy, media, and interactions are
    # the exact component proposed upstream, not a standalone variant.
    run('npm', 'run', 'build', cwd=work)
    built = work / 'dist/client'
    # Keep these checks close to the exporter: missing WASM was the easiest
    # way to accidentally ship a static wordmark in place of the real effect.
    for required in ['index.html', 'ttfx/0.3.2/ttfx.js', 'ttfx/effects/all.wasm',
                     'music/kevin_koontz-we_can_fix_everything.mp3',
                     'data/search-index.json']:
        assert (built / required).is_file(), required
    for directory in ['_astro', 'ttfx', 'music', 'images/try', 'assets/images/theme-previews']:
        dest = ROOT / directory
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(built / directory, dest)
    for filename in ['index.html', 'brand/omarchy-logo.svg', 'brand/omarchy-wordmark.svg', 'data/search-index.json', 'data/explorer.json']:
        dest = ROOT / filename
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(built / filename, dest)
    # Keep old shared page anchors working for previously shared links.
    html = (ROOT / 'index.html').read_text()
    html = html.replace('<body>', '''<body><script>if(location.hash==='#to-mac'||location.hash==='#to-windows'){history.replaceState(history.state,'',location.pathname+location.search+location.hash.replace('#to-','#'))}</script>''')
    (ROOT / 'index.html').write_text(html)
    (ROOT / 'omarchy-source.json').write_text(json.dumps({
        'repository': SOURCE, 'revision': REVISION,
        'proposal': 'https://github.com/omacom/omarchy-site/pull/461',
        'sharedComponents': ['SiteHeader', 'SiteFooter', 'HeroShader', 'HeroPixelField', 'ThemePicker', 'SearchPalette', 'MusicControl'],
    }, indent=2) + '\n')
    print('Exported the native Omarchy page to', ROOT)
