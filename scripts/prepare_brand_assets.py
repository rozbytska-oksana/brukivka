"""Export the authored vector brand and favicon assets; Python standard library only."""

from pathlib import Path
import json
import math
import struct
import zlib

ROOT = Path(__file__).resolve().parent.parent
BRAND = json.loads((ROOT / "app/assets/brand/geometry.json").read_text())
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "brand"
OUTPUT.mkdir(exist_ok=True)
SCALE = 4


def points(value):
    return [tuple(map(float, point.split(","))) for point in value.split()]


def rgba(value):
    return tuple(bytes.fromhex(value.lstrip("#"))) + (255,)


def path(contours):
    return " ".join(f'M{contour.replace(" ", "L")}Z' for contour in contours)


def mark_svg(compact=False):
    mark = BRAND["mark"]
    polygons = mark["outline"] + mark["compactStones" if compact else "stones"]
    return "".join(f'<polygon points="{polygon}"/>' for polygon in polygons)


def logo_svg(theme):
    colors = BRAND["colors"][theme]
    word = BRAND["wordmark"]
    letters = "".join(
        f'<path d="{path(glyph["contours"])}" '
        f'transform="translate({glyph["x"]} {word["baselineOffset"]})"/>'
        for glyph in word["glyphs"]
    )
    dot = word["dot"]
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{word["viewBox"]}" '
        'width="360" height="64" role="img" aria-label="BRUKIVKA">'
        f'<g fill="{colors["accent"]}">{mark_svg()}</g>'
        f'<g fill="{colors["ink"]}" fill-rule="evenodd">{letters}</g>'
        f'<rect x="{dot["x"]}" y="{dot["y"]}" width="{dot["size"]}" '
        f'height="{dot["size"]}" fill="{colors["accent"]}"/></svg>\n'
    )


def polygon_fill(canvas, width, height, contours, color):
    """Rasterize pixel centers with even-odd fill, including glyph counters."""
    edges = [(a, b) for contour in contours for a, b in zip(contour, contour[1:] + contour[:1])]
    top = max(0, math.floor(min(y for contour in contours for _, y in contour)))
    bottom = min(height, math.ceil(max(y for contour in contours for _, y in contour)))
    for row in range(top, bottom):
        y = row + 0.5
        crossings = sorted(
            a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
            for a, b in edges
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1])
        )
        for left, right in zip(crossings[::2], crossings[1::2]):
            start = max(0, math.ceil(left - 0.5))
            end = min(width, math.ceil(right - 0.5))
            if end > start:
                offset = (row * width + start) * 4
                canvas[offset:offset + (end - start) * 4] = bytes(color) * (end - start)


def transform(contours, scale, x=0, y=0):
    return [[((px * scale + x) * SCALE, (py * scale + y) * SCALE) for px, py in contour]
            for contour in contours]


def draw_mark(canvas, width, height, scale, x, y, color, compact=False):
    mark = BRAND["mark"]
    for contour in mark["outline"] + mark["compactStones" if compact else "stones"]:
        polygon_fill(canvas, width, height, transform([points(contour)], scale, x, y), color)


def draw_logo(canvas, width, height, scale, x, y, theme):
    colors = BRAND["colors"][theme]
    draw_mark(canvas, width, height, scale, x, y, rgba(colors["accent"]))
    word = BRAND["wordmark"]
    for glyph in word["glyphs"]:
        contours = [points(contour) for contour in glyph["contours"]]
        polygon_fill(canvas, width, height,
                     transform(contours, scale, x + glyph["x"] * scale,
                               y + word["baselineOffset"] * scale), rgba(colors["ink"]))
    dot = word["dot"]
    dx, dy, size = dot["x"], dot["y"], dot["size"]
    polygon_fill(canvas, width, height,
                 transform([[(dx, dy), (dx + size, dy), (dx + size, dy + size), (dx, dy + size)]],
                           scale, x, y), rgba(colors["accent"]))


def downsample(canvas, width, height):
    result = bytearray(width * height * 4)
    stride = width * SCALE * 4
    for y in range(height):
        for x in range(width):
            red = green = blue = alpha = 0
            for sy in range(SCALE):
                offset = (y * SCALE + sy) * stride + x * SCALE * 4
                for sx in range(SCALE):
                    at = offset + sx * 4
                    a = canvas[at + 3]
                    red += canvas[at] * a
                    green += canvas[at + 1] * a
                    blue += canvas[at + 2] * a
                    alpha += a
            at = (y * width + x) * 4
            if alpha:
                result[at:at + 4] = bytes((round(red / alpha), round(green / alpha),
                                          round(blue / alpha), round(alpha / SCALE ** 2)))
    return result


def png_bytes(pixels, width, height):
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))
    rows = b"".join(b"\0" + pixels[y * width * 4:(y + 1) * width * 4] for y in range(height))
    return (b"\x89PNG\r\n\x1a\n" +
            chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)) +
            chunk(b"IDAT", zlib.compress(rows, 9)) + chunk(b"IEND", b""))


def icon(size, rounded=True):
    width = height = size * SCALE
    canvas = bytearray(width * height * 4)
    if rounded:
        outline = []
        for cx, cy, start in [(50, 14, -90), (50, 50, 0), (14, 50, 90), (14, 14, 180)]:
            for step in range(17):
                angle = math.radians(start + step * 90 / 16)
                outline.append((cx + 14 * math.cos(angle), cy + 14 * math.sin(angle)))
    else:
        outline = [(0, 0), (64, 0), (64, 64), (0, 64)]
    polygon_fill(canvas, width, height, transform([outline], size / 64),
                 rgba(BRAND["colors"]["dark"]["background"]))
    draw_mark(canvas, width, height, size / 64 * 0.84, size / 64 * 5, size / 64 * 5,
              rgba(BRAND["colors"]["dark"]["accent"]), compact=True)
    return downsample(canvas, size, size)


def ico_bytes(images):
    """32-bit DIB entries retain compatibility with legacy favicon readers."""
    directory = bytearray(struct.pack("<HHH", 0, 1, len(images)))
    bodies = []
    offset = 6 + 16 * len(images)
    for size, pixels in images:
        xor = bytearray()
        mask = bytearray()
        mask_stride = ((size + 31) // 32) * 4
        for y in reversed(range(size)):
            row_mask = bytearray(mask_stride)
            for x in range(size):
                at = (y * size + x) * 4
                r, g, b, a = pixels[at:at + 4]
                xor.extend((b, g, r, a))
                if a < 128:
                    row_mask[x // 8] |= 1 << (7 - x % 8)
            mask.extend(row_mask)
        body = struct.pack("<IiiHHIIiiII", 40, size, size * 2, 1, 32, 0, len(xor), 0, 0, 0, 0)
        body += xor + mask
        directory.extend(struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(body), offset))
        bodies.append(body)
        offset += len(body)
    return bytes(directory) + b"".join(bodies)


for theme in BRAND["colors"]:
    (OUTPUT / f"logo-{theme}.svg").write_text(logo_svg(theme))
(OUTPUT / "mark.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
    'role="img" aria-label="BRUKIVKA" fill="#e58c58">' + mark_svg() + '</svg>\n'
)
(PUBLIC / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="14" fill="#0e0e0f"/>'
    '<g transform="translate(5 5) scale(.84)" fill="#e58c58">' +
    mark_svg(compact=True) + '</g></svg>\n'
)
icons = [(size, icon(size)) for size in (16, 32, 48)]
for size, pixels in icons[:2]:
    (PUBLIC / f"favicon-{size}x{size}.png").write_bytes(png_bytes(pixels, size, size))
(PUBLIC / "favicon.ico").write_bytes(ico_bytes(icons))
(PUBLIC / "apple-touch-icon.png").write_bytes(png_bytes(icon(180, rounded=False), 180, 180))
(OUTPUT / "icon-512.png").write_bytes(png_bytes(icon(512, rounded=False), 512, 512))

# A review sheet renders the actual geometry in both site palettes; not a browser screenshot.
sheet_width, sheet_height = 960, 400
width, height = sheet_width * SCALE, sheet_height * SCALE
sheet = bytearray(width * height * 4)
for row, theme in enumerate(("dark", "light")):
    colors = BRAND["colors"][theme]
    polygon_fill(sheet, width, height,
                 transform([[(0, row * 200), (960, row * 200),
                             (960, (row + 1) * 200), (0, (row + 1) * 200)]], 1),
                 rgba(colors["background"]))
    draw_logo(sheet, width, height, 1.3, 48, row * 200 + 58, theme)
    draw_mark(sheet, width, height, 1.25, 620, row * 200 + 58, rgba(colors["accent"]))
    draw_mark(sheet, width, height, 0.5, 780, row * 200 + 85, rgba(colors["accent"]), compact=True)
    draw_mark(sheet, width, height, 0.25, 848, row * 200 + 94, rgba(colors["accent"]), compact=True)
(ROOT / "docs/BRAND_PREVIEW.png").write_bytes(
    png_bytes(downsample(sheet, sheet_width, sheet_height), sheet_width, sheet_height)
)
print("Brand SVGs, 16/32px PNGs, 16/32/48px ICO, Apple icon, 512px icon and preview exported.")
