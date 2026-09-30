"""App-Icons für die installierbare Web-App erzeugen:  python tools/make-icons.py
Sol (assets/sol/wave.webp) auf warmem Hintergrund. iOS und Android runden die Ecken selbst,
darum sind die Icons vollflächig. Die „maskable“-Variante hat mehr Rand (Sicherheitszone)."""
from PIL import Image, ImageDraw
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sol = Image.open(root / 'assets/sol/wave.webp').convert('RGBA')
out = root / 'assets/icons'
out.mkdir(exist_ok=True)


def background(size):
    top, bottom = (255, 232, 204), (255, 190, 140)
    img = Image.new('RGB', (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / max(1, size - 1)
        d.line([(0, y), (size, y)], fill=tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img


def make(size, scale, name):
    img = background(size).convert('RGBA')
    s = round(size * scale)
    mascot = sol.resize((s, s), Image.LANCZOS)
    img.alpha_composite(mascot, ((size - s) // 2, round((size - s) / 2 + size * 0.02)))
    img.convert('RGB').save(out / name, optimize=True)
    print(name, size)


make(180, 0.90, 'apple-touch-icon.png')
make(192, 0.90, 'icon-192.png')
make(512, 0.90, 'icon-512.png')
make(512, 0.68, 'icon-maskable-512.png')
