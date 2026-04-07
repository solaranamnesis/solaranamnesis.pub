# CLAUDE.md

## Project Overview

**Solar Anamnesis Publishing** is a multilingual digital library of public-domain texts. The site serves books in 40+ languages, each with localized content typeset in LaTeX and distributed as PDFs via IPFS.

**Live Site:** https://www.solaranamnesis.pub/

**Technical Stack:**
- Static HTML/CSS/JavaScript (vanilla, no frameworks)
- Python 3.6+ for build scripts (`generate_books.py`)
- Deployed via HTTPS on static CDN
- JSON-driven content architecture

---

## Repository Structure

```text
/
├── books.json              # Master English book catalogue (source of truth)
├── translations.json       # Translation dictionary (BCP-47 language codes)
├── generate_books.py       # Build script for localized catalogues
├── index.html              # English front-end
├── script.js               # English JavaScript (fetches books.json)
├── shelf-data/             # English shelf/markdown templates
│   └── md-viewer.html
├── {lang}/                 # Per-language directories (e.g., fr/, zh/, ar/)
│   ├── index.html
│   ├── script.js
│   ├── books.json          # Auto-generated
│   ├── links.html
│   └── shelf-data/
└── redirect-stubs/         # Backwards compatibility (index-{lang}.html, etc.)

Build & Deployment Workflow
Generating Localized Catalogues
Run the build script to regenerate all localized books.json files from the master books.json and translations.json:

# Regenerate all languages
python3 generate_books.py

# Regenerate specific languages only
python3 generate_books.py --languages zh ar fr de

# Custom input/output paths
python3 generate_books.py --base books.json --translations translations.json --output-dir ./output

# Skip English output (translated files only)
python3 generate_books.py --no-english

Deployment Checklist
Run generate_books.py to sync all {lang}/books.json files.
Validate JSON syntax across all generated files.
Commit changes to version control.
Deploy to static CDN (ensure HTTPS enforcement).
Verify redirects (index-{lang}.html → {lang}/index.html).
Test CDN cache invalidation if applicable.
Coding Standards
HTML Best Practices
Goal: Semantic, accessible, and clean markup.

<!-- ✓ DO: Semantic HTML5 -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/fr/">Français</a></li>
    </ul>
  </nav>
</header>

<main id="book-list">
  <!-- Content injected via JS -->
</main>

<footer>
  <p>&copy; 2026 Solar Anamnesis Publishing</p>
</footer>

<!-- ✗ DON'T: Non-semantic div soup -->
<div class="header">
  <div class="nav">
    <div class="menu-item">...</div>
  </div>
</div>

Requirements:

Use semantic elements (<header>, <main>, <article>, <section>, <footer>).
Include alt attributes on all images.
Ensure proper heading hierarchy (h1 → h2 → h3).
Add ARIA labels for accessibility.
Validate against W3C HTML validator.
Beautification: 2-space indentation, max line length 120 chars, self-close void elements (<img />).
CSS Best Practices
Goal: Maintainable, responsive, and performant styling.

/* ✓ DO: CSS custom properties for theming */
:root {
  --primary-color: #2c3e50;
  --accent-color: #e74c3c;
  --font-size-base: 1rem;
  --spacing-unit: 1rem;
}

/* ✓ DO: Mobile-first responsive design */
.book-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-unit);
  padding: var(--spacing-unit);
}

@media (min-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .book-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ✓ DO: Logical properties for RTL support */
.book-card {
  margin-inline-start: var(--spacing-unit); /* Works for LTR and RTL */
}

/* ✗ DON'T: Inline styles or !important abuse */

Requirements:

Use CSS custom properties (--variable) for colors, spacing, and fonts.
Mobile-first responsive breakpoints.
Use BEM or utility-class naming convention.
Minify CSS for production.
No inline styles in HTML.
Beautification: 2-space indentation, one property per line, group related selectors.
JavaScript Best Practices
Goal: Modern, robust, and dependency-free (vanilla JS).

'use strict';

/**
 * Fetches book data for a specific language.
 * @param {string} lang - BCP-47 language code (default: 'en')
 * @returns {Promise<Array>} Array of book objects
 */
const fetchBooks = async (lang = 'en') => {
  try {
    const url = `/${lang}/books.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load ${url}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to load books:', error);
    // Handle error gracefully (e.g., show offline message)
    throw error;
  }
};

/**
 * Renders a list of books into the DOM.
 * @param {Array} books - List of book objects
 * @param {HTMLElement} container - Target container element
 */
const renderBooks = (books, container) => {
  container.innerHTML = ''; // Clear existing content
  
  const fragment = document.createDocumentFragment();
  
  books.forEach(book => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="$${book.image}" alt="$${book.title}" loading="lazy">
      <h2>${escapeHtml(book.title)}</h2>
      <p>${escapeHtml(book.author)}</p>
    `;
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
};

// Helper to prevent XSS
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  const lang = window.location.pathname.split('/')[1] || 'en';
  const container = document.getElementById('book-list');
  
  try {
    const books = await fetchBooks(lang);
    renderBooks(books, container);
  } catch (err) {
    container.innerHTML = '<p>Error loading books. Please try again later.</p>';
  }
});

Requirements:

'use strict' at module/script level.
Prefer const over let; avoid var.
Use async/await over callbacks.
Implement error handling with try/catch.
No jQuery or external framework dependencies.
Sanitize all dynamic content to prevent XSS.
Beautification: 2-space indentation, semicolons required, single quotes for strings.
JSON Data Standards
Goal: Consistent, valid, and source-of-truth data.

{
  "id": "unique-book-id",
  "title": "Book Title",
  "author": "Author Name",
  "year": 1850,
  "languages": ["English", "French"],
  "subjects": ["Philosophy", "History"],
  "collections": ["Classics"],
  "image": "/images/book-cover.jpg",
  "thumbs": [
    {
      "label": "PDF Variant A",
      "class": "thumb-a",
      "pdfUrl": "/ipfs/QmHash/variant-a.pdf"
    }
  ],
  "footer": [
    {
      "text": "Read More",
      "link": "/shelf-data/md-viewer.html"
    }
  ]
}

Requirements:

Consistent field ordering.
No trailing commas.
UTF-8 encoding.
Validate with python3 -m json.tool or similar.
Keep books.json as the source of truth; {lang}/books.json is auto-generated.
Localization Guidelines
Translation Fields (from translations.json)
Category	Keys	Notes
languages	Language names	e.g., "en": "English"
subjects	Subject keywords	e.g., "philosophy": "Philosophie"
collections	Collection names	e.g., "classics": "Klassiker"
labels	PDF variant labels	e.g., "variant-a": "Version A"
footer	Footer link text	e.g., "read-more": "Weiterlesen"
authors	Author name translations	Optional overrides
year_conversion	Calendar offsets	offset, prefix, suffix for CE→native conversion
Year Conversion Logic
The generate_books.py script handles calendar conversions (e.g., CE to Buddhist Era, Hebrew, etc.):

{
  "year_conversion": {
    "th": { "offset": 543, "prefix": "", "suffix": "" },
    "he": { "offset": 3760, "prefix": "", "suffix": " AM" },
    "be": { "offset": 543, "prefix": "BE ", "suffix": "" }
  }
}

RTL Language Support
For Arabic (ar), Hebrew (he), Persian (fa), Urdu (ur):

Set dir="rtl" on <html> or relevant containers dynamically based on language code.
Use CSS logical properties (margin-inline-start vs margin-left).
Test bidirectional text rendering.
Ensure CDN serves correct charset (UTF-8).
Security Considerations
HTTPS & CDN
All pages served over HTTPS only.
HSTS headers enabled.
CDN configured to block HTTP fallback.
No mixed content (all assets must be HTTPS).
Content Security Policy (CSP)
Implement a strict CSP header via CDN configuration or meta tag:

<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https: data:; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self';">

Input Validation
Sanitize any dynamic content rendered from JSON (see escapeHtml helper).
Escape HTML entities in user-facing text.
Validate JSON structure before rendering.
Common Tasks
Adding a New Language
Create {lang}/ directory.
Copy index.html, script.js, shelf-data/ from English root.
Add language entry to translations.json.
Run python3 generate_books.py --languages {lang}.
Update translations.json with all new field translations.
Re-run generator and test.
Updating Book Data
Edit books.json (master source).
Add any new translation keys to translations.json.
Run python3 generate_books.py.
Verify all languages updated correctly.
Commit and deploy.
Debugging Translation Issues
# Check if a language code exists in translations.json
grep '"{lang}"' translations.json

# Validate generated JSON
python3 -m json.tool {lang}/books.json > /dev/null

# Compare English vs translated field
diff books.json {lang}/books.json

Testing Checklist
Before deploying:

 All {lang}/books.json files validate as valid JSON.
 No broken links (run link checker).
 Responsive design tested on mobile/tablet/desktop.
 RTL languages render correctly.
 Year conversions display properly for each locale.
 HTTPS enforced on CDN.
 Cache headers configured appropriately.
 Accessibility audit (WCAG 2.1 AA target).
Contact & Support
Repository: Solar Anamnesis Publishing
Build Script: generate_books.py (Python 3.6+)
Support: Refer to project documentation or repository issues.
