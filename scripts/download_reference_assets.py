#!/usr/bin/env python3
"""Download only the local reference assets listed in the handoff manifest."""
import argparse
import hashlib
import json
import os
import tempfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]


def checked_path(value):
    path = PurePosixPath(value)
    if not value or path.is_absolute() or '..' in path.parts or '\\' in value:
        raise ValueError('Unsafe manifest path: ' + value)
    return path


def download(asset, destination, source, overwrite, previous):
    relative = checked_path(asset['path'])
    url = asset['url']
    origin = urlsplit(source)
    parsed = urlsplit(url)
    expected = origin.path.rstrip('/') + '/' + relative.as_posix()
    if parsed.scheme != 'https' or parsed.netloc != origin.netloc or unquote(parsed.path) != expected:
        raise ValueError('URL is outside the reference directory: ' + url)
    target = destination.joinpath(*relative.parts).resolve()
    if not target.is_relative_to(destination):
        raise ValueError('Destination escapes selected directory')
    if target.exists() and not overwrite:
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        old = previous.get(asset['path'])
        if old and old.get('sha256') == digest and old.get('status') in ('downloaded', 'verified_existing'):
            return {'path': asset['path'], 'url': url, 'status': 'verified_existing',
                    'bytes': target.stat().st_size, 'sha256': digest}
        return {'path': asset['path'], 'url': url, 'status': 'existing_unverified',
                'error': 'File exists without matching successful report; inspect or use --overwrite.'}
    last_error = ''
    for _ in range(2):
        temp_name = None
        try:
            request = Request(url, headers={'User-Agent': 'Brukivka-reference-transfer/1.0'})
            with urlopen(request, timeout=25) as response:
                final = urlsplit(response.geturl())
                if final.scheme != 'https' or final.netloc != origin.netloc:
                    raise ValueError('Unexpected cross-origin redirect')
                data = response.read(25 * 1024 * 1024 + 1)
                content_type = response.headers.get('Content-Type', '')
            if not data or len(data) > 25 * 1024 * 1024:
                raise ValueError('Empty asset or asset exceeds 25 MiB')
            if 'text/html' in content_type.lower() or data.lstrip()[:15].lower().startswith((b'<!doctype html', b'<html')):
                raise ValueError('Received HTML instead of an asset')
            target.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as handle:
                temp_name = handle.name
                handle.write(data)
            os.replace(temp_name, target)
            return {'path': asset['path'], 'url': url, 'status': 'downloaded',
                    'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
                    'content_type': content_type}
        except Exception as error:
            last_error = str(error)
            if temp_name:
                Path(temp_name).unlink(missing_ok=True)
    return {'path': asset['path'], 'url': url, 'status': 'failed', 'error': last_error}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', type=Path, default=ROOT / 'reference/asset-manifest.json')
    parser.add_argument('--destination', type=Path, default=ROOT / 'reference/site')
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--overwrite', action='store_true', help='Replace already downloaded assets.')
    parser.add_argument('--dry-run', action='store_true', help='Validate manifest without network or writes.')
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text(encoding='utf-8'))
    destination = args.destination.resolve()
    assets = manifest['assets']
    for item in assets:
        checked_path(item['path'])
    if args.dry_run:
        print(json.dumps({'assets': len(assets), 'destination': str(destination), 'network_requests': 0}))
        return 0
    destination.mkdir(parents=True, exist_ok=True)
    report_path = destination / 'download-report.json'
    previous = {}
    if report_path.exists():
        previous = {x['path']: x for x in json.loads(report_path.read_text(encoding='utf-8')).get('results', [])}
    with ThreadPoolExecutor(max_workers=max(1, min(args.workers, 8))) as pool:
        results = list(pool.map(lambda item: download(item, destination, manifest['source_url'], args.overwrite, previous), assets))
    failures = [x for x in results if x['status'] not in ('downloaded', 'verified_existing')]
    report = {'source_url': manifest['source_url'], 'generated_at': datetime.now(timezone.utc).isoformat(),
              'results': results, 'success_count': len(results) - len(failures), 'failure_count': len(failures)}
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'success': report['success_count'], 'failed_or_unverified': len(failures),
                      'report': str(report_path)}, ensure_ascii=False))
    for failure in failures:
        print(failure['path'] + ': ' + failure['error'])
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
