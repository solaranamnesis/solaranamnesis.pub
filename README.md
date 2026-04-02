# Dedication to the Greek Muses

An IPFS library of PDFs made with LaTeX with minimal grammatical errors.

In the spirit of inspiration, we pay homage to the nine Muses of Greek mythology, who guide our creativity and knowledge. Their whispers fuel our passion for the arts and sciences, reminding us of the beauty of expression and the pursuit of wisdom.

"Sing, O Muse, of the wonders of the past, of the Library of Alexandria, where knowledge flowed like the Nile, and the light of learning shone bright."

## About This Repository

This repository powers [solaranamnesis.pub](https://www.solaranamnesis.pub/), a multilingual digital library of public-domain texts typeset in LaTeX and distributed as PDFs via IPFS. The site presents books in over 30 languages, each with its own localized sub-directory and a corresponding `{lang}/books.json` data file that drives the book catalogue.

**Key files and directories:**

| File / Directory | Description |
|---|---|
| `books.json` | Master English book catalogue (source of truth) |
| `translations.json` | Dictionary of all field translations and year-calendar offsets, keyed by BCP-47 language code |
| `generate_books.py` | Python script that reads `books.json` + `translations.json` and regenerates all `{lang}/books.json` files |
| `index.html` | English front-end page (root) |
| `script.js` | English JavaScript that fetches `books.json` and renders the book list |
| `shelf-data/` | English shelf and markdown-viewer templates |
| `{lang}/` | Per-language sub-directory (e.g. `fr/`, `zh/`, `ar/`) |
| `{lang}/index.html` | Language-specific front-end page |
| `{lang}/script.js` | Per-language JavaScript that fetches `{lang}/books.json` and renders the book list |
| `{lang}/books.json` | Auto-generated per-language catalogue |
| `{lang}/links.html` | Per-language links page |
| `{lang}/shelf-data/` | Per-language shelf and markdown-viewer templates |
| `index-{lang}.html` | Redirect stub → `{lang}/index.html` (backwards compatibility) |
| `links-{lang}.html` | Redirect stub → `{lang}/links.html` (backwards compatibility) |
| `md-viewer-{lang}.html` | Redirect stub → `{lang}/shelf-data/md-viewer.html` (backwards compatibility) |

---

## generate_books.py

`generate_books.py` is the script used to regenerate every localized `{lang}/books.json` catalogue from the single master `books.json` and the `translations.json` dictionary.

### What it translates

For each book entry the script translates (or converts) the following fields:

| Field | How it is handled |
|---|---|
| `languages` | Comma-separated language names — each term is looked up in `translations["languages"]` |
| `subjects` | Comma-separated subject keywords — each term is looked up in `translations["subjects"]` |
| `collections` | Semicolon-separated collection names — each term is looked up in `translations["collections"]` |
| `thumbs[].label` | PDF-variant labels — custom design names are looked up in `translations["labels"]` |
| `footer[].text` | Footer link labels — looked up in `translations["footer"]` |
| `footer[].link` | Links to `md-viewer.html` are rewritten to `{lang}/shelf-data/md-viewer.html` |
| `year` | Leading integer is offset using `translations["year_conversion"]` (keys: `offset`, `prefix`, `suffix`) to convert CE years to native calendars (e.g. Buddhist Era, Hebrew calendar) |
| `author` | Translated via the `translations["authors"]` mapping when present |

All other fields (`id`, `title`, `image`, `shelfFile`, `thumbs[].class`, `thumbs[].pdfUrl`, `footer[].link` for non-viewer links) are copied unchanged from `books.json`.

### Requirements

Python 3.6+ — no third-party packages required.

### Usage

```
python3 generate_books.py [options]
```

### Options

| Option | Default | Description |
|---|---|---|
| `--base FILE` | `books.json` | Base English JSON file to read |
| `--translations FILE` | `translations.json` | Translations dictionary file |
| `--output-dir DIR` | `.` (current directory) | Root directory; each language writes to `{DIR}/{lang}/books.json` |
| `--languages LANG …` | *(all in translations.json)* | Generate only the specified language codes |
| `--no-english` | *(off)* | Skip writing the English `books.json` output |

### Examples

**Regenerate all languages (typical workflow):**
```bash
python3 generate_books.py
```

**Regenerate only a subset of languages:**
```bash
python3 generate_books.py --languages zh ar fr de
```

**Use custom input files and write output to a different directory:**
```bash
python3 generate_books.py --base books.json --translations translations.json --output-dir ./output
```

**Regenerate translated files only, skipping the English copy:**
```bash
python3 generate_books.py --no-english
```

**Regenerate a single language for quick testing:**
```bash
python3 generate_books.py --languages ja
```

---

## Language Editions

[Solar Anamnesis Publishing --- English](https://www.solaranamnesis.pub/)  
[Spanish](https://www.solaranamnesis.pub/es/)  
[German](https://www.solaranamnesis.pub/de/)  
[French](https://www.solaranamnesis.pub/fr/)  
[Japanese (日本語)](https://www.solaranamnesis.pub/ja/)  
[Italian](https://www.solaranamnesis.pub/it/)  
[Russian (Русский)](https://www.solaranamnesis.pub/ru/)  
[Chinese (中文)](https://www.solaranamnesis.pub/zh/)  
[Hebrew (עברית)](https://www.solaranamnesis.pub/he/)  
[Thai (ไทย)](https://www.solaranamnesis.pub/th/)  
[Vietnamese (Tiếng Việt)](https://www.solaranamnesis.pub/vi/)  
[Arabic (العربية)](https://www.solaranamnesis.pub/ar/)  
[Hindi (हिन्दी)](https://www.solaranamnesis.pub/hi/)  
[Greek (Ελληνικά)](https://www.solaranamnesis.pub/el/)  
[Korean (한국어)](https://www.solaranamnesis.pub/ko/)  
[Portuguese](https://www.solaranamnesis.pub/pt/)  
[Bengali (বাংলা)](https://www.solaranamnesis.pub/bn/)  
[Punjabi (ਪੰਜਾਬੀ)](https://www.solaranamnesis.pub/pa/)  
[Persian (فارسی)](https://www.solaranamnesis.pub/fa/)  
[Kiswahili](https://www.solaranamnesis.pub/sw/)  
[Bahasa Indonesia](https://www.solaranamnesis.pub/id/)  
[Język Polski](https://www.solaranamnesis.pub/pl/)  
[Nederlands](https://www.solaranamnesis.pub/nl/)  
[Svenska](https://www.solaranamnesis.pub/sv/)  
[Turkish (Türkçe)](https://www.solaranamnesis.pub/tr/)  
[Magyar](https://www.solaranamnesis.pub/hu/)  
[Nepal Bhasa (𑐣𑐾𑐥𑐵𑐮 𑐨𑐵𑐲𑐵)](https://www.solaranamnesis.pub/new/)  
[Lhasa Tibetan (ལྷ་སའི་སྐད་)](https://www.solaranamnesis.pub/bo/)  
[Sinhala (සිංහල)](https://www.solaranamnesis.pub/si/)  
[Tamil (தமிழ்)](https://www.solaranamnesis.pub/ta/)  
[Odia (ଓଡ଼ିଆ)](https://www.solaranamnesis.pub/or/)  
[Armenian (Հայերեն)](https://www.solaranamnesis.pub/hy/)  
[Tagalog](https://www.solaranamnesis.pub/tl/)  
[Amharic (አማርኛ)](https://www.solaranamnesis.pub/am/)  
[Gujarati (ગુજરાતી)](https://www.solaranamnesis.pub/gu/)  
[Hausa](https://www.solaranamnesis.pub/ha/)  
[Javanese (Basa Jawa)](https://www.solaranamnesis.pub/jv/)  
[Georgian (ქართული)](https://www.solaranamnesis.pub/ka/)  
[Kannada (ಕನ್ನಡ)](https://www.solaranamnesis.pub/kn/)  
[Marathi (मराठी)](https://www.solaranamnesis.pub/mr/)  
[Telugu (తెలుగు)](https://www.solaranamnesis.pub/te/)  
[Urdu (اردو)](https://www.solaranamnesis.pub/ur/)  
[Yoruba (Yorùbá)](https://www.solaranamnesis.pub/yo/)  

IPFS Mirror:

[IPNS hash k51qzi5uqu5dhxjrhpv3w4j0vpwai82jxdgel8kefwf0jzm1l14ow991qo5aga](https://dweb.link/ipns/k51qzi5uqu5dhxjrhpv3w4j0vpwai82jxdgel8kefwf0jzm1l14ow991qo5aga/)
