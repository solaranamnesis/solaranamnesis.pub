# Dedication to the Greek Muses

An IPFS library of PDFs made with LaTeX with minimal grammatical errors.

In the spirit of inspiration, we pay homage to the nine Muses of Greek mythology, who guide our creativity and knowledge. Their whispers fuel our passion for the arts and sciences, reminding us of the beauty of expression and the pursuit of wisdom.

"Sing, O Muse, of the wonders of the past, of the Library of Alexandria, where knowledge flowed like the Nile, and the light of learning shone bright."

## About This Repository

This repository powers [solaranamnesis.pub](https://www.solaranamnesis.pub/), a multilingual digital library of public-domain texts typeset in LaTeX and distributed as PDFs via IPFS. The site presents books in over 30 languages, each with its own localized index page and a corresponding `books-{lang}.json` data file that drives the book catalogue.

**Key files and directories:**

| File / Directory | Description |
|---|---|
| `books.json` | Master English book catalogue (source of truth) |
| `books-{lang}.json` | Auto-generated per-language catalogues (e.g. `books-fr.json`, `books-zh.json`) |
| `translations.json` | Dictionary of all field translations and year-calendar offsets, keyed by BCP-47 language code |
| `generate_books.py` | Python script that reads `books.json` + `translations.json` and regenerates all `books-{lang}.json` files |
| `index.html` / `index-{lang}.html` | Language-specific front-end pages |
| `script.js` / `script-{lang}.js` | Per-language JavaScript that fetches the matching JSON and renders the book list |
| `shelf-data/` | Shelf artwork and related assets |

---

## generate_books.py

`generate_books.py` is the script used to regenerate every localized `books-{lang}.json` catalogue from the single master `books.json` and the `translations.json` dictionary.

### What it translates

For each book entry the script translates (or converts) the following fields:

| Field | How it is handled |
|---|---|
| `languages` | Comma-separated language names — each term is looked up in `translations["languages"]` |
| `subjects` | Comma-separated subject keywords — each term is looked up in `translations["subjects"]` |
| `collections` | Semicolon-separated collection names — each term is looked up in `translations["collections"]` |
| `thumbs[].label` | PDF-variant labels — custom design names are looked up in `translations["labels"]` |
| `footer[].text` | Footer link labels — looked up in `translations["footer"]` |
| `footer[].link` | Links to `md-viewer.html` are rewritten to `md-viewer-{lang}.html` |
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
| `--output-dir DIR` | `.` (current directory) | Directory where generated files are written |
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
[Spanish](https://www.solaranamnesis.pub/index-es.html)  
[German](https://www.solaranamnesis.pub/index-de.html)  
[French](https://www.solaranamnesis.pub/index-fr.html)  
[Japanese (日本語)](https://www.solaranamnesis.pub/index-ja.html)  
[Italian](https://www.solaranamnesis.pub/index-it.html)  
[Russian (Русский)](https://www.solaranamnesis.pub/index-ru.html)  
[Chinese (中文)](https://www.solaranamnesis.pub/index-zh.html)  
[Hebrew (עברית)](https://www.solaranamnesis.pub/index-he.html)  
[Thai (ไทย)](https://www.solaranamnesis.pub/index-th.html)  
[Vietnamese (Tiếng Việt)](https://www.solaranamnesis.pub/index-vi.html)  
[Arabic (العربية)](https://www.solaranamnesis.pub/index-ar.html)  
[Hindi (हिन्दी)](https://www.solaranamnesis.pub/index-hi.html)  
[Greek (Ελληνικά)](https://www.solaranamnesis.pub/index-el.html)  
[Korean (한국어)](https://www.solaranamnesis.pub/index-ko.html)  
[Portuguese](https://www.solaranamnesis.pub/index-pt.html)  
[Bengali (বাংলা)](https://www.solaranamnesis.pub/index-bn.html)  
[Punjabi (ਪੰਜਾਬੀ)](https://www.solaranamnesis.pub/index-pa.html)  
[Persian (فارسی)](https://www.solaranamnesis.pub/index-fa.html)  
[Kiswahili](https://www.solaranamnesis.pub/index-sw.html)  
[Bahasa Indonesia](https://www.solaranamnesis.pub/index-id.html)  
[Język Polski](https://www.solaranamnesis.pub/index-pl.html)  
[Nederlands](https://www.solaranamnesis.pub/index-nl.html)  
[Svenska](https://www.solaranamnesis.pub/index-sv.html)  
[Turkish (Türkçe)](https://www.solaranamnesis.pub/index-tr.html)  
[Magyar](https://www.solaranamnesis.pub/index-hu.html)  
[Nepal Bhasa (𑐣𑐾𑐥𑐵𑐮 𑐨𑐵𑐲𑐵)](https://www.solaranamnesis.pub/index-new.html)  
[Lhasa Tibetan (ལྷ་སའི་སྐད་)](https://www.solaranamnesis.pub/index-bo.html)  
[Sinhala (සිංහල)](https://www.solaranamnesis.pub/index-si.html)  
[Tamil (தமிழ்)](https://www.solaranamnesis.pub/index-ta.html)  
[Odia (ଓଡ଼ିଆ)](https://www.solaranamnesis.pub/index-or.html)  
[Armenian (Հայերեն)](https://www.solaranamnesis.pub/index-hy.html)  
[Tagalog](https://www.solaranamnesis.pub/index-tl.html)  

IPFS Mirror:

[IPNS hash k51qzi5uqu5dhxjrhpv3w4j0vpwai82jxdgel8kefwf0jzm1l14ow991qo5aga](https://dweb.link/ipns/k51qzi5uqu5dhxjrhpv3w4j0vpwai82jxdgel8kefwf0jzm1l14ow991qo5aga/)
