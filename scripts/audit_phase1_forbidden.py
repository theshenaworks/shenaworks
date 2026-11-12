import os
import re

SRC_DIR = "/home/cooper/Downloads/shena-works/src"

# Allowed colors from DESIGN.md:
# Accent: #c14a12, #963a12, #7a3214, #ff8f50
# Ink: #0e0f11, #1a1c20, #2b2e35, #555962, #8b909a, #d4d7dc, #e8eaed, #f4f5f6, #ffffff
# Earth: #d97736, #e8a36e, #f4cfb2, #fbf3ec
# Status: #9d1c30, #226c3b, #b45309, #1d4ed8 (and light tints #fdf2f2, #f0fdf4, #fffbeb, #eff6ff)

FORBIDDEN_PATTERNS = {
    "transition-all": re.compile(r'\btransition-all\b'),
    "duration_not_in_tokens": re.compile(r'\bduration-(?!150\b|200\b|250\b|0\b|75\b|100\b)\d+\b'),
    "rounded_not_none_or_full": re.compile(r'\brounded-(?!none\b|full\b)[a-z0-9-]+\b'),
    "confirm_tag": re.compile(r'\[CONFIRM'),
    "banned_superlatives": re.compile(r'\b(premier|leading|best|world-class|unrivalled|cutting-edge|seamless)\b', re.IGNORECASE),
}

files_to_scan = []
for root, dirs, files in os.walk(SRC_DIR):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.css', '.json')):
            files_to_scan.append(os.path.join(root, f))

results = {k: [] for k in FORBIDDEN_PATTERNS}

for path in files_to_scan:
    rel_path = os.path.relpath(path, "/home/cooper/Downloads/shena-works")
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        for idx, line in enumerate(f, 1):
            for pat_name, pat in FORBIDDEN_PATTERNS.items():
                m = pat.search(line)
                if m:
                    results[pat_name].append((rel_path, idx, line.strip(), m.group(0)))

for pat_name, occurrences in results.items():
    print(f"=== {pat_name} ({len(occurrences)} found) ===")
    for rel_path, idx, line, match in occurrences[:15]:
        print(f"  {rel_path}:{idx}: [{match}] {line[:100]}")
    if len(occurrences) > 15:
        print(f"  ... and {len(occurrences) - 15} more")
    print()
