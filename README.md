# Radiant

AI-assisted X-ray review for dogs. Radiant helps veterinary professionals examine limb X-rays for possible
fractures.

**Live site:** https://realpkim-gif.github.io/X-ray.web/Radiant.dc.html

## What it does

- **Fracture check:** upload a limb X-ray and Radiant says whether it sees a possible fracture, with a confidence score,
  a heatmap and a box showing where. It first checks that the image is actually an X-ray.
- **Visual explanations:** switch between Box + heatmap, Box, or Heatmap without running the model again.
- **PDF report:** download a one-page report of the result.
- **English and Spanish:** the whole site and the PDF report, starting in the browser's main language.
- **Private by design:** the model runs in the visitor's browser, so X-rays never leave their computer.
- **Optional Google sign-in:** saves scans and results to the user's own Google Drive.

## Stack

- Plain HTML, CSS and JavaScript (no framework, no build step)
- [onnxruntime-web](https://onnxruntime.ai/) to run the model in the browser, and the browser's Web Crypto API to
  decrypt it
- Google sign-in and Drive for optional backup of scans
- GitHub Pages for free hosting (no server and no API)

## Run it locally

There is nothing to install or build. Serve the folder with any static file server and open it in a browser:

```bash
git clone https://github.com/realpkim-gif/X-ray.web.git
cd X-ray.web
python -m http.server 8000
```

Then open http://localhost:8000/. The first time you analyze an X-ray, the browser downloads the model (about 305 MB,
then cached), so the first run takes a little while. Google sign-in and Drive backup are set up for the hosted site
and may not work on localhost; everything else does.

## Project structure

```
index.html            Entry page (redirects signed-in users to the main page)
Login.dc.html         Sign-in page
Intro.dc.html         Intro page
Radiant.dc.html       Main page
Analyze.dc.html       X-ray upload and analysis page
Founders.dc.html      About the team
radiant.js            Model pipeline: X-ray gate, features, heads, confidence, heatmap, box
report.js             PDF report (drawn on a canvas, wrapped in a PDF with no libraries)
i18n.js               English and Spanish text
beam.js, lens.js, tiles.js, waves.js, sfx.js   Animations and sound effects
model/                Encrypted model files, cut into pieces
privacy.html, terms.html   Privacy policy and terms of service
```

## Deployment

`.github/workflows/deploy.yml` publishes the repository root to GitHub Pages on every push to `main`. There is no build
step.

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

### How a ~305 MB model fits on GitHub (100 MB per file limit)

GitHub's limit is **per file**, not per repo, so each encrypted file is cut into pieces of 45 MB or less
(45, not 99, because GitHub warns about files over 50 MB):

| Model | Size | Pieces |
|---|---|---|
| config | tiny | `part0-0.bin` |
| X-ray gate | 22.5 MB | `part1-0.bin` |
| ConvNeXt | 100 MB | `part2-0.bin` ... `part2-2.bin` |
| DINOv2 | 174 MB | `part3-0.bin` ... `part3-3.bin` |
| heads | 8 MB | `part4-0.bin` |

1. **Python, on the developer's computer** (`encrypt_models.py`, private ML repo): encrypt each model file, cut
   the result every 45 MB, and write the key and the piece counts (`PIECES = [1, 1, 3, 4, 1]`) into `radiant.js`.
   The pieces are normal files, so a normal `git push` uploads them.
2. **JavaScript, in the visitor's browser** (`radiant.js`, `fetchAndDecrypt`): download every piece of a model,
   glue them back into one file in memory, decrypt it, and hand it to onnxruntime:

```js
const pieces = [];
for (let i = 0; i < PIECES[part]; i++) {                                   // e.g. part3-0.bin ... part3-3.bin
    const response = await fetch(folder + "part" + part + "-" + i + ".bin");
    pieces.push(await response.arrayBuffer());
}
const file = new Uint8Array(await new Blob(pieces).arrayBuffer());        // glue the pieces back together
const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: file.subarray(0, 12) }, key, file.subarray(12));
```

The joined, decrypted model only ever exists in the browser's memory. It is never saved as a file.

**Downside:** every retrain commits ~300 MB of new pieces into the repo history. If the repo gets too big, host
`model/` on Hugging Face instead and change `MODEL_URL` in `Analyze.dc.html`.

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

This tool is AI-assisted and is not intended to diagnose medical
conditions or replace evaluation by a qualified medical professional.
