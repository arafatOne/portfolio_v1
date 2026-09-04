# Yeasin Arafat — portfolio

A single-page portfolio. Plain HTML, CSS and JavaScript — no build step, no
dependencies, no framework. Terminal/mono aesthetic, strictly monochrome,
dark by default with a light toggle.

```
portfolio/
├── index.html      all content lives here
├── styles.css      all styling; colours are CSS variables at the top
├── script.js       theme toggle, reveals, clock, copy button
├── dev-server.js   optional local preview server (safe to delete)
└── assets/
    └── portrait.jpg   the About photo
```

## Viewing it

Double-click `index.html` — it opens straight in a browser. Nothing needs a
server. (`dev-server.js` is only there if you'd rather serve it over
`http://localhost:4321`; it needs Node installed.)

## Loose ends

All the content is real. These are the three things worth revisiting.

### 1. Behance project links

Projects 02–07 point at `https://www.behance.net/arafat67` — your profile root,
not the individual galleries. Behance gallery URLs need a numeric ID that can't
be guessed from the title. To deep-link one, open the project on Behance and
paste its URL (`behance.net/gallery/<id>/<slug>`) over the `href`.

### 2. Missing years

Only project 01 has a year, because the others weren't known — better a blank
than a wrong date. The layout treats a missing year as intentional, so nothing
looks broken. To add one, drop a `<span class="project__year">2025</span>` inside
that row's `.project__meta`.

### 3. Before you publish

- `og:url` in `<head>` still says `https://example.com`. Set it to your real
  domain so link previews work.
- The `01` project links to a repo literally named
  `RPL-ICT-WDDF-L3-00XXXX_BloomingOasis` — the template `XXXX` was never
  replaced. If you rename the repo on GitHub, update the `href` to match.
- There's no Dribbble row. Your Behance profile mentions one; paste the URL in
  and copy the shape of the GitHub row in `#contact` if you want it listed.

## What's deliberately not on the page

Your CV and certificate carry a phone number, home address, parents' names,
date of birth, national ID / birth registration number, religion, marital
status, and your CGPA and GPA. None of that is on the site. It's normal on a
Bangladeshi CV, but on a public web page it's a privacy and identity-theft
risk, and grades aren't what a design client is reading for.

Also removed for the same reason:

- **The "download CV" button and its PDF.** The PDF was the full CV, so anyone
  clicking it got every one of the details above. Both are gone. A commented-out
  block sits at the end of the `#experience` section in `index.html` — export a
  trimmed CV as `assets/cv.pdf` and paste that block back in to restore it.
- **The certificate's Credential ID.** It's listed as a qualification with the
  issuing authority and dates, which is enough for an employer; the ID number
  itself isn't published.

Add any of it back if you'd rather have it there — the markup is all in
`index.html`.

## Changing the design

All colours are CSS variables at the top of `styles.css`, in two blocks:
`[data-theme='dark']` and `[data-theme='light']`. Change them there and both
themes stay consistent — nothing is hard-coded further down.

Other useful knobs in `:root`:

- `--wrap` — max content width (currently `1080px`)
- `--section-y` — vertical space between sections
- `--font-mono` — the typeface stack

The font is JetBrains Mono, loaded from Google Fonts. If it fails to load the
site falls back to the system monospace and still looks correct.

## Swapping the portrait

Overwrite `assets/portrait.jpg` — nothing else needs touching. The frame is a
fixed `4 / 5` box using `object-fit: cover`, so any aspect ratio fills it
without distorting; the image is grayscaled in CSS, so it doesn't need to be
black and white already.

If a new photo crops badly, the one knob is `object-position` on
`.about__portrait img` in `styles.css`. It's currently `center top`, chosen
because the current photo's ring light sits close to the top edge and any
downward bias crowds it. `center` or `center 30%` suits a photo with more
headroom.

## Deploying

It's a static folder, so anything works. Drag it onto
[netlify.com/drop](https://app.netlify.com/drop), or push it to a GitHub repo
and turn on GitHub Pages. No build command, no output directory.
