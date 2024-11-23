/** @typedef {ToggleItem & { label: string }} HourInterval
 * @property {string} label - The display value
 */

/**
 * Represents a service with timing, cost, and label information
 * @typedef {ToggleItem & {
 *   time: number,
 *   cost: number,
 *   label: string
 * }} Service
 */

/** @typedef {Object} ToggleItem
 * @property {boolean} disabled - Wheter the interval is available or not
 * @property {string} value - The display value
 */

/** @typedef {Array<ToggleItem>} ToggleGroup */

export {};
