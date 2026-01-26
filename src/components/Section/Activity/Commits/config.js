// Chart configuration constants
export const CELL_SIZE = 20
export const CELL_GAP = 4
export const CELL_RADIUS = 4
export const LABEL_WIDTH = 30
export const YEAR_LABEL_HEIGHT = 18
export const MONTH_LABEL_HEIGHT = 14
export const PADDING = 5

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Visible day indices for labels (Mon, Wed, Fri)
export const VISIBLE_DAYS = [1, 3, 5]

// Hatch patterns for intensity levels (7 levels)
// Level 1: < 10 commits (very sparse)
// Levels 2-6: 10-100 commits (exponential scale)
// Level 7: > 100 commits (solid fill)
export const HATCH_PATTERNS = [
  { id: 'hatch-1', spacing: 12 },
  { id: 'hatch-2', spacing: 8 },
  { id: 'hatch-3', spacing: 5 },
  { id: 'hatch-4', spacing: 3.5 },
  { id: 'hatch-5', spacing: 2.5 },
  { id: 'hatch-6', spacing: 1.5 }
]

// Thresholds for special buckets
export const COMMIT_THRESHOLD_LOW = 10
export const COMMIT_THRESHOLD_HIGH = 100
