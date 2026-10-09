// Mock data for the dashboard. Replace with real API/database calls once
// the backend exists — the dashboard UI only depends on this shape.

export const RECENT_ANALYSES = [
  {
    id: 'a-1042',
    title: 'Chest X-ray',
    date: '2026-09-19',
    hasFinding: true,
    confidence: 0.87,
  },
  {
    id: 'a-1038',
    title: 'Wrist X-ray',
    date: '2026-09-16',
    hasFinding: true,
    confidence: 0.74,
  },
  {
    id: 'a-1021',
    title: 'Chest X-ray',
    date: '2026-09-08',
    hasFinding: false,
    confidence: 0.93,
  },
]

export const DASHBOARD_STATS = [
  { label: 'Total analyses', value: RECENT_ANALYSES.length },
  { label: 'Possible findings flagged', value: RECENT_ANALYSES.filter((a) => a.hasFinding).length },
  { label: 'Demo cases available', value: 3 },
]
