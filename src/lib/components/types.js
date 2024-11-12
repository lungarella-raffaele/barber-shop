/** @typedef {ToggleItem & { label: string }} HourInterval
 * @property {string} label - The display value
 */

/** @typedef {ToggleItem & { time: number, cost: number, info: string, label: string}} Service
 * @property {number} time - The time the service will take
 * @property {string} cost - The cost of the service
 * @property {string} label - Name of the service
 */

/** @typedef {Object} ToggleItem
 * @property {boolean} disabled - Wheter the interval is available or not
 * @property {string} value - The display value
 */

/** @typedef {Array<ToggleItem>} ToggleGroup */

export {};
