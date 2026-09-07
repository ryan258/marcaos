# Artist one-page site

A single-scroll Hugo site for a musician / DJ: hero, bio, press quotes,
listen links, timeline, tour dates, booking. Ships with the **Marchaos**
demo brand so it runs before you change anything.

## Requirements

Hugo **extended** (for SCSS):

```
brew install hugo        # macOS
```

## Use it

1. `hugo server` — open http://localhost:1313
2. Edit **`hugo.toml`** — most text on the page is a param there.
   - Optional sections (`listen`, `timeline`) vanish when you delete
     their entries. Delete the whole `[params.*]` block to remove the
     section entirely.
   - Prose fields take Markdown.
2a. **Shows** are one Markdown file each in `content/ceremonies/`
   (see the four samples). `hugo new ceremonies/paris.md` scaffolds one
   with the right front matter. Each becomes its own page; the homepage
   lists them by date. Set `tickets` to a URL while on sale; drop it
   afterwards. Remove all the files to hide the section.
3. Replace **`assets/artist.jpg`** with your photo (any name — update
   `hero.image` to match).
4. Recolor: edit the six values in the block at the top of
   **`assets/scss/main.scss`**.
5. Set `baseURL` in `hugo.toml` to your domain.

## Build

```
hugo --gc --minify        # output in public/
```

Deploy `public/` anywhere static (Netlify, Cloudflare Pages, GitHub Pages).
`layouts/404.html` is served as the not-found page by most hosts.

## Layout

```
hugo.toml                 content + config
content/ceremonies/*.md   one file per show
archetypes/ceremonies.md  front matter for `hugo new`
assets/artist.jpg         hero image
assets/scss/main.scss     styles (color block up top)
layouts/index.html        the page — data-driven sections
layouts/ceremonies/       single + list templates for shows
layouts/partials/          head, ceremony-list
layouts/_default/baseof.html
layouts/404.html
```
