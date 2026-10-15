# X-ray.web

AI-assisted X-ray research prototype built for the Congressional App Challenge. Radiant
is a student research/demo project — **not a medical diagnostic device**. It never
claims to diagnose conditions or replace a qualified medical professional.

## Stack

- React 19 + Vite
- Tailwind CSS v4 for styling
- React Router for navigation
- Anime.js for scroll reveals, staggered entrances, and cursor/scroll motion
- Lucide for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build, output in dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

## Project structure

```
src/
  components/
    layout/        Navbar, Footer, page Layout (with route transitions)
    xray/           UploadZone, XrayViewer, AnalysisLoader, ResultsPanel
    xray/illustrations/  DogLegXray (stylized SVG) + shared XrayFilm backdrop
    auth/           shared AuthCard used by Login/Signup/ForgotPassword
    ui/             Button, FormField, Disclaimer — shared primitives
  assets/xrays/     real, public-domain (CC0) sample X-ray images — see below
  context/
    AuthContext.jsx   mock, frontend-only auth (never stores real passwords)
    ToastContext.jsx  toast notifications
  hooks/
    useReveal.js      scroll-triggered fade/slide-in (single + staggered group)
    useCountUp.js     animated stat numbers
    useTilt.js        cursor-based 3D tilt (desktop, motion-safe only)
    useParallax.js    subtle scroll parallax (motion-safe only)
  lib/
    xrayService.js    <-- the AI/backend integration boundary (see below)
    demoCases.js       prepared "Try a Demo" cases
    mockDashboard.js   mock dashboard data
  pages/            one file per route, wired up in App.jsx
```

## Connecting the real AI model

The entire app calls exactly one function to get an analysis result:
[`src/lib/xrayService.js`](src/lib/xrayService.js). It currently returns mock data after
a simulated delay. To connect the real backend, replace the body of `analyzeXray()` with
a real API call (e.g. `fetch` to the backend), but keep returning the same shape:

```js
{
  hasFinding: boolean,
  finding: string,        // short human-readable label
  confidence: number,     // 0–1, model confidence — not medical certainty
  region: { x, y, width, height } | null,  // percentages (0–100), for the overlay
  explanation: string,
}
```

Nothing else in the UI needs to change — every screen that shows a result (Analyze,
Demo, the dog demo) consumes this same shape.

## Authentication

Login/signup in this prototype are **mock, frontend-only** (see
[`src/context/AuthContext.jsx`](src/context/AuthContext.jsx)) — there is no real backend
and no real password or account is ever created or stored. There is currently no
third-party sign-in (e.g. Google OAuth) wired up; if that's added later, it will need its
own Client ID and authorized origins configured separately.

## Demo images

The three human demo cases (`src/assets/xrays/`) are real radiographs released into the
public domain (**CC0 1.0 Universal**) by **Mikael Häggström, M.D.**, via Wikimedia
Commons. No attribution is legally required for CC0, but it's credited here anyway:

- `chest-normal.jpg` — [Normal posteroanterior (PA) chest radiograph](https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg)
- `chest-finding.jpg` — [Chest radiograph in influenza and H. influenzae](https://commons.wikimedia.org/wiki/File:Chest_radiograph_in_influensa_and_H_influenzae,_posteroanterior.jpg) (real patchy consolidation, upper right lobe; used here with a mock/simulated analysis overlay, not a real diagnosis)
- `foot-normal.jpg` — [X-ray of normal right foot](https://commons.wikimedia.org/wiki/File:X-ray_of_normal_right_foot_by_dorsoplantar_projection.jpg)

The veterinary demo (`DogLegXray.jsx`) still uses an original stylized illustration — no
suitably licensed modern dog-leg radiograph was found; swap it for a real one the same
way (an `<img>` in `DogDemo.jsx`) if you find a properly licensed source.

## Deployment

A GitHub Pages workflow is included ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)),
triggered on push to `main`. It builds with `GITHUB_PAGES=true` so Vite serves assets
from the `/X-ray.web/` base path. To enable it, turn on GitHub Pages for this repository
(Settings → Pages → Source: GitHub Actions).

## The fracture model (runs in the browser)

The Analyze page (`Analyze.dc.html`) runs the real fracture model **inside the visitor's browser** with
onnxruntime-web, so X-rays never leave the visitor's computer and no server is needed:

- `radiant.js`: the whole pipeline: "is this an X-ray?" gate, ConvNeXt + DINOv2 features, both trained heads with
  10 Monte Carlo dropout votes, then the answer, confidence, heatmap and box. The Box + heatmap / Box / Heatmap
  buttons switch the overlay instantly without running the model again.
- `model/part*-*.bin` (~305 MB): the **encrypted** model files, cut into 45 MB pieces so GitHub (100 MB per file
  limit) and GitHub Pages can host them. `radiant.js` downloads the pieces once (then the browser caches them).

The model files are made in the private ML repo (`export_onnx.py`, then `encrypt_models.py`), which encrypts each
file with **AES-256-GCM**. `radiant.js` decrypts them in memory with the browser's Web Crypto, so the downloaded
files are useless on their own. The key has to ship in `radiant.js`, so this deters copying but can't make it
impossible. The license below is what forbids it.

## License

- **Website code** (HTML, CSS, JavaScript, including `radiant.js`): MIT, see [`LICENSE`](LICENSE).
- **Model files** (`model/*.bin` and the trained weights inside them): **Copyright (c) 2026 Patrick Kim. All rights
  reserved.** They are **not** covered by the MIT license. You may not download them for reuse, redistribute,
  decrypt, extract, reverse-engineer, or train other models on them or their outputs without written permission.
- The model is built on third-party work whose terms still apply:
  - the "Fratura de membro" dataset by RodrigoDoutorado on
    [Roboflow Universe](https://universe.roboflow.com/rodrigodoutorado/fratura-de-membro/dataset/5) (CC BY 4.0);
  - DINOv2 by Meta (Apache-2.0);
  - ConvNeXt-V2 pretrained weights by Meta (**CC BY-NC 4.0, non-commercial only**, so the model may only be used
    non-commercially);
  - ResNet18 from torchvision (BSD-3-Clause).

## Disclaimer

This tool is an AI-assisted research prototype and is not intended to diagnose medical
conditions or replace evaluation by a qualified medical professional.
