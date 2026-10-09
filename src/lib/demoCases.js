import chestFinding from '../assets/xrays/chest-finding.jpg'
import chestNormal from '../assets/xrays/chest-normal.jpg'
import footNormal from '../assets/xrays/foot-normal.jpg'

/**
 * Prepared cases for "Try a Demo" so judges can see the full flow without
 * uploading anything.
 *
 * Images are real radiographs released into the public domain (CC0) by
 * Mikael Häggström, M.D., via Wikimedia Commons — used here for
 * demonstration only, with a simulated (mock) analysis overlaid on top.
 * The highlighted region is illustrative, not a real finding location
 * except where noted. See README.md for full source/license details.
 */
export const DEMO_CASES = [
  {
    id: 'demo-normal',
    title: 'Routine chest X-ray',
    description: 'A demonstration case with no flagged region.',
    image: chestNormal,
    alt: 'Normal posteroanterior chest X-ray',
    mode: 'clear',
  },
  {
    id: 'demo-finding',
    title: 'Chest X-ray, possible finding',
    description: 'A demonstration case where the prototype flags a region for review.',
    image: chestFinding,
    alt: 'Chest X-ray showing patchy opacity in the upper right lung field',
    mode: 'finding',
    // Positioned over the actual patchy opacity visible in this image
    // (patient's right upper lobe — the left side in this PA view).
    region: { x: 16, y: 9, width: 25, height: 36 },
  },
  {
    id: 'demo-foot',
    title: 'Foot X-ray, possible finding',
    description: 'A second demonstration case showing a different body region.',
    image: footNormal,
    alt: 'Dorsoplantar X-ray of a foot',
    mode: 'finding',
    // This is a normal foot — the highlight is illustrative only, placed
    // over the metatarsals (a common site of interest on a foot X-ray).
    region: { x: 8, y: 33, width: 30, height: 20 },
  },
]

export function getDemoCase(id) {
  return DEMO_CASES.find((c) => c.id === id) ?? DEMO_CASES[0]
}
