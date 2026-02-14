# Specification

## Summary
**Goal:** Build a single-page site with three locally generated demo creation tools (Text-to-Image, Text-to-Video, Image-to-Video) plus per-user recent generation history stored as metadata in a Motoko canister.

**Planned changes:**
- Add single-page navigation (tabs/segmented control) to switch between Text-to-Image, Text-to-Video, and Image-to-Video while preserving each tool’s form state until reset.
- Implement Text-to-Image UI with prompt input, aspect ratio + simple style selector, local/demo image generation, preview, and PNG download.
- Implement Text-to-Video UI with prompt input, duration + motion style controls, local/demo video generation, preview, and video download.
- Implement Image-to-Video UI with image upload + preview, duration + animation style controls, local/demo video generation from the uploaded image, preview, and video download.
- Add frontend UX states for all generators: in-progress/loading (disabled Generate), success (preview + download), and failure (English error message).
- Add a consistent site theme (colors/typography/spacing/component styling) across all tools and history panel, avoiding a blue/purple-dominant palette.
- Add a lightweight Motoko (single-actor) backend to store per-user generation history metadata (activity type, prompt, timestamps, artifact identifiers/filenames) and expose add/list methods; display a “Recent generations” panel in the UI.

**User-visible outcome:** Users can switch between three generation tools on one page, generate and download demo images/videos locally in the browser, and see a persistent per-user list of recent generations with basic details.
