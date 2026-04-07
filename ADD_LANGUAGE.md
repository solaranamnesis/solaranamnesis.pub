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
```

Root-level files that must be updated for every new language:

| File | What to update |
|---|---|
| `translations.json` | Add the new language translation block |
| `index.html` | `hreflang` link, language picker list, JSON-LD `inLanguage` |
| `links.html` | `hreflang` link |
| `book_shelf.html` | `hreflang` link |
| `md-viewer.html` | `hreflang` link |
| `sitemap.xml` | New `<url>` entry |
| `README.md` | New entry in the Language Editions list |
| Every existing `{lang}/index.html` | `hreflang` link + language picker list entry |

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

---

## Step 4 — Update root HTML files

The root pages (`index.html`, `links.html`, `book_shelf.html`, `md-viewer.html`) each contain `hreflang` `<link>` tags in their `<head>`. Add a new entry for `{lang}` in every one of them:

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

## Checklist summary

- [ ] Add `{lang}` block to `translations.json` (labels, subjects, languages, footer, collections; plus optional `year_conversion` / `authors`)
- [ ] Run `python3 generate_books.py --languages {lang}` to create `{lang}/books.json`
- [ ] Create `{lang}/index.html` (translated title, meta tags, canonical, OG/Twitter tags, hreflang links, JSON-LD, hero, cards, filter labels, language list, `langCode`)
- [ ] Create `{lang}/script.js` (shelf URL, "Languages:" / "Subjects:" labels, filter placeholder strings)
- [ ] Create `{lang}/links.html` (translated content)
- [ ] Create `{lang}/book_shelf.html` (translated content)
- [ ] Create `{lang}/md-viewer.html` (translated content)
- [ ] Add `hreflang` link to root `index.html`, `links.html`, `book_shelf.html`, `md-viewer.html`
- [ ] Add language to `inLanguage` array and language picker list in root `index.html`
- [ ] Add `hreflang` link and language picker list entry to every existing `{lang}/index.html`
- [ ] Add `<url>` block to `sitemap.xml`
- [ ] Add entry to **Language Editions** list in `README.md`
