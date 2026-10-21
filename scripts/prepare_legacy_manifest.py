#!/usr/bin/env python3
"""Map the user-supplied legacy site galleries to the retained design snapshot."""
import json
import re
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
class GalleryParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cell = None
        self.group = ''
        self.heading = False
        self.entries = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h2':
            self.heading = True
            self.group = ''
        if tag == 'td' and a.get('class') == 'tds':
            self.cell = {'caption': '', 'group_title': self.group.strip()}
        if self.cell is not None and tag == 'a':
            self.cell['href'] = a.get('href', '').lstrip('/')
        if self.cell is not None and tag == 'img':
            self.cell['thumbnail'] = a.get('src', '').lstrip('/')
    def handle_data(self, text):
        if self.heading:
            self.group += text
        if self.cell is not None:
            self.cell['caption'] += ' ' + text.strip()
    def handle_endtag(self, tag):
        if tag == 'h2':
            self.heading = False
        if tag == 'td' and self.cell is not None:
            if 'href' in self.cell:
                self.cell['caption'] = ' '.join(self.cell['caption'].split())
                self.entries.append(self.cell)
            self.cell = None

def main():
    groups = {}
    for page, default in [('typesofstone', 'stones'), ('productsandservices', None), ('finishedobjects', 'objects')]:
        p = GalleryParser()
        p.feed((ROOT / f'reference/legacy/{page}.html').read_text())
        titles = list(dict.fromkeys(e['group_title'] for e in p.entries))
        for entry in p.entries:
            group = default or 'cat-' + str(titles.index(entry['group_title']) + 1)
            groups.setdefault(group, []).append(entry)
    snapshot = json.loads((ROOT / 'reference/asset-manifest.json').read_text())
    old_groups = defaultdict(list)
    for e in snapshot['gallery_entries']:
        old_groups[e['group']].append(e)
    entries = []
    differences = []
    def normalized(text):
        return re.sub(r'[\W_]+', '', text.casefold())
    for group, source in old_groups.items():
        actual = groups[group]
        assert len(source) == len(actual), f'Group count differs: {group}'
        for i, (old, new) in enumerate(zip(source, actual)):
            entry = {**new, 'group': group, 'snapshot_href': old['href'], 'snapshot_caption': old['caption']}
            entries.append(entry)
            if normalized(old['caption']) != normalized(new['caption']):
                differences.append({'group': group, 'position': i + 1, 'snapshot': old['caption'], 'legacy': new['caption']})
    paths = set(['images/logo.png', 'images/1_1.png', 'images/1_2.png'])
    for e in entries:
        paths.update([e['href'], e['thumbnail']])
    manifest = {'source_url': 'https://brukivka.org/', 'source_note': 'User supplied the legacy site on 2026-10-20. Gallery mapping uses group, sequence and caption comparison; no claim of byte equality with unavailable WebP.', 'assets': [{'path': p, 'url': 'https://brukivka.org/' + p} for p in sorted(paths)], 'gallery_entries': entries, 'caption_differences': differences}
    (ROOT / 'reference/legacy/asset-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'assets': len(paths), 'entries': len(entries), 'caption_differences': differences}, ensure_ascii=False, indent=2))
if __name__ == '__main__':
    main()
