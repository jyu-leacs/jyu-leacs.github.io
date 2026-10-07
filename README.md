# LEACS seminars

A responsive, static seminar website with an eye-tracking-lab look: ink navy, lake blue, sky, teal, and an amber "fixation" accent (deliberately no purple), an original brain-and-cursor LEACS logo, and a cognitive science illustration overlaid with an animated scanpath. Write content in Markdown; Eleventy generates ordinary HTML for GitHub Pages. Body text uses Inter, headings Space Grotesk, and small labels JetBrains Mono. No database or server is needed on the deployed site.

## Preview on your computer

Install Node.js 22 or later, then open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open **http://localhost:8080**. Save a file to refresh the preview. `npm run build` generates the deployable site in `_site/`. Do not edit `_site/` directly.

On a Windows network folder (`\\server\share\…`), open the project through a mapped drive instead. For this workspace, run `Set-Location 'U:\Desktop\LEACS Seminars'` in PowerShell before the npm commands. Windows’ default npm shell and the generator’s file discovery require a drive path here. On a local drive and GitHub Actions, the ordinary commands above work.

## Make it yours

1. Edit `src/_data/site.js`: review the manager’s published JYU contact email, description, timezone, and optional social links. Choose `selectedFont`: `Ubuntu`, `Inter`, `DM Sans`, or `Source Sans 3`. Add another Google Font to the `fonts` object if desired. This is an owner setting; all body text uses the selected font. `displayFont` (headings) and `monoFont` (labels, dates) can be changed or set to `null` to reuse the body font. `seoTitle` is the homepage title shown in search results; `organization` feeds the structured data.
2. Replace the three example Markdown talks in `src/talks/` and the two example posts in `src/journal/`. Set `example: false` on real content, then `demo: false` in site settings. Example detail pages are excluded from the sitemap and marked `noindex`.
3. Edit `src/about.md` with your seminar description and participation details. Edit `content/people.json` to add organizers, their photos, roles, short descriptions, and external profile links. Aaron’s manager entry is already included.
4. Edit `src/index.njk` to change homepage headline and introduction. The YAML `hero` block controls its lead text. Other homepage copy is below it. The "Next session" bar under the hero shows the first upcoming talk automatically.
5. Contact-page copy is in `src/contact.njk`. The page embeds the Microsoft Form configured in `site.contactFormUrl`, with a direct link to open the form and an email alternative. Change the form questions and response settings in Microsoft Forms. To replace it, set `contactFormUrl` in `src/_data/site.js` to the new response URL without `&embed=true`. To remove the embed, set this field to an empty string. The **Write an email** link opens the visitor’s email app.

### Microsoft Forms contact form

Microsoft Forms can collect responses through an embedded form on GitHub Pages. No email password or server code needs to be stored in the website.

1. Sign in to [Microsoft Forms](https://forms.office.com/) with your university account and create a form with name, email address, topic, and message questions.
2. Select **Collect responses** and choose **Anyone can respond** if visitors outside JYU should be able to contact you. Your university’s Microsoft 365 administrator may restrict external responses. For an internal form, choose the organization-only option; visitors will need to sign in.
3. Set `contactFormUrl` in `src/_data/site.js` to the form’s response URL. The template adds the embed parameter, an accessible title, full-width sizing, and a direct-link fallback automatically. The frame scrolls independently when the form is taller than its viewport; adjust its height in `src/assets/people.css` if needed.
4. The privacy page explains the Microsoft embed. Keep it current if you change services or how submissions are handled.

The supplied Microsoft Forms response URL is already configured. The website does not control who can respond, response notifications, or submission storage; manage these in Microsoft Forms and your university’s Microsoft 365 environment. See [Microsoft’s sharing and embedding instructions](https://support.microsoft.com/en-us/forms/send-a-form-and-collect-responses).

## Publish to GitHub Pages

1. Create a GitHub repository and upload this folder’s contents, including `.github/` and `package-lock.json` (exclude `node_modules/`, `_site/`, and test outputs).
2. Use `main` as the default branch, or update the branch in `.github/workflows/pages.yml`.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Push to `main`, or run **Build and deploy LEACS** from the Actions tab. The workflow builds, checks links, and publishes the static output.

The workflow obtains the correct origin and repository prefix from GitHub, so both `username.github.io` and `username.github.io/repository/` work. For correct canonical links during local builds, change `url` in `site.js` to your actual origin (e.g. `https://username.github.io`) and set `basePath` via the `SITE_BASE_PATH` environment variable or its default. The origin must not include the repository path.

For a custom domain, configure the domain in Settings → Pages and its DNS records following [GitHub’s guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). The workflow picks up the Pages domain. No publication has been performed automatically by this project.

## Add a seminar

Copy an existing file into `src/talks/my-new-talk.md`. The filename controls the URL. Use quoted ISO 8601 dates **with the correct UTC offset**: Finland is `+02:00` in winter and `+03:00` in summer. Display times are formatted using `site.timezone` (default `Europe/Helsinki`).

```yaml
---
title: Your seminar title
description: A short abstract for the cards and search engines.
starts: '2026-11-26T14:00:00+02:00'
ends: '2026-11-26T15:00:00+02:00'
speaker: Speaker Name
affiliation: Institution or research group
speakerPhoto: /content/images/speaker-name.jpg
speakerPhotoAlt: Speaker Name
speakerBio: A short biography describing the speaker’s background and research.
speakerProfile: https://your-university-profile-url
speakerLinks:
  - label: Personal website
    url: https://your-personal-site-url
  - label: ORCID
    url: https://orcid.org/your-id
topic: Cognitive science
venue: Building, room, or online
language: English
example: false
draft: false
# Optional:
# coverImage: /content/images/talk-cover.jpg
# coverImageAlt: A description of the cover image
# slides: /content/pdfs/my-new-talk.pdf
# recording: https://your-recording-url
# registration: https://your-registration-url
---
## Abstract

Write your abstract here in Markdown.

Write additional sections and links here. The template renders a separate
About the speaker section from the fields above.
```

`draft: true` prevents a talk/post page and listing from publishing. Upcoming/past labels use the end time at build time. A daily scheduled build refreshes them; GitHub may delay scheduled jobs or disable them after a long period of repository inactivity. A manual Actions run also refreshes the list. Real talks get an `.ics` calendar download using UTC instants so calendar apps convert them to the attendee’s timezone. Example events never get calendar downloads.

The speaker portrait appears in the talk card and the About the speaker section. An optional cover image appears above the card and the talk’s abstract; cards without a cover use a blue LEACS graphic. Without a speaker photo, a neutral silhouette is shown. The external `registration` URL becomes a prominent **Register / join** button for real talks. Remove the field if registration is unnecessary; example talks do not display actionable registration links.

If an end time is not yet known, omit `ends`. The page displays only the start time, and the calendar file includes only the start time as a reminder rather than reserving a guessed duration. Upcoming status then uses the start time. Confirmed talks appear before illustrative samples in the full programme.

For a forthcoming talk with an unannounced exact date, omit `starts` and `ends` and add a quoted month such as `plannedMonth: '2026-11'`. The site displays **November 2026** and **Date & time to be announced**, keeps the talk in the upcoming list during that month, and does not generate a calendar download. Set a clear placeholder title until the speaker’s title is confirmed. Once you have the date, add `starts` with its UTC offset to enable normal date/time display and the calendar download.

For Microsoft Forms registration, set `registration` to the response URL without `&embed=true` and add `registrationEmbed: true`. The talk page then includes a full-width registration iframe and a direct-link fallback. The homepage and programme cards link to that registration section. Set `registrationQr` to a local QR image if desired. For Zoom, add `meetingUrl` and optionally `meetingLogo`; the sidebar shows a labelled meeting link and the calendar includes it. Set `venue: Online on Zoom` for online workshops. For logo-style header images such as PsychoPy, `coverFit: contain` preserves the full image rather than cropping it.

## Add organizers and other people

Open `content/people.json` and add another object to the array. Separate entries with commas; JSON does not permit trailing commas. Put the person’s photo in `content/images/`.

```json
{
  "name": "Person Name, PhD",
  "role": "Organizer",
  "position": "Researcher · Cognitive Science",
  "image": "/content/images/person-name.jpg",
  "imageAlt": "Person Name",
  "description": "A short description of the person’s research and role in LEACS.",
  "links": [
    { "label": "University profile", "url": "https://your-profile-url" },
    { "label": "Personal website", "url": "https://your-website-url" }
  ]
}
```

The About page generates cards automatically for all entries. External links open normally so visitors can choose whether to open a new tab. To change surrounding text or section headings, edit `src/about.md`. Aaron’s portrait and research summary were sourced from his linked JYU profile; his seminar manager role was supplied by him. Image sources and the full generation prompt are recorded in `content/ASSETS.md`.

## Add a journal post

Create `src/journal/your-post.md`:

```yaml
---
title: Your article title
description: A short summary.
date: 2026-10-02
author: Your name
category: Seminar notes
example: false
draft: false
---
## Your heading

Write here. **Bold**, *italic*, lists, quotes, and links work.
```

Posts appear automatically in the journal, homepage, and Atom feed. The journal serves as the blog.

## Images and PDFs

- Put images in `content/images/` and PDFs in `content/pdfs/`.
- In Markdown, use the URL filter so links work on project Pages:

```md
![A useful description of the image]({{ '/content/images/your-image.webp' | url }})

[Download the handout (PDF)]({{ '/content/pdfs/handout.pdf' | url }})
```

Prefer compressed WebP/JPEG photos and descriptive filenames. Include meaningful alternative text. Files in these folders are copied unchanged and are publicly accessible even if linked only from a draft. Keep confidential materials outside the project.

## Appearance, search, and accessibility

Change colours (the tokens at the top), spacing, and breakpoints in `src/assets/style.css`; photo, speaker, and organizer layouts are in `src/assets/people.css`. The homepage illustration is `content/images/cognition-interface.webp` (a compressed copy of the original PNG); update its references in `src/index.njk` and `src/_includes/base.njk` (preload) to replace it. The scanpath circles in `src/index.njk` are positioned for this image. Prefer WebP or compressed JPEG for new photos. The SVG logo files are in `src/assets/`: `logo-mark.svg` for the header, `logo.svg` for a standalone wordmark, and `favicon.svg` for browser tabs. `src/assets/social-blue.png` is the current 1200×630 social preview. With a root-path preview running, `node scripts/social-preview.mjs` recreates it from the homepage; then rebuild to copy the new image to `_site`.

The site includes descriptive metadata, canonical links, Open Graph/Twitter previews (a talk's cover photo is used as its sharing image), an XML sitemap with `lastmod`, robots.txt, and schema.org structured data generated in `src/_data/eleventyComputed.js` (Organization, WebSite, breadcrumbs, an Event for each confirmed talk with a date, and BlogPosting for real journal posts), semantic HTML, keyboard navigation, a skip link, reduced-motion support, and responsive layouts. These support discoverability; they do not guarantee Google rankings. Once published, submit the sitemap to Google Search Console. On a repository subpath, its `robots.txt` is not at the origin root and cannot set origin-wide crawling rules; submit the sitemap directly. Do not index the sample programme as real events.

Google Fonts makes an external font request. For self-hosted fonts, download the properly licensed font files into `src/assets/fonts/`, add `@font-face` rules, and remove the Google Fonts links from `base.njk`. The privacy page explains the current implementation.

## Check changes

```sh
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

The build checks cover generated asset/page links and demo indexing. Browser checks cover search, filters, mobile navigation, no-JavaScript content, and horizontal overflow at 320, 390, 768, and 1440 pixels. Run browser tests with the default root base path.

Browser content assertions use the supplied three example talks; update those assertions when replacing the programme. The checks run during deployment do not depend on example filenames or talk counts. `npm run preview` serves an already-built site without watching. With that preview running, `node scripts/screenshots.mjs` refreshes the included desktop and mobile previews.

References: [Eleventy documentation](https://www.11ty.dev/docs/) and [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
