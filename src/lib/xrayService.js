// AI analysis service boundary.
//
// This is the ONE place the UI calls to get an analysis result. Right now it
// returns mock data after a simulated delay. When the real model is ready,
// replace the body of `analyzeXray` with a real API call (e.g. `fetch` to
// your backend) — every screen that consumes it (Analyze, Demo, ResultsPanel)
// only depends on the shape of `AnalysisResult` below, not on how it's
// produced.

/**
 * @typedef {Object} AnalysisRegion
 * @property {number} x - percentage (0-100) from the left of the image
 * @property {number} y - percentage (0-100) from the top of the image
 * @property {number} width - percentage (0-100) of the image width
 * @property {number} height - percentage (0-100) of the image height
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {boolean} hasFinding - whether a possible area of interest was identified
 * @property {string} finding - short human-readable label
 * @property {number} confidence - model confidence, 0-1 (NOT a medical certainty)
 * @property {AnalysisRegion|null} region - normalized bounding box for the highlight overlay
 * @property {string} explanation - one or two sentences, phrased as "may warrant review"
 * @property {string[]} stages - the progress stages the analysis reports as it runs
 */

export const ANALYSIS_STAGES = [
  'Preparing image',
  'Examining image',
  'Identifying regions of interest',
  'Preparing results',
]

const MOCK_FINDINGS = {
  finding: {
    hasFinding: true,
    finding: 'Possible area requiring additional review',
    confidence: 0.87,
    region: { x: 58, y: 34, width: 22, height: 26 },
    explanation:
      'The prototype identified an area that may warrant additional review. This is a model output, not a diagnosis.',
  },
  clear: {
    hasFinding: false,
    finding: 'No notable area identified in this demonstration',
    confidence: 0.93,
    region: null,
    explanation:
      'The prototype did not flag a region of interest in this image. This does not rule out an abnormality.',
  },
}

/** A static sample result for previewing the results UI without running the
 * (simulated) analysis pipeline — e.g. the landing page's product showcase.
 * The region is positioned for `assets/xrays/chest-finding.jpg` specifically
 * (the real patchy-opacity area in that image), not a generic placeholder. */
export const SAMPLE_RESULT = {
  ...MOCK_FINDINGS.finding,
  region: { x: 16, y: 9, width: 25, height: 36 },
  stages: ANALYSIS_STAGES,
}

/**
 * Simulates sending an X-ray image to the AI model for analysis.
 *
 * @param {{ imageUrl: string, mode?: 'finding' | 'clear', onStage?: (stageIndex: number, stageLabel: string) => void }} params
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeXray({ imageUrl, mode = 'finding', onStage } = {}) {
  void imageUrl // the real implementation will send this to the backend

  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    onStage?.(i, ANALYSIS_STAGES[i])
    // eslint-disable-next-line no-await-in-loop
    await wait(650 + Math.random() * 350)
  }

  const result = MOCK_FINDINGS[mode] ?? MOCK_FINDINGS.finding
  return { ...result, stages: ANALYSIS_STAGES }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
