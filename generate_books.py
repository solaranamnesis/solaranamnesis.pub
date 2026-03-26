#!/usr/bin/env python3
"""
generate_books.py - Generate localized books-*.json files from a base books.json file.

The script reads the base English books.json and a translations.json dictionary,
then produces one translated output file per language:
  books.json       (English, copy of the base)
  books-ar.json    (Arabic)
  books-bn.json    (Bengali)
  ... and so on for all languages defined in translations.json

Fields that are translated per book entry:
  - languages  : comma-separated list of language names
  - subjects   : comma-separated list of subject keywords
  - thumbs[].label : PDF-variant labels (custom design names are translated)
  - footer[].text  : footer link labels

All other fields (id, title, author, year, image, shelfFile, collections,
thumbs[].class, thumbs[].pdfUrl, footer[].link) are kept as-is.

Usage:
    python3 generate_books.py [options]

Options:
    --base FILE           Base English JSON file (default: books.json)
    --translations FILE   Translations dictionary (default: translations.json)
    --output-dir DIR      Directory for generated files (default: current directory)
    --languages LANG ...  Generate only these language codes (default: all)
    --include-english     Also write books.json from the base (default: true)

Example:
    python3 generate_books.py
    python3 generate_books.py --languages zh ar fr de
    python3 generate_books.py --base books.json --translations translations.json --output-dir .
"""

import argparse
import copy
import json
import os
import sys


def translate_comma_list(value: str, translation_map: dict) -> str:
    """Translate each item in a comma-separated string using *translation_map*.

    Items that have no entry in the map are kept unchanged (English fallback).
    """
    items = [item.strip() for item in value.split(", ") if item.strip()]
    return ", ".join(translation_map.get(item, item) for item in items)


def translate_book(book: dict, translations: dict, lang: str = "") -> dict:
    """Return a deep copy of *book* with translatable fields replaced.

    *translations* is a dict with keys: 'labels', 'subjects', 'languages', 'footer'.
    Each value is a flat string-to-string mapping from English to the target language.

    *lang* is the BCP-47 language code (e.g. 'de', 'ar').  When non-empty, any
    footer link that points to the base ``md-viewer.html`` viewer is rewritten to
    the language-specific ``md-viewer-{lang}.html`` viewer.
    """
    label_map = translations.get("labels", {})
    subj_map = translations.get("subjects", {})
    lang_map = translations.get("languages", {})
    footer_map = translations.get("footer", {})

    translated = copy.deepcopy(book)

    if translated.get("languages"):
        translated["languages"] = translate_comma_list(translated["languages"], lang_map)

    if translated.get("subjects"):
        translated["subjects"] = translate_comma_list(translated["subjects"], subj_map)

    for thumb in translated.get("thumbs", []):
        if thumb.get("label") in label_map:
            thumb["label"] = label_map[thumb["label"]]

    for footer_item in translated.get("footer", []):
        if footer_item.get("text") in footer_map:
            footer_item["text"] = footer_map[footer_item["text"]]
        if lang and "link" in footer_item:
            footer_item["link"] = footer_item["link"].replace(
                "md-viewer.html", f"md-viewer-{lang}.html"
            )

    return translated


def write_json(path: str, data: list) -> None:
    """Write *data* as formatted JSON to *path*."""
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate localized books-*.json files from a base books.json.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--base",
        default="books.json",
        metavar="FILE",
        help="Base English JSON file (default: books.json)",
    )
    parser.add_argument(
        "--translations",
        default="translations.json",
        metavar="FILE",
        help="Translations dictionary file (default: translations.json)",
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        metavar="DIR",
        help="Output directory for generated files (default: current directory)",
    )
    parser.add_argument(
        "--languages",
        nargs="+",
        metavar="LANG",
        help="Language codes to generate (default: all defined in translations.json)",
    )
    parser.add_argument(
        "--no-english",
        action="store_true",
        help="Skip writing the English books.json output",
    )
    args = parser.parse_args(argv)

    # --- Load base ---
    if not os.path.isfile(args.base):
        print(f"Error: base file not found: {args.base}", file=sys.stderr)
        return 1
    with open(args.base, encoding="utf-8") as fh:
        base_books = json.load(fh)
    print(f"Loaded {len(base_books)} books from {args.base}")

    # --- Load translations ---
    if not os.path.isfile(args.translations):
        print(f"Error: translations file not found: {args.translations}", file=sys.stderr)
        return 1
    with open(args.translations, encoding="utf-8") as fh:
        all_translations = json.load(fh)

    os.makedirs(args.output_dir, exist_ok=True)

    # --- Write English (copy of base) ---
    if not args.no_english:
        out_path = os.path.join(args.output_dir, "books.json")
        write_json(out_path, base_books)
        print(f"Generated books.json ({len(base_books)} books)")

    # --- Determine target languages ---
    languages = args.languages if args.languages else sorted(all_translations.keys())

    # --- Generate each language ---
    for lang in languages:
        if lang not in all_translations:
            print(f"Warning: no translations found for '{lang}', skipping.", file=sys.stderr)
            continue

        translated_books = [
            translate_book(book, all_translations[lang], lang) for book in base_books
        ]

        out_path = os.path.join(args.output_dir, f"books-{lang}.json")
        write_json(out_path, translated_books)
        print(f"Generated books-{lang}.json ({len(translated_books)} books)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
