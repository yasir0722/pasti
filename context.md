# Kids Revision App

## Purpose

Build a very fast, simple web app for a child to revise Islamic learning material with a parent nearby. The app should make it easy to open a topic, choose one item, view or listen to it, and move through a short revision session without distraction.

The first content areas are:

1. Hadis: a set of 20 Hadis cards/images to memorize.
2. Quran: selected surah from Juz 30 to memorize.
3. Colors in Arabic: Arabic names, transliteration, and a visual color reference.

More topics can be added later using the same structure, for example dua, Arabic letters, Islamic manners, or vocabulary.

## Primary Users

- Child: opens a topic and studies one item at a time.
- Parent: chooses the material, guides the child, and optionally marks what has been revised.

The first version should remain child-friendly and require no login, account, or internet connection after the app has loaded.

## MVP User Flow

```text
Home
  -> Hadis
      -> list of 20 Hadis
          -> one Hadis detail page
  -> Quran
      -> list of selected surah
          -> one surah detail page
  -> Colors
      -> list/grid of colors
          -> one color detail page
```

### Home page

Show only large, clear topic choices:

- Hadis
- Quran
- Colors

Each topic tile includes a small image or simple illustrated icon and the number of available lessons. There is no feed, sign-in, advertising, or unrelated navigation.

### Topic page

For example, the Hadis page shows all 20 Hadis as a numbered list or compact card grid. Each item has:

- Number and title, for example `Hadis 1`.
- A small thumbnail.
- An optional completed/revised mark controlled by the parent.

Selecting an item opens its detail page.

### Lesson detail page

For a Hadis, display the full learning card/image prominently, matching the supplied example. Keep controls simple:

- Back to the topic list.
- Previous and next lesson.
- Optional `Revised` toggle for parent guidance.
- Optional audio play button when an audio recording is available.

For Quran lessons, show Arabic text, transliteration/translation where supplied, and optional recitation audio. For colors, show a large color swatch with Arabic, transliteration, and Malay/English meaning, plus a `Listen` button that speaks the Arabic name.

## Content Model

Keep all lesson metadata in a single local JSON file so more lessons can be added without changing the app interface.

```json
{
  "topics": [
    {
      "id": "hadis",
      "title": "Hadis",
      "description": "20 Hadis untuk dihafal",
      "coverImage": "assets/images/hadis/cover.webp",
      "items": [
        {
          "id": "hadis-01",
          "title": "Hadis Ke-1: Sebaik-Baik Amalan",
          "thumbnail": "assets/images/hadis/hadis01-thumb.webp",
          "image": "assets/images/hadis/hadis01.webp",
          "audio": null
        }
      ]
    }
  ]
}
```

The existing 20 Hadis images should be named consistently, for example `hadis01.webp` through `hadis20.webp`. The original image shown in the brief becomes `hadis01.webp`.

## Technical Direction: Fastest Web App

Use a static site with plain HTML, CSS, and small vanilla JavaScript modules.

This is a static app: the deployed files are HTML, CSS, JavaScript, images, JSON content, and optional local audio. Routing, revision progress, and speech all run in the browser, so the app needs no backend, database, account, or server-side rendering.

Why this is the best starting point:

- No server, database, authentication, or API calls.
- No React/framework runtime or large JavaScript bundle.
- Can be hosted free on GitHub Pages with HTTPS and a Git-based deployment workflow.
- Can work offline after the first visit when a small service worker is added.
- Content and images remain private to the deployed site and are easy to update.

Suggested structure:

```text
index.html
assets/
  css/app.css
  js/app.js
  data/content.json
  images/
    hadis/
    quran/
    colors/
  audio/
```

One-page navigation can use URL hashes such as `#hadis`, `#hadis/hadis-01`, and `#quran/al-fatihah`. This keeps navigation fast while retaining browser back/forward support without requiring server-side routing.

## GitHub Pages Deployment

GitHub Pages is the official hosting target for the first release. The repository `yasir0722/pasti` should publish the static app directly from its `main` branch through GitHub Actions.

Deployment requirements:

- Publish the repository root or a generated `dist/` folder as static files.
- Use a GitHub Actions workflow that runs on pushes to `main`.
- Do not require Node.js, Python, Docker, a database, environment secrets, or a server process at runtime.
- Keep all lesson data, images, and optional recordings inside the repository or another intentionally public static asset location.
- Use relative asset paths so the app works both at `https://yasir0722.github.io/pasti/` and with a future custom domain.
- Use hash navigation such as `#hadis/hadis-01`; do not depend on server-side route rewrites.
- Include a `404.html` fallback only if the deployed app needs a friendly missing-page response.
- Enable GitHub Pages with GitHub Actions in repository settings.

The expected first URL is:

```text
https://yasir0722.github.io/pasti/
```

A custom domain can be added later with a `CNAME` file and DNS configuration, without changing the app architecture.

GitHub Pages is appropriate because this app has no private runtime data or server-side behavior. Browser-only features such as `localStorage`, speech synthesis, and service-worker caching continue to work over the HTTPS Pages URL. Revision progress is stored per browser/device and is not synchronized between parents or devices until a backend is intentionally added in a future version.

## Arabic Voice Synthesis

Color lessons use the browser's built-in Web Speech API to pronounce the Arabic color name after the child or parent taps `Listen`.

- Create a `SpeechSynthesisUtterance` using the Arabic word with diacritics when available.
- Request an Arabic voice with `ar-SA` first, then another available `ar` voice.
- Use a slower speaking rate suitable for repetition and memorization.
- Cancel current speech before playing a new word, so repeated taps do not overlap.
- Start speech only after a user tap, which works with mobile browser audio rules.

Speech synthesis remains fully client-side and does not add an API request, server, or download to the static app. Arabic voices depend on the device and browser, however, so pronunciation quality and offline availability cannot be guaranteed everywhere. When a suitable voice is unavailable, the app should keep the word visible and optionally use a locally stored MP3/WebM recording as the preferred fallback.

## Performance Rules

1. Convert lesson images to WebP or AVIF while keeping Arabic text sharp and readable.
2. Create small WebP thumbnails for topic lists; load the full-size image only on the detail page.
3. Add `width` and `height` to images to avoid page movement while they load.
4. Lazy-load thumbnails below the first screen.
5. Use local assets only; avoid third-party fonts, trackers, ads, video embeds, and UI libraries.
6. Use system fonts unless a locally hosted font is essential for Arabic readability.
7. Keep the initial HTML, CSS, and JavaScript very small; target under 100 KB before images.
8. Cache the app shell, content JSON, and previously opened lessons with a service worker in a later step.

## Visual Direction

- Warm, calm, child-friendly palette inspired by the supplied Hadis cards.
- Large touch targets for children and parents using phones or tablets.
- Clear Malay labels, with Arabic where it is learning content.
- No dense dashboards or decorative clutter.
- Responsive layout: 1 to 2 columns on phones, more columns on tablets and desktops.
- The lesson image is always the most important element on its page.

## Parent Guidance, Version 1

Keep this deliberately lightweight:

- A `Revised` control on each lesson.
- Store revised status in the browser with `localStorage`.
- Show a small progress count per topic, such as `5 / 20 revised`.
- No account means the progress belongs only to that browser/device.

## Build Order

1. Create the static app shell and mobile-first layout.
2. Add the Home, Hadis list, and Hadis detail views.
3. Import and optimize the 20 Hadis images plus thumbnails.
4. Add the Quran and Colors content using the same data model.
5. Add parent revision marks and per-topic progress.
6. Add Arabic color voice synthesis and test it on the family's phone and tablet browsers.
7. Add optional local recordings and offline caching after the core revision flow works.

## GitHub Pages Release Checklist

- Repository is `yasir0722/pasti` and the production branch is `main`.
- GitHub Pages source is set to GitHub Actions.
- The workflow completes successfully after every push to `main`.
- The app opens at `/pasti/` and all CSS, JavaScript, JSON, image, and audio paths load correctly from that subpath.
- Home, Hadis, Quran, and Colors navigation works after a refresh and through browser back/forward controls.
- Arabic speech starts only after a user taps `Listen` and fails gracefully when no Arabic voice is installed.
- Revision marks persist after refresh using `localStorage`.
- The app remains usable on a phone, tablet, and desktop browser.
- No API key, password, database, server process, or Docker container is needed for deployment.

## Information Needed Before Content Import

- The original image files for all 20 Hadis, ideally in a folder available to this workspace.
- The exact list of Juz 30 surah to include.
- Quran text, translations, and audio sources that the family is permitted to use.
- The desired Malay wording and spelling for Arabic color names.
- The Arabic color words, preferably with diacritics, to improve voice synthesis pronunciation.
- Whether the app should be Malay-only or offer a language switch later.

## Definition of Done for the First Release

- The Home page opens quickly and presents Hadis, Quran, and Colors.
- A child can open Hadis, select any of 20 lessons, and read the full card.
- Back, previous, and next navigation work on phone and desktop.
- A parent can mark a lesson as revised, and the local progress count updates.
- Each Arabic color can be spoken with the device's available Arabic voice after tapping `Listen`.
- Images stay readable, load efficiently, and do not require an internet API.
- A push to `main` deploys the complete static app to GitHub Pages.