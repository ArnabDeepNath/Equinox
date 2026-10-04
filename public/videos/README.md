# Landing Page Video Assets

The redesigned landing page expects these loops in this folder. Until a file
exists, the site renders its poster image instead — the page never looks
broken, so you can ship posters first and add videos later.

| File                      | Used by          | Suggested prompt (Nano Banana)                                 |
| ------------------------- | ---------------- | -------------------------------------------------------------- |
| `hero.mp4`                | Home hero        | Cinematic night padel court, gold floodlights, slow dolly-in   |
| `paddle.mp4`              | Collections card | Close-up paddle rally under warm floodlights, shallow DOF      |
| `football.mp4`            | Collections card | Five-a-side night turf, golden stadium lights, drifting camera |
| `table-tennis.mp4`        | Collections card | Indoor table tennis, moody black hall, single gold key light   |
| `experience.mp4`          | Experience split | Slow pan across a premium empty sports club lounge + courts    |
| `*-poster.jpg` (per file) | Poster fallbacks | First frame of each video                                      |

Only MP4 sources are wired up in the components. If you add `.webm` (VP9)
twins later, pass them via the `webm` prop on `BgVideo`.

## Compression pipeline (REQUIRED — raw AI output is too heavy for the web)

Target: 5–15s loops, no audio, 1080p max, 2–5MB each, H.264 + faststart.

```powershell
# MP4 (H.264, no audio, faststart for instant playback)
ffmpeg -i raw.mp4 -an -c:v libx264 -crf 26 -preset slow -movflags +faststart -vf scale=1920:-2 hero.mp4

# Optional WebM twin (smaller, served to browsers that support it)
ffmpeg -i raw.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf scale=1920:-2 hero.webm

# Poster frame
ffmpeg -i raw.mp4 -frames:v 1 -q:v 4 hero-poster.jpg
```

Budget: keep the total of all files in this folder under ~25MB so the site
stays comfortably within Vercel Hobby's 100GB/month free bandwidth
(~20k video plays/month at that size).
