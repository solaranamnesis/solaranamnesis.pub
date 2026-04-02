#!/usr/bin/env python3
"""
extract_local_testing.py - Extract non-English per-language files into a flat
directory for local testing.

For every non-English language sub-directory found under *--repo-dir* (detected
by the presence of a ``books.json`` file), the following files are copied to
*--output-dir* with a language suffix in the filename:

  {lang}/books.json       → books-{lang}.json
  {lang}/book_shelf.html  → book_shelf-{lang}.html
  {lang}/md-viewer.html   → md-viewer-{lang}.html

Files that do not exist in a particular language directory are silently skipped.

Usage:
    python3 extract_local_testing.py [options]

Options:
    --repo-dir DIR        Root of the repository (default: directory of this script)
    --output-dir DIR      Destination directory for extracted files (default: current directory)
    --languages LANG ...  Extract only these language codes (default: all detected)

Examples:
    python3 extract_local_testing.py
    python3 extract_local_testing.py --output-dir /tmp/local-test
    python3 extract_local_testing.py --languages ar de fr zh --output-dir /tmp/local-test
"""

import argparse
import os
import shutil
import sys


# Files to extract and the naming pattern for the output file.
# Each entry is (source_filename, output_prefix, output_extension).
EXTRACT_FILES = [
    ("books.json",      "books-",       ".json"),
    ("book_shelf.html", "book_shelf-",  ".html"),
    ("md-viewer.html",  "md-viewer-",   ".html"),
]


def detect_language_dirs(repo_dir: str) -> list[str]:
    """Return sorted list of language codes found under *repo_dir*.

    A directory is treated as a language directory when it contains a
    ``books.json`` file directly inside it.  The root-level ``books.json``
    (English) is intentionally excluded.
    """
    langs = []
    try:
        entries = os.listdir(repo_dir)
    except OSError as exc:
        print(f"Error reading repo directory: {exc}", file=sys.stderr)
        return langs

    for entry in sorted(entries):
        entry_path = os.path.join(repo_dir, entry)
        if os.path.isdir(entry_path) and os.path.isfile(
            os.path.join(entry_path, "books.json")
        ):
            langs.append(entry)
    return langs


def copy_file(src: str, dst: str, replacements: dict[str, str] | None = None) -> bool:
    """Copy *src* to *dst*, returning True on success.

    If *replacements* is provided, the file is read as text and each key is
    replaced by its corresponding value before writing to *dst*.
    """
    if not os.path.isfile(src):
        return False
    try:
        if replacements:
            with open(src, encoding="utf-8") as fh:
                content = fh.read()
            for old, new in replacements.items():
                content = content.replace(old, new)
            with open(dst, "w", encoding="utf-8") as fh:
                fh.write(content)
        else:
            shutil.copy2(src, dst)
    except OSError as exc:
        print(f"Error copying {src} → {dst}: {exc}", file=sys.stderr)
        return False
    return True


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        description="Extract non-English per-language files into a flat directory for local testing.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--repo-dir",
        default=os.path.dirname(os.path.abspath(__file__)),
        metavar="DIR",
        help="Root of the repository (default: directory containing this script)",
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        metavar="DIR",
        help="Destination directory for extracted files (default: current directory)",
    )
    parser.add_argument(
        "--languages",
        nargs="+",
        metavar="LANG",
        help="Language codes to extract (default: all detected)",
    )
    args = parser.parse_args(argv)

    repo_dir = os.path.abspath(args.repo_dir)
    output_dir = os.path.abspath(args.output_dir)

    if not os.path.isdir(repo_dir):
        print(f"Error: repo directory not found: {repo_dir}", file=sys.stderr)
        return 1

    os.makedirs(output_dir, exist_ok=True)

    # Determine which languages to process.
    if args.languages:
        languages = args.languages
    else:
        languages = detect_language_dirs(repo_dir)
        if not languages:
            print("No language directories detected.", file=sys.stderr)
            return 1
        print(f"Detected {len(languages)} language(s): {', '.join(languages)}")

    extracted_count = 0

    for lang in languages:
        lang_dir = os.path.join(repo_dir, lang)
        if not os.path.isdir(lang_dir):
            print(f"Warning: language directory not found: {lang_dir}", file=sys.stderr)
            continue

        for src_name, out_prefix, out_ext in EXTRACT_FILES:
            src_path = os.path.join(lang_dir, src_name)
            dst_name = f"{out_prefix}{lang}{out_ext}"
            dst_path = os.path.join(output_dir, dst_name)

            replacements = None
            if src_name == "book_shelf.html":
                replacements = {"books.json": f"books-{lang}.json"}

            if copy_file(src_path, dst_path, replacements):
                print(f"  Extracted {lang}/{src_name} → {dst_name}")
                extracted_count += 1
            else:
                print(f"  Skipped   {lang}/{src_name} (not found)")

    print(f"\nDone. {extracted_count} file(s) extracted to {output_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
