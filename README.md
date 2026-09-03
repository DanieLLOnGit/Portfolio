# Personal website

Static site (plain HTML + CSS), hosted on GitHub Pages.

Visual language ported from the [Miyazaki](https://andersnoren.se/teman/miyazaki-wordpress-theme/)
WordPress theme by Anders Norén (GPLv2): black / white / red-orange `#F9423A`,
Teko for display type, Charis SIL for body text.

## Local preview

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Structure

```
index.html      Home
about.html      About page
css/style.css   All styles + font-face declarations
fonts/          Teko + Charis SIL (woff2)
.nojekyll       Tells GitHub Pages to serve files as-is
```

## Deploy

Pushing to the `main` branch publishes automatically once GitHub Pages is
enabled (Settings → Pages → Source: `main` / root).
