// Block type configuration for reasoning diagram

export const BLOCK_TYPES = {
  OBSERVATION: {
    label: 'OBSERVATION',
    color: 'var(--teal)',
    bgVar: 'var(--teal-light)',
    borderVar: 'var(--teal-border)',
  },
  INTERPRETATION: {
    label: 'INTERPRETATION',
    color: 'var(--slate)',
    bgVar: 'var(--slate-light)',
    borderVar: 'var(--slate-border)',
  },
  CONSIDERATION: {
    label: 'CONSIDERATION',
    color: 'var(--amber)',
    bgVar: 'var(--amber-light)',
    borderVar: 'var(--amber-border)',
  },
  CONTRAINDICATION: {
    label: 'CONTRAINDICATION',
    color: 'var(--crimson)',
    bgVar: 'var(--crimson-light)',
    borderVar: 'var(--crimson-border)',
  },
  DECISION: {
    label: 'DECISION',
    color: 'var(--green)',
    bgVar: 'var(--green-light)',
    borderVar: 'var(--green-border)',
  },
}

/**
 * Get style object for a given block type
 * @param {string} type - Block type (OBSERVATION, INTERPRETATION, etc.)
 * @returns {Object} Style configuration for the block
 */
export function getBlockStyle(type) {
  const config = BLOCK_TYPES[type]
  if (!config) {
    console.warn(`Unknown block type: ${type}`)
    return BLOCK_TYPES.OBSERVATION // Fallback to OBSERVATION
  }
  return config
}

/**
 * Get CSS class modifier for a block type
 * @param {string} type - Block type
 * @returns {string} CSS class name (e.g., "block--OBSERVATION")
 */
export function getBlockTypeClass(type) {
  return `block--${type}`
}
