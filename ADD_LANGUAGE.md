# Adding a New Language to Solar Anamnesis Publishing

This document describes every step required to add full support for a new language, referred to as `{lang}` (the BCP-47 code, e.g. `de`, `zh`, `new`).

---

## Overview of the file structure per language

```
{lang}/
  index.html        — Localized front page
  script.js         — Localized JavaScript (filter labels, book-shelf URL)
  books.json        — Auto-generated catalogue (do NOT edit by hand)
  links.html        — Localized links page
  book_shelf.html   — Localized book shelf page
  md-viewer.html    — Localized Markdown viewer
  timeline.html     — Localized interactive D3.js timeline viewer
```

Root-level files that must be updated for every new language:

| File | What to update |
|---|---|
| `translations.json` | Add the new language translation block |
| `index.html` | `hreflang` link, language picker list, JSON-LD `inLanguage` |
| `sitemap.xml` | New `<url>` entry |
| `README.md` | New entry in the Language Editions list |
| Every existing `{lang}/index.html` | `hreflang` link + language picker list entry |

> **Note:** Root `links.html`, `book_shelf.html`, `md-viewer.html`, and `timeline.html` do **not** contain `hreflang` links — only `index.html` files (root and per-language) need updating.

---

## Step 1 — Add the language block to `translations.json`

Open `translations.json` and add a new top-level key for `{lang}`. The required sub-keys are:

```jsonc
"{lang}": {
  "labels": {
    // PDF variant labels: English label → translated label
    "French Cursive": "...",
    "Custom Purple Paper": "...",
    ...
  },
  "subjects": {
    // Subject keywords: English term → translated term
    "Purple": "...",
    "History": "...",
    ...
  },
  "languages": {
    // Language names: English name → translated name
    "French": "...",
    "Greek": "...",
    ...
  },
  "footer": {
    // Footer link text: English text → translated text
    "View on archive.org": "...",
    "LaTeX Files": "..."
  },
  "collections": {
    // Collection names: English name → translated name
    "History of Meteorites, Aeroliths, Baetyls": "...",
    ...
  }
}
```

**Optional sub-keys:**

- `year_conversion` — Add this when the language uses a non-CE calendar. Keys:
  - `offset` (integer) — value added to the CE year (negative for subtraction)
  - `prefix` (string) — text prepended before the year number
  - `suffix` (string) — text appended after the year number
  - Example for Hebrew (`+3760` offset): `{ "offset": 3760 }`

- `authors` — Add this when author names should be transliterated or rewritten in native script. Maps English display name → native display name. The `author_url` keys in each book entry are automatically remapped alongside author translations.

Every term present in the master `books.json` that does not have an entry in the maps falls back to the English string, so partial translations are safe.

---

## Step 2 — Generate `{lang}/books.json`

Run `generate_books.py` to produce the localized book catalogue:

```bash
python3 generate_books.py --languages {lang}
```

This reads `books.json` (master English catalogue) and `translations.json`, then writes `{lang}/books.json`.

To regenerate all languages at once (e.g. after updating the master catalogue):

```bash
python3 generate_books.py
```

---

## Step 3 — Create the `{lang}/` directory and its files

Copy the files from the closest existing language edition (e.g. `fr/`) and adapt every language-specific string. Each file is described below.

### 3a. `{lang}/index.html`

Copy `fr/index.html` (or any other language) and update:

1. **`<html lang="{lang}">`** — set the BCP-47 code.
2. **`<title>`** — translated page title.
3. **`<meta name="description">`** — translated description.
4. **`<meta name="keywords">`** — translated keywords.
5. **`<link rel="canonical" href="https://www.solaranamnesis.pub/{lang}/">`**
6. **`<meta property="og:url" content="https://www.solaranamnesis.pub/{lang}/">`**
7. **`<meta property="og:title">`** — translated.
8. **`<meta property="og:description">`** — translated.
9. **`<meta property="og:locale" content="{lang}_{REGION}">`** — e.g. `fr_FR`.
10. **`<meta name="twitter:title">`** — translated.
11. **`<meta name="twitter:description">`** — translated.
12. **`hreflang` links** — Add one line for the new language and keep all other existing languages:
    ```html
    <link href="https://www.solaranamnesis.pub/{lang}/" hreflang="{lang}" rel="alternate" />
    ```
13. **JSON-LD `<script type="application/ld+json">`** — update `url` and `description`; keep `inLanguage` as `"{lang}"`.
14. **Hero section** — translated title and subtitle.
15. **Navigation cards** — translated card headings and descriptions.
16. **Filter dropdown labels** — translate the `<label>` text for Collection, Language, Year, Subject, Author.
17. **Filter default `<option>` placeholder text** — translate the five placeholder strings (e.g. "Select Collection" → native equivalent).
18. **Language picker list** — Add an entry for the new language (matching the other pages) and keep all existing entries:
    ```html
    <li><a href="../{lang}/index.html">{Native name}</a></li>
    ```
19. **`const langCode = "{lang}";`** — set the language code variable at the bottom of the body.

### 3b. `{lang}/script.js`

Copy `fr/script.js` (or any other language) and update:

1. **Book shelf URL** — Change the `href` inside the book list template to point to the language-specific shelf, e.g.:
   ```js
   `https://cdn.solaranamnesis.com/library-test/examples/book_shelf-{lang}.html#${t.id}`
   ```
2. **"Languages:" label** — translate the `<b>Languages:</b>` string in the book list template.
3. **"Subjects:" label** — translate the `<b>Subjects:</b>` string.
4. **Filter comparison strings** — translate the five filter placeholder strings that are compared against the selected `<option>` value (e.g. `"Sélectionner la Langue"`, `"Sélectionner l'Année"`, etc.) so they match the placeholder text set in `index.html`.

### 3c. `{lang}/links.html`

Copy `fr/links.html` (or root `links.html`) and translate:

- `<html lang="{lang}">` attribute.
- Page title.
- All visible text content.
- Navigation links (back to index, etc.).

### 3d. `{lang}/book_shelf.html`

Copy `fr/book_shelf.html` (or root `book_shelf.html`) and translate all visible UI strings.

### 3e. `{lang}/md-viewer.html`

Copy `fr/md-viewer.html` (or root `md-viewer.html`) and translate all visible UI strings.

### 3f. `{lang}/timeline.html`

Copy `fr/timeline.html` (or root `timeline.html`) and update:

1. **`<html lang="{lang}">`** — set the BCP-47 code.
2. **`<title>`** — translated page title (e.g. "Chronologie des Livres | Solar Anamnesis Publishing").
3. **`<meta name="description">`** — translated description including the year range.
4. **`<meta name="keywords">`** — translated keywords.
5. **`<link rel="canonical" href="https://www.solaranamnesis.pub/{lang}/timeline.html">`**
6. **`<meta property="og:url" content="https://www.solaranamnesis.pub/{lang}/timeline.html">`**
7. **`<meta property="og:title">`** — translated.
8. **`<meta property="og:description">`** — translated (including year range).
9. **`<meta property="og:locale" content="{lang}_{REGION}">`** — e.g. `fr_FR`.
10. **`<meta name="twitter:title">`** — translated.
11. **`<meta name="twitter:description">`** — translated (including year range).
12. **Inline D3.js script strings** — translate all user-visible text literals in the embedded script (axis labels, tooltip field names, loading/error messages, the `"Interactive timeline of …"` string, etc.).
13. **Hero section** — translated title and subtitle/description text in the `<body>`.

> **Year range:** The description strings contain the publication year range (e.g. `"1600 to 2022"`). These must match the actual range in the master `books.json`. To update the range across all `timeline.html` files at once:
> ```bash
> find . -name "timeline.html" -exec sed -i 's/OLD_YEAR/NEW_YEAR/g' {} \;
> ```

> **Data source:** Each `{lang}/timeline.html` fetches `books.json` with a relative path — no path change is needed; it will automatically read `{lang}/books.json` when served from the language sub-directory.

---

## Step 4 — Update root HTML files

Only the root `index.html` contains `hreflang` `<link>` tags — add a new entry for `{lang}`:

```html
<link
  href="https://www.solaranamnesis.pub/{lang}/"
  hreflang="{lang}"
  rel="alternate"
/>
```

In **root `index.html`** also:

1. Add the new language to the `inLanguage` array in the JSON-LD `<script>` block:
   ```json
   "inLanguage": ["en", ..., "{lang}"]
   ```
2. Add an entry to the **language picker list** in the body:
   ```html
   <li><a href="{lang}/index.html">{Native name}</a></li>
   ```

---

## Step 5 — Update every existing `{lang}/index.html`

Every language sub-directory has its own `index.html` with its own set of `hreflang` links and language picker list. Add entries for the new language to each of them, exactly as described in Step 4.

---

## Step 6 — Update `sitemap.xml`

Add a new `<url>` block for the language homepage:

```xml
<url>
  <loc>https://www.solaranamnesis.pub/{lang}/</loc>
  <lastmod>YYYY-MM-DDT00:00:00+00:00</lastmod>
  <priority>0.80</priority>
</url>
```

---

## Step 7 — Update `README.md`

Add a line to the **Language Editions** section:

```markdown
[{Native name}](https://www.solaranamnesis.pub/{lang}/)
```

---

## Automation scripts

These Python one-liners and snippets were discovered while adding Catalan (`ca`) and can save significant time when adding new languages.

### Bulk-update all `{lang}/index.html` with new hreflang + language picker entry

Run this after creating the new language directory. Replace `LANG`, `URL`, and `DISPLAY_NAME` with the new language's values.

```python
import os, re

LANG = "ca"
URL = "https://www.solaranamnesis.pub/ca/"
DISPLAY_NAME = "Català"

lang_dirs = [
    d for d in os.listdir(".")
    if os.path.isdir(d) and d != LANG
    and os.path.exists(f"{d}/index.html")
    and len(d) <= 4 and not d.startswith(".")
]

for lang in sorted(lang_dirs):
    path = f"{lang}/index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if f'hreflang="{LANG}"' in content:
        continue  # already done

    # 1. Insert hreflang before x-default
    hreflang_block = (
        f'    <link\n      href="{URL}"\n      hreflang="{LANG}"\n      rel="alternate"\n    />\n'
        '    <link\n      hreflang="x-default"'
    )
    content = content.replace('    <link\n      hreflang="x-default"', hreflang_block, 1)

    # 2. Append entry to the language picker list (after the last language's </li>)
    #    Assumes the previous last language's <a href> doesn't use "#" (current page)
    entry = f'<li><a href="../{LANG}/index.html">{DISPLAY_NAME}</a></li>'
    # Insert before the closing </ul> of the language list (last </ul> before </div> near end)
    content = re.sub(
        r'(<li><a href="#">[^<]+</a></li>)(\s*\n\s*</ul>)',
        lambda m: m.group(1) + "\n              " + entry + m.group(2),
        content, count=1
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {path}")
```

> **Note:** The pattern above handles the case where the currently-active language uses `href="#"` for itself. For the last-added language that links to `#` (e.g. `af/index.html` before `ca` was added), you still need to manually append the entry — or adjust the regex to match both the `href="#"` and `href="../{prev}/index.html"` forms.

### Create `{lang}/script.js` from another language

```bash
# Copy and patch in one command:
sed \
  -e 's/book_shelf-XX\.html/book_shelf-LANG.html/g' \
  -e 's/"Select Collection"/"Translated Collection"/g' \
  -e 's/"Select Language"/"Translated Language"/g' \
  -e 's/"Select Year"/"Translated Year"/g' \
  -e 's/"Select Subject"/"Translated Subject"/g' \
  -e 's/"Select Author"/"Translated Author"/g' \
  XX/script.js > LANG/script.js
```

### Validate all generated `books.json` files

```bash
for f in */books.json; do
  python3 -m json.tool "$f" > /dev/null && echo "OK: $f" || echo "INVALID: $f"
done
```

### Find untranslated language names still in Spanish/source language

After creating `{lang}/index.html` from `es/index.html`, search for remaining Spanish-specific words:

```bash
grep -n "ción\|ñol\|Inglés\|Francés\|Alemán\|Turco\|Griego\|Hebreo\|Chino\|Ruso\|Árabe\|Japonés" {lang}/index.html
```

### Key observations

- Root `links.html`, `book_shelf.html`, `md-viewer.html`, and `timeline.html` do **not** contain `hreflang` links — only `index.html` files (root and per-language) need updating.
- The `es/` directory is the best template for Romance-language additions (French also works). Use `fr/` for languages with a similar degree of formality.
- The per-language `md-viewer.html` has a `FOOTNOTE_I18N` object — add an entry for the new language's footnotes so they display translated headings when reading that language's books.
- Filter placeholder strings in `script.js` must **exactly match** the `<option>` text in `index.html`; mismatches silently break filtering.
- The `{lang}/timeline.html` fetches `books.json` with a relative path, so it automatically reads the correct `{lang}/books.json` file without any path changes needed.

---

## Checklist summary

- [ ] Add `{lang}` block to `translations.json` (labels, subjects, languages, footer, collections; plus optional `year_conversion` / `authors`)
- [ ] Run `python3 generate_books.py --languages {lang}` to create `{lang}/books.json`
- [ ] Create `{lang}/index.html` (translated title, meta tags, canonical, OG/Twitter tags, hreflang links, JSON-LD, hero, cards, filter labels, language list, `langCode`)
- [ ] Create `{lang}/script.js` (shelf URL, "Languages:" / "Subjects:" labels, filter placeholder strings)
- [ ] Create `{lang}/links.html` (translated content)
- [ ] Create `{lang}/book_shelf.html` (translated content)
- [ ] Create `{lang}/md-viewer.html` (translated content)
- [ ] Create `{lang}/timeline.html` (translated title, meta tags, canonical, OG/Twitter tags, inline D3.js UI strings, hero text)
- [ ] Add `hreflang` link to root `index.html` (root `links.html`, `book_shelf.html`, `md-viewer.html`, and `timeline.html` do **not** need `hreflang`)
- [ ] Add language to `inLanguage` array and language picker list in root `index.html`
- [ ] Add `hreflang` link and language picker list entry to every existing `{lang}/index.html` (use bulk-update script above)
- [ ] Add `<url>` block to `sitemap.xml`
- [ ] Add entry to **Language Editions** list in `README.md`
