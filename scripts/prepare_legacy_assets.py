#!/usr/bin/env python3
"""Verify and copy original legacy JPG/PNG bytes, then generate gallery metadata."""
import hashlib
import json
import shutil
import struct
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def dimensions(path):
    b = path.read_bytes()
    if b[:8] == b'\x89PNG\r\n\x1a\n':
        return struct.unpack('>II', b[16:24])
    if b[:2] == b'\xff\xd8':
        offset = 2
        while offset < len(b):
            if b[offset] != 255:
                raise ValueError(f'Invalid JPEG: {path}')
            while b[offset] == 255:
                offset += 1
            marker = b[offset]
            offset += 1
            if marker in [0xd8, 0xd9] or 0xd0 <= marker <= 0xd7:
                continue
            length = int.from_bytes(b[offset:offset + 2], 'big')
            if marker in [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]:
                height, width = struct.unpack('>HH', b[offset + 3:offset + 7])
                return width, height
            offset += length
    raise ValueError(f'Unsupported or corrupt image: {path}')

def main():
    manifest = json.loads((ROOT / 'reference/legacy/asset-manifest.json').read_text())
    report = json.loads((ROOT / 'reference/legacy/site/download-report.json').read_text())
    results = {r['path']: r for r in report['results']}
    measured = {}
    copied = []
    for asset in manifest['assets']:
        name = asset['path']
        source = ROOT / 'reference/legacy/site' / name
        r = results.get(name, {})
        if r.get('status') not in ['downloaded', 'verified_existing'] or not source.is_file():
            raise SystemExit('Missing/unverified: ' + name)
        if hashlib.sha256(source.read_bytes()).hexdigest() != r['sha256']:
            raise SystemExit('Hash mismatch: ' + name)
        w, h = dimensions(source)
        measured[name] = {'width': w, 'height': h}
        target = ROOT / 'public' / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        assert hashlib.sha256(target.read_bytes()).hexdigest() == r['sha256']
        copied.append({'path': name, 'sha256': r['sha256'], 'bytes': source.stat().st_size, 'width': w, 'height': h})
    groups = {}
    mapping = {}
    for index, e in enumerate(manifest['gallery_entries']):
        large = e['href']
        w, h = measured[large].values()
        # Legacy 90px thumbnails are kept intact. Use the existing large file for cards;
        # no new crop/resized variant is created and the full material remains visible.
        item = {'id': str(index + 1), 'src': large, 'large': large, 'thumbnail': e['thumbnail'],
                'caption': e['snapshot_caption'], 'alt': e['snapshot_caption'],
                'width': w, 'height': h, 'variants': [{'src': large, 'width': w}]}
        groups.setdefault(e['group'], []).append(item)
        mapping[e['snapshot_href']] = large
    for group, items in groups.items():
        (ROOT / f'app/data/galleries/{group}.ts').write_text("// Generated from brukivka.org original photos; see reference/legacy/asset-manifest.json.\nimport type { ImageAsset } from '~/types/catalog'\nexport default " + json.dumps(items, ensure_ascii=False, indent=2) + ' satisfies ImageAsset[]\n')
    featured = {'stones': groups['stones'][:4], 'objects': groups['objects'][:3]}
    (ROOT / 'app/data/featured.ts').write_text("// Generated from original legacy photos.\nimport type { ImageAsset } from '~/types/catalog'\nexport const featured = " + json.dumps(featured, ensure_ascii=False, indent=2) + ' satisfies Record<string, ImageAsset[]>\n')
    (ROOT / 'app/data/available-assets.ts').write_text('// Generated after byte verification.\nexport const availableAssets = new Set<string>(' + json.dumps(list(measured)) + ')\nexport const assetDimensions: Record<string, { width: number; height: number }> = ' + json.dumps(measured) + '\n')
    (ROOT / 'reference/legacy/copy-report.json').write_text(json.dumps({'source': 'https://brukivka.org/', 'copied_count': len(copied), 'mapped_gallery_entries': len(mapping), 'total_bytes': sum(c['bytes'] for c in copied), 'files': copied}, ensure_ascii=False, indent=2) + '\n')
    print(f'Copied/verified {len(copied)} original files; mapped {len(mapping)} entries. No recompression.')
if __name__ == '__main__':
    main()
