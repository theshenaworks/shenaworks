import sys
import json
from PIL import Image, ImageChops, ImageDraw

def compare_images(ref_path, target_path, diff_output_path, tolerance=15):
    """
    Compares two images pixel by pixel.
    Returns (diff_ratio, diff_pixels, total_pixels)
    """
    img_ref = Image.open(ref_path).convert('RGBA')
    img_target = Image.open(target_path).convert('RGBA')

    # Dimensions
    w = max(img_ref.width, img_target.width)
    h = max(img_ref.height, img_target.height)

    # Pad images to same size with transparency if dimensions differ slightly
    if img_ref.size != (w, h):
        padded_ref = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        padded_ref.paste(img_ref, (0, 0))
        img_ref = padded_ref

    if img_target.size != (w, h):
        padded_target = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        padded_target.paste(img_target, (0, 0))
        img_target = padded_target

    total_pixels = w * h
    if total_pixels == 0:
        return 0.0, 0, 0

    # Pixel difference
    ref_data = img_ref.load()
    target_data = img_target.load()

    # Create visual diff canvas: Side-by-side [Ref | Target | Diff]
    diff_canvas = Image.new('RGBA', (w * 3, h), (255, 255, 255, 255))
    diff_canvas.paste(img_ref, (0, 0))
    diff_canvas.paste(img_target, (w, 0))

    diff_layer = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    diff_draw = diff_layer.load()

    diff_pixels = 0
    for y in range(h):
        for x in range(w):
            r1, g1, b1, a1 = ref_data[x, y]
            r2, g2, b2, a2 = target_data[x, y]
            dr = abs(r1 - r2)
            dg = abs(g1 - g2)
            db = abs(b1 - b2)
            da = abs(a1 - a2)
            if dr > tolerance or dg > tolerance or db > tolerance or da > tolerance:
                diff_pixels += 1
                diff_draw[x, y] = (255, 0, 0, 255) # Highlight in red
            else:
                # Dim background for context
                diff_draw[x, y] = (r2 // 4 + 192, g2 // 4 + 192, b2 // 4 + 192, 255)

    diff_canvas.paste(diff_layer, (w * 2, 0))
    diff_canvas.save(diff_output_path)

    diff_ratio = diff_pixels / total_pixels
    return diff_ratio, diff_pixels, total_pixels

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(json.dumps({'error': 'Usage: compare_images.py <ref> <target> <diff_out> [tolerance]'}))
        sys.exit(1)

    ref_path = sys.argv[1]
    target_path = sys.argv[2]
    diff_output = sys.argv[3]
    tol = int(sys.argv[4]) if len(sys.argv) > 4 else 15

    try:
        ratio, diff_count, total = compare_images(ref_path, target_path, diff_output, tol)
        result = {
            'diffRatio': ratio,
            'diffPixels': diff_count,
            'totalPixels': total,
            'passed': ratio <= 0.01,
            'diffPath': diff_output
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
